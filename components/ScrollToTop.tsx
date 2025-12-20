import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  // Performance: Removed multiple scrollTop reads/writes - causes layout thrashing
  // Lenis handles scroll management, this component may not be needed if Lenis is active
  useEffect(() => {
    // Single scroll reset - let Lenis handle smooth scrolling
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
