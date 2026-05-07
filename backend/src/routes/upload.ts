import express from 'express';
import upload, { uploadDocument, uploadPartnerLogo } from '../middleware/upload';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { verifyAdmin } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', verifyAdmin, upload.single('avatar'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `/uploads/avatars/${req.file.filename}`;
    res.json({ url: fileUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Upload document (PDF) and save to SiteConfig
router.post('/document', verifyAdmin, uploadDocument.single('document'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `/uploads/documents/${req.file.filename}`;
    
    // Save to SiteConfig
    await prisma.siteConfig.upsert({
      where: { key: 'company_profile_pdf' },
      update: { value: fileUrl },
      create: { key: 'company_profile_pdf', value: fileUrl },
    });

    res.json({ url: fileUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Upload partner logo
router.post('/partner-logo', verifyAdmin, uploadPartnerLogo.single('logo'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `/uploads/partners/${req.file.filename}`;
    res.json({ url: fileUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
