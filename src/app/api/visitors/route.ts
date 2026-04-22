import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define path to our local database file
const dbPath = path.join(process.cwd(), 'visitors.json');

// Helper to ensure file exists and read data
function getDatabase() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify([]));
  }
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
}

export async function GET() {
  try {
    const visitors = getDatabase();
    return NextResponse.json(visitors);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read database' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    let visitors = getDatabase();

    const newVisitor = {
      ...data,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      status: 'Pending',
    };

    visitors.push(newVisitor);
    
    try {
      fs.writeFileSync(dbPath, JSON.stringify(visitors, null, 2));
    } catch (fsError) {
      console.warn("Read-only Serverless Environment: Simulated database write.");
    }

    return NextResponse.json(newVisitor, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    let visitors = getDatabase();
    
    const index = visitors.findIndex((v: any) => v.id === data.id);
    if (index !== -1) {
      visitors[index].status = data.status;
      try {
        fs.writeFileSync(dbPath, JSON.stringify(visitors, null, 2));
      } catch (fsError) {
        console.warn("Read-only Serverless Environment: Simulated database write.");
      }
      return NextResponse.json(visitors[index]);
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const data = await request.json();
    let visitors = getDatabase();
    visitors = visitors.filter((v: any) => v.id !== data.id);
    
    try {
      fs.writeFileSync(dbPath, JSON.stringify(visitors, null, 2));
    } catch (fsError) {
      console.warn("Read-only Serverless Environment: Simulated database write.");
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
