import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { db } from '../../server/db';
import { users } from '../../server/db/schema';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }
  const [existingUser] = await db.select().from(users).where(eq(users.email, email));
  if (existingUser) {
    return res.status(409).json({ error: 'User already exists' });
  }
  const newUser = {
    id: crypto.randomUUID(),
    email,
    password,
    name: name || 'New User',
    emailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await db.insert(users).values(newUser);
  res.status(201).json({ user: { id: newUser.id, email: newUser.email, name: newUser.name } });
} 