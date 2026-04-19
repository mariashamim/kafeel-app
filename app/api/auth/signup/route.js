import { NextResponse } from 'next/server';
import { connectDB, disconnectDB } from '@/app/lib/mongodb';
import User from '@/app/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();
    const { role, name, email, password, ...roleSpecificData } = body;
    
    await connectDB();
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await User.create({
      role,
      name,
      email,
      password: hashedPassword,
      ...roleSpecificData,
    });
    
    return NextResponse.json(
      { message: 'User created successfully!', userId: user._id },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  } finally {
    await disconnectDB();
  }
}