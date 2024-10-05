import OpenAI from 'openai';

import env from '@/lib/env';

const openai = new OpenAI({
  apiKey: env.openaiApiKey,
});

const systemInstructions = `
  You are to suggest the following in the form of a JSON object: a text color, background color and the reason why each was chosen, 
  all based on the tone, mood, content, etc. of given journal entry transcript. Colors should be hex values. Colors other than white and black strongly preferred.
  Be artistic and colorful (but be mindful of color contrast/readbility). Feel free to choose colors inspired by individual phrases or even single words in the transcript.
  Provide data in the following JSON format: { textColor: { value: <string>, reason: <string>}, backgroundColor: { value: <string>, reason: <string>} }.
`;

export async function analyzeEntry(transcript: string) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: systemInstructions,
      },
      {
        role: 'user',
        content: transcript,
      },
    ],
    model: 'gpt-3.5-turbo',
  });

  return completion.choices[0].message;
}
