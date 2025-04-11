'use server';
/**
 * @fileOverview Extracts keywords from a given URL.
 *
 * - extractKeywords - A function that handles the keyword extraction process.
 * - ExtractKeywordsInput - The input type for the extractKeywords function.
 * - ExtractKeywordsOutput - The return type for the extractKeywords function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {analyzeSeo} from '@/services/seo-analyzer';

const ExtractKeywordsInputSchema = z.object({
  url: z.string().describe('The URL to extract keywords from.'),
});
export type ExtractKeywordsInput = z.infer<typeof ExtractKeywordsInputSchema>;

const ExtractKeywordsOutputSchema = z.object({
  keywords: z.array(z.string()).describe('The extracted keywords from the URL.'),
});
export type ExtractKeywordsOutput = z.infer<typeof ExtractKeywordsOutputSchema>;

export async function extractKeywords(input: ExtractKeywordsInput): Promise<ExtractKeywordsOutput> {
  return extractKeywordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractKeywordsPrompt',
  input: {
    schema: z.object({
      url: z.string().describe('The URL to extract keywords from.'),
    }),
  },
  output: {
    schema: z.object({
      keywords: z.array(z.string()).describe('The extracted keywords from the URL.'),
    }),
  },
  prompt: `You are an expert SEO analyst. Extract the keywords from the content of the following URL. Return a list of keywords.

URL: {{{url}}}`,
});

const extractKeywordsFlow = ai.defineFlow<
  typeof ExtractKeywordsInputSchema,
  typeof ExtractKeywordsOutputSchema
>(
  {
    name: 'extractKeywordsFlow',
    inputSchema: ExtractKeywordsInputSchema,
    outputSchema: ExtractKeywordsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
