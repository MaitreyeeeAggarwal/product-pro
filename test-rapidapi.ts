const apiKey = process.env.RAPIDAPI_KEY || "4f7c5512camsh8508a57d02df766p181e5ejsnd285a6ab0db6";

async function fetchAmazonProducts() {
  if (!apiKey) {
    console.error("Missing API Key");
    return;
  }
  const url = 'https://real-time-amazon-data.p.rapidapi.com/search?query=best%20sellers%20electronics&page=1&country=US';
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.text();
    console.log(result.slice(0, 1000)); 
  } catch (error) {
    console.error(error);
  }
}

fetchAmazonProducts();
