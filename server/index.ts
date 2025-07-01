import crypto from 'crypto';
import dotenv from 'dotenv';
// Load environment variables
dotenv.config();

import cors from 'cors';
import { eq } from 'drizzle-orm';
import express from 'express';
import { db } from './db';
import { users } from './db/schema';

// Debug: Check environment variables
console.log('🔍 Environment check:');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('PORT:', process.env.PORT);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:3000', 'exp://192.168.1.169:8081'],
  credentials: true,
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Core Access API is running' });
});

// Sign in endpoint
app.post('/api/auth/signin', async (req, res) => {
  console.log('🔐 Sign in attempt:', { email: req.body.email });
  
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({
        error: 'Email and password are required',
      });
    }

    // Find user in database
    const [user] = await db.select().from(users).where(eq(users.email, email));
    console.log('👤 User found:', user ? 'Yes' : 'No');

    if (!user || user.password !== password) {
      console.log('❌ Invalid credentials');
      return res.status(401).json({
        error: 'Invalid credentials',
      });
    }

    console.log('✅ Sign in successful for:', email);
    // Return user data (without password)
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('❌ Sign in error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sign up endpoint
app.post('/api/auth/signup', async (req, res) => {
  console.log('📝 Sign up attempt:', { email: req.body.email, name: req.body.name });
  
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({
        error: 'Email and password are required',
      });
    }
    // Email format validation
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      console.log('❌ Invalid email format:', email);
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    // Check if user already exists
    const [existingUser] = await db.select().from(users).where(eq(users.email, email));
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(409).json({
        error: 'User already exists',
      });
    }

    // Create new user
    const newUser = {
      id: crypto.randomUUID(),
      email,
      password, // Will be hashed when we add BetterAuth
      name: name || 'New User',
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('💾 Creating new user:', { id: newUser.id, email: newUser.email });
    await db.insert(users).values(newUser);
    console.log('✅ User created successfully');

    // Return user data (without password)
    res.status(201).json({
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (error) {
    console.error('❌ Sign up error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 API available at http://localhost:${PORT}`);
}); 