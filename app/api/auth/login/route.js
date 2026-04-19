import { NextResponse } from 'next/server';
import { connectDB, disconnectDB } from '@/app/lib/mongodb';
import User from '@/app/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { email, password, role } = await request.json();
    
    await connectDB();
    
    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Check role
    if (user.role !== role) {
      return NextResponse.json(
        { error: `You are registered as a ${user.role}, not a ${role}` },
        { status: 401 }
      );
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  } finally {
    await disconnectDB();
  }
}