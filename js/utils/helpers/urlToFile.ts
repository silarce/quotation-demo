export async function urlToFile({
  url,
  fileName,
  mimeType,
}: {
  url: string;
  fileName: string;
  mimeType: string;
}): Promise<File> {
  const response = await fetch(url, { credentials: 'include' });
  const data = await response.blob();

  return new File([data], fileName, { type: mimeType });
}
