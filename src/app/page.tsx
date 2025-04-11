'use client';

import {useState} from 'react';
import {analyzeOnPageSeo, AnalyzeOnPageSeoOutput} from '@/ai/flows/analyze-on-page-seo';
import {extractKeywords, ExtractKeywordsOutput} from '@/ai/flows/extract-keywords';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {analyzeSeo, SeoAnalysisResult} from '@/services/seo-analyzer';
import {Switch} from '@/components/ui/switch';
import {useToast} from '@/hooks/use-toast';
import {Toaster} from '@/components/ui/toaster';

// Function to extract keywords from text (non-AI alternative)
const extractKeywordsFromText = async (text: string): Promise<string[]> => {
  // Basic implementation: split by spaces and filter common stop words
  const stopWords = new Set(['the', 'a', 'an', 'is', 'are', 'in', 'of', 'to', 'and', 'for', 'on', 'at', 'by']);
  return text.split(/\s+/).filter(word => word.length > 2 && !stopWords.has(word.toLowerCase()));
};

// Function to provide SEO improvement suggestions
const getSeoSuggestions = (seoScore: number, titleAnalysis: string, descriptionAnalysis: string): string[] => {
  const suggestions: string[] = [];

  if (seoScore < 60) {
    suggestions.push('Improve your overall SEO score by optimizing content and structure.');
  }

  if (titleAnalysis.toLowerCase().includes('not optimized')) {
    suggestions.push('Optimize your title tag with relevant keywords and a concise description.');
  }

  if (descriptionAnalysis.toLowerCase().includes('not optimized')) {
    suggestions.push('Improve your meta description to accurately reflect the page content and attract clicks.');
  }

  // Add more specific suggestions based on the analysis
  if (seoScore < 80) {
    suggestions.push('Consider improving page load speed for better user experience and SEO.');
  }

  return suggestions;
};

export default function Home() {
  const [url, setUrl] = useState('');
  const [seoAnalysis, setSeoAnalysis] = useState<AnalyzeOnPageSeoOutput | SeoAnalysisResult | null>(null);
  const [keywords, setKeywords] = useState<ExtractKeywordsOutput | { keywords: string[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [useAi, setUseAi] = useState(true); // State to control AI usage
  const {toast} = useToast();

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      let seoResult: AnalyzeOnPageSeoOutput | SeoAnalysisResult;
      let keywordsResult: ExtractKeywordsOutput | { keywords: string[] } | null = null;

      if (useAi) {
        seoResult = await analyzeOnPageSeo({url});
        keywordsResult = await extractKeywords({url});
      } else {
        seoResult = await analyzeSeo(url);
        const response = await fetch(url);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const textContent = doc.body.textContent || "";
        const keywords = await extractKeywordsFromText(textContent);
        keywordsResult = {keywords};
      }

      setSeoAnalysis(seoResult);
      setKeywords(keywordsResult);

      toast({
        title: 'Analysis Complete',
        description: 'SEO analysis and keyword extraction complete.',
      });

    } catch (error) {
      console.error('Error during analysis:', error);
      toast({
        title: 'Error',
        description: 'An error occurred during analysis. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  let seoScore: number | undefined = undefined;
  let titleAnalysis: string = "";
  let descriptionAnalysis: string = "";

  if (seoAnalysis) {
    if ('seoAnalysis' in seoAnalysis && seoAnalysis.seoAnalysis) {
      seoScore = seoAnalysis.seoAnalysis.seoScore;
      titleAnalysis = seoAnalysis.seoAnalysis.titleAnalysis;
      descriptionAnalysis = seoAnalysis.seoAnalysis.descriptionAnalysis;
    } else if ('seoScore' in seoAnalysis) {
      seoScore = seoAnalysis.seoScore;
      titleAnalysis = seoAnalysis.titleAnalysis;
      descriptionAnalysis = seoAnalysis.descriptionAnalysis;
    }
  }

  const seoSuggestions = seoScore !== undefined ? getSeoSuggestions(seoScore, titleAnalysis, descriptionAnalysis) : [];

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>SEO Sleuth</CardTitle>
          <CardDescription>
            Enter a URL to analyze its SEO factors and extract keywords. {useAi ? `Powered by Google's Gemini 2.0 Flash model.` : `Running without AI.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="Enter URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAnalyze} disabled={isLoading}>
              {isLoading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="ai" checked={useAi} onCheckedChange={(checked) => setUseAi(checked)} />
            <label htmlFor="ai" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Use AI Analysis
            </label>
          </div>

          {seoAnalysis && 'seoAnalysis' in seoAnalysis && seoAnalysis.seoAnalysis && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">SEO Analysis</h2>
              <p>SEO Score: {seoAnalysis.seoAnalysis.seoScore}</p>
              <p>Title Analysis: {seoAnalysis.seoAnalysis.titleAnalysis}</p>
              <p>Description Analysis: {seoAnalysis.seoAnalysis.descriptionAnalysis}</p>
            </div>
          )}

          {seoAnalysis && !('seoAnalysis' in seoAnalysis) && ('seoScore' in seoAnalysis) && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">SEO Analysis</h2>
              <p>SEO Score: {seoAnalysis.seoScore}</p>
              <p>Title Analysis: {seoAnalysis.titleAnalysis}</p>
              <p>Description Analysis: {seoAnalysis.descriptionAnalysis}</p>
            </div>
          )}

          {seoSuggestions.length > 0 && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">SEO Improvement Suggestions</h2>
              <ul>
                {seoSuggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}

          {keywords && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Keywords</h2>
              <ul>
                {keywords.keywords.map((keyword, index) => (
                  <li key={index}>{keyword}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
      <Toaster/>
    </div>
  );
}
