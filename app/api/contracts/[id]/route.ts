import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase is not configured' }, { status: 500 });
    }

    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') ?? null;

    if (!token) {
      return NextResponse.json({ error: 'Missing auth token' }, { status: 401 });
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, data, html } = await request.json();

    const { data: updated, error } = await supabase
      .from('contracts')
      .update({
        title: title ?? 'Lease Agreement',
        data,
        html,
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select('id')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: updated?.id ?? id });
  } catch (error) {
    console.error('Update contract error:', error);
    return NextResponse.json({ error: 'Unable to update contract' }, { status: 502 });
  }
}
