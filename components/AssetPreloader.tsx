import React, { useEffect, useState } from 'react';

interface AssetPreloaderProps {
  assets: string[];
  onLoadComplete: () => void;
  children: React.ReactNode;
}

const AssetPreloader: React.FC<AssetPreloaderProps> = ({ assets, onLoadComplete, children }) => {
  const [loadedAssets, setLoadedAssets] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (assets.length === 0) {
      setIsLoading(false);
      onLoadComplete();
      return;
    }

    const loadPromises: Promise<void>[] = assets.map((asset) => {
      return new Promise<void>((resolve) => {
        // Check if it's a video or image
        const isVideo = asset.match(/\.(mp4|webm|ogg)$/i);
        
        if (isVideo) {
          const video = document.createElement('video');
          video.preload = 'auto';
          video.src = asset;
          
          const handleCanPlay = () => {
            setLoadedAssets((prev) => {
              const newSet = new Set(prev);
              newSet.add(asset);
              return newSet;
            });
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('error', handleError);
            resolve();
          };
          
          const handleError = () => {
            // Even if there's an error, we continue
            setLoadedAssets((prev) => {
              const newSet = new Set(prev);
              newSet.add(asset);
              return newSet;
            });
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('error', handleError);
            resolve();
          };
          
          video.addEventListener('canplay', handleCanPlay);
          video.addEventListener('error', handleError);
          video.load();
        } else {
          // It's an image
          const img = new Image();
          
          const handleLoad = () => {
            setLoadedAssets((prev) => {
              const newSet = new Set(prev);
              newSet.add(asset);
              return newSet;
            });
            img.removeEventListener('load', handleLoad);
            img.removeEventListener('error', handleError);
            resolve();
          };
          
          const handleError = () => {
            // Even if there's an error, we continue
            setLoadedAssets((prev) => {
              const newSet = new Set(prev);
              newSet.add(asset);
              return newSet;
            });
            img.removeEventListener('load', handleLoad);
            img.removeEventListener('error', handleError);
            resolve();
          };
          
          img.addEventListener('load', handleLoad);
          img.addEventListener('error', handleError);
          img.src = asset;
        }
      });
    });

    // Wait for all assets or timeout after 15 seconds (for large video files)
    Promise.race([
      Promise.all(loadPromises),
      new Promise<void>((resolve) => setTimeout(resolve, 15000))
    ]).then(() => {
      setIsLoading(false);
      onLoadComplete();
    });
  }, [assets, onLoadComplete]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-nexus-dark">
        <div className="text-center">
          <div className="font-tesla font-bold text-4xl md:text-6xl text-white uppercase tracking-wider mb-4" style={{ fontFamily: 'Barlow' }}>
            NEXUS
          </div>
          <div className="w-16 h-1 bg-white/20 mx-auto mt-6 overflow-hidden">
            <div className="h-full bg-white animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AssetPreloader;
