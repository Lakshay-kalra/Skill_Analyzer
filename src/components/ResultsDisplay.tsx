import { CheckCircle, AlertCircle, TrendingUp, FileText } from 'lucide-react';

interface Analysis {
  ats_score: number;
  skill_gaps: string[];
  strengths: string[];
  suggestions: string[];
  keyword_matches: number;
  formatting_score: number;
}

interface ResultsDisplayProps {
  filename: string;
  atsScore: number;
  analysis: Analysis;
  onReset: () => void;
}

export function ResultsDisplay({
  filename,
  atsScore,
  analysis,
  onReset,
}: ResultsDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-gray-600" />
            <h2 className="text-2xl font-bold text-gray-800">{filename}</h2>
          </div>
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Analyze Another
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex flex-col items-center">
            <span className="text-sm font-medium text-gray-600 mb-2">
              ATS Score
            </span>
            <span
              className={`text-6xl font-bold ${getScoreColor(atsScore)}`}
            >
              {atsScore}
            </span>
            <span className={`text-lg font-medium ${getScoreColor(atsScore)}`}>
              {getScoreLabel(atsScore)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6 max-w-md mx-auto">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Keyword Matches</p>
              <p className="text-2xl font-bold text-gray-800">
                {analysis.keyword_matches}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Formatting Score</p>
              <p className="text-2xl font-bold text-gray-800">
                {analysis.formatting_score}%
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-green-900">
                Strengths
              </h3>
            </div>
            <ul className="space-y-2">
              {analysis.strengths.length > 0 ? (
                analysis.strengths.map((strength, index) => (
                  <li
                    key={index}
                    className="text-sm text-green-800 flex items-start gap-2"
                  >
                    <span className="text-green-600 mt-1">•</span>
                    <span>{strength}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-green-800">
                  No significant strengths detected
                </li>
              )}
            </ul>
          </div>

          <div className="bg-red-50 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold text-red-900">
                Skill Gaps
              </h3>
            </div>
            <ul className="space-y-2">
              {analysis.skill_gaps.length > 0 ? (
                analysis.skill_gaps.slice(0, 8).map((gap, index) => (
                  <li
                    key={index}
                    className="text-sm text-red-800 flex items-start gap-2"
                  >
                    <span className="text-red-600 mt-1">•</span>
                    <span className="capitalize">{gap}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-red-800">
                  No skill gaps detected
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">
              Suggestions for Improvement
            </h3>
          </div>
          <ul className="space-y-2">
            {analysis.suggestions.length > 0 ? (
              analysis.suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="text-sm text-blue-800 flex items-start gap-2"
                >
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{suggestion}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-blue-800">
                Your resume looks great!
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
