import React, { useEffect, useState } from 'react';
import{ usePhotoStore } from '../store/photoStore';
import type { ExifData } from '@shared/types';

interface ExifDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// EXIFDrawer 元件已移除，保留空檔案以避免匯入錯誤。
  const { currentPhotoId, photos } = usePhotoStore();
