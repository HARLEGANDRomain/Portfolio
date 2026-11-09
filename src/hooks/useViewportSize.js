import { useEffect, useState } from 'react';

/** Taille de la fenêtre, mise à jour 150 ms après la fin d'un redimensionnement (évite de recalculer à chaque pixel). */
export const useViewportSize = (delay = 150) => {
  const read = () => ({ w: window.innerWidth, h: window.innerHeight });
  const [size, setSize] = useState(read);

  useEffect(() => {
    let id = 0;
    const onResize = () => {
      clearTimeout(id);
      id = setTimeout(() => setSize(read()), delay);
    };
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); clearTimeout(id); };
  }, [delay]);

  return size;
};

export default useViewportSize;
