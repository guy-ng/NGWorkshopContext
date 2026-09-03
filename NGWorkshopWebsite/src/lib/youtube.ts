const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

export function getYouTubeVideoId(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return null;
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    let candidate: string | null = null;

    if (host === 'youtu.be') {
      candidate = url.pathname.split('/').filter(Boolean)[0] ?? null;
    } else if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (url.pathname === '/watch') candidate = url.searchParams.get('v');
      else {
        const [kind, id] = url.pathname.split('/').filter(Boolean);
        if (['embed', 'shorts', 'live'].includes(kind)) candidate = id ?? null;
      }
    }

    return candidate && VIDEO_ID.test(candidate) ? candidate : null;
  } catch {
    return null;
  }
}
