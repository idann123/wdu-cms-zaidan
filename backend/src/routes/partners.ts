import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyAdmin } from '../middleware/auth';
const router = express.Router();
const prisma = new PrismaClient();

// Public: Get all partners (for ExperiencePage)
router.get('/', async (req, res) => {
  try {
    const { limit, active } = req.query;
    const partners = await prisma.partner.findMany({
      where: active === 'true' ? { isActive: true } : undefined,
      orderBy: { year: 'desc' },
      take: limit ? parseInt(limit as string) : undefined,
    });
    res.json(partners);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Get all partners (with auth)
router.get('/admin', verifyAdmin, async (req, res) => {
  try {
    const { limit, active } = req.query;
    const partners = await prisma.partner.findMany({
      where: active === 'true' ? { isActive: true } : undefined,
      orderBy: { updatedAt: 'desc' },
      take: limit ? parseInt(limit as string) : undefined,
    });
    res.json(partners);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create partner
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { name, category, logo, image, website, isActive, order, year } = req.body;
    const partner = await prisma.partner.create({
      data: { name, category, logo, image, website, isActive, order, year },
    });
    res.json(partner);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update partner
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, logo, image, website, isActive, order, year } = req.body;
    const partner = await prisma.partner.update({
      where: { id },
      data: { name, category, logo, image, website, isActive, order, year },
    });
    res.json(partner);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete partner
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.partner.delete({ where: { id } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
