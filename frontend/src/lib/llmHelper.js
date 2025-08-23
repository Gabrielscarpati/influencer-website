import OpenAI from 'openai';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function generateInfluencerReply(influencerModelPreset, priorMessages, latestUserMessage) {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not set. Check your .env file and restart the dev server.');
  }
  
  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true // Note: In production, move API calls to backend
  });

  // Build conversation history for OpenAI format
  const messages = [
    {
      role: 'system',
      content: influencerModelPreset.system_prompt
    }
  ];

  // Add prior conversation history
  priorMessages.forEach(msg => {
    messages.push({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content
    });
  });

  // Add the latest user message
  messages.push({
    role: 'user',
    content: latestUserMessage
  });

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: messages,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating content from OpenAI:', error);
    throw new Error('Failed to generate influencer reply.');
  }
}
