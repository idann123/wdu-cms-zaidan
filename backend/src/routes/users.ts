import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { verifySuperAdmin, verifyAuth } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET all users
router.get('/', verifySuperAdmin, async (req: any, res: any) => {
  const { role, search } = req.query;
  const where: any = {};
  if (role && role !== 'ALL') {
    where.role = role;
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }
try {
  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatarUrl: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(users);
} catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create new user
router.post('/', verifySuperAdmin, async (req: any, res: any) => {
  const { email, name, password, role } = req.body;
  if (!email || !name || !password || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (!['SUPER_ADMIN', 'ADMIN'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
const user = await prisma.user.create({
  data: { email, name, passwordHash, role },
  select: {
    id: true,
    email: true,
    name: true,
    role: true,
    avatarUrl: true,
    createdAt: true,
  },
});
    res.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update user
router.put('/:id', verifySuperAdmin, async (req: any, res: any) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  
  try {
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }
    
    if (role && !['SUPER_ADMIN', 'ADMIN'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    
const updatedUser = await prisma.user.update({
  where: { id },
  data: {
    ...(name && { name }),
    ...(email && { email }),
    ...(role && { role }),
  },
  select: {
    id: true,
    email: true,
    name: true,
    role: true,
    avatarUrl: true,
    createdAt: true,
    updatedAt: true,
  },
});
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE user
router.delete('/:id', verifySuperAdmin, async (req: any, res: any) => {
  const { id } = req.params;
  if (req.user.userId === id) {
    return res.status(400).json({ error: 'Cannot delete your own account' });
  }
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await prisma.user.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST reset password
router.post('/:id/reset-password', verifySuperAdmin, async (req: any, res: any) => {
  const { id } = req.params;
  const { newPassword } = req.body;
  if (!newPassword) {
    return res.status(400).json({ error: 'New password is required' });
  }
  try {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH update user avatar
router.patch('/:id/avatar', verifyAuth, async (req: any, res: any) => {
  const { id } = req.params;
  const { avatarUrl } = req.body;
  const { userId, role } = req.user;

  if (userId !== id && role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Can only update your own avatar' });
  }

  if (!avatarUrl) {
    return res.status(400).json({ error: 'avatarUrl is required' });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { avatarUrl },
      select: { id: true, email: true, name: true, role: true, avatarUrl: true },
    });
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating avatar:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
