import { dialog, nativeImage } from 'electron';
import { stat } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { Photo } from '@shared/types';

const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.tiff', '.tif'];

/**
 * 開啟檔案選擇對話框並匯入照片
 */
export async function importPhotos(): Promise<Photo[]> {
  const result = await dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    filters: [
      {
        name: 'Images',
        extensions: ['jpg', 'jpeg', 'png', 'tiff', 'tif'],
      },
    ],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return [];
  }

  const photos: Photo[] = [];

  for (const filepath of result.filePaths) {
    try {
      const stats = await stat(filepath);
      if (!stats.isFile()) continue;

      const ext = path.extname(filepath).toLowerCase();
      if (!SUPPORTED_EXTENSIONS.includes(ext)) continue;

      // Generate thumbnail using nativeImage
      let thumbnail: string | undefined;
      try {
        const thumbnailImage = await nativeImage.createThumbnailFromPath(filepath, {
          width: 256,
          height: 256,
        });
        if (!thumbnailImage.isEmpty()) {
          thumbnail = thumbnailImage.toDataURL();
        }
      } catch (error) {
        console.error(`Failed to generate thumbnail for: ${filepath}`, error);
      }

      const photo: Photo = {
        id: uuidv4(),
        fileName: path.basename(filepath),
        filePath: filepath,
        selected: false,
        exif: null,
        gps: null,
        status: 'idle',
        thumbnail,
      };

      photos.push(photo);
    } catch (error) {
      console.error(`Failed to process file: ${filepath}`, error);
    }
  }

  return photos;
}

/**
 * 生成照片縮圖
 */
export async function generateThumbnail(photoPath: string): Promise<string> {
  try {
    // Read the image file
    const imageBuffer = await readFile(photoPath);
    const base64 = imageBuffer.toString('base64');
    const ext = path.extname(photoPath).toLowerCase();
    
    // Determine MIME type
    let mimeType = 'image/jpeg';
    if (ext === '.png') mimeType = 'image/png';
    else if (ext === '.tiff' || ext === '.tif') mimeType = 'image/tiff';

    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error(`Failed to generate thumbnail for: ${photoPath}`, error);
    throw error;
  }
}
