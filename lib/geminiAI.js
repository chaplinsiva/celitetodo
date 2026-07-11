const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const API_KEY_STORAGE = 'celite-gemini-api-key';

export function getStoredApiKey() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(API_KEY_STORAGE) || '';
}

export function setStoredApiKey(key) {
  if (typeof window === 'undefined') return;
  if (key) {
    localStorage.setItem(API_KEY_STORAGE, key);
  } else {
    localStorage.removeItem(API_KEY_STORAGE);
  }
}

/**
 * Call Gemini API with structured JSON output configuration for maximum speed
 */
async function callGemini(systemPrompt, userMessage, apiKey) {
  const makeRequest = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: `${systemPrompt}\n\nUser input: "${userMessage}"` }
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 800,
            responseMimeType: 'application/json',
          },
        }),
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        if (res.status === 400 || res.status === 403) {
          throw new Error('Invalid API key. Please check your Gemini API key.');
        }
        const errBody = await res.text();
        throw new Error(`Gemini API error (${res.status}): ${errBody}`);
      }

      return res;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error('AI request timed out. Please try again.');
      }
      throw err;
    }
  };

  // Try once, retry on failure
  let res;
  try {
    res = await makeRequest();
  } catch (firstErr) {
    // Retry once for transient errors (not auth errors)
    if (firstErr.message?.includes('Invalid API key')) throw firstErr;
    try {
      res = await makeRequest();
    } catch (retryErr) {
      throw retryErr;
    }
  }

  const data = await res.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const cleanText = rawText.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(cleanText);
  } catch (e) {
    // Fallback regex parsing if needed
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse AI response.');
    }
    return JSON.parse(jsonMatch[0]);
  }
}

/**
 * Master function: parse message into multiple actions (tasks, finances, and/or notes).
 * Returns an array of actions: [{ type: 'task' | 'finance' | 'note', data: {...} }]
 */
export async function parseMessage(message, apiKey, activeTab = 'tasks') {
  if (!apiKey) throw new Error('Gemini API key is not set.');

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });

  const tomorrowStr = new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0];
  const nextWeekStr = new Date(today.setDate(today.getDate() + 6)).toISOString().split('T')[0];

  const systemPrompt = `You are a parser for "Celite Manager" (Tasks, Finances, Notes). Today is ${dayOfWeek}, ${todayStr}.
Active Tab: "${activeTab}". Ambiguous queries bias to active tab. Support single/multiple actions.
Output format: ONLY JSON matching this structure:
{
  "actions": [
    {
      "messageType": "task",
      "data": {
        "title": "Task title",
        "description": "Details",
        "labels": ["Work"|"Personal"|"Study"|"Health"|"Shopping"|"Urgent"],
        "dueDate": "YYYY-MM-DD",
        "routine": "daily"|"weekly"|"monthly"|""
      }
    },
    {
      "messageType": "finance",
      "data": {
        "type": "income"|"expense"|"savings"|"investment",
        "amount": 0,
        "label": "Short label",
        "category": "Category name",
        "description": "Details",
        "date": "YYYY-MM-DD"
      }
    },
    {
      "messageType": "note",
      "data": {
        "title": "Structured title",
        "content": "Cleaned formatted text. Checklists format as '- [ ] item'. Brainstorms format with bullet lists.",
        "type": "note"|"brainstorm"|"checklist",
        "labels": ["Ideas"|"Work"|"Personal"|...]
      }
    },
    {
      "messageType": "clear_finance" | "clear_tasks" | "clear_notes" | "clear_all",
      "data": {}
    }
  ]
}

Classification rules:
- NOTE: Messy paragraphs, ideas list, checklists. (Default when tab is notes).
- TASK: Todos, reminders, schedules. E.g. "attend meeting tomorrow".
- FINANCE: Money tracker (income, spent, save, invest). E.g. "spent 192 rs".
- CLEAR_FINANCE: When user wants to delete/clear/reset all transactions or reset balance to 0. E.g. "delete all transactions", "reset balance", "clear money history".
- CLEAR_TASKS: When user wants to delete/clear/reset all tasks. E.g. "delete all tasks", "clear todos".
- CLEAR_NOTES: When user wants to delete/clear/reset all notes. E.g. "delete all notes", "clear brainstorms".
- CLEAR_ALL: When user wants to delete everything/reset everything. E.g. "reset all", "delete everything".

Relative Dates:
- "today" = ${todayStr}
- "tomorrow" = ${tomorrowStr}
- "next week" = ${nextWeekStr}`;

  let parsed;
  try {
    parsed = await callGemini(systemPrompt, message, apiKey);
  } catch (err) {
    console.error('Gemini parsing failed, falling back to local defaults:', err);
    // Graceful fallback to avoid showing error to the user
    parsed = { actions: [] };
  }

  // Graceful fallback: if parsing returned no actions, map the raw input to a default action based on the active tab
  if (!parsed || !Array.isArray(parsed.actions) || parsed.actions.length === 0) {
    if (activeTab === 'money') {
      // Look for any numbers in the message to default the amount
      const numMatch = message.match(/\d+/);
      const fallbackAmount = numMatch ? Number(numMatch[0]) : 0;
      return [
        {
          type: 'finance',
          data: {
            type: 'expense',
            amount: fallbackAmount,
            label: message.replace(/\d+/, '').trim() || 'Expense',
            category: 'General',
            description: '',
            date: todayStr,
          },
        },
      ];
    } else if (activeTab === 'notes') {
      return [
        {
          type: 'note',
          data: {
            title: message.length > 30 ? message.slice(0, 30) + '...' : message,
            content: message,
            type: 'note',
            labels: ['General'],
          },
        },
      ];
    } else {
      return [
        {
          type: 'task',
          data: {
            title: message,
            description: '',
            labels: ['Personal'],
            dueDate: '',
            routine: '',
          },
        },
      ];
    }
  }

  return parsed.actions.map((act) => {
    if (['clear_finance', 'clear_tasks', 'clear_notes', 'clear_all'].includes(act.messageType)) {
      return {
        type: act.messageType,
        data: {},
      };
    }

    if (act.messageType === 'finance') {
      const fd = act.data || {};
      return {
        type: 'finance',
        data: {
          type: ['income', 'expense', 'savings', 'investment'].includes(fd.type)
            ? fd.type
            : 'expense',
          amount: Math.abs(Number(fd.amount) || 0),
          label: String(fd.label || message).slice(0, 80),
          category: String(fd.category || 'General'),
          description: String(fd.description || ''),
          date: /^\d{4}-\d{2}-\d{2}$/.test(fd.date) ? fd.date : todayStr,
        },
      };
    }

    if (act.messageType === 'note') {
      const nd = act.data || {};
      return {
        type: 'note',
        data: {
          title: String(nd.title || 'Untitled Note').slice(0, 100),
          content: String(nd.content || ''),
          type: ['note', 'brainstorm', 'checklist'].includes(nd.type) ? nd.type : 'note',
          labels: Array.isArray(nd.labels) ? nd.labels.map(l => String(l).trim()).filter(Boolean) : ['General'],
        },
      };
    }

    // Default to task
    const td = act.data || {};
    return {
      type: 'task',
      data: {
        title: String(td.title || message).slice(0, 100),
        description: String(td.description || ''),
        labels: Array.isArray(td.labels)
          ? td.labels.map((l) => String(l).trim()).filter(Boolean)
          : [],
        dueDate: /^\d{4}-\d{2}-\d{2}$/.test(td.dueDate) ? td.dueDate : '',
        routine: ['daily', 'weekly', 'monthly'].includes(td.routine)
          ? td.routine
          : '',
      },
    };
  });
}
