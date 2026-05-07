import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyAdmin } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', verifyAdmin, async (req, res) => {
  const pages = await prisma.page.findMany({ orderBy: { slug: 'asc' } });
  res.json(pages);
});

// Public endpoint - no auth required, only returns published pages
router.get('/public/:slug', async (req, res) => {
  const slug = req.params.slug;
  let page = await prisma.page.findUnique({ 
    where: { slug: slug } 
  });

  // Fallback: try with leading slash if not found
  if (!page) {
    page = await prisma.page.findUnique({
      where: { slug: `/${slug}` }
    });
  }
  
  if (!page || !page.isPublished) {
    return res.status(404).json({ error: 'Page not found' });
  }
  
  res.json(page);
});

// Public endpoint - get all published pages (for navigation)
router.get('/public', async (req, res) => {
  const pages = await prisma.page.findMany({ 
    where: { isPublished: true },
    orderBy: { slug: 'asc' },
    select: {
      id: true,
      slug: true,
      title: true,
      isPublished: true
    }
  });
  res.json(pages);
});

// Admin endpoint - requires auth
router.get('/:slug', verifyAdmin, async (req, res) => {
  const page = await prisma.page.findUnique({ where: { slug: req.params.slug } });
  if (!page) return res.status(404).json({ error: 'Page not found' });
  res.json(page);
});

router.post('/', verifyAdmin, async (req, res) => {
  const { title, slug, metaTitle, metaDesc, sections, isPublished } = req.body;

  if (!title) return res.status(400).json({ error: 'Title is required' });

  let pageSlug = slug || title.toLowerCase().replace(/\s+/g, '-');
  // Clean slug - remove leading slash if present
  if (pageSlug.startsWith('/')) {
    pageSlug = pageSlug.slice(1);
  }

  try {
    const page = await prisma.page.create({
      data: {
        title,
        slug: pageSlug,
        metaTitle,
        metaDesc,
        sections: sections || null,
        isPublished: isPublished || false,
      },
    });
    res.status(201).json(page);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Slug already exists' });
    }
    throw error;
  }
});

router.put('/:slug', verifyAdmin, async (req, res) => {
  const { title, metaTitle, metaDesc, sections, isPublished } = req.body;
  const page = await prisma.page.update({
    where: { slug: req.params.slug },
    data: { title, metaTitle, metaDesc, sections, isPublished },
  });
  res.json(page);
});

router.delete('/:slug', verifyAdmin, async (req, res) => {
  await prisma.page.delete({
    where: { slug: req.params.slug },
  });
  res.status(204).send();
});

router.patch('/:slug/publish', verifyAdmin, async (req, res) => {
  const { isPublished } = req.body;
  const page = await prisma.page.update({
    where: { slug: req.params.slug },
    data: { isPublished },
  });
  res.json(page);
});

export default router;