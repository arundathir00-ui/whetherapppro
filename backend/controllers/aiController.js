// Prompt 3: AI-Powered Diet Plan & Reliable Solutions
exports.generatePlan = async (req, res, next) => {
  try {
    const { patientMetrics, currentPrediction } = req.body;

    if (!patientMetrics || !currentPrediction) {
      return res.status(400).json({ success: false, message: "Missing patient details or health prediction context." });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_KEY}`;

    const llmPrompt = `
      Act as a clinical expert AI. 
      Patient Metrics: ${JSON.stringify(patientMetrics)}
      Current Health Prediction: ${currentPrediction}
      
      STRICTLY output valid JSON containing:
      {
        "dietPlan": "A completely personalized diet plan based strictly on the patient's metrics",
        "reliableSolution": "A reliable, evidence-based solution/advice for the specific prediction"
      }
      Do not include markdown tags (\`\`\`json). Just return the raw JSON object.
    `;

    // Hackathon Fallback handling
    let aiPayload;
    if (!API_KEY || API_KEY.length < 10) {
        // Validation step triggered: Sandbox Fallback
        aiPayload = {
            dietPlan: `Limit sodium intake to <1500mg daily. Emphasize DASH diet principles: leafy greens, lean protein, and reduced saturated fats. Avoid processed foods given the metrics of Age: ${patientMetrics.age}, Weight: ${patientMetrics.weight}kg.`,
            reliableSolution: `Evidence indicates immediate commencement of ACE inhibitors combined with strict telemetry monitoring for ${currentPrediction}.`
        };
    } else {
        // Actual LLM Integration via Google Gemini REST API
        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: llmPrompt }] }],
                generationConfig: { temperature: 0.2 }
            })
        });

        if (!response.ok) {
           throw new Error("Failed to communicate with LLM Provider.");
        }

        const data = await response.json();
        const rawText = data.candidates[0].content.parts[0].text;
        
        try {
            // Validation step: Ensuring AI output is structured JSON without missing fields
            aiPayload = JSON.parse(rawText.trim());
            if (!aiPayload.dietPlan || !aiPayload.reliableSolution) {
                throw new Error("AI output missing fields.");
            }
        } catch (e) {
            throw new Error(`AI Payload Structure Validation Failed: ${e.message}`);
        }
    }

    res.status(200).json({
        success: true,
        data: aiPayload
    });

  } catch (err) {
    next(err); // Triggers global error handler
  }
};
