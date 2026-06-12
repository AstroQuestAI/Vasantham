const cache = new Map<string, string>();

export async function resolveJioSaavnUrl(
  title: string,
  album: string
): Promise<string | null> {
  const key = `${title}|${album}`;
  if (cache.has(key)) return cache.get(key)!;

  try {
    const query = encodeURIComponent(`${title} ${album}`);
    const res = await fetch(
      `https://saavn.sumit.co/api/search/songs?query=${query}&limit=5`
    );
    if (!res.ok) return null;

    const json = await res.json();
    const results: any[] = json?.data?.results ?? [];
    if (!results.length) return null;

    // Validate: result name must share a meaningful word with the title
    const titleWords = title.toLowerCase().split(' ').filter((w) => w.length > 2);
    const match = results.find((r) => {
      const name = (r.name ?? '').toLowerCase();
      return titleWords.some((w) => name.includes(w));
    });
    if (!match) return null;

    // Prefer 320kbps (last entry)
    const urls: any[] = match.downloadUrl ?? [];
    const url = urls[urls.length - 1]?.url ?? null;
    if (url) cache.set(key, url);
    return url;
  } catch {
    return null;
  }
}
