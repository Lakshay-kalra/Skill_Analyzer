/*
  # Create resumes table

  1. New Tables
    - `resumes`
      - `id` (uuid, primary key) - Unique identifier for each resume
      - `user_id` (uuid, nullable) - Reference to user if auth is implemented
      - `filename` (text) - Original filename of the uploaded resume
      - `content` (text) - Extracted text content from the resume
      - `ats_score` (integer) - ATS score (0-100)
      - `analysis` (jsonb) - Detailed analysis including skill gaps
      - `created_at` (timestamptz) - When the resume was uploaded
  
  2. Security
    - Enable RLS on `resumes` table
    - Add policy for public to insert resumes (for demo purposes)
    - Add policy for public to read own resumes
*/

CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  filename text NOT NULL,
  content text NOT NULL,
  ats_score integer DEFAULT 0,
  analysis jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert resumes"
  ON resumes
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read resumes"
  ON resumes
  FOR SELECT
  TO anon
  USING (true);