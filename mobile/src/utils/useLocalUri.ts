import { useState, useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';

// Cache resolved URIs to avoid repeated async calls
const uriCache = new Map<string, string>();

export function useLocalUri(assetId: string, fallbackUri: string): string | null {
  const [localUri, setLocalUri] = useState<string | null>(() => uriCache.get(assetId) ?? null);

  useEffect(() => {
    if (uriCache.has(assetId)) {
      setLocalUri(uriCache.get(assetId)!);
      return;
    }

    // If URI is already a file:// or http:// URL, use it directly
    if (!fallbackUri.startsWith('ph://')) {
      uriCache.set(assetId, fallbackUri);
      setLocalUri(fallbackUri);
      return;
    }

    let cancelled = false;
    MediaLibrary.getAssetInfoAsync(assetId).then((info) => {
      if (cancelled) return;
      const uri = info.localUri ?? fallbackUri;
      uriCache.set(assetId, uri);
      setLocalUri(uri);
    });

    return () => { cancelled = true; };
  }, [assetId, fallbackUri]);

  return localUri;
}
