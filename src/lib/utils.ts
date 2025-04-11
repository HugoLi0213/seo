import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSeoSuggestions(seoScore: number, titleAnalysis: string, descriptionAnalysis: string): string[] {
  const suggestions: string[] = [];

  if (seoScore < 70) {
    suggestions.push("Improve the overall quality of your content.");
  }

  if (titleAnalysis.toLowerCase().includes("not optimized")) {
    suggestions.push("Optimize your title tag with relevant keywords.");
  }

  if (descriptionAnalysis.toLowerCase().includes("not optimized")) {
    suggestions.push("Write a compelling meta description to improve click-through rate.");
  }

  return suggestions;
}
