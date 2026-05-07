import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyAdmin } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', verifyAdmin, async (req, res) => {
  const services = await prisma.service.findMany({
    where: req.query.active === 'true' ? { isActive: true } : undefined,
    orderBy: { order: 'asc' },
  });
  res.json(services);
});

router.get('/:id', verifyAdmin, async (req, res) => {
  const service = await prisma.service.findUnique({ where: { id: req.params.id } });
  if (!service) return res.status(404).json({ error: 'Service not found' });
  res.json(service);
});

router.post('/', verifyAdmin, async (req, res) => {
  const { title, slug, shortDescription, fullDescription, icon, features, benefits, process, technologies, pricing, gallery, faqs } = req.body;
  const maxOrder = await prisma.service.aggregate({ _max: { order: true } });
  const service = await prisma.service.create({
    data: {
      title,
      slug,
      shortDescription,
      fullDescription,
      icon,
      features: features || [],
      benefits: benefits || [],
      process: process || [],
      technologies: technologies || [],
      pricing: pricing || [],
      gallery: gallery || [],
      faqs: faqs || [],
      order: (maxOrder._max.order || 0) + 1,
    },
  });
  res.json(service);
});

router.put('/:id', verifyAdmin, async (req, res) => {
  const { title, slug, shortDescription, fullDescription, icon, isActive, order, features, benefits, process, technologies, pricing, gallery, faqs } = req.body;
  const service = await prisma.service.update({
    where: { id: req.params.id },
    data: {
      title,
      slug,
      shortDescription,
      fullDescription,
      icon,
      isActive,
      order,
      features: features || undefined,
      benefits: benefits || undefined,
      process: process || undefined,
      technologies: technologies || undefined,
      pricing: pricing || undefined,
      gallery: gallery || undefined,
      faqs: faqs || undefined,
    },
  });
  res.json(service);
});

router.delete('/:id', verifyAdmin, async (req, res) => {
  await prisma.service.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

router.patch('/reorder', verifyAdmin, async (req, res) => {
  const { orders } = req.body;
  await Promise.all(
    orders.map((item: { id: string; order: number }) =>
      prisma.service.update({ where: { id: item.id }, data: { order: item.order } })
    )
  );
  res.json({ success: true });
});

export default router;