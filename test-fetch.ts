import * as cheerio from 'cheerio'

async function testFetch() {
  const url = 'https://www.amazon.com/dp/B08N5WRWNW'
  console.log('Fetching', url)
  try {
    const resp = await fetch(url, {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'accept-language': 'en-US,en;q=0.9',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'accept-encoding': 'gzip, deflate, br',
        'cache-control': 'max-age=0',
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
