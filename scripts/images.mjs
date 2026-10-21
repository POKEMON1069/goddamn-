import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const SRC = "public/images";
const WIDTHS = [640, 960, 1440];

const files = (await fs.readdir(SRC)).filter((f) => f.endsWith(".jpg") && !/-\d+w\./.test(f));
for (const file of files) {
  const base = file.replace(/\.jpg$/, "");
  for (const w of WIDTHS) {
    await sharp(path.join(SRC, file))
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 74, effort: 6 })
      .toFile(path.join(SRC, `${base}-${w}w.webp`));
  }
  console.log("sized", base);
}
