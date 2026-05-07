# Plan: Preview Mode Before Publish - PagesListPage

## Overview
Add a preview button in `PagesListPage` that opens a modal to preview page content before publishing. The preview will show page metadata and a structured view of the page sections.

## Changes

### 1. `frontend/src/services/pageApi.ts`
Add `getBySlug(slug: string)` method:

```typescript
getBySlug: async (slug: string): Promise<Page> => {
  const response = await api.get(`/pages/${encodeURIComponent(slug)}`);
  return response.data;
},
```

### 2. `frontend/src/components/admin/PagePreviewModal.tsx` (NEW FILE)
Create a preview modal component with:
- Full-screen modal using existing `Modal` component
- Orange banner: "Mode Pratinjau — Halaman ini belum dipublikasikan"
- Page header showing title, slug, and status
- Sections rendered as structured cards with type labels
- Close button

### 3. `frontend/src/pages/admin/PagesListPage.tsx`
Modify:
- Add `previewPage` state: `const [previewPage, setPreviewPage] = useState<Page | null>(null);`
- Add `handlePreview` function that fetches fresh page data and opens preview modal
- Replace "View" button logic:
  - Show "Preview" button for all pages (opens modal)
  - Keep "View" button only for published pages (opens public URL)
- Import and render `PagePreviewModal`

## File Paths
- `C:\Users\user\Desktop\zaidan-magang\wdu-cms-2026\frontend\src\services\pageApi.ts`
- `C:\Users\user\Desktop\zaidan-magang\wdu-cms-2026\frontend\src\components\admin\PagePreviewModal.tsx` (new)
- `C:\Users\user\Desktop\zaidan-magang\wdu-cms-2026\frontend\src\pages\admin\PagesListPage.tsx`
