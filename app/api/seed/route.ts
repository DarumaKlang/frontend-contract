import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

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

    const { error } = await supabase.from('contracts').insert({
      user_id: user.id,
      title: 'Seed Demo Contract',
      data: {
        sellerName: 'Demo Landlord',
        buyerName: 'Demo Tenant',
        productName: 'Demo Studio',
        unitPrice: 35000,
        depositAmount: 70000,
      },
      html: '<div><h1>Seed Demo Contract</h1><p>This record was created from the seed endpoint.</p></div>',
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Seed demo contract error:', error);
    return NextResponse.json({ error: 'Unable to seed demo contract' }, { status: 502 });
  }
}
