const fs = require('fs');
const path = require('path');

// 1. Automatically load environment variables from .env.local or .env in current or next-app dir
function loadEnv() {
  const envFiles = [
    path.resolve(__dirname, '.env.local'),
    path.resolve(__dirname, '.env'),
    path.resolve(__dirname, 'next-app', '.env.local'),
    path.resolve(__dirname, 'next-app', '.env')
  ];
  for (const envPath of envFiles) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...valParts] = trimmed.split('=');
          const value = valParts.join('=').trim().replace(/^["']|["']$/g, '');
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = value;
          }
        }
      }
    }
  }
}

loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("❌ Error: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.");
  process.exit(1);
}

/**
 * Pure HTTP Client for Supabase PostgREST API (No SDK / MCP required)
 */
class SupabaseHttpClient {
  constructor(url = SUPABASE_URL, apiKey = SUPABASE_ANON_KEY) {
    this.baseUrl = url.replace(/\/$/, '');
    this.apiKey = apiKey;
    this.headers = {
      'apikey': this.apiKey,
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Get API Schema definition to discover table paths
   */
  async getSchema() {
    const res = await fetch(`${this.baseUrl}/rest/v1/`, {
      method: 'GET',
      headers: this.headers
    });
    if (!res.ok) {
      throw new Error(`Schema request failed: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  }

  /**
   * Call a Supabase Table (GET request)
   */
  async getTableData(tableName, options = { select: '*' }) {
    const url = new URL(`${this.baseUrl}/rest/v1/${tableName}`);
    Object.entries(options).forEach(([k, v]) => url.searchParams.append(k, v));

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: this.headers
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`HTTP ${res.status} error querying table '${tableName}': ${errText}`);
    }

    return await res.json();
  }

  /**
   * Insert a row into a Supabase Table (POST request)
   */
  async insertRow(tableName, data) {
    const res = await fetch(`${this.baseUrl}/rest/v1/${tableName}`, {
      method: 'POST',
      headers: {
        ...this.headers,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`HTTP ${res.status} error inserting into '${tableName}': ${errText}`);
    }

    return await res.json();
  }
}

// Runnable CLI functionality if executed directly with node
async function run() {
  const args = process.argv.slice(2);
  const action = args[0] || 'notes';

  const client = new SupabaseHttpClient();

  console.log(`📡 Connecting to Supabase HTTP REST API...`);
  console.log(`🔗 URL: ${SUPABASE_URL}\n`);

  if (action === 'schema') {
    console.log(`Fetching database schema definition...`);
    try {
      const schema = await client.getSchema();
      const tables = Object.keys(schema.definitions || {});
      console.log(`\n✅ Database Schema Loaded! Available Tables:`);
      tables.forEach(t => console.log(`  - ${t}`));
    } catch (err) {
      console.error(`❌ Failed to fetch schema: ${err.message}`);
    }
    return;
  }

  if (action === 'insert') {
    const tableName = args[1];
    const jsonData = args[2];
    if (!tableName || !jsonData) {
      console.error(`Usage: node supabase-http.js insert <tableName> '<jsonData>'`);
      return;
    }
    try {
      const parsed = JSON.parse(jsonData);
      console.log(`Inserting row into '${tableName}'...`);
      const inserted = await client.insertRow(tableName, parsed);
      console.log(`\n✅ Successfully inserted row:`, inserted);
    } catch (err) {
      console.error(`❌ Insert failed: ${err.message}`);
    }
    return;
  }

  // Default behavior: Fetch table data
  const targetTable = action;
  console.log(`📋 Target Table: '${targetTable}'`);
  try {
    console.log(`Fetching data from table '${targetTable}' via pure HTTP...`);
    const data = await client.getTableData(targetTable, { select: '*', limit: '20' });

    console.log(`\n✅ HTTP Request Successful! Received ${data.length} row(s):\n`);
    console.dir(data, { depth: null, colors: true });

    if (data.length === 0) {
      console.log(`\n💡 Tip: The table is empty or protected by Supabase Row Level Security (RLS).`);
    }

  } catch (err) {
    console.error(`\n❌ HTTP Request Failed: ${err.message}`);
  }
}

if (require.main === module) {
  run();
}

module.exports = { SupabaseHttpClient };
