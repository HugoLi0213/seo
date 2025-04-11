'use client';

import {useState} from 'react';
import {analyzeOnPageSeo, AnalyzeOnPageSeoOutput} from '@/ai/flows/analyze-on-page-seo';
import {extractKeywords, ExtractKeywordsOutput} from '@/ai/flows/extract-keywords';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';

export default function Home() {
  const [url, setUrl] = useState('');
  const [seoAnalysis, setSeoAnalysis] = useState<AnalyzeOnPageSeoOutput | null>(null);
  const [keywords, setKeywords] = useState<ExtractKeywordsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const seoResult = await analyzeOnPageSeo({url});
      setSeoAnalysis(seoResult);

      const keywordsResult = await extractKeywords({url});
      setKeywords(keywordsResult);
    } catch (error) {
      console.error('Error during analysis:', error);
      // TODO: Show toast notification
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>SEO Sleuth</CardTitle>
          <CardDescription>Enter a URL to analyze its SEO factors and extract keywords.</CardDescription>
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

          {seoAnalysis && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">SEO Analysis</h2>
              <p>SEO Score: {seoAnalysis.seoAnalysis.seoScore}</p>
              <p>Title Analysis: {seoAnalysis.seoAnalysis.titleAnalysis}</p>
              <p>Description Analysis: {seoAnalysis.seoAnalysis.descriptionAnalysis}</p>
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
    </div>
  );
}
