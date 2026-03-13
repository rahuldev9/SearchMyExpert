const OpenAI = require("openai");
const User = require("../models/User");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.matchExperts = async (req, res) => {
  try {
    const { prompt } = req.body;

    // Get only experts
    const experts = await User.find({ role: "expert", isActive: true })
      .select(
        "_id name skills experience hourlyRate location bio rating totalProjects",
      )
      .lean();

    const aiPrompt = `
You are an expert hiring assistant helping businesses find the best AI automation experts.

A business owner will describe a project they want to build.

Your task:
1. Understand the project requirements.
2. Compare them with the experts.
3. Select the TOP 10 experts.

Consider:
- skills
- experience
- bio
- rating
- projects completed

Return ONLY valid JSON.

Response format:

[
 {
   "expert": {
      "_id": "string",
      "name": "string",
      "skills": ["string"],
      "experience": number,
      "hourlyRate": number,
      "location": "string",
      "bio": "string",
      "rating": number,
      "totalProjects": number
   },
   "reason": "why this expert matches"
 }
]

User Project Request:
${prompt}

Experts:
${JSON.stringify(experts)}
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: aiPrompt,
    });

    const result = JSON.parse(response.output_text);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI expert matching failed" });
  }
};
