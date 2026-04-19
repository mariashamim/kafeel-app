import { connectDB } from '@/app/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ 
      message: '✅ Database connected successfully!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ 
      error: '❌ Database connection failed: ' + error.message 
    }, { status: 500 });
  }
}