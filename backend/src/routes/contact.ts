import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyAdmin, verifySuperAdmin } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const contact = await prisma.contactMessage.create({
      data: { name, email, phone, subject, message },
    });
    res.json(contact);
  } catch (error) {
    console.error('Error creating contact message:', error);
    res.status(500).json({ error: 'Failed to create contact message' });
  }
});

router.get('/messages', verifyAdmin, async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Get unread message count (for dashboard)
router.get('/messages/unread-count', verifyAdmin, async (req, res) => {
  try {
    const count = await prisma.contactMessage.count({
      where: { isRead: false }
    });
    res.json({ count });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/messages/:id/read', verifyAdmin, async (req, res) => {
  try {
    const message = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { isRead: true },
    });
    res.json(message);
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(404).json({ error: 'Message not found' });
  }
});

router.patch('/messages/:id/reply', verifyAdmin, async (req, res) => {
  try {
    const message = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { isReplied: true },
    });
    res.json(message);
  } catch (error) {
    console.error('Error marking message as replied:', error);
    res.status(404).json({ error: 'Message not found' });
  }
});

router.delete('/messages/:id', verifySuperAdmin, async (req, res) => {
  try {
    await prisma.contactMessage.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(404).json({ error: 'Message not found' });
  }
});

export default router;