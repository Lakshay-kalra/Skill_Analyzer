import { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { ResultsDisplay } from './components/ResultsDisplay';
import { FileText } from 'lucide-react';
import { getRandomMockResume } from './lib/mockData';

interface Analysis {
  ats_score: number;
  skill_gaps: string[];
  strengths: string[];
  suggestions: string[];
  keyword_matches: number;
  formatting_score: number;
}

interface ResultData {
  filename: string;
  ats_score: number;
  analysis: Analysis;
}

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase configuration missing');
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `${supabaseUrl}/functions/v1/analyze-resume`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to analyze resume');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setResult({
        filename: data.filename,
        ats_score: data.ats_score,
        analysis: data.analysis,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Upload error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  const handleDemo = () => {
    const mockResume = getRandomMockResume();
    setResult({
      filename: mockResume.filename,
      ats_score: mockResume.ats_score,
      analysis: mockResume.analysis,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Resume Skill Gap Analyzer
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Upload your resume to get an ATS score and identify skill gaps
          </p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Error: {error}</p>
          </div>
        )}

        {!result ? (
          <FileUpload onUpload={handleUpload} onDemo={handleDemo} isLoading={isLoading} />
        ) : (
          <ResultsDisplay
            filename={result.filename}
            atsScore={result.ats_score}
            analysis={result.analysis}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}

export default App;
