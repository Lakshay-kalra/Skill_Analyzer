interface Analysis {
  ats_score: number;
  skill_gaps: string[];
  strengths: string[];
  suggestions: string[];
  keyword_matches: number;
  formatting_score: number;
}

interface MockResume {
  filename: string;
  ats_score: number;
  analysis: Analysis;
}

const mockResumes: MockResume[] = [
  {
    filename: 'john_doe_resume.pdf',
    ats_score: 82,
    analysis: {
      ats_score: 82,
      keyword_matches: 18,
      formatting_score: 85,
      strengths: [
        'Contact information present',
        'Education section included',
        'Work experience detailed',
        'Skills section present',
        'Good keyword coverage',
      ],
      skill_gaps: [
        'kubernetes',
        'azure',
        'docker',
        'scrum',
        'cloud',
        'agile',
        'leadership',
        'communication',
      ],
      suggestions: [
        'Add more technical keywords like Kubernetes and Docker',
        'Include cloud platform experience (AWS, Azure)',
        'Expand on project achievements with quantifiable metrics',
        'Add certifications if applicable',
      ],
    },
  },
  {
    filename: 'sarah_smith_resume.docx',
    ats_score: 65,
    analysis: {
      ats_score: 65,
      keyword_matches: 12,
      formatting_score: 70,
      strengths: [
        'Contact information present',
        'Work experience detailed',
        'Clean formatting',
      ],
      skill_gaps: [
        'kubernetes',
        'azure',
        'docker',
        'aws',
        'api',
        'database',
        'sql',
        'management',
        'scrum',
        'agile',
      ],
      suggestions: [
        'Include education section',
        'Add dedicated skills section',
        'Add more industry-relevant keywords',
        'Include programming languages and tools',
        'Add certifications and achievements',
      ],
    },
  },
  {
    filename: 'michael_johnson_resume.txt',
    ats_score: 72,
    analysis: {
      ats_score: 72,
      keyword_matches: 15,
      formatting_score: 75,
      strengths: [
        'Contact information present',
        'Education section included',
        'Work experience detailed',
      ],
      skill_gaps: [
        'kubernetes',
        'docker',
        'azure',
        'react',
        'leadership',
        'communication',
        'management',
        'scrum',
      ],
      suggestions: [
        'Add more technical skills',
        'Include modern development frameworks',
        'Expand skills section with proficiency levels',
        'Add project descriptions with impact metrics',
        'Consider adding soft skills',
      ],
    },
  },
  {
    filename: 'emily_chen_resume.pdf',
    ats_score: 88,
    analysis: {
      ats_score: 88,
      keyword_matches: 22,
      formatting_score: 90,
      strengths: [
        'Contact information present',
        'Education section included',
        'Work experience detailed',
        'Skills section present',
        'Good keyword coverage',
        'Professional formatting',
      ],
      skill_gaps: ['kubernetes', 'azure', 'scrum'],
      suggestions: [
        'Consider adding Kubernetes experience',
        'Include Azure certification if applicable',
        'Add agile/scrum certification',
      ],
    },
  },
  {
    filename: 'alex_williams_resume.docx',
    ats_score: 45,
    analysis: {
      ats_score: 45,
      keyword_matches: 8,
      formatting_score: 50,
      strengths: [
        'Contact information present',
        'Basic work experience',
      ],
      skill_gaps: [
        'kubernetes',
        'docker',
        'aws',
        'azure',
        'management',
        'development',
        'design',
        'analysis',
        'leadership',
        'agile',
      ],
      suggestions: [
        'Add education section',
        'Include dedicated skills section',
        'Add more industry-relevant keywords',
        'Expand work experience descriptions',
        'Improve overall formatting and structure',
        'Add certifications and technical skills',
      ],
    },
  },
];

export function getRandomMockResume(): MockResume {
  return mockResumes[Math.floor(Math.random() * mockResumes.length)];
}

export function getAllMockResumes(): MockResume[] {
  return mockResumes;
}
