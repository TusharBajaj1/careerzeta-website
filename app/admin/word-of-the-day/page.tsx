import Link from "next/link";
import { desc } from "drizzle-orm";

import WordOfTheDayForm from "@/components/admin/WordOfTheDayForm";
import { db } from "@/lib/db";
import { wordOfTheDay } from "@/lib/db/schema";

/** Admin pages read live data on every request — never statically prerendered/cached. */
export const dynamic = "force-dynamic";

export default async function AdminWordOfTheDayPage() {
  const [current] = await db.select().from(wordOfTheDay).orderBy(desc(wordOfTheDay.id)).limit(1);

  return (
    <div className="mx-auto max-w-[640px] px-6 py-16">
      <Link href="/admin" className="text-sm text-sky-700 hover:underline">
        ← Admin
      </Link>

      <h1 className="mt-4 font-display text-3xl font-bold">Word of the Day</h1>
      <p className="mt-1 text-sm opacity-60">
        Shown on the W.O.R.D card on the public /tools page. Update it whenever you post a new
        word to @w.o.r.dd — takes effect immediately, no deploy needed.
      </p>

      <div className="mt-8">
        <WordOfTheDayForm current={current ? { word: current.word, definition: current.definition } : null} />
      </div>
    </div>
  );
}
