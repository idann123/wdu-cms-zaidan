import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyAdmin } from '../middleware/auth';
import * as fs from 'fs';
import * as path from 'path';

const router = Router();
const prisma = new PrismaClient();

router.get('/', verifyAdmin, async (req, res) => {
  try {
    const configs = await prisma.siteConfig.findMany();
    res.json(configs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get config by key
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const config = await prisma.siteConfig.findUnique({ where: { key } });
    if (!config) {
      return res.status(404).json({ error: 'Config not found' });
    }
    res.json(config);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update config by key
router.put('/:key', verifyAdmin, async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    const config = await prisma.siteConfig.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    res.json(config);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get multiple configs by keys
router.post('/batch', verifyAdmin, async (req, res) => {
  try {
    const { keys } = req.body;
    const configs = await prisma.siteConfig.findMany({
      where: { key: { in: keys } }
    });
    res.json(configs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete config by key (and delete file if it's a file path)
router.delete('/:key', verifyAdmin, async (req, res) => {
  try {
    const { key } = req.params;
    const config = await prisma.siteConfig.findUnique({ where: { key } });

    if (!config) {
      return res.status(404).json({ error: 'Config not found' });
    }

    // If the config value is a file path (e.g., PDF), delete the physical file
    if (config.value && config.value.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', config.value);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete config from database
    await prisma.siteConfig.delete({ where: { key } });
    res.json({ message: 'Config deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;