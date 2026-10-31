"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";

export type BlogPostRow = {
  id: number;
  title: string;
  slug: string;
  seriesId: number | null;
  seriesPart: number | null;
  excerpt: string | null;
  contentHtml: string;
  coverImageUrl: string | null;
  author: string | null;
  status: "draft" | "published";
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SeriesOption = { id: number; name: string };

type Props =
  | { mode: "create"; seriesOptions: SeriesOption[] }
  | { mode: "edit"; post: BlogPostRow; seriesOptions: SeriesOption[] };

async function uploadImage(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/admin/blog/upload", { method: "POST", body: formData });
  if (!res.ok) return null;
  const data = await res.json().catch(() => null);
  return data?.url ?? null;
}

function ToolbarButton({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`rounded-md px-2.5 py-1.5 text-sm font-semibold transition ${
        active ? "bg-slate-200" : "hover:bg-slate-100"
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor, onInsertImage }: { editor: Editor; onInsertImage: () => void }) {
  function setLink() {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previousUrl ?? "https://");
    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b-2 border-line bg-slate-50 p-2">
      <ToolbarButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        B
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <span className="italic">I</span>
      </ToolbarButton>
      <ToolbarButton
        label="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        label="Heading 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        H3
      </ToolbarButton>
      <ToolbarButton
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        • List
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1. List
      </ToolbarButton>
      <ToolbarButton
        label="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        “ Quote
      </ToolbarButton>
      <ToolbarButton label="Link" active={editor.isActive("link")} onClick={setLink}>
        Link
      </ToolbarButton>
      <ToolbarButton label="Insert image" onClick={onInsertImage}>
        Image
      </ToolbarButton>
    </div>
  );
}

export default function BlogPostEditor(props: Props) {
  const router = useRouter();
  const existing = props.mode === "edit" ? props.post : null;

  const [title, setTitle] = useState(existing?.title ?? "");
  const [seriesId, setSeriesId] = useState(existing?.seriesId ? String(existing.seriesId) : "");
  const [seriesPart, setSeriesPart] = useState(existing?.seriesPart ? String(existing.seriesPart) : "");
  const [excerpt, setExcerpt] = useState(existing?.excerpt ?? "");
  const [author, setAuthor] = useState(existing?.author ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(existing?.coverImageUrl ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<"draft" | "published" | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const bodyImageInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: false,
          HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
        },
      }),
      TiptapImage,
      Placeholder.configure({ placeholder: "Write this week's post…" }),
    ],
    content: existing?.contentHtml ?? "",
    editorProps: {
      attributes: { class: "cz-prose min-h-[360px] px-4 py-4 focus:outline-none" },
    },
  });

  async function handleCoverUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingCover(true);
    const url = await uploadImage(file);
    setUploadingCover(false);
    if (url) setCoverImageUrl(url);
    else setError("Couldn't upload that image — please try again.");
  }

  async function handleBodyImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !editor) return;
    const url = await uploadImage(file);
    if (url) editor.chain().focus().setImage({ src: url }).run();
    else setError("Couldn't upload that image — please try again.");
  }

  async function handleSubmit(nextStatus: "draft" | "published") {
    if (!editor) return;
    setError(null);

    if (!title.trim()) {
      setError("Give the post a title first.");
      return;
    }
    if (editor.isEmpty) {
      setError("The post body is empty.");
      return;
    }

    setSubmitting(nextStatus);
    const payload = {
      title: title.trim(),
      seriesId: seriesId ? Number(seriesId) : null,
      seriesPart: seriesPart.trim() ? Number(seriesPart) : null,
      excerpt: excerpt.trim() || null,
      contentHtml: editor.getHTML(),
      coverImageUrl: coverImageUrl.trim() || null,
      author: author.trim() || null,
      status: nextStatus,
    };

    const res = await fetch(existing ? `/api/admin/blog/${existing.id}` : "/api/admin/blog", {
      method: existing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setError("Something went wrong saving this post — please try again.");
      setSubmitting(null);
      return;
    }

    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-[800px] px-6 py-16">
      <h1 className="font-display text-3xl font-bold">
        {existing ? "Edit Post" : "New Post"}
      </h1>

      <div className="mt-8 flex flex-col gap-5">
        <div>
          <label htmlFor="post-title" className="mb-1 block text-sm font-semibold">
            Title
          </label>
          <input
            id="post-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="This week's post title"
            className="w-full rounded-lg border-2 border-line bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="post-series" className="mb-1 block text-sm font-semibold">
              Series <span className="text-xs font-normal opacity-60">(optional)</span>
            </label>
            <select
              id="post-series"
              value={seriesId}
              onChange={(e) => setSeriesId(e.target.value)}
              className="w-full rounded-lg border-2 border-line bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
            >
              <option value="">No series</option>
              {props.seriesOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {props.seriesOptions.length === 0 ? (
              <p className="mt-1 text-xs opacity-60">
                No series registered yet — go to Admin → Blog → Series to add one.
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="post-series-part" className="mb-1 block text-sm font-semibold">
              Part number <span className="text-xs font-normal opacity-60">(optional)</span>
            </label>
            <input
              id="post-series-part"
              type="number"
              min={1}
              value={seriesPart}
              onChange={(e) => setSeriesPart(e.target.value)}
              placeholder="1"
              className="w-full rounded-lg border-2 border-line bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
            />
          </div>
        </div>

        <div>
          <label htmlFor="post-excerpt" className="mb-1 block text-sm font-semibold">
            Excerpt <span className="text-xs font-normal opacity-60">(shown on the blog index)</span>
          </label>
          <textarea
            id="post-excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            placeholder="A one or two sentence teaser…"
            className="w-full rounded-lg border-2 border-line bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
          />
        </div>

        <div>
          <label htmlFor="post-author" className="mb-1 block text-sm font-semibold">
            Author <span className="text-xs font-normal opacity-60">(optional)</span>
          </label>
          <input
            id="post-author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-lg border-2 border-line bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
          />
        </div>

        <div>
          <span className="mb-1 block text-sm font-semibold">Cover image</span>
          <p className="mb-2 text-xs opacity-60">
            For best results use a wide/landscape photo (around 1600×700) — a taller or
            square image still works, it just won&apos;t fill the banner edge-to-edge.
          </p>
          {coverImageUrl ? (
            // object-contain on a dark background matches exactly how the
            // public post page renders this image — no surprises on publish.
            <div className="mb-2 flex aspect-[21/9] w-full items-center justify-center overflow-hidden rounded-lg border-2 border-line bg-[#0b1220]">
              {/* eslint-disable-next-line @next/next/no-img-element -- admin-uploaded, external Blob URL; not worth next/image config here. */}
              <img src={coverImageUrl} alt="" className="h-full w-full object-contain" />
            </div>
          ) : null}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              disabled={uploadingCover}
              className="rounded-lg border-2 border-line px-4 py-2 text-sm font-semibold transition hover:border-sky-400 disabled:opacity-60"
            >
              {uploadingCover ? "Uploading…" : coverImageUrl ? "Replace image" : "Upload image"}
            </button>
            {coverImageUrl ? (
              <button
                type="button"
                onClick={() => setCoverImageUrl("")}
                className="text-sm text-red-600 hover:underline"
              >
                Remove
              </button>
            ) : null}
          </div>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverUpload}
            className="hidden"
            aria-label="Upload cover image"
          />
        </div>

        <div>
          <span className="mb-1 block text-sm font-semibold">Post body</span>
          <div className="rounded-lg border-2 border-line bg-white">
            {editor ? <Toolbar editor={editor} onInsertImage={() => bodyImageInputRef.current?.click()} /> : null}
            <EditorContent editor={editor} />
          </div>
          <input
            ref={bodyImageInputRef}
            type="file"
            accept="image/*"
            onChange={handleBodyImageUpload}
            className="hidden"
            aria-label="Insert image into post body"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleSubmit("draft")}
            disabled={submitting !== null}
            className="rounded-lg border-2 border-line px-5 py-3 text-sm font-bold transition hover:border-sky-400 disabled:opacity-60"
          >
            {submitting === "draft" ? "Saving…" : "Save as draft"}
          </button>
          <button
            type="button"
            onClick={() => handleSubmit("published")}
            disabled={submitting !== null}
            className="rounded-lg bg-sky-400 px-5 py-3 text-sm font-bold text-slate-900 transition-transform duration-150 hover:scale-105 disabled:opacity-60"
          >
            {submitting === "published" ? "Publishing…" : existing?.status === "published" ? "Save & keep published" : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
