import { useEffect, useState } from 'react';

const query = '(max-width: 767px)';

/** true sous 768 px (même seuil que le breakpoint `md` de Tailwind). */
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e) => setIsMobile(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return isMobile;
};

export default useIsMobile;
