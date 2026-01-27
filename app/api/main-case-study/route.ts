import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const project = searchParams.get('project');

  if (!project) {
    return new NextResponse('Missing project parameter', { status: 400 });
  }

  try {
    // Construct the file path within the project directory
    const filePath = path.join(process.cwd(), 'MiniCaseStudies', project, 'MainCaseStudy');
    
    const content = await fs.readFile(filePath, 'utf-8');
    
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Error reading main case study file:', error);
    return new NextResponse('Error loading case study', { status: 500 });
  }
}
