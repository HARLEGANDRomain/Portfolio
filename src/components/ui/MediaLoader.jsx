import React, { useState } from 'react';

/**
 * MediaLoader — Composant universel de chargement de médias (images & vidéos)
 * Fusionne les fonctionnalités de ImageLoader (GwidoPortfolio) et MediaLoader (CaseStudy).
 * 
 * Supporte :
 * - Images et vidéos avec fallback et détection automatique ou explicite
 * - Indicateur de chargement centralisé (spinner)
 * - Animation fluide de transition d'opacité (fade-in)
 * - Eager / Lazy loading configurable
 * - Option wrap pour créer un conteneur relatif automatique
 */
export const MediaLoader = ({
  src,
  type = 'image',
  alt = '',
  className = '',
  style = {},
  eagerLoad = false,
  imgProps = {},
  videoProps = {},
  wrap = false,
  wrapperClassName = '',
  spinnerClassName = '',
  onLoad,
}) => {
  const [loaded, setLoaded] = useState(false);

  const handleLoaded = () => {
    setLoaded(true);
    if (onLoad) onLoad();
  };

  const combinedStyle = {
    ...style,
    opacity: loaded ? (style.opacity ?? 1) : 0,
    transition: style.transition
      ? `${style.transition}, opacity 0.6s ease-in-out`
      : 'opacity 0.6s ease-in-out, transform 0.4s ease',
  };

  const spinner = !loaded && (
    <div className={`absolute inset-0 flex items-center justify-center pointer-events-none z-0 ${spinnerClassName}`}>
      <div className="w-7 h-7 border-2 border-indigo-200/30 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  const resolvedAlt = alt || imgProps.alt || '';

  const mediaElement = type === 'video' ? (
    <video
      src={src}
      preload="none"
      {...videoProps}
      className={`relative z-10 ${className}`}
      style={combinedStyle}
      onLoadedData={handleLoaded}
    />
  ) : (
    <img
      src={src}
      alt={resolvedAlt}
      loading={eagerLoad ? 'eager' : (imgProps.loading ?? 'lazy')}
      decoding={eagerLoad ? 'sync' : (imgProps.decoding ?? 'async')}
      {...imgProps}
      className={`relative z-10 ${className}`}
      style={combinedStyle}
      onLoad={handleLoaded}
    />
  );

  if (wrap) {
    return (
      <div className={`relative ${wrapperClassName}`} style={style}>
        {spinner}
        {mediaElement}
      </div>
    );
  }

  return (
    <>
      {spinner}
      {mediaElement}
    </>
  );
};

export default MediaLoader;
