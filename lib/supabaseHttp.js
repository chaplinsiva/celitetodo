/**
 * Direct HTTP Client for Supabase PostgREST API (No heavy SDK required)
 * Can be imported in React/Next.js components or Node.js services.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export class SupabaseHttpClient {
  constructor(url = SUPABASE_URL, apiKey = SUPABASE_ANON_KEY) {
    if (!url || !apiKey) {
      throw new Error('Supabase URL and Anon Key are required for SupabaseHttpClient.');
    }
    this.baseUrl = url.replace(/\/$/, '');
    this.apiKey = apiKey;
    this.headers = {
      'apikey': this.apiKey,
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Fetch data from a table (GET)
   * @param {string} tableName - e.g. 'notes', 'tasks', 'transactions'
   * @param {object} params - e.g. { select: '*', limit: 10 }
   * @param {string} authToken - Optional User JWT if RLS is enabled for authenticated users
   */
  async getTable(tableName, params = { select: '*' }, authToken = null) {
    const url = new URL(`${this.baseUrl}/rest/v1/${tableName}`);
    Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));

    const headers = { ...this.headers };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`[Supabase HTTP GET ${res.status}] ${err}`);
    }

    return await res.json();
  }

  /**
   * Insert record into table (POST)
   */
  async insert(tableName, data, authToken = null) {
    const headers = {
      ...this.headers,
      'Prefer': 'return=representation'
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const res = await fetch(`${this.baseUrl}/rest/v1/${tableName}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`[Supabase HTTP POST ${res.status}] ${err}`);
    }

    return await res.json();
  }

  /**
   * Update records in table (PATCH)
   */
  async update(tableName, matchParams, data, authToken = null) {
    const url = new URL(`${this.baseUrl}/rest/v1/${tableName}`);
    Object.entries(matchParams).forEach(([k, v]) => url.searchParams.append(k, v));

    const headers = {
      ...this.headers,
      'Prefer': 'return=representation'
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const res = await fetch(url.toString(), {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`[Supabase HTTP PATCH ${res.status}] ${err}`);
    }

    return await res.json();
  }

  /**
   * Delete records from table (DELETE)
   */
  async delete(tableName, matchParams, authToken = null) {
    const url = new URL(`${this.baseUrl}/rest/v1/${tableName}`);
    Object.entries(matchParams).forEach(([k, v]) => url.searchParams.append(k, v));

    const headers = { ...this.headers };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const res = await fetch(url.toString(), {
      method: 'DELETE',
      headers
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`[Supabase HTTP DELETE ${res.status}] ${err}`);
    }

    return true;
  }
}

export const supabaseHttp = new SupabaseHttpClient();
