require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { GoogleGenAI } = require('@google/genai');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');

const execPromise = util.promisify(exec);
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const LOG_FILE = path.join(__dirname, '..', 'agent.log');

function logToFile(message) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(LOG_FILE, `[${timestamp}] ${message}\n`);
}

async function executeDoer(objective) {
    logToFile(`[DOER] Objective: ${objective}`);
    let context = `Objective: ${objective}\n`;
    const protocols = fs.readFileSync(path.join(__dirname, '../../INFRA/03_AGENT_PROTOCOLS.md'), 'utf-8');
    
    for (let i = 0; i < 5; i++) {
        logToFile(`[DOER] Iteration ${i + 1}`);
                const response = await ai.models.generateContent({
                    model: 'gemini-3.1-pro-preview',
                    contents: context,
                    config: {
                        systemInstruction: `You are DOER, an execution agent running on Windows/Node. Provide ONLY raw terminal commands to achieve the objective. No markdown formatting. If done, output [STOP].\n\nStudio Rules:\n${protocols}`
                    }
                });
        
        let command = response.text.trim();
        logToFile(`[DOER] Command: ${command}`);
        
        if (command === '[STOP]' || command.includes('[STOP]')) {
            logToFile(`[DOER] Finished.`);
            break;
        }

        try {
            const { stdout, stderr } = await execPromise(command, { cwd: path.join(__dirname, '..') });
            const output = stdout + (stderr ? `\nSTDERR: ${stderr}` : '');
            logToFile(`[DOER] Output:\n${output}`);
            context += `\nCommand: ${command}\nOutput:\n${output}\n`;
        } catch (error) {
            logToFile(`[DOER] Error:\n${error.message}`);
            context += `\nCommand: ${command}\nError:\n${error.message}\n`;
        }
    }
    logToFile(`[DOER] Execution cycle ended.`);
}

module.exports = { executeDoer };
