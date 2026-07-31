import { NextResponse } from 'next/server';
import { getGitHubEvents, saveGitHubEvent, clearGitHubEvents } from '@/lib/githubEvents';

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

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const branch = body.branch || (Math.random() > 0.5 ? 'main' : 'develop');
    const author = body.author || 'Siva';
    const message = body.message || (branch === 'main' ? 'Fix login page' : 'Add payment API');

    const newEvent = await saveGitHubEvent({
      event_type: 'push',
      title: `Push to ${branch}`,
      author: author,
      avatar_url: 'https://github.com/chaplinsiva.png',
      message: message,
      branch: branch,
      repo_name: 'chaplinsiva/celitetodo',
      url: `https://github.com/chaplinsiva/celitetodo/commit/${branch}`,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Simulated GitHub webhook event created',
      event: newEvent,
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
      message: 'GitHub events cleared successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
