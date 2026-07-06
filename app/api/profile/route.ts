import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase is not configured' }, { status: 500 });
    }

    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') ?? null;

    if (!token) {
      return NextResponse.json({ error: 'Missing auth token' }, { status: 401 });
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: data });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({ error: 'Unable to load profile' }, { status: 502 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase is not configured' }, { status: 500 });
    }

    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') ?? null;

    if (!token) {
      return NextResponse.json({ error: 'Missing auth token' }, { status: 401 });
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await request.json();
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    const existingHistory = Array.isArray(existingProfile?.contract_history) ? existingProfile.contract_history : [];
    const existingLinks = Array.isArray(existingProfile?.document_links) ? existingProfile.document_links : [];
    const existingFrequent = existingProfile?.frequent_profile_data && typeof existingProfile.frequent_profile_data === 'object'
      ? existingProfile.frequent_profile_data
      : {};

    const nextHistory = [...existingHistory, ...(payload.contract_history ?? [])].slice(-10);
    const nextLinks = [...existingLinks, ...(payload.document_links ?? [])].slice(-10);
    const nextFrequent = {
      ...(existingFrequent as Record<string, unknown>),
      ...(payload.frequent_profile_data ?? {}),
    };
    const nextPoints = Number(existingProfile?.points ?? 0) + Number(payload.points ?? 0);

    const updatePayload = {
      user_id: user.id,
      full_name: payload.full_name ?? existingProfile?.full_name ?? null,
      frequent_profile_data: nextFrequent,
      contract_history: nextHistory,
      document_links: nextLinks,
      points: nextPoints,
      last_used_at: payload.last_used_at ?? new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(updatePayload, { onConflict: 'user_id' })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: data });
  } catch (error) {
    console.error('Save profile error:', error);
    return NextResponse.json({ error: 'Unable to save profile' }, { status: 502 });
  }
}
