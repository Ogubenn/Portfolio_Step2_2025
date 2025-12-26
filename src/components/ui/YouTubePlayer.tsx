'use client'

import { useState } from 'react';
import { extractYouTubeId } from '@/lib/youtube';

interface YouTubePlayerProps {
  url: string;
  title?: string;
  className?: string;
}

export default function YouTubePlayer({ url, title = 'Video', className = '' }: YouTubePlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const videoId = extractYouTubeId(url);

  if (!videoId) {
    return null;
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  // sddefault.jpg (640x480) - her YouTube videosunda garanti var
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;

  return (
    <div className={`relative w-full ${className}`}>
      {/* 16:9 Aspect Ratio Container */}
      <div className="relative w-full overflow-hidden rounded-xl shadow-2xl" style={{ paddingBottom: '56.25%' }}>
        {/* Thumbnail & Play Button (Lazy Load) */}
        {!isLoaded && (
          <div 
            className="absolute inset-0 cursor-pointer group"
            onClick={() => setIsLoaded(true)}
          >
            {/* Loading Skeleton */}
            {!thumbnailLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black animate-pulse flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <p className="text-gray-500 text-sm">Video yükleniyor...</p>
                </div>
              </div>
            )}
            
            {/* Thumbnail Image */}
            <img
              src={thumbnailUrl}
              alt={title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${thumbnailLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setThumbnailLoaded(true)}
              onError={(e) => {
                console.error('YouTube thumbnail yükleme hatası:', videoId);
                setThumbnailLoaded(true); // Hata olsa da skeleton'u kaldır
              }}
            />
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-red-600 group-hover:bg-red-700 group-hover:scale-110 transition-all shadow-lg">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="white"
                  className="w-10 h-10 ml-1"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* YouTube iframe (Loaded on click) */}
        {isLoaded && (
          <iframe
            src={`${embedUrl}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        )}
      </div>

      {/* Video Info */}
      <div className="mt-4 flex items-center gap-3 text-sm text-gray-400">
        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
        <span>YouTube</span>
      </div>
    </div>
  );
}
