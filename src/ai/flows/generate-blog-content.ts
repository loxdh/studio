'use server';

/**
 * @fileOverview An AI agent for generating blog content based on a title.
 *
 * - generateBlogContent - A function that generates blog content.
 * - GenerateBlogContentInput - The input type for the generateBlogContent function.
 * - GenerateBlogContentOutput - The return type for the generateBlogContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBlogContentInputSchema = z.object({
  title: z.string().describe('The title of the blog post to generate.'),
});

export type GenerateBlogContentInput = z.infer<
  typeof GenerateBlogContentInputSchema
>;

const GenerateBlogContentOutputSchema = z.object({
  content: z.string().describe('The generated blog content in HTML format.'),
});

export type GenerateBlogContentOutput = z.infer<
  typeof GenerateBlogContentOutputSchema
>;

export async function generateBlogContent(
  input: GenerateBlogContentInput
): Promise<GenerateBlogContentOutput> {
  return generateBlogContentFlow(input);
}

const generateBlogContentPrompt = ai.definePrompt({
  name: 'generateBlogContentPrompt',
  input: {schema: GenerateBlogContentInputSchema},
  output: {schema: GenerateBlogContentOutputSchema},
  prompt: `Write a sophisticated, editorial-style article (approx 300 words) for a luxury stationery brand blog about: "{{title}}". Use HTML tags for formatting.`,
});

const generateBlogContentFlow = ai.defineFlow(
  {
    name: 'generateBlogContentFlow',
    inputSchema: GenerateBlogContentInputSchema,
    outputSchema: GenerateBlogContentOutputSchema,
  },
  async input => {
    const {output} = await generateBlogContentPrompt(input);
    return output!;
  }
);
