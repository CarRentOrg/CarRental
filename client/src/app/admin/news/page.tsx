"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Newspaper, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { AdminTable, Column } from "@/components/admin/AdminTable";
import { NewsPost } from "@/types";
import Image from "next/image";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { api } from "@/lib/api";

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsPost[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [postToDelete, setPostToDelete] = useState<NewsPost | null>(null);

  useEffect(() => {
    loadNews();
  }, []);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    setFilteredNews(
      news.filter(
        (post) =>
          post.title_en.toLowerCase().includes(lowerSearch) ||
          post.author.toLowerCase().includes(lowerSearch),
      ),
    );
  }, [search, news]);

  async function loadNews() {
    try {
      setLoading(true);
      const data = await api.news.getAll();
      setNews(data);
      setFilteredNews(data);
    } catch (error) {
      console.error("Failed to load news:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteClick = (post: NewsPost) => {
    setPostToDelete(post);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;

    setIsDeleting(true);
    try {
      await api.news.delete(postToDelete.id);
      setNews((prev) => prev.filter((p) => p.id !== postToDelete.id));
      setPostToDelete(null);
    } catch (error) {
      alert("Failed to delete news post");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<NewsPost>[] = [
    {
      header: "Article",
      cell: (row) => (
        <div className="flex items-center space-x-4">
          <div className="relative h-12 w-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
            {row.image_url && (
              <Image
                src={row.image_url}
                alt={row.title_en}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 line-clamp-1">
              {row.title_en}
            </p>
            <p className="text-xs text-gray-400 mt-0.5 max-w-[200px] truncate">
              {row.content_en}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Author",
      accessorKey: "author",
      className: "text-gray-600 font-medium text-xs",
    },
    {
      header: "Date",
      cell: (row) => (
        <span className="text-xs text-gray-500 font-bold">
          {new Date(row.created_at).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      <AdminPageHeader
        title="News & Content"
        description="Manage news articles, blog posts, and site content."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "News" },
        ]}
        actions={
          <Link
            href="/admin/news/new"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-200 hover:-translate-y-0.5"
          >
            <Plus className="h-5 w-5" />
            <span>Add Article</span>
          </Link>
        }
      />

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-sm font-medium"
            />
          </div>
        </div>

        <div className="p-4">
          <AdminTable
            columns={columns}
            data={filteredNews}
            loading={loading}
            onDelete={handleDeleteClick}
            emptyMessage="No articles found. Create one to get started."
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={!!postToDelete}
        onClose={() => setPostToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Article"
        message={`Are you sure you want to delete "${postToDelete?.title_en}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
