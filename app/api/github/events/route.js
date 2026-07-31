import { NextResponse } from 'next/server';
import { getGitHubEvents, clearGitHubEvents } from '@/lib/githubEvents';

export async function GET() {
  try {
    const events = await getGitHubEvents();
    return NextResponse.json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await clearGitHubEvents();
    return NextResponse.json({
      success: true,
      message: 'GitHub activity history cleared successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
