# Plan: Sinkronisasi Publish/Draft Status - Admin & Halaman Publik

## Problem
`PublicLayout` hanya fetch pages data sekali saat mount. Saat admin toggle publish/draft di tab admin, halaman publik tidak langsung update.

## Solution
Tambahkan `window.addEventListener('focus', ...)` di `PublicLayout` yang akan re-fetch pages setiap kali user fokus kembali ke tab publik.

## Changes

| File | Change |
|------|--------|
| `frontend/src/components/PublicLayout.tsx` | Tambahkan re-fetch saat tab fokus |

## Implementation
Di dalam `PublicLayout`, modifikasi useEffect yang sudah ada:

```typescript
useEffect(() => {
  const loadPages = async () => {
    try {
      const data = await pageApi.getAll();
      setPages(data);
    } catch (err) {
      console.error("Failed to load pages metadata", err);
    } finally {
      setLoadingPages(false);
    }
  };
  loadPages();

  const handleFocus = () => {
    loadPages();
  };
  window.addEventListener('focus', handleFocus);
  return () => window.removeEventListener('focus', handleFocus);
}, []);
```

## Behavior
1. Admin buka halaman publik di tab A
2. Admin toggle publish/draft di tab B (admin panel)
3. Admin klik/fokus ke tab A (halaman publik) → otomatis re-fetch → nav links dan status langsung update

## Tradeoffs
- **Pro**: Ringan, tidak ada polling yang membebani server, UX natural
- **Con**: Hanya trigger saat user fokus ke tab (tidak real-time otomatis). User harus klik/tab ke halaman publik dulu.
