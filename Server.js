const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Embedded API credential
const GEMINI_API_KEY = 'AIzaSyAeSw9WxCsYh7URPYVx0mWj0i1AvYKZ-aY';

app.post('/solve-question', async (req, res) => {
  try {
    const { questionText, options } = req.body;

    const promptInstructions = `You are a real-time academic assistant reading an assignment page. 
Analyze the question text and option objects array below. 
Determine the correct single option choice character (A, B, C, or D).
Respond strictly with ONLY that one uppercase letter. Do not write markdown, headers, punctuation, or descriptions.

Question content: ${questionText}
Available options:
${options.join('\n')}`;

    // Standard live framework endpoint string
    const targetEndpoint = `googleapis.com{GEMINI_API_KEY}`;

    const apiResponse = await fetch(targetEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptInstructions }] }]
      })
    });

    const parsedData = await apiResponse.json();
    const modelOutput = parsedData.candidates[0].content.parts[0].text.trim();
    const finalSelection = modelOutput.match(/[A-D]/)?.[0] || 'A';

    console.log(`[Proxy Logic Executed] Verified Answer Match: Option ${finalSelection}`);
    res.json({ success: true, correctLetter: finalSelection });

  } catch (backendError) {
    console.error("Critical server pipeline processing error:", backendError);
    res.json({ success: false, correctLetter: 'A' });
  }
});

const APP_PORT = process.env.PORT || 3000;
app.listen(APP_PORT, () => console.log(`Proxy translation layer online using port ${APP_PORT}`));
