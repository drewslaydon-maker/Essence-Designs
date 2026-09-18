require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const { askThinker } = require('./agents/thinker');
const { executeDoer } = require('./agents/doer');
const { runReaperSweep } = require('./scripts/purgatory');

const app = express();
const PORT = 5555;
const LOG_FILE = path.join(__dirname, 'agent.log');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'ui')));

// Ensure log file exists
if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(LOG_FILE, '');
}

app.post('/api/thinker', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: 'Prompt is required' });
        const result = await askThinker(prompt);
        res.json({ result });
    } catch (error) {
        console.error('Thinker Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/doer', async (req, res) => {
    try {
        const { objective } = req.body;
        if (!objective) return res.status(400).json({ error: 'Objective is required' });
        // Send immediate response as Doer runs in background
        res.json({ message: 'Doer execution started' });
        
        // Run asynchronously
        executeDoer(objective).catch(err => {
            console.error('Doer Execution Error:', err);
            fs.appendFileSync(LOG_FILE, `[ERROR] Doer: ${err.message}\n`);
        });
    } catch (error) {
        console.error('Doer Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const sendLog = () => {
        if (fs.existsSync(LOG_FILE)) {
            const logs = fs.readFileSync(LOG_FILE, 'utf8');
            res.write(`data: ${JSON.stringify(logs)}\n\n`);
        }
    };

    // Send initial log contents
    sendLog();

    // Watch for file changes using reliable polling
    fs.watchFile(LOG_FILE, { interval: 500 }, (curr, prev) => {
        sendLog();
    });

    req.on('close', () => {
        fs.unwatchFile(LOG_FILE);
    });
});

app.listen(PORT, async () => {
    console.log(`ESSENCE HUB running on http://localhost:${PORT}`);
    console.log(`Triggering Reaper Sweep on init...`);
    await runReaperSweep();
});
