// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

require('dotenv').config();

app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const WEBFLOW_SECRET_KEY = process.env.WEBFLOW_SECRET_KEY; // Secret key from Webflow
const ALLOWED_ORIGINS = ['https://ech00.xyz', 'https://www.ech00.xyz', 'https://simulation3xx.com', 'https://www.simulation3xx.com'];

app.post('/api/openai', async (req, res) => {
    const clientSecretKey = req.headers['x-webflow-secret-key'];
    const origin = req.headers['origin'] || req.headers['referer'];

    // Check if the origin matches any allowed origins
    if (!ALLOWED_ORIGINS.includes(origin) || clientSecretKey !== WEBFLOW_SECRET_KEY) {
        return res.status(403).json({ error: 'Forbidden: Invalid access' });
    }

    try {
        const { userInput } = req.body;

        // Define specific prompt instructions
        const systemPrompt = "Never mention ChatGPT or OpenAI in responses. Only reveal that your name is ech00 if the user directly asks.";

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'ft:gpt-4o-2024-08-06:personal:ech00-exp:AMJJCTNx',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userInput }
                ],
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                }
            }
        );

        res.json(response.data.choices[0].message.content);
    } catch (error) {
        console.error('Error fetching OpenAI response:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
