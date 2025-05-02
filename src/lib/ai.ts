// lib/ai.ts
import { genkit }        from 'genkit';
import { googleAI }      from '@genkit-ai/googleai';
import { gemini15Flash } from '@genkit-ai/googleai/models';

export const ai = genkit({
  plugins: [
      googleAI({
            apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
                }),
                  ],
                    model: gemini15Flash,
                    });
                    