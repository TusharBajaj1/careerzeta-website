"use client";

import { useState } from "react";
import Link from "next/link";

export type BlogPostRow = {
  id: number;
  title: string;
  slug: string;
  series: string | null;
  seriesPart: number | null;
  status: "draft" | "published";
  publishedAt: string | null;
  createdAt: string;
};

export default function BlogClient({ initialPosts }: { initialPosts: BlogPostRow[] }) {
  const [posts, setPosts] = useState<BlogPostRow[]>(initialPosts);

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Delete "${title}" permanently? This can't be undone.`)) return;
    const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    if (res.ok) setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Blog</h1>
        <Link
          href="/admin/blog/new"
          className="rounded-lg bg-sky-400 px-5 py-3 text-sm font-bold text-slate-900 transition-transform duration-150 hover:scale-105"
        >
          + New Post
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto">
        {posts.length === 0 ? (
          <p className="text-sm opacity-60">No posts yet — click &quot;+ New Post&quot; to write the first one.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b-2 border-line text-xs tracking-wide uppercase opacity-60">
                <th className="py-2 pr-4">Title</th>
                <th className="py-2 pr-4">Series</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Published</th>
                <th className="py-2 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-line/60">
                  <td className="py-3 pr-4 font-semibold">{post.title}</td>
                  <td className="py-3 pr-4 opacity-70">
                    {post.series ? `${post.series}${post.seriesPart ? ` · Part ${post.seriesPart}` : ""}` : "—"}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        post.status === "published" ? "bg-green-100 text-green-700" : "bg-slate-100"
                      }`}
                    >
                      {post.status === "published" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-IN") : "—"}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex gap-3">
                      {post.status === "published" ? (
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-700 hover:underline"
                        >
                          View
                        </a>
                      ) : null}
                      <Link href={`/admin/blog/${post.id}/edit`} className="text-sky-700 hover:underline">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(post.id, post.title)} className="text-red-600 hover:underline">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
