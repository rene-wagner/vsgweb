import type { MediaItem as ApiMediaItem } from "@vsg/sdk";
import type { MediaItem as AppMediaItem } from "@vsg/types";

type MediaItem = ApiMediaItem | AppMediaItem;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function getUploadUrl(pathOrFilename: string | null | undefined): string | null {
  return `${API_BASE_URL}${pathOrFilename}`;
}

export function getMediaUrl(item: MediaItem): string {
  return getUploadUrl(item.url) ?? "";
}

export function getMediaDisplayUrl(item: MediaItem): string {
  return getUploadUrl(item.display_url || item.cropped_url || item.original_url || item.url) ?? "";
}

export function getMediaThumbnailUrl(item: MediaItem): string {
  return (
    getUploadUrl(
      item.cropped_thumbnail_url ||
        item.thumbnail_url ||
        item.display_url ||
        item.cropped_url ||
        item.original_url ||
        item.url,
    ) ?? ""
  );
}
