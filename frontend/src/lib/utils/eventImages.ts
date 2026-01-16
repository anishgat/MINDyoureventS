/**
 * Get event image URL - uses Unsplash API for professional stock photos
 * Falls back to placeholder if API key not available
 */

export function getEventImageUrl(eventTitle: string, eventLocation?: string): string {
  // Use Unsplash Source API (no key required for basic usage)
  // Format: https://source.unsplash.com/featured/?{keywords}
  
  // Extract keywords from event title
  const keywords = eventTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2)
    .slice(0, 3)
    .join(',');
  
  // Add location if available
  const searchQuery = eventLocation 
    ? `${keywords},${eventLocation.toLowerCase().replace(/[^a-z0-9\s]/g, '')}`
    : keywords;
  
  // Use Unsplash Source with specific dimensions (800x600 for carousel cards)
  return `https://source.unsplash.com/800x600/?${encodeURIComponent(searchQuery)}`;
}

/**
 * Get a more specific image based on event type
 */
export function getEventImageByType(eventTitle: string, eventLocation?: string): string {
  const title = eventTitle.toLowerCase();
  
  // Map common event types to better search terms
  let searchTerms = eventTitle;
  
  if (title.includes('clean') || title.includes('river') || title.includes('beach')) {
    searchTerms = 'volunteer cleanup environment';
  } else if (title.includes('food') || title.includes('pantry') || title.includes('pack')) {
    searchTerms = 'food pantry volunteer community';
  } else if (title.includes('tech') || title.includes('mentor') || title.includes('youth')) {
    searchTerms = 'technology education youth workshop';
  } else if (title.includes('story') || title.includes('history') || title.includes('neighborhood')) {
    searchTerms = 'community storytelling gathering';
  } else if (title.includes('garden') || title.includes('shelter') || title.includes('build')) {
    searchTerms = 'community garden volunteer work';
  }
  
  if (eventLocation) {
    searchTerms += ` ${eventLocation}`;
  }
  
  return `https://source.unsplash.com/800x600/?${encodeURIComponent(searchTerms)}`;
}
