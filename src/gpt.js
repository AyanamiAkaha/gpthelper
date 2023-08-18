const https = require('https');

const defaultOptions = {
  apiUrl: 'api.openai.com',
  apiKey: '',
  model: 'gpt-3.5-turbo',
  temperature: 0.8,
};

module.exports = function callGPT(prompt, options = {}) {
  const {
    apiUrl, apiKey, model, temperature,
  } = { ...defaultOptions, ...options };
  const messages = Array.isArray(prompt) ? prompt : [{
    role: 'user',
    content: prompt,
  }];

  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ model, messages, temperature });

    const apiOptions = {
      hostname: apiUrl,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    };

    const request = https.request(apiOptions, (response) => {
      let result = '';

      response.on('data', (chunk) => {
        result += chunk;
      });

      response.on('end', () => {
        if (response.statusCode === 200) {
          const completion = JSON.parse(result).choices[0].message.content;
          resolve(completion);
        } else {
          reject(new Error(`GPT API request failed: ${response.statusMessage}`));
        }
      });
    });

    request.on('error', (error) => {
      reject(error);
    });

    request.write(data);
    request.end();
  });
};
