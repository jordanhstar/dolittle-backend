const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));

app.post('/analyze', async (req, res) => {
  try {
    const { messages } = req.body;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1000,
        messages,
      }),
    });
    const text = await response.text();
    console.log('Anthropic response:', text);
    try {
      const data = JSON.parse(text);
      res.json(data);
    } catch {
      res.status(500).json({ error: 'Invalid response from Anthropic', raw: text });
    }
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Dolittle backend is running.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));