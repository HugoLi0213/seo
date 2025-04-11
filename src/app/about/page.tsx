'use client';

import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';

export default function About() {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>About SEO Sleuth</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p>
            SEO Sleuth is a web application designed to help users analyze and optimize their website's SEO (Search Engine
            Optimization). It provides tools and insights to improve on-page SEO, extract relevant keywords, and enhance
            overall search engine visibility.
          </p>
          <ul>
            <li>
              <strong>On-Page SEO Analysis:</strong> Evaluates various aspects of a webpage's content and structure to identify
              areas for improvement.
            </li>
            <li>
              <strong>Keyword Extraction:</strong> Extracts the most relevant keywords from a given text or webpage content.
            </li>
            <li>
              <strong>AI Powered analysis:</strong> Uses Artificial Intelligence to process and analyze the data.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
