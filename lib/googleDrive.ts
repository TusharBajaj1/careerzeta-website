import { Readable } from "stream";

import { google } from "googleapis";

/**
 * Mirrors every invoice/admission letter PDF into a Google Drive folder the
 * moment it's generated, so accounting can reconcile straight from Drive
 * without ever touching the admin panel. Entirely optional — every function
 * here degrades to a silent no-op (returns null, never throws) when the
 * service account env vars aren't set, so the rest of the app works exactly
 * as before until this is configured.
 */

const PARENT_FOLDER_ID = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID;

function isConfigured(): boolean {
  return !!(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY && PARENT_FOLDER_ID);
}

function getDriveClient() {
  // Vercel env vars are single-line — a PEM key pasted with escaped "\n"
  // sequences needs them turned back into real newlines. A key pasted with
  // real newlines (multi-line env var value) already works as-is.
  const privateKey = (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  return google.drive({ version: "v3", auth });
}

const subfolderIdCache = new Map<string, string>();

/** Finds (or creates, first time) a named subfolder directly under the configured parent folder. Cached per warm serverless instance — worst case it just looks it up again next cold start. */
async function ensureSubfolder(name: string): Promise<string | null> {
  if (!isConfigured()) return null;
  if (subfolderIdCache.has(name)) return subfolderIdCache.get(name)!;

  const drive = getDriveClient();

  const escaped = name.replace(/'/g, "\\'");
  const existing = await drive.files.list({
    q: `'${PARENT_FOLDER_ID}' in parents and name = '${escaped}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id, name)",
    spaces: "drive",
    // Required for the parent to be (or live inside) a Shared Drive — a
    // service account has no storage quota of its own, so a Shared Drive
    // is the only place it can actually create files (see uploadToDrive).
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
    corpora: "allDrives",
  });

  const found = existing.data.files?.[0]?.id;
  if (found) {
    subfolderIdCache.set(name, found);
    return found;
  }

  const created = await drive.files.create({
    requestBody: {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [PARENT_FOLDER_ID!],
    },
    fields: "id",
    supportsAllDrives: true,
  });

  const id = created.data.id;
  if (!id) return null;
  subfolderIdCache.set(name, id);
  return id;
}

/**
 * Uploads a PDF into the given named subfolder (created under the
 * configured parent folder if it doesn't exist yet). Skips the upload if a
 * file with the same name is already there — makes this safe to call
 * repeatedly for the same document (e.g. a backfill run twice) without
 * creating duplicates. Never throws; logs and returns false on any
 * failure, including simply not being configured yet.
 */
export async function uploadToDrive(
  subfolder: "Invoices" | "Admission Letters",
  filename: string,
  pdf: Buffer,
): Promise<{ ok: boolean; error?: string }> {
  if (!isConfigured()) return { ok: false, error: "not_configured" };

  try {
    const folderId = await ensureSubfolder(subfolder);
    if (!folderId) return { ok: false, error: "subfolder_lookup_failed" };

    const drive = getDriveClient();

    const escaped = filename.replace(/'/g, "\\'");
    const existing = await drive.files.list({
      q: `'${folderId}' in parents and name = '${escaped}' and trashed = false`,
      fields: "files(id)",
      spaces: "drive",
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
      corpora: "allDrives",
    });
    if (existing.data.files && existing.data.files.length > 0) {
      return { ok: true }; // already there
    }

    await drive.files.create({
      requestBody: { name: filename, parents: [folderId] },
      media: { mimeType: "application/pdf", body: bufferToStream(pdf) },
      fields: "id",
      supportsAllDrives: true,
    });
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Google Drive upload failed for ${filename}:`, err);
    return { ok: false, error: message };
  }
}

// googleapis' media.body wants a stream, not a raw Buffer.
function bufferToStream(buffer: Buffer) {
  return Readable.from(buffer);
}
