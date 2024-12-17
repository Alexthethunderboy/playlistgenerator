export function getProxiedImageUrl(originalUrl) {
    if (!originalUrl) return '/placeholder.svg';
    
    // If it's already a local URL or data URL, return as is
    if (originalUrl.startsWith('/') || originalUrl.startsWith('data:')) {
      return originalUrl;
    }
  
    // Create the proxied URL
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/api/image-proxy?url=${encodeURIComponent(originalUrl)}`;
  }
  
  