"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FolderKanban,
  Award,
  Briefcase,
  TrendingUp,
  Eye,
  Calendar,
} from "lucide-react";

interface Stats {
  projects: number;
  skills: number;
  experience: number;
  services: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    skills: 0,
    experience: 0,
    services: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch real stats from API
    // Şimdilik mock data
    setTimeout(() => {
      setStats({
        projects: 8,
        skills: 12,
        experience: 3,
        services: 4,
      });
      setLoading(false);
    }, 500);
  }, []);

  const statCards = [
    {
      title: "Toplam Proje",
      value: stats.projects,
      icon: FolderKanban,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
    },
    {
      title: "Yetenekler",
      value: stats.skills,
      icon: Award,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
    },
    {
      title: "İş Deneyimi",
      value: stats.experience,
      icon: Briefcase,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
    },
    {
      title: "Hizmetler",
      value: stats.services,
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Portfolio yönetim panelinize hoş geldiniz</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Calendar className="w-4 h-4" />
          {new Date().toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden bg-gray-800 border ${stat.borderColor} rounded-xl p-6 hover:scale-105 transition-transform`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
              </div>
              <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
              
              {/* Gradient overlay */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <motion.a
            href="/admin/projects/new"
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors group"
          >
            <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
              <FolderKanban className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-white font-medium">Yeni Proje Ekle</p>
              <p className="text-sm text-gray-400">Portfolio'ya proje ekleyin</p>
            </div>
          </motion.a>

          <motion.a
            href="/admin/skills"
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors group"
          >
            <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
              <Award className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-white font-medium">Yetenek Yönet</p>
              <p className="text-sm text-gray-400">Yeteneklerinizi güncelleyin</p>
            </div>
          </motion.a>

          <motion.a
            href="/"
            target="_blank"
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors group"
          >
            <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
              <Eye className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-white font-medium">Siteyi Görüntüle</p>
              <p className="text-sm text-gray-400">Canlı siteyi kontrol edin</p>
            </div>
          </motion.a>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Son Aktiviteler</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <p className="text-gray-300 text-sm">Admin paneli kurulumu tamamlandı</p>
            <span className="ml-auto text-xs text-gray-500">Az önce</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <p className="text-gray-300 text-sm">Database başarıyla oluşturuldu</p>
            <span className="ml-auto text-xs text-gray-500">Bugün</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full" />
            <p className="text-gray-300 text-sm">Authentication sistemi aktif</p>
            <span className="ml-auto text-xs text-gray-500">Bugün</span>
          </div>
        </div>
      </div>
    </div>
  );
}
