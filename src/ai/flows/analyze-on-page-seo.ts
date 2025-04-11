// use server'
'use server';
/**
 * @fileOverview Analyzes the on-page SEO factors of a given URL.
 *
 * - analyzeOnPageSeo - A function that handles the on-page SEO analysis process.
 * - AnalyzeOnPageSeoInput - The input type for the analyzeOnPageSeo function.
 * - AnalyzeOnPageSeoOutput - The return type for the analyzeOnPageSeo function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {analyzeSeo, SeoAnalysisResult} from '@/services/seo-analyzer';

const AnalyzeOnPageSeoInputSchema = z.object({
  url: z.string().describe('The URL to analyze.'),
});
export type AnalyzeOnPageSeoInput = z.infer<typeof AnalyzeOnPageSeoInputSchema>;

const AnalyzeOnPageSeoOutputSchema = z.object({
  seoAnalysis: z.object({
    seoScore: z.number().describe('The overall SEO score (0-100).'),
    titleAnalysis: z.string().describe('Analysis of title.'),
    descriptionAnalysis: z.string().describe('Analysis of description.'),
  }).describe('The SEO analysis of the page.'),
});
export type AnalyzeOnPageSeoOutput = z.infer<typeof AnalyzeOnPageSeoOutputSchema>;

export async function analyzeOnPageSeo(input: AnalyzeOnPageSeoInput): Promise<AnalyzeOnPageSeoOutput> {
  return analyzeOnPageSeoFlow(input);
}

const analyzeSeoTool = ai.defineTool({
  name: 'analyzeSeo',
  description: 'Analyzes the on-page SEO factors of a given URL and returns an SEO score.',
  inputSchema: z.object({
    url: z.string().describe('The URL to analyze.'),
  }),
  outputSchema: z.object({
    seoScore: z.number().describe('The overall SEO score (0-100).'),
    titleAnalysis: z.string().describe('Analysis of title.'),
    descriptionAnalysis: z.string().describe('Analysis of description.'),
  }),
},
async input => {
  const seoAnalysisResult: SeoAnalysisResult = await analyzeSeo(input.url);
  return {
    seoScore: seoAnalysisResult.seoScore,
    titleAnalysis: seoAnalysisResult.titleAnalysis,
    descriptionAnalysis: seoAnalysisResult.descriptionAnalysis,
  };
});


const analyzeOnPageSeoPrompt = ai.definePrompt({
  name: 'analyzeOnPageSeoPrompt',
  tools: [analyzeSeoTool],
  prompt: `Analyze the on-page SEO factors of the given URL and provide a score.\n\nIf the URL is provided, use the \"analyzeSeo\" tool to get the SEO score and analysis for the URL.\n\nURL: {{{url}}}`, 
  input: {
    schema: z.object({
      url: z.string().describe('The URL to analyze.'),
    }),
  },
  output: {
    schema: z.object({
      seoAnalysis: z.object({
        seoScore: z.number().describe('The overall SEO score (0-100).'),
        titleAnalysis: z.string().describe('Analysis of title.'),
        descriptionAnalysis: z.string().describe('Analysis of description.'),
      }).describe('The SEO analysis of the page.'),
    }),
  },
});

const analyzeOnPageSeoFlow = ai.defineFlow<
  typeof AnalyzeOnPageSeoInputSchema,
  typeof AnalyzeOnPageSeoOutputSchema
>({
  name: 'analyzeOnPageSeoFlow',
  inputSchema: AnalyzeOnPageSeoInputSchema,
  outputSchema: AnalyzeOnPageSeoOutputSchema,
}, async (input) => {
  const {output} = await analyzeOnPageSeoPrompt(input);
  return output!;
});
