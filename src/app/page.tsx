'use client';

import {useState} from 'react';
import {analyzeOnPageSeo, AnalyzeOnPageSeoOutput} from '@/ai/flows/analyze-on-page-seo';
import {extractKeywords, ExtractKeywordsOutput} from '@/ai/flows/extract-keywords';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {useToast} from '@/hooks/use-toast';
import {Toaster} from '@/components/ui/toaster';
import {getSeoSuggestions} from "@/lib/utils";

export default function Home() {
  const [url, setUrl] = useState('');
  const [seoAnalysis, setSeoAnalysis] = useState<AnalyzeOnPageSeoOutput | null>(null);
  const [keywords, setKeywords] = useState<ExtractKeywordsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {toast} = useToast();

  const handleAnalyze = async () => {
    if (!url.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a URL to analyze.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const seoResult: AnalyzeOnPageSeoOutput = await analyzeOnPageSeo({url});
      const keywordsResult: ExtractKeywordsOutput = await extractKeywords({url});

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

  if (seoAnalysis && seoAnalysis.seoAnalysis) {
    seoScore = seoAnalysis.seoAnalysis.seoScore;
    titleAnalysis = seoAnalysis.seoAnalysis.titleAnalysis;
    descriptionAnalysis = seoAnalysis.seoAnalysis.descriptionAnalysis;
  }

  const seoSuggestions = seoScore !== undefined ? getSeoSuggestions(seoScore, titleAnalysis, descriptionAnalysis) : [];

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>SEO Sleuth</CardTitle>
          <CardDescription>
            Analyze the SEO factors of a webpage and extract keywords. Powered by Google's Gemini 2.0 Flash model.
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

          {seoAnalysis && seoAnalysis.seoAnalysis && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">SEO Analysis</h2>
              <p>SEO Score: {seoAnalysis.seoAnalysis.seoScore}</p>
              <p>Title Analysis: {seoAnalysis.seoAnalysis.titleAnalysis}</p>
              <p>Description Analysis: {seoAnalysis.seoAnalysis.descriptionAnalysis}</p>
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
