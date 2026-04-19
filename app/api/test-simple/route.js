import { NextResponse } from 'next/server';
import { connectDB, disconnectDB } from '@/app/lib/mongodb';

export async function GET() {
  try {
    await connectDB();
    
    return NextResponse.json({ 
      success: true, 
      message: '✅ Database connected successfully!' 
    });
    
  } catch (error) {
    console.error('Connection error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      code: error.code
    }, { status: 500 });
  } finally {
    await disconnectDB();
  }
}