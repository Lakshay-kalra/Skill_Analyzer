import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface ATSAnalysis {
  ats_score: number;
  skill_gaps: string[];
  strengths: string[];
  suggestions: string[];
  keyword_matches: number;
  formatting_score: number;
}

function analyzeResume(content: string): ATSAnalysis {
  const keywords = [
    'experience', 'education', 'skills', 'project', 'work',
    'management', 'development', 'design', 'analysis', 'leadership',
    'communication', 'team', 'agile', 'scrum', 'git', 'javascript',
    'python', 'java', 'react', 'node', 'sql', 'database', 'api',
    'cloud', 'aws', 'azure', 'docker', 'kubernetes'
  ];

  const contentLower = content.toLowerCase();

  let keywordMatches = 0;
  const foundKeywords: string[] = [];
  const missingKeywords: string[] = [];

  keywords.forEach(keyword => {
    if (contentLower.includes(keyword)) {
      keywordMatches++;
      foundKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });

  const hasContactInfo = /email|phone|linkedin|github/.test(contentLower);
  const hasEducation = /education|degree|university|college|bachelor|master/.test(contentLower);
  const hasExperience = /experience|worked|developed|managed|led/.test(contentLower);
  const hasSkills = /skills|proficient|expertise|familiar/.test(contentLower);

  let formattingScore = 0;
  if (hasContactInfo) formattingScore += 25;
  if (hasEducation) formattingScore += 25;
  if (hasExperience) formattingScore += 25;
  if (hasSkills) formattingScore += 25;

  const keywordScore = Math.min((keywordMatches / keywords.length) * 100, 100);
  const atsScore = Math.round((keywordScore * 0.6) + (formattingScore * 0.4));

  const skillGaps = missingKeywords.slice(0, 10);

  const strengths: string[] = [];
  if (hasContactInfo) strengths.push('Contact information present');
  if (hasEducation) strengths.push('Education section included');
  if (hasExperience) strengths.push('Work experience detailed');
  if (hasSkills) strengths.push('Skills section present');
  if (keywordMatches > 15) strengths.push('Good keyword coverage');

  const suggestions: string[] = [];
  if (!hasContactInfo) suggestions.push('Add contact information (email, phone, LinkedIn)');
  if (!hasEducation) suggestions.push('Include education details');
  if (!hasExperience) suggestions.push('Add work experience section');
  if (!hasSkills) suggestions.push('Include a dedicated skills section');
  if (keywordMatches < 10) suggestions.push('Add more industry-relevant keywords');
  if (content.length < 500) suggestions.push('Expand resume content with more details');

  return {
    ats_score: atsScore,
    skill_gaps: skillGaps,
    strengths,
    suggestions,
    keyword_matches: keywordMatches,
    formatting_score: formattingScore,
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file uploaded' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const content = await file.text();

    console.log('Resume Content:', content);
    console.log('Filename:', file.name);
    console.log('File size:', content.length, 'characters');

    const analysis = analyzeResume(content);

    console.log('ATS Score:', analysis.ats_score);
    console.log('Keyword Matches:', analysis.keyword_matches);
    console.log('Formatting Score:', analysis.formatting_score);

    const { data: resumeData, error: dbError } = await supabase
      .from('resumes')
      .insert({
        filename: file.name,
        content: content,
        ats_score: analysis.ats_score,
        analysis: analysis,
      })
      .select()
      .maybeSingle();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to save resume', details: dbError }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        resume_id: resumeData?.id,
        filename: file.name,
        ats_score: analysis.ats_score,
        analysis: analysis,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing resume:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process resume', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
