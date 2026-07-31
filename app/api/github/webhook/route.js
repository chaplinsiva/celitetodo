import { NextResponse } from 'next/server';
import { saveGitHubEvent } from '@/lib/githubEvents';

export async function POST(request) {
  try {
    const eventHeader = request.headers.get('x-github-event') || 'push';
    const body = await request.json().catch(() => ({}));

    let title = 'GitHub Event';
    let author = 'GitHub User';
    let avatar_url = null;
    let message = 'Event received';
    let branch = 'main';
    let repo_name = body.repository?.full_name || 'celitetodo';
    let url = null;

    if (eventHeader === 'push') {
      const branchRef = body.ref ? body.ref.replace('refs/heads/', '') : 'main';
      branch = branchRef;
      title = `Push to ${branchRef}`;
      author = body.pusher?.name || body.head_commit?.author?.name || body.sender?.login || 'Siva';
      avatar_url = body.sender?.avatar_url || null;

      if (body.head_commit?.message) {
        message = body.head_commit.message;
      } else if (body.commits && body.commits.length > 0) {
        message = body.commits.map((c) => c.message).join(' | ');
      } else {
        message = `Pushed commits to ${branchRef}`;
      }

      url = body.head_commit?.url || body.compare || body.repository?.html_url;
    } else if (eventHeader === 'pull_request') {
      const action = body.action || 'updated';
      const prNumber = body.number || body.pull_request?.number || '';
      title = `PR #${prNumber} ${action}`;
      author = body.pull_request?.user?.login || body.sender?.login || 'GitHub User';
      avatar_url = body.pull_request?.user?.avatar_url || body.sender?.avatar_url || null;
      message = body.pull_request?.title || `Pull Request #${prNumber} ${action}`;
      branch = body.pull_request?.head?.ref || 'main';
      url = body.pull_request?.html_url;
    } else if (eventHeader === 'issues') {
      const action = body.action || 'opened';
      const issueNum = body.issue?.number || '';
      title = `Issue #${issueNum} ${action}`;
      author = body.issue?.user?.login || body.sender?.login || 'GitHub User';
      avatar_url = body.issue?.user?.avatar_url || body.sender?.avatar_url || null;
      message = body.issue?.title || `Issue #${issueNum}`;
      url = body.issue?.html_url;
    } else if (eventHeader === 'star') {
      const action = body.action === 'deleted' ? 'unstarred' : 'starred';
      title = `Repo ${action}`;
      author = body.sender?.login || 'GitHub User';
      avatar_url = body.sender?.avatar_url || null;
      message = `${author} ${action} ${repo_name}`;
      url = body.repository?.html_url;
    } else if (eventHeader === 'ping') {
      title = 'Webhook Connected';
      author = body.sender?.login || 'GitHub';
      avatar_url = body.sender?.avatar_url || null;
      message = `GitHub Webhook successfully configured for ${repo_name}!`;
      url = body.repository?.html_url;
    } else {
      title = `${eventHeader.toUpperCase()} Event`;
      author = body.sender?.login || 'GitHub User';
      avatar_url = body.sender?.avatar_url || null;
      message = body.description || `Received ${eventHeader} payload`;
      url = body.repository?.html_url;
    }

    const savedEvent = await saveGitHubEvent({
      event_type: eventHeader,
      title,
      author,
      avatar_url,
      message,
      branch,
      repo_name,
      url,
      payload: body,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Webhook event received and recorded successfully',
      event: savedEvent,
    });
  } catch (error) {
    console.error('Error processing GitHub webhook:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    message: 'GitHub Webhook listener is active and ready to accept POST webhooks.',
    endpoint: '/api/github/webhook',
  });
}
