import express from 'express'
import * as cheerio from 'cheerio'

const app = express()
app.use(express.json({ limit: '128kb' }))

function isLikelyAmazonUrl(input: string) {
  try {
    const u = new URL(input)
    return /(^|\.)amazon\./i.test(u.hostname)
  } catch {
    return false
  }
}

app.post('/api/fetch-product', async (req, res) => {
  const url = typeof req.body?.url === 'string' ? req.body.url.trim() : ''
  if (!url) return res.status(400).json({ error: 'Missing url' })
  if (!isLikelyAmazonUrl(url)) return res.status(400).json({ error: 'URL must be an Amazon product URL' })

  try {
    const resp = await fetch(url, {
      headers: {
        // Amazon tends to block generic bots; this is a best-effort.
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'accept-language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    })

    if (!resp.ok) {
      return res.status(502).json({ error: `Upstream returned ${resp.status}` })
    }

    const html = await resp.text()
    const $ = cheerio.load(html)

    const title = ($('#productTitle').text() || '').replace(/\s+/g, ' ').trim()
    const imageUrl =
      ($('#landingImage').attr('src') || '').trim() ||
      ($('#landingImage').attr('data-old-hires') || '').trim() ||
      ($('#imgTagWrapperId img').attr('src') || '').trim()
    const description = ($('#productDescription').text() || '').replace(/\s+/g, ' ').trim()

    return res.json({
      title,
      imageUrl,
      description,
    })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Failed to fetch product data' })
  }
})

const port = Number(process.env.PORT || 5179)
app.listen(port, () => {
  console.log(`[api] listening on http://localhost:${port}`)
})

