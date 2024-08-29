import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fetchWebsiteInfo(url: string) {
  try {
    const response = await fetch(`/api/fetch-website-info?url=${encodeURIComponent(url)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch website info');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching website info:', error);
    return { title: null, favicon: null };
  }
}
