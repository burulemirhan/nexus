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
        // Check if image is complete or has natural dimensions
        return img.complete && (img.naturalWidth > 0 || img.naturalHeight > 0);
      });

      // Check all videos
      const videos = Array.from(document.querySelectorAll('video'));
      const videosLoaded = videos.every(video => {
        // Check if video has loaded enough data to play
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
  const seedVisible = growth < 0.2;
  const leavesVisible = growth > 0.4;

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
        <div className="relative w-28 h-40 mb-6">
          <svg
            viewBox="0 0 100 120"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Soil base */}
            <ellipse
              cx="50"
              cy="115"
              rx="40"
              ry="5"
              fill="#1a1a1a"
              opacity={0.4}
            />

            {/* Seed - dark green dot */}
            {seedVisible && (
              <circle
                cx="50"
                cy={110 - growth * 25}
                r={7 - growth * 3}
                fill="#064e3b"
                opacity={1 - growth * 5}
                className="transition-all duration-300"
              />
            )}

            {/* Stem - grows upward */}
            {growth >= 0.2 && (
              <line
                x1="50"
                y1={110 - stemHeight}
                x2="50"
                y2="110"
                stroke="#064e3b"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
              />
            )}

            {/* Leaves appear as plant grows */}
            {leavesVisible && (
              <>
                {/* Left bottom leaf */}
                <path
                  d={`M 50 ${110 - stemHeight * 0.5} Q ${38 - (growth - 0.4) * 12} ${95 - stemHeight * 0.55} ${32 - (growth - 0.4) * 10} ${85 - stemHeight * 0.6}`}
                  fill="none"
                  stroke="#065f46"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity={Math.min((growth - 0.4) / 0.3, 1)}
                  className="transition-all duration-400"
                />
                <ellipse
                  cx={32 - (growth - 0.4) * 10}
                  cy={85 - stemHeight * 0.6}
                  rx={4 + (growth - 0.4) * 5}
                  ry={5 + (growth - 0.4) * 6}
                  fill="#065f46"
                  opacity={0.65 * Math.min((growth - 0.4) / 0.3, 1)}
                  className="transition-all duration-400"
                />
                
                {/* Right bottom leaf */}
                <path
                  d={`M 50 ${110 - stemHeight * 0.5} Q ${62 + (growth - 0.4) * 12} ${95 - stemHeight * 0.55} ${68 + (growth - 0.4) * 10} ${85 - stemHeight * 0.6}`}
                  fill="none"
                  stroke="#065f46"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity={Math.min((growth - 0.4) / 0.3, 1)}
                  className="transition-all duration-400"
                />
                <ellipse
                  cx={68 + (growth - 0.4) * 10}
                  cy={85 - stemHeight * 0.6}
                  rx={4 + (growth - 0.4) * 5}
                  ry={5 + (growth - 0.4) * 6}
                  fill="#065f46"
                  opacity={0.65 * Math.min((growth - 0.4) / 0.3, 1)}
                  className="transition-all duration-400"
                />
                
                {/* Middle left leaf */}
                {growth > 0.65 && (
                  <>
                    <path
                      d={`M 50 ${110 - stemHeight * 0.75} Q ${42 - (growth - 0.65) * 8} ${70 - stemHeight * 0.8} ${38 - (growth - 0.65) * 6} ${60 - stemHeight * 0.85}`}
                      fill="none"
                      stroke="#064e3b"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      opacity={Math.min((growth - 0.65) / 0.2, 1)}
                      className="transition-all duration-300"
                    />
                    <ellipse
                      cx={38 - (growth - 0.65) * 6}
                      cy={60 - stemHeight * 0.85}
                      rx={3 + (growth - 0.65) * 4}
                      ry={4 + (growth - 0.65) * 5}
                      fill="#064e3b"
                      opacity={0.7 * Math.min((growth - 0.65) / 0.2, 1)}
                      className="transition-all duration-300"
                    />
                  </>
                )}
                
                {/* Middle right leaf */}
                {growth > 0.65 && (
                  <>
                    <path
                      d={`M 50 ${110 - stemHeight * 0.75} Q ${58 + (growth - 0.65) * 8} ${70 - stemHeight * 0.8} ${62 + (growth - 0.65) * 6} ${60 - stemHeight * 0.85}`}
                      fill="none"
                      stroke="#064e3b"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      opacity={Math.min((growth - 0.65) / 0.2, 1)}
                      className="transition-all duration-300"
                    />
                    <ellipse
                      cx={62 + (growth - 0.65) * 6}
                      cy={60 - stemHeight * 0.85}
                      rx={3 + (growth - 0.65) * 4}
                      ry={4 + (growth - 0.65) * 5}
                      fill="#064e3b"
                      opacity={0.7 * Math.min((growth - 0.65) / 0.2, 1)}
                      className="transition-all duration-300"
                    />
                  </>
                )}
                
                {/* Top leaf */}
                {growth > 0.85 && (
                  <>
                    <line
                      x1="50"
                      y1={110 - stemHeight}
                      x2="50"
                      y2={45 - stemHeight * 0.15}
                      stroke="#065f46"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      opacity={Math.min((growth - 0.85) / 0.15, 1)}
                      className="transition-all duration-300"
                    />
                    <ellipse
                      cx="50"
                      cy={45 - stemHeight * 0.15}
                      rx={5 + (growth - 0.85) * 4}
                      ry={6 + (growth - 0.85) * 5}
                      fill="#065f46"
                      opacity={0.75 * Math.min((growth - 0.85) / 0.15, 1)}
                      className="transition-all duration-300"
                    />
                  </>
                )}
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
