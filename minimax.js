import { OpenRouter } from '@openrouter/sdk';

const client = new OpenRouter({
  apiKey: 'YOUR_API_KEY',
  baseURL: 'https://ai.hackclub.com/proxy/v1',
});

const response = await client.chat.send({
  model: 'minimax/minimax-m2-her',
  messages: [
    { role: 'user', content: 'Hello!' }
  ],
});

console.log(response.choices[0].message.content);
