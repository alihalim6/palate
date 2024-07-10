import { saveEntryAnalysis } from '@/database/entries.repository';
import { analyzeEntry } from '@/lib/openai';
import { AnalyzeEntryRequest, EntryAnalysisResponse } from '@/types';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { transcript, entryId } = await request.json() as AnalyzeEntryRequest;
  const analysisResponse = await analyzeEntry(transcript);
  let analysis: EntryAnalysisResponse | null = null;

  if (analysisResponse.content) {
    analysis = JSON.parse(analysisResponse.content) as EntryAnalysisResponse;

    if (analysis.textColor && analysis.backgroundColor) {
      await saveEntryAnalysis(analysis, entryId);
    }
  }      
}