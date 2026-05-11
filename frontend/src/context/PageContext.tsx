import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

export interface Page {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDesc: string;
  isPublished: boolean;
  updatedAt: string;
}

interface PageContextType {
  pages: Page[];
  loading: boolean;
  refreshPages: () => Promise<void>;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export function PageProvider({ children }: { children: ReactNode }) {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/pages');
      setPages(data);
    } catch (error) {
      console.error('Failed to fetch pages in context:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  return (
    <PageContext.Provider value={{ pages, loading, refreshPages: fetchPages }}>
      {children}
    </PageContext.Provider>
  );
}

export function usePages() {
  const context = useContext(PageContext);
  if (context === undefined) {
    throw new Error('usePages must be used within a PageProvider');
  }
  return context;
}
