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
const WEBFLOW_SECRET_KEY = process.env.WEBFLOW_SECRET_KEY; // New secret key

app.post('/api/openai', async (req, res) => {
    const clientSecretKey = req.headers['x-webflow-secret-key'];
    if (clientSecretKey !== WEBFLOW_SECRET_KEY) {
        return res.status(403).json({ error: 'Forbidden: Invalid access key' });
    }

    try {
        const { userInput } = req.body;

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'ft:gpt-4o-2024-08-06:personal:ech00-exp:AMJJCTNx',
                messages: [{ role: 'user', content: userInput }],
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
