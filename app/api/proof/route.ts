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
      'TidesOS': {
        'main': 'README.md',
        'case1-cross-browser-audio': 'Case1-Cross-Browser-Audio.md',
        'case2-exponential-backoff': 'Case2-Exponential-Backoff.md',
      },
      'LogiScan': {
        'main': 'README.md',
        'case1-vision-api-cost': 'Case1-Vision-API-Cost.md',
        'case2-client-side-architecture': 'Case2-Client-Side-Architecture.md',
      },
      'Lux': {
        'main': 'README.md',
        'case1-token-efficiency': 'Case1-Token-Efficiency.md',
        'case2-circuit-breaker': 'Case2-Circuit-Breaker.md',
        'case3-path-validation': 'Case3-Path-Validation.md',
        'case4-memory-decay': 'Case4-Memory-Decay.md',
        'case6-hallucination-reduction': 'Case6-Hallucination-Reduction.md',
      }
    };

    const fileName = proofFileMap[project]?.[proof];
    if (!fileName) {
      return new NextResponse('Proof not found', { status: 404 });
    }

    // Construct the file path within the project directory
    // Main files (README.md, Main.md) are directly in the project folder
    // Case study files: Lux has files directly in folder, TidesOS and LogiScan have a MiniCaseStudies subfolder
    let filePath: string;
    if (proof === 'main') {
      // Main case study content is in the project root
      filePath = path.join(process.cwd(), 'MiniCaseStudies', project, fileName);
    } else if (project === 'Lux') {
      // Lux case studies are directly in the Lux folder
      filePath = path.join(process.cwd(), 'MiniCaseStudies', project, fileName);
    } else {
      // TidesOS and LogiScan case studies are in a MiniCaseStudies subfolder
      filePath = path.join(process.cwd(), 'MiniCaseStudies', project, 'MiniCaseStudies', fileName);
    }
    
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
