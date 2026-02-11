import piexif from 'piexifjs';
import { readFile, writeFile } from 'fs/promises';
import type { GpsCoordinates } from '@shared/types';

/**
 * 將十進制座標轉換為 EXIF GPS 格式
 */
function decimalToDMS(decimal: number, isLongitude: boolean): [number[], string] {
  const absolute = Math.abs(decimal);
  const degrees = Math.floor(absolute);
  const minutesFloat = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = (minutesFloat - minutes) * 60;

  const ref = isLongitude
    ? decimal >= 0
      ? 'E'
      : 'W'
    : decimal >= 0
    ? 'N'
    : 'S';

  return [
    [
      [degrees, 1],
      [minutes, 1],
      [Math.round(seconds * 100), 100],
    ],
    ref,
  ];
}

/**
 * 寫入 GPS 資訊到照片的 EXIF
 */
export async function writeGpsToPhoto(
  photoPath: string,
  gps: GpsCoordinates
): Promise<void> {
  try {
    // Read the image file
    const imageData = await readFile(photoPath);
    const imageDataStr = imageData.toString('binary');

    // Parse existing EXIF data or create new
    let exifObj: Record<string, unknown>;
    try {
      const exifData = piexif.load(imageDataStr);
      exifObj = exifData;
    } catch {
      exifObj = { '0th': {}, 'Exif': {}, 'GPS': {}, 'Interop': {}, '1st': {}, thumbnail: null };
    }

    // Convert coordinates to DMS format
    const [latDMS, latRef] = decimalToDMS(gps.lat, false);
    const [lngDMS, lngRef] = decimalToDMS(gps.lng, true);

    // Set GPS data
    if (!exifObj['GPS']) {
      exifObj['GPS'] = {};
    }

    const gpsIfd = exifObj['GPS'] as Record<string, unknown>;
    gpsIfd[piexif.GPSIFD.GPSLatitude] = latDMS;
    gpsIfd[piexif.GPSIFD.GPSLatitudeRef] = latRef;
    gpsIfd[piexif.GPSIFD.GPSLongitude] = lngDMS;
    gpsIfd[piexif.GPSIFD.GPSLongitudeRef] = lngRef;

    // Dump EXIF data
    const exifBytes = piexif.dump(exifObj);
    const newImageData = piexif.insert(exifBytes, imageDataStr);

    // Write back to file
    const buffer = Buffer.from(newImageData, 'binary');
    await writeFile(photoPath, buffer);
  } catch (error) {
    console.error(`Failed to write GPS to ${photoPath}:`, error);
    throw error;
  }
}

/**
 * 批次寫入 GPS 到多張照片
 */
export async function batchWriteGps(
  photoPaths: string[],
  gps: GpsCoordinates,
  progressCallback?: (completed: number, total: number) => void
): Promise<{ success: string[]; failed: string[] }> {
  const success: string[] = [];
  const failed: string[] = [];
  const total = photoPaths.length;

  for (let i = 0; i < total; i++) {
    const photoPath = photoPaths[i];
    try {
      await writeGpsToPhoto(photoPath, gps);
      success.push(photoPath);
    } catch (error) {
      console.error(`Failed to write GPS to ${photoPath}:`, error);
      failed.push(photoPath);
    }

    if (progressCallback) {
      progressCallback(i + 1, total);
    }
  }

  return { success, failed };
}
