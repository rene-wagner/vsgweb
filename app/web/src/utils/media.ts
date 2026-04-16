const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function getUploadUrl(pathOrFilename: string | null | undefined): string | null {
  if (!pathOrFilename) {
    return null;
  }

  if (/^https?:\/\//.test(pathOrFilename)) {
    return pathOrFilename;
  }

  const normalizedPath = pathOrFilename.replace(/^\/?uploads\//, "");
  return `${API_BASE_URL}/uploads/${normalizedPath}`;
}
