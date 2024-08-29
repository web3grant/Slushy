// pages/api/metadata.ts

import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { load } from 'cheerio'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Invalid URL' })
  }

  try {
    const response = await axios.get(url)
    const html = response.data
    const $ = load(html)

    const title = $('title').text() || $('meta[property="og:title"]').attr('content') || ''
    let favicon = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href') || ''

    // Ensure favicon is an absolute URL
    if (favicon && !favicon.startsWith('http')) {
      const urlObject = new URL(url);
      favicon = new URL(favicon, `${urlObject.protocol}//${urlObject.host}`).href
    }

    res.status(200).json({ title, favicon })
  } catch (error) {
    console.error('Error fetching metadata:', error)
    res.status(500).json({ error: 'Failed to fetch metadata' })
  }
}