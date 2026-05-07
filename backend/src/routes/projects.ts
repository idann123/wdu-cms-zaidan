import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyAdmin } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', verifyAdmin, async (req, res) => {
  const projects = await prisma.project.findMany({
    where: req.query.highlight === 'true' ? { isHighlight: true } : undefined,
    orderBy: { order: 'asc' },
  });
  res.json(projects);
});

router.get('/:id', verifyAdmin, async (req, res) => {
  const project = await prisma.project.findUnique({ where: { id: req.params.id } });
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

router.post('/', verifyAdmin, async (req, res) => {
  const { title, client, category, year, description, imageUrl, isHighlight } = req.body;
  const maxOrder = await prisma.project.aggregate({ _max: { order: true } });
  const project = await prisma.project.create({
    data: {
      title, client, category, year, description, imageUrl, isHighlight,
      order: (maxOrder._max.order || 0) + 1,
    },
  });
  res.json(project);
});

router.put('/:id', verifyAdmin, async (req, res) => {
  const { title, client, category, year, description, imageUrl, isHighlight } = req.body;
  const project = await prisma.project.update({
    where: { id: req.params.id },
    data: { title, client, category, year, description, imageUrl, isHighlight },
  });
  res.json(project);
});

router.delete('/:id', verifyAdmin, async (req, res) => {
  await prisma.project.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

export default router;