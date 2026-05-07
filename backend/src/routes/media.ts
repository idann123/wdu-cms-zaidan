import express from 'express';
import { PrismaClient } from '@prisma/client';
import { uploadGallery } from '../middleware/upload';
import { Request, Response } from 'express';
import { verifyAdmin } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get media with optional type filter
router.get('/', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const { limit, type } = req.query;
    const where: any = {};

    // Filter by file type
    if (type) {
      if (type === 'image') {
        where.mimeType = { startsWith: 'image/' };
      } else if (type === 'pdf') {
        where.mimeType = 'application/pdf';
      } else if (type === 'other') {
        // Files that are not image or pdf
        where.AND = [
          { mimeType: { not: { startsWith: 'image/' } } },
          { mimeType: { not: 'application/pdf' } }
        ];
      }
    }

    const media = await prisma.media.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit as string) : 50,
    });
    res.json(media);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Upload file to gallery
router.post('/upload', verifyAdmin, uploadGallery.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `/uploads/gallery/${req.file.filename}`;

    const media = await prisma.media.create({
      data: {
        filename: req.file.originalname,
        url: fileUrl,
        mimeType: req.file.mimetype,
        size: req.file.size,
        altText: req.body.altText || null,
        uploadedBy: req.body.uploadedBy || 'admin',
      },
    });

    res.status(201).json(media);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update media
router.put('/:id', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const { altText, filename } = req.body;
    const updateData: any = {};
    if (altText !== undefined) updateData.altText = altText;
    if (filename !== undefined) updateData.filename = filename;

    const media = await prisma.media.update({
      where: { id: req.params.id },
      data: updateData,
    });
    res.json(media);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add media via URL (for external URLs)
router.post('/add-url', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const { url, altText, filename } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Detect if URL is an image
    const isImage = /\.(jpeg|jpg|png|gif|webp|svg)$/i.test(url);
    const ext = url.split('.').pop()?.toLowerCase();
    const mimeType = isImage
      ? `image/${ext === 'jpg' ? 'jpeg' : ext || 'jpeg'}`
      : 'application/octet-stream';

    const media = await prisma.media.create({
      data: {
        filename: filename || url.split('/').pop() || 'external-media',
        url: url,
        mimeType: mimeType,
        size: 0, // External URL, size unknown
        altText: altText || null,
        uploadedBy: req.body.uploadedBy || 'admin',
      },
    });

    res.status(201).json(media);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete media
router.delete('/:id', verifyAdmin, async (req: Request, res: Response) => {
  try {
    await prisma.media.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
