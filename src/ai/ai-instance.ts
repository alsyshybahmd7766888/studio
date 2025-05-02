'use server';
/**
 * @fileOverview Configures the global Genkit instance.
 */
import {genkit} from 'genkit';
import {googleAI, gemini15Flash} from '@genkit-ai/googleai';

export const ai = genkit({
  promptDir: './prompts',
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY, // Ensure this environment variable is set
    }),
  ],
  model: gemini15Flash, // Set gemini-1.5-flash as the default model
});
