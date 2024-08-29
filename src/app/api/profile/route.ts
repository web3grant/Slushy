import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  const dynamicUserId = searchParams.get('dynamicUserId');

  console.log('API: Fetching profile', { username, dynamicUserId });

  try {
    let query = supabase
      .from('users')
      .select('*, social_media_links(*), projects(*), favorite_apps(*)');

    if (username) {
      query = query.eq('username', username);
    } else if (dynamicUserId) {
      query = query.eq('dynamic_user_id', dynamicUserId);
    } else {
      return NextResponse.json({ error: 'Username or Dynamic user ID is required' }, { status: 400 });
    }

    // Use `maybeSingle()` instead of `single()` to handle the case of no results
    const { data, error } = await query.maybeSingle();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    if (!data) {
      console.log('User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('Profile fetched successfully');
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: `Internal server error: ${error.message}` }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(request.url);
  const dynamicUserId = searchParams.get('dynamicUserId');

  if (!dynamicUserId) {
    return NextResponse.json({ error: 'Dynamic user ID is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    console.log('API: Updating profile', { dynamicUserId, body });

    const { data, error } = await supabase
      .from('users')
      .update(body)
      .eq('dynamic_user_id', dynamicUserId)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    if (!data) {
      console.log('User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('Profile updated successfully');
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: `Internal server error: ${error.message}` }, { status: 500 });
  }
}