import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const project = searchParams.get('project');
  const proof = searchParams.get('proof');

  if (!project || !proof) {
    return new NextResponse('Missing parameters', { status: 400 });
  }

  try {
    // Map proof IDs to file paths
    const proofFileMap: Record<string, Record<string, string>> = {
      'LogiScan': {
        'main': 'README.md',
      },
      'Lux': {
        'main': 'README.md',
      }
    };

    const fileName = proofFileMap[project]?.[proof];
    if (!fileName) {
      return new NextResponse('Proof not found', { status: 404 });
    }

    // Construct the file path within the project directory
    let filePath = path.join(process.cwd(), 'MiniCaseStudies', project, fileName);
    
    const content = await fs.readFile(filePath, 'utf-8');
    
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Error reading proof file:', error);
    return new NextResponse('Error loading proof', { status: 500 });
  }
}
