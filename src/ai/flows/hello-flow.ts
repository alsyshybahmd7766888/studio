'use server';
/**
 * @fileOverview Defines a simple Genkit flow to generate a greeting.
 *
 * - helloFlow - A function that generates a greeting for a given name.
 * - HelloFlowInput - The input type for the helloFlow function (string).
 * - HelloFlowOutput - The output type for the helloFlow function (string).
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

// Define Input Schema
const HelloFlowInputSchema = z.string().describe("The name to greet.");
export type HelloFlowInput = z.infer<typeof HelloFlowInputSchema>;

// Define Output Schema
const HelloFlowOutputSchema = z.string().describe("The generated greeting.");
export type HelloFlowOutput = z.infer<typeof HelloFlowOutputSchema>;

// Define the Flow
export const helloFlow = ai.defineFlow<
  typeof HelloFlowInputSchema,
  typeof HelloFlowOutputSchema
>(
  {
    name: 'helloFlow',
    inputSchema: HelloFlowInputSchema,
    outputSchema: HelloFlowOutputSchema,
  },
  async (name) => {
    // Use the globally configured model (gemini15Flash)
    const { text } = await ai.generate(`Hello Gemini, my name is ${name}`);
    console.log("Generated greeting:", text); // Log the raw response for debugging
    return text; // Return the generated text
  }
);

// Example function to call the flow (optional, useful for direct invocation)
export async function generateGreeting(name: HelloFlowInput): Promise<HelloFlowOutput> {
    return helloFlow(name);
}

// Example usage within this file (will run on server start if not careful, better to call from dev.ts or API route)
// generateGreeting('Chris').catch(console.error);
