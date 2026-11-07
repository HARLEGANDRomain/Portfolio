import React from 'react';
import MediaLoader from '../ui/MediaLoader';
import { assetUrl } from '../../utils/assetUrl';
import { MARQUEE_ROWS } from '../../data/projects';

/**
 * Trois bandeaux de captures qui défilent en sens alterné.
 * Chaque bandeau est dupliqué pour boucler sans saut (translateX -50 %).
 * @param {boolean} eager charger les images immédiatement (bandeau visible dès le splash)
 */
const ImageMarquee = ({ eager = false }) => (
  <div className="absolute inset-0 z-[5] flex flex-col justify-center gap-6 py-4" aria-hidden="true">
    {MARQUEE_ROWS.map((row, ri) => (
      <div key={ri} className="overflow-hidden flex-shrink-0">
        <div className={row.direction === 'ltr' ? 'marquee-ltr' : 'marquee-rtl'}>
          {[...row.images, ...row.images].map((src, i) => (
            <div key={i} className="relative flex-shrink-0 w-72 h-[160px] mx-2 rounded-xl overflow-hidden opacity-80">
              <MediaLoader src={assetUrl(src)} alt="" className="w-full h-full object-cover" eagerLoad={eager} />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default ImageMarquee;
