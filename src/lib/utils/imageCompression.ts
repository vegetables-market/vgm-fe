/**
 * 逕ｻ蜒丞悸邵ｮ繝ｦ繝ｼ繝・ぅ繝ｪ繝・ぅ
 */

import imageCompression from 'browser-image-compression';

const MAX_SIZE_MB = 0.3; // 300KB

/**
 * 逕ｻ蜒上ヵ繧ｩ繝ｼ繝槭ャ繝亥梛
 */
export type ImageFormat = 'jpeg' | 'png' | 'webp';

/**
 * 蝨ｧ邵ｮ繧ｪ繝励す繝ｧ繝ｳ繧堤函謌・
 */
function getCompressionOptions(format: ImageFormat = 'jpeg') {
  return {
    maxSizeMB: MAX_SIZE_MB,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: `image/${format}`,
    initialQuality: 0.8,
  };
}

/**
 * 蝨ｧ邵ｮ邨先棡縺ｮ蝙句ｮ夂ｾｩ
 */
export interface CompressionResult {
  compressedFile: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number; // 蝨ｧ邵ｮ邇・ｼ・・・
}

/**
 * 逕ｻ蜒上ｒ蝨ｧ邵ｮ縺吶ｋ
 * @param file - 蝨ｧ邵ｮ縺吶ｋ逕ｻ蜒上ヵ繧｡繧､繝ｫ
 * @param format - 蜃ｺ蜉帙ヵ繧ｩ繝ｼ繝槭ャ繝茨ｼ医ョ繝輔か繝ｫ繝・ jpeg・・
 * @returns 蝨ｧ邵ｮ邨先棡
 */
export async function compressImage(
  file: File,
  format: ImageFormat = 'jpeg',
): Promise<CompressionResult> {
  const originalSize = file.size;

  // 逶ｮ讓吶し繧､繧ｺ莉･荳九〒縲√°縺､繝輔か繝ｼ繝槭ャ繝医′荳閾ｴ縺吶ｋ蝣ｴ蜷医・縺昴・縺ｾ縺ｾ霑斐☆
  const targetMimeType = `image/${format}`;
  if (originalSize <= MAX_SIZE_MB * 1024 * 1024 && file.type === targetMimeType) {
    return {
      compressedFile: file,
      originalSize,
      compressedSize: originalSize,
      compressionRatio: 0,
    };
  }

  try {
    // 蝨ｧ邵ｮ螳溯｡・
    const options = getCompressionOptions(format);
    let compressedFile = await imageCompression(file, options);
    
    // 300KB繧定ｶ・∴繧句ｴ蜷医√し繧､繧ｺ縺ｫ蜿弱∪繧九∪縺ｧ隗｣蜒丞ｺｦ繧定誠縺ｨ縺励※蜀崎ｩｦ陦・(譛螟ｧ5蝗・
    let iteration = 0;
    const MAX_ITERATIONS = 5;
    
    while (compressedFile.size > MAX_SIZE_MB * 1024 * 1024 && iteration < MAX_ITERATIONS) {
      // 隗｣蜒丞ｺｦ繧貞ｾ舌・↓荳九￡繧・(0.8蛟阪★縺､)
      options.maxWidthOrHeight = Math.floor(options.maxWidthOrHeight * 0.8);
      // 逕ｻ雉ｪ險ｭ螳壹ｂ蟆代＠荳九￡繧具ｼ・rowser-image-compression縺ｮ閾ｪ蜍戊ｪｿ謨ｴ繧定｣懷勧・・
      options.initialQuality = Math.max(0.5, options.initialQuality * 0.9);
      
      console.log(`Retry compression: ${iteration + 1}, MaxWidth: ${options.maxWidthOrHeight}, Quality: ${options.initialQuality}`);
      
      compressedFile = await imageCompression(file, options);
      iteration++;
    }

    const compressedSize = compressedFile.size;

    // 蝨ｧ邵ｮ邇・ｒ險育ｮ暦ｼ亥ｰ乗焚轤ｹ隨ｬ1菴阪∪縺ｧ・・
    const compressionRatio = Math.round(
      ((originalSize - compressedSize) / originalSize) * 1000,
    ) / 10;

    return {
      compressedFile,
      originalSize,
      compressedSize,
      compressionRatio,
    };
  } catch (error) {
    console.error('逕ｻ蜒丞悸邵ｮ繧ｨ繝ｩ繝ｼ:', error);
    throw new Error('逕ｻ蜒上・蝨ｧ邵ｮ縺ｫ螟ｱ謨励＠縺ｾ縺励◆');
  }
}

/**
 * 繝輔ぃ繧､繝ｫ繧ｵ繧､繧ｺ繧剃ｺｺ髢薙′隱ｭ縺ｿ繧・☆縺・ｽ｢蠑上↓螟画鋤
 * @param bytes - 繝舌う繝域焚
 * @returns 繝輔か繝ｼ繝槭ャ繝域ｸ医∩譁・ｭ怜・・井ｾ・ "245.3 KB"・・
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
