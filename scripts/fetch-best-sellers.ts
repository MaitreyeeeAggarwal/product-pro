import fs from 'fs';
import path from 'path';

const apiKey = process.env.RAPIDAPI_KEY || "4f7c5512camsh8508a57d02df766p181e5ejsnd285a6ab0db6";
const OUTPUT_FILE = path.resolve(process.cwd(), './src/data/amazon_products.json');

const FALLBACK_DATA = [
  {
    "id": "B0C3R8Q48M",
    "name": "HP i3-1315U Anti-Glare Micro-Edge Laptop",
    "tagline": "Powerful everyday computing.",
    "price": "$429.99",
    "accent": "grey",
    "type": "desk",
    "imageUrl": "https://m.media-amazon.com/images/I/71kr3ZNjGcL._SX679_.jpg",
    "imported": true
  },
  {
    "id": "B09G96TZZ7",
    "name": "Sony WH-1000XM5 Wireless Headphones",
    "tagline": "Industry leading noise cancellation.",
    "price": "$348.00",
    "accent": "black",
    "type": "audio",
    "imageUrl": "https://m.media-amazon.com/images/I/51aXvjzcukL._AC_SX679_.jpg",
    "imported": true
  },
  {
    "id": "B08N5M7S6K",
    "name": "Apple MacBook Air M1",
    "tagline": "Supercharged by M1.",
    "price": "$749.00",
    "accent": "grey",
    "type": "desk",
    "imageUrl": "https://m.media-amazon.com/images/I/71jG+e7roXL._AC_SX679_.jpg",
    "imported": true
  },
  {
    "id": "B0C5SGN4LX",
    "name": "Anker 737 Power Bank",
    "tagline": "Charge anything, anywhere.",
    "price": "$99.99",
    "accent": "black",
    "type": "accessory",
    "imageUrl": "https://m.media-amazon.com/images/I/71H4U+6i3XL._AC_SX679_.jpg",
    "imported": true
  },
  {
    "id": "B08R6PFD1P",
    "name": "Garmin Forerunner 245",
    "tagline": "GPS running smartwatch.",
    "price": "$199.99",
    "accent": "black",
    "type": "watch",
    "imageUrl": "https://m.media-amazon.com/images/I/51wXkGfHYyL._AC_SX679_.jpg",
    "imported": true
  },
  {
    "id": "B0BCNJNMX1",
    "name": "Logitech MX Master 3S",
    "tagline": "Precision and speed.",
    "price": "$99.00",
    "accent": "black",
    "type": "accessory",
    "imageUrl": "https://m.media-amazon.com/images/I/61ni3t1ryQL._AC_SX679_.jpg",
    "imported": true
  }
];

async function fetchAmazonProducts() {
  console.log("Fetching top products from Amazon via RapidAPI...");
  const url = 'https://real-time-amazon-data.p.rapidapi.com/search?query=best%20sellers%20electronics&page=1&country=US';
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com'
    }
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); 
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
        const result = await response.json();
        if (result && result.data && result.data.products && result.data.products.length > 0) {
            console.log(`Successfully fetched ${result.data.products.length} products.`);
            
            // Map the RapidAPI schema to our app's internal Product schema
            const mappedProducts = result.data.products.map((p: any) => {
                return {
                    id: p.asin,
                    name: p.product_title || 'Amazon Product',
                    tagline: p.product_description?.slice(0, 50) || 'Best seller',
                    price: p.product_price || '$199',
                    accent: Math.random() > 0.5 ? 'black' : 'grey',
                    type: 'accessory', 
                    imageUrl: p.product_photo || '',
                    imported: true
                }
            });

            fs.writeFileSync(OUTPUT_FILE, JSON.stringify(mappedProducts, null, 2));
            console.log(`Saved products to ${OUTPUT_FILE}`);
            return;
        }
    }
    console.warn("API responded but didn't contain expected data. Saving fallback data.");
  } catch (error) {
    console.error("Failed to fetch from RapidAPI (possibly network timeout). \nError:", error);
    console.log("Saving realistic fallback Amazon data to ensure app continues working...");
  }
  
  // Create output file with fallback data
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(FALLBACK_DATA, null, 2));
}

fetchAmazonProducts();
