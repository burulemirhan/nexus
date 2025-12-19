import React, { useEffect, useState } from 'react';

const LoadingScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    let animationInterval: NodeJS.Timeout;
    let checkInterval: NodeJS.Timeout;

    // Animation loop that repeats until assets are loaded
    const animate = () => {
      let progress = 0;
      animationInterval = setInterval(() => {
        progress += 1.5;
        if (progress >= 100) {
          progress = 0; // Reset to loop
        }
        setAnimationProgress(progress);
      }, 30);
    };

    // Start animation loop
    animate();

    // Function to check if all assets are loaded
    const checkAssetsLoaded = (): boolean => {
      // Check all images
      const images = Array.from(document.querySelectorAll('img'));
      const imagesLoaded = images.every(img => {
        return img.complete && (img.naturalWidth > 0 || img.naturalHeight > 0);
      });

      // Check all videos
      const videos = Array.from(document.querySelectorAll('video'));
      const videosLoaded = videos.every(video => {
        return video.readyState >= 3; // HAVE_FUTURE_DATA or higher
      });

      return imagesLoaded && videosLoaded;
    };

    // Function to check if page is ready
    const isPageReady = (): boolean => {
      return document.readyState === 'complete' && checkAssetsLoaded();
    };

    // Check periodically if everything is loaded
    checkInterval = setInterval(() => {
      if (isPageReady()) {
        // Everything loaded, complete animation and hide
        setAnimationProgress(100);
        setTimeout(() => {
          setLoading(false);
          if (animationInterval) clearInterval(animationInterval);
          if (checkInterval) clearInterval(checkInterval);
        }, 500);
      }
    }, 200);

    // Also check on window load
    const handleLoad = () => {
      setTimeout(() => {
        if (isPageReady()) {
          setAnimationProgress(100);
          setTimeout(() => {
            setLoading(false);
            if (animationInterval) clearInterval(animationInterval);
            if (checkInterval) clearInterval(checkInterval);
          }, 500);
        }
      }, 300);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    // Maximum loading time fallback
    const maxTimeout = setTimeout(() => {
      setAnimationProgress(100);
      setTimeout(() => {
        setLoading(false);
        if (animationInterval) clearInterval(animationInterval);
        if (checkInterval) clearInterval(checkInterval);
      }, 500);
    }, 8000);

    return () => {
      if (animationInterval) clearInterval(animationInterval);
      if (checkInterval) clearInterval(checkInterval);
      clearTimeout(maxTimeout);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  if (!loading) return null;

  // Growth progress (0 to 1, looping)
  const growth = (animationProgress / 100) % 1;
  const stemHeight = 50 * growth;
  const seedVisible = growth < 0.15;
  const leavesVisible = growth > 0.5;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-nexus-dark flex items-center justify-center transition-opacity duration-500"
      style={{ 
        opacity: loading ? 1 : 0,
        pointerEvents: loading ? 'auto' : 'none'
      }}
    >
      <div className="flex flex-col items-center justify-center">
        {/* Simple Seed to Plant Animation */}
        <div className="relative w-24 h-40 mb-6">
          <svg
            viewBox="0 0 100 120"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Seed - emerald dot */}
            {seedVisible && (
              <circle
                cx="50"
                cy={110 - growth * 20}
                r={6 - growth * 3}
                fill="#10b981"
                opacity={1 - growth * 6}
                className="transition-all duration-300"
              />
            )}

            {/* Stem - thin emerald line growing upward */}
            {growth >= 0.15 && (
              <line
                x1="50"
                y1={110 - stemHeight}
                x2="50"
                y2="110"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
              />
            )}

            {/* Two leaves at the top */}
            {leavesVisible && (
              <>
                {/* Left leaf */}
                <path
                  d={`M 50 ${110 - stemHeight} Q ${40 - (growth - 0.5) * 15} ${80 - stemHeight * 0.2} ${35 - (growth - 0.5) * 12} ${70 - stemHeight * 0.3}`}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity={Math.min((growth - 0.5) / 0.3, 1)}
                  className="transition-all duration-400"
                />
                <ellipse
                  cx={35 - (growth - 0.5) * 12}
                  cy={70 - stemHeight * 0.3}
                  rx={4 + (growth - 0.5) * 5}
                  ry={5 + (growth - 0.5) * 6}
                  fill="#10b981"
                  opacity={0.7 * Math.min((growth - 0.5) / 0.3, 1)}
                  className="transition-all duration-400"
                />
                
                {/* Right leaf */}
                <path
                  d={`M 50 ${110 - stemHeight} Q ${60 + (growth - 0.5) * 15} ${80 - stemHeight * 0.2} ${65 + (growth - 0.5) * 12} ${70 - stemHeight * 0.3}`}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity={Math.min((growth - 0.5) / 0.3, 1)}
                  className="transition-all duration-400"
                />
                <ellipse
                  cx={65 + (growth - 0.5) * 12}
                  cy={70 - stemHeight * 0.3}
                  rx={4 + (growth - 0.5) * 5}
                  ry={5 + (growth - 0.5) * 6}
                  fill="#10b981"
                  opacity={0.7 * Math.min((growth - 0.5) / 0.3, 1)}
                  className="transition-all duration-400"
                />
              </>
            )}
          </svg>
        </div>

        {/* NEXUS Text */}
        <div 
          className="font-tesla font-bold text-lg text-white/70 tracking-[0.15em] mb-4"
          style={{ 
            fontFamily: 'Barlow',
            letterSpacing: '0.15em'
          }}
        >
          NEXUS
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
