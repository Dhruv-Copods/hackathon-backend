import express from 'express';
import { JSONFilePreset } from 'lowdb/node';
import bodyParser from 'body-parser';
import cors from 'cors';
import { textToPoints } from './AI/text_to_points.js';
import { multiDayData } from './AI/multi_day_data.js';

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize Lowdb with JSONFilePreset
const defaultData = { posts: [] };
const db = await JSONFilePreset('db.json', defaultData);

app.post('/text-to-points', async (req, res) => {
    const { userInput } = req.body;

    if (!userInput) {
        return res.status(400).json({ error: 'Input is required' });
    }

    try {
        const aiResponse = await textToPoints(userInput);
        res.json({ response: aiResponse });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/multi-day-data', async (req, res) => {
    const { userInput } = req.body;

    if (!userInput) {
        return res.status(400).json({ error: 'Input is required' });
    }

    try {
        const aiResponse = await multiDayData(userInput);
        res.json({ response: aiResponse });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});