import ExifReader from 'exifreader';
import { readFile } from 'fs/promises';
import type { ExifData } from '@shared/types';

/**
 * 讀取照片的 EXIF 資訊
 */
export async function readExif(photoPath: string): Promise<ExifData | null> {
  try {
    const buffer = await readFile(photoPath);
    const tags = ExifReader.load(buffer, { expanded: true });

    const exifData: ExifData = {};

    // Extract common EXIF fields
    if (tags.exif) {
      if (tags.exif.DateTimeOriginal) {
        exifData.dateTime = tags.exif.DateTimeOriginal.description;
      }
    }

    if (tags.file) {
      if (tags.file['Image Width']) {
        exifData.width = parseInt(tags.file['Image Width'].description);
      }
      if (tags.file['Image Height']) {
        exifData.height = parseInt(tags.file['Image Height'].description);
      }
    }

    if (tags.ifd0) {
      if (tags.ifd0.Make) {
        exifData.cameraMake = tags.ifd0.Make.description;
      }
      if (tags.ifd0.Model) {
        exifData.cameraModel = tags.ifd0.Model.description;
      }
      if (tags.ifd0.Orientation) {
        exifData.orientation = tags.ifd0.Orientation.value as number;
      }
    }

    if (tags.exif) {
      if (tags.exif.ISO) {
       exifData.iso = tags.exif.ISO.description;
      }
      if (tags.exif.FocalLength) {
        exifData.focalLength = tags.exif.FocalLength.description;
      }
      if (tags.exif.FNumber) {
        exifData.aperture = `f/${tags.exif.FNumber.description}`;
      }
      if (tags.exif.ExposureTime) {
        exifData.shutterSpeed = tags.exif.ExposureTime.description;
      }
    }

    return Object.keys(exifData).length > 0 ? exifData : null;
  } catch (error) {
    console.error(`Failed to read EXIF from ${photoPath}:`, error);
    return null;
  }
}
