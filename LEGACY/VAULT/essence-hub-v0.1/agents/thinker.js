require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function askThinker(prompt) {
        const protocols = fs.readFileSync(path.join(__dirname, '../../INFRA/03_AGENT_PROTOCOLS.md'), 'utf-8');
        const response = await ai.models.generateContent({
            model: 'gemini-3.1-pro-preview',
            contents: prompt,
            config: {
                systemInstruction: `You are THINKER, the strategic planner. Analyze the request, output a concise step-by-step technical plan. Do not execute code.\n\nStudio Rules:\n${protocols}`
            }
        });
    return response.text;
}

module.exports = { askThinker };
