import { NextResponse } from 'next/server';
import axios from 'axios';
import { load } from 'cheerio';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = load(html);

    const title = $('title').text() || $('meta[property="og:title"]').attr('content') || '';
    let favicon = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href') || '';

    // Ensure favicon is an absolute URL
    if (favicon && !favicon.startsWith('http')) {
      const urlObject = new URL(url);
      favicon = new URL(favicon, `${urlObject.protocol}//${urlObject.host}`).href;
    }

    return NextResponse.json({ name: title, favicon });
  } catch (error) {
    console.error('Error fetching website info:', error);
    return NextResponse.json({ error: 'Failed to fetch website info' }, { status: 500 });
  }
}