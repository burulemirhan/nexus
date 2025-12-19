import React, { useEffect, useState } from 'react';

const LoadingScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    let checkInterval: NodeJS.Timeout;

    // Function to check if all assets are loaded
    const checkAssetsLoaded = (): boolean => {
      // Check all images
      const images = Array.from(document.querySelectorAll('img'));
      const imagesLoaded = images.length === 0 || images.every(img => {
        return img.complete && (img.naturalWidth > 0 || img.naturalHeight > 0);
      });

      // Check all videos
      const videos = Array.from(document.querySelectorAll('video'));
      const videosLoaded = videos.length === 0 || videos.every(video => {
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
        // Everything loaded, hide loader
        setTimeout(() => {
          setLoading(false);
          if (checkInterval) clearInterval(checkInterval);
        }, 600);
      }
    }, 200);

    // Also check on window load
    const handleLoad = () => {
      setTimeout(() => {
        if (isPageReady()) {
          setTimeout(() => {
            setLoading(false);
            if (checkInterval) clearInterval(checkInterval);
          }, 600);
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
      setLoading(false);
      if (checkInterval) clearInterval(checkInterval);
    }, 8000);

    return () => {
      if (checkInterval) clearInterval(checkInterval);
      clearTimeout(maxTimeout);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  // Trigger animation restart for looping
  useEffect(() => {
    if (!loading) return;
    
    const interval = setInterval(() => {
      setAnimationKey(prev => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, [loading]);

  if (!loading) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-nexus-dark flex items-center justify-center transition-opacity duration-700"
      style={{ 
        opacity: loading ? 1 : 0,
        pointerEvents: loading ? 'auto' : 'none'
      }}
    >
      <div className="flex flex-col items-center justify-center">
        {/* Premium Seed to Plant Animation */}
        <div className="relative w-20 h-28 mb-6">
          <svg
            key={animationKey}
            viewBox="0 0 80 100"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Smooth easing for organic motion */}
              <style>{`
                @keyframes seedAppear {
                  0% { opacity: 0; transform: scale(0.95); }
                  100% { opacity: 1; transform: scale(1); }
                }
                @keyframes rootHint {
                  0%, 15% { opacity: 0; stroke-dashoffset: 8; }
                  25% { opacity: 0.4; stroke-dashoffset: 0; }
                  35% { opacity: 0.2; stroke-dashoffset: 0; }
                  45%, 100% { opacity: 0; stroke-dashoffset: 0; }
                }
                @keyframes stemGrow {
                  0%, 20% { stroke-dashoffset: 50; opacity: 0; }
                  25% { opacity: 1; }
                  65% { stroke-dashoffset: 0; opacity: 1; }
                  75%, 100% { stroke-dashoffset: 0; opacity: 1; }
                }
                @keyframes leafLeftUnfurl {
                  0%, 30% { opacity: 0; transform: scale(0) rotate(-90deg); transform-origin: 40px 60px; }
                  35% { opacity: 0; }
                  65% { opacity: 1; transform: scale(1.05) rotate(0deg); }
                  70% { transform: scale(1) rotate(0deg); }
                  75%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
                }
                @keyframes leafRightUnfurl {
                  0%, 30% { opacity: 0; transform: scale(0) rotate(90deg); transform-origin: 40px 60px; }
                  35% { opacity: 0; }
                  65% { opacity: 1; transform: scale(1.05) rotate(0deg); }
                  70% { transform: scale(1) rotate(0deg); }
                  75%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
                }
                @keyframes fadeOut {
                  0%, 75% { opacity: 1; }
                  100% { opacity: 0; }
                }
              `}</style>
            </defs>

            {/* Root hint - subtle downward line */}
            <line
              x1="40"
              y1="88"
              x2="40"
              y2="92"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="8"
              strokeDashoffset="8"
              opacity="0.3"
              style={{
                animation: 'rootHint 2s ease-out infinite',
                animationFillMode: 'both'
              }}
            />

            {/* Seed - emerald dot with scale-in */}
            <circle
              cx="40"
              cy="88"
              r="5"
              fill="#10b981"
              style={{
                animation: 'seedAppear 0.3s ease-out, fadeOut 2s 1.5s ease-in infinite',
                animationFillMode: 'both'
              }}
            />

            {/* Stem - thin line growing upward */}
            <line
              x1="40"
              y1="83"
              x2="40"
              y2="50"
              stroke="#10b981"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeDasharray="50"
              strokeDashoffset="50"
              opacity="0.9"
              style={{
                animation: 'stemGrow 2s cubic-bezier(0.4, 0, 0.2, 1) infinite, fadeOut 2s 1.5s ease-in infinite',
                animationFillMode: 'both'
              }}
            />

            {/* Left leaf */}
            <g
              style={{
                animation: 'leafLeftUnfurl 2s cubic-bezier(0.34, 1.56, 0.64, 1) infinite, fadeOut 2s 1.5s ease-in infinite',
                animationFillMode: 'both'
              }}
            >
              <path
                d="M 40 60 Q 32 55 28 50"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.85"
              />
              <ellipse
                cx="28"
                cy="50"
                rx="6"
                ry="8"
                fill="#10b981"
                opacity="0.75"
              />
            </g>

            {/* Right leaf */}
            <g
              style={{
                animation: 'leafRightUnfurl 2s cubic-bezier(0.34, 1.56, 0.64, 1) infinite, fadeOut 2s 1.5s ease-in infinite',
                animationFillMode: 'both'
              }}
            >
              <path
                d="M 40 60 Q 48 55 52 50"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.85"
              />
              <ellipse
                cx="52"
                cy="50"
                rx="6"
                ry="8"
                fill="#10b981"
                opacity="0.75"
              />
            </g>
          </svg>
        </div>

        {/* NEXUS Text - minimal and elegant */}
        <div 
          className="font-tesla font-light text-base text-white/50 tracking-[0.2em]"
          style={{ 
            fontFamily: 'Barlow',
            letterSpacing: '0.2em',
            fontWeight: 300
          }}
        >
          NEXUS
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
