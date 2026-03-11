type ParsedMetadata = {
  title: string
  imageUrl: string
  description: string
}

// Mocked client-side metadata "fetcher" that infers content from the domain.
export async function fetchProductMetadata(url: string): Promise<ParsedMetadata> {
  // Simulate async delay
  await new Promise((resolve) => setTimeout(resolve, 900))

  let host = ''
  try {
    host = new URL(url).hostname.toLowerCase()
  } catch {
    host = url.toLowerCase()
  }

  if (host.includes('amazon')) {
    return {
      title: 'Amazon Product',
      imageUrl: 'https://images.pexels.com/photos/3945650/pexels-photo-3945650.jpeg?auto=compress&w=800',
      description: 'Imported from Amazon. Clean layout, primary product imagery, and a concise description.',
    }
  }

  if (host.includes('nike')) {
    return {
      title: 'Nike Running Sneaker',
      imageUrl: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&w=800',
      description: 'A lightweight performance sneaker with a monochrome upper and subtle detailing.',
    }
  }

  if (host.includes('apple')) {
    return {
      title: 'Apple Device',
      imageUrl: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&w=800',
      description: 'A polished Apple device link. Minimal hardware, clean edges, and a crisp display.',
    }
  }

  return {
    title: 'Referenced Product',
    imageUrl: 'https://images.pexels.com/photos/325153/pexels-photo-325153.jpeg?auto=compress&w=800',
    description: 'We couldn’t detect a specific brand, so we created a neutral placeholder description you can refine.',
  }
}

