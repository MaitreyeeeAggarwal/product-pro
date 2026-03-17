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
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'accept-language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    })

    let title = ''
    let imageUrl = ''
    let description = ''

    if (resp.ok) {
      const html = await resp.text()
      const $ = cheerio.load(html)
      title = ($('#productTitle').text() || '').replace(/\s+/g, ' ').trim()
      imageUrl =
        ($('#landingImage').attr('src') || '').trim() ||
        ($('#landingImage').attr('data-old-hires') || '').trim() ||
        ($('#imgTagWrapperId img').attr('src') || '').trim()
      description = ($('#productDescription').text() || '').replace(/\s+/g, ' ').trim()
    }

    // Fallback if Amazon WAF blocked us (resp returning 503) or parsing failed
    if (!title) {
      try {
        const u = new URL(url)
        // Parse slugs like /HP-i3-1315U-Anti-Glare-Micro/dp/B0C3R8Q48M
        const pathParts = u.pathname.split('/').filter(Boolean)
        const dpIndex = pathParts.findIndex(p => p === 'dp' || p === 'gp')
        
        if (dpIndex > 0) {
          title = pathParts[dpIndex - 1].replace(/-/g, ' ')
        } else if (pathParts.length > 0) {
          title = pathParts[0].replace(/-/g, ' ')
        } else {
          title = 'Imported Amazon Product'
        }
      } catch {
        title = 'Imported Amazon Product'
      }
      
      description = 'Product details could not be fully scraped due to Amazon bot protection. You can still rate and review this item.'
    }

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

