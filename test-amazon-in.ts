import * as cheerio from 'cheerio'

async function testFetch() {
  const url = 'https://www.amazon.in/HP-i3-1315U-Anti-Glare-Micro/dp/B0C3R8Q48M'
  console.log('Fetching', url)
  try {
    const resp = await fetch(url, {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'accept-language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    })
    
    console.log('Status:', resp.status)
    const html = await resp.text()
    console.log('HTML length:', html.length)
    
    const $ = cheerio.load(html)
    const title = ($('#productTitle').text() || '').replace(/\s+/g, ' ').trim()
    console.log('Title:', title)
  } catch (e) {
    console.error(e)
  }
}

testFetch()
