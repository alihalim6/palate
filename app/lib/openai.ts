import env from '@/lib/env';
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: env.openaiApiKey,
});

const systemInstructions = `
  You are to suggest the following in the form of a JSON object: a text color, background color and the reason why each was chosen, 
  all based on the tone, mood, content, etc. of given journal entry transcript. Colors should be hex values. Colors other than white and black strongly preferred.
  Be colorful (maintain readbility though). Feel free to choose colors based on individual phrases or even single words in the transcript.
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
        content: `Ugh. Today was one of those days where everything seemed to go wrong.  First, the power went out just as I was starting a crucial video call for work.  By the time it flickered back on, the connection had dropped, and I had to scramble to reschedule.  Then, on my way to grab a much-needed coffee, I managed to trip on a cracked sidewalk and spill half my lunch down my shirt.  Fantastic.The rest of the day was a blur of catching up, apologizing profusely, and trying to salvage a semblance of productivity.  The only saving grace was a surprise delivery of cookies from a neighbor.  Apparently, they heard about the power outage and decided to spread some cheer.  A small gesture, but it definitely brightened my day (and my taste buds).Hopefully, tomorrow is a fresh start.  Maybe I'll even wear my lucky socks.`,
      }
    ],
    model: 'gpt-3.5-turbo',
  });

  return completion.choices[0].message;
}