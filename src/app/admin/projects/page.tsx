"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { ProjectCardSkeleton } from "@/components/ui/Skeleton";
import { ProjectCardSkeleton } from "@/components/ui/Skeleton";
import {
  Plus,
  Search,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Star,
  ExternalLink,
} from "lucide-react";

interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  shortDesc: string;
  thumbnail: string | null;
  featured: boolean;
  published: boolean;
  year: number;
  createdAt: string;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; project: Project | null }>({ isOpen: false, project: null });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (project: Project) => {
    setDeleteDialog({ isOpen: true, project });
  };

  const closeDeleteDialog = () => {
    if (!isDeleting) {
      setDeleteDialog({ isOpen: false, project: null });
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.project) return;

    setIsDeleting(true);
    const deleteToast = toast.loading('Proje siliniyor...');

    try {
      const response = await fetch(`/api/projects/${deleteDialog.project.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProjects(projects.filter((p) => p.id !== deleteDialog.project!.id));
        toast.success('Proje başarıyla silindi!', { id: deleteToast });
        closeDeleteDialog();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Proje silinemedi', { id: deleteToast });
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast.error('Bir hata oluştu', { id: deleteToast });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.category.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter =
      filter === "all" ||
      (filter === "published" && project.published) ||
      (filter === "draft" && !project.published) ||
      (filter === "featured" && project.featured) ||
      project.category === filter;

    return matchesSearch && matchesFilter;
  });

  const categories = ["all", "published", "draft", "featured", "web", "game", "mobile", "tool"];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Projeler</h1>
            <p className="text-gray-400 mt-1">Yükleniyor...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projeler</h1>
          <p className="text-gray-400">{projects.length} proje</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Yeni Proje
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Proje ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                filter === cat
                  ? "bg-blue-500 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {cat === "all"
                ? "Tümü"
                : cat === "published"
                ? "Yayında"
                : cat === "draft"
                ? "Taslak"
                : cat === "featured"
                ? "Öne Çıkan"
                : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
          <p className="text-gray-400">Proje bulunamadı</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all group"
            >
              {/* Thumbnail */}
              <div className="relative h-48 bg-gray-900 overflow-hidden">
                {project.thumbnail ? (
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    Görsel Yok
                  </div>
                )}
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {project.featured && (
                    <span className="px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Öne Çıkan
                    </span>
                  )}
                  <span
                    className={`px-2 py-1 text-xs font-bold rounded ${
                      project.published
                        ? "bg-green-500 text-white"
                        : "bg-gray-500 text-white"
                    }`}
                  >
                    {project.published ? "Yayında" : "Taslak"}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-white line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {project.category} • {project.year}
                    </p>
                  </div>
                </div>

                <p className="text-gray-400 text-sm line-clamp-2">
                  {project.shortDesc}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-700">
                  <Link
                    href={`/projects/${project.slug}`}
                    target="_blank"
                    className="flex items-center gap-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Görüntüle
                  </Link>
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="flex items-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Düzenle
                  </Link>
                  <button
                    onClick={() => openDeleteDialog(project)}
                    className="flex items-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
        title="Projeyi Sil"
        message={`"${deleteDialog.project?.title}" projesini kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve tüm proje verileri (galeri resimleri dahil) silinecektir.`}
        confirmText="Evet, Sil"
        cancelText="İptal"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
}
