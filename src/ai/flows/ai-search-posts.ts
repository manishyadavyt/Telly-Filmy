'use server';

/**
 * @fileOverview An AI-powered post search flow.
 *
 * - aiSearchPosts - A function that handles the post search process.
 * - AISearchPostsInput - The input type for the aiSearchPosts function.
 * - AISearchPostsOutput - The return type for the aiSearchPosts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AISearchPostsInputSchema = z.object({
  query: z.string().describe('The search query.'),
  posts: z
    .array(z.string())
    .describe('The list of posts available to search through.'),
});
export type AISearchPostsInput = z.infer<typeof AISearchPostsInputSchema>;

const AISearchPostsOutputSchema = z.object({
  results: z
    .array(z.string())
    .describe('The list of relevant posts based on the search query.'),
});
export type AISearchPostsOutput = z.infer<typeof AISearchPostsOutputSchema>;

export async function aiSearchPosts(input: AISearchPostsInput): Promise<AISearchPostsOutput> {
  return aiSearchPostsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSearchPostsPrompt',
  input: {schema: AISearchPostsInputSchema},
  output: {schema: AISearchPostsOutputSchema},
  prompt: `You are a search assistant. Given a search query and a list of
posts, you will return a list of relevant posts based on the search query.

Search Query: {{{query}}}
Posts: {{{posts}}}`,
});

const aiSearchPostsFlow = ai.defineFlow(
  {
    name: 'aiSearchPostsFlow',
    inputSchema: AISearchPostsInputSchema,
    outputSchema: AISearchPostsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
