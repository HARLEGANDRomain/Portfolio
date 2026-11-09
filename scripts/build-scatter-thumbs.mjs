/**
 * Génère les miniatures du fond éparpillé : public/scatter/<projet>/<image>.webp
 *
 *   npm run build:scatter
 *
 * Les captures d'origine (1,5 à 2,5 K px, 400 à 800 Ko) sont réduites à 1100 px de large : assez net pour
 * l'image principale de l'amas (≈ 560 px CSS, écrans 2×), et ≈ 6× plus léger. Relancer après avoir modifié
 * la liste d'images dans src/data/scatterImages.js, puis committer public/scatter/.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { scatterSourceFiles } from '../src/data/scatterImages.js';

const WIDTH = 1100;
const publicDir = path.resolve('public');
let total = 0;

for (const { from, to } of scatterSourceFiles()) {
  const input = path.join(publicDir, from);
  const output = path.join(publicDir, to);
  if (!fs.existsSync(input)) { console.warn(`⚠ introuvable : ${from}`); continue; }
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const info = await sharp(input).resize({ width: WIDTH, withoutEnlargement: true }).webp({ quality: 78 }).toFile(output);
  total += info.size;
  console.log(`${to}  ${info.width}×${info.height}  ${(info.size / 1024).toFixed(0)} Ko`);
}
console.log(`Total : ${(total / 1024).toFixed(0)} Ko`);
