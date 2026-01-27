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
        'case1-4096-audio-buffer': 'Case1-4096-Audio-Buffer.md',
        'case2-manual-wav-encoding': 'Case2-Manual-WAV-Encoding.md',
        'case3-exponential-backoff': 'Case3-Exponential-Backoff.md',
        'case4-decoupled-architecture': 'Case4-Decoupled-Architecture.md',
        'case5-edge-middleware-auth': 'Case5-Edge-Middleware-Auth.md',
        'case6-interaction-speed': 'Case6-Interaction-Speed.md',
        'case7-persistent-mediastream': 'Case7-Persistent-MediaStream.md',
        'case8-end-to-end-latency': 'Case8-End-to-End-Latency.md',
        'case9-success-rate': 'Case9-Success-Rate.md',
        'case10-zero-escalations': 'Case10-Zero-Escalations.md',
      },
      'LogiScan': {
        'case1': 'Case1.md',
        'case2': 'Case2.md',
        'case3': 'Case3.md',
        'case4': 'Case4.md',
        'case5': 'Case5.md',
        'case6': 'Case6.md',
      }
    };

    const fileName = proofFileMap[project]?.[proof];
    if (!fileName) {
      return new NextResponse('Proof not found', { status: 404 });
    }

    // Construct the file path within the project directory
    const filePath = path.join(process.cwd(), 'MiniCaseStudies', project, 'MiniCaseStudies', fileName);
    
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
