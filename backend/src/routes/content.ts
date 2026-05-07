import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyAdmin } from '../middleware/auth';
const router = express.Router();
const prisma = new PrismaClient();

router.get('/latest', verifyAdmin, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    
    const [pages, services, projects, media, partners, heroConfig] = await Promise.all([
      prisma.page.findMany({ 
        orderBy: { updatedAt: 'desc' }, 
        take: 3,
        select: { id: true, title: true, updatedAt: true, isPublished: true }
      }),
      prisma.service.findMany({ 
        orderBy: { updatedAt: 'desc' }, 
        take: 3,
        select: { id: true, title: true, updatedAt: true, isActive: true }
      }),
      prisma.project.findMany({ 
        orderBy: { updatedAt: 'desc' }, 
        take: 3,
        select: { id: true, title: true, updatedAt: true, isHighlight: true }
      }),
      prisma.media.findMany({ 
        orderBy: { createdAt: 'desc' }, 
        take: 3 
      }),
      prisma.partner.findMany({ 
        orderBy: { updatedAt: 'desc' }, 
        take: 3 
      }),
      prisma.siteConfig.findUnique({ where: { key: 'hero_slides' } }),
    ]);

    const allContent: any[] = [
      ...pages.map((p: any) => ({ 
        id: p.id, type: 'Page', title: p.title, 
        status: p.isPublished ? 'Published' : 'Draft', date: p.updatedAt 
      })),
      ...services.map((s: any) => ({ 
        id: s.id, type: 'Service', title: s.title, 
        status: s.isActive ? 'Active' : 'Inactive', date: s.updatedAt 
      })),
      ...projects.map((p: any) => ({ 
        id: p.id, type: 'Project', title: p.title, 
        status: p.isHighlight ? 'Highlight' : 'Regular', date: p.updatedAt 
      })),
      ...media.map((m: any) => ({ 
        id: m.id, type: 'Gallery', title: m.filename, 
        status: 'Uploaded', date: m.createdAt 
      })),
      ...partners.map((p: any) => ({ 
        id: p.id, type: 'Partner', title: p.name, 
        status: p.isActive ? 'Active' : 'Inactive', date: p.updatedAt 
      })),
      // Hero & Banner from SiteConfig
      ...(heroConfig ? [{
        id: 'hero-slides', type: 'Hero/Banner', 
        title: 'Hero Slides', 
        status: 'Active', date: heroConfig.updatedAt 
      }] : []),
    ];

    allContent.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    res.json(allContent.slice(0, limit));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
