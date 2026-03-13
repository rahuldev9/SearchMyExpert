import OpenAI from "openai";
import { NextResponse } from "next/server";
import { experts } from "../data/experts"; // your dataset

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const systemPrompt = `
You are an expert hiring assistant helping businesses find the best AI automation experts.

A business owner will describe a project they want to build.

Your task:
1. Understand the project requirements and features.
2. Compare the requirements with the provided experts.
3. Select the TOP 10 experts who are most capable of building the project.

When evaluating experts consider:
- Skills
- Experience
- Bio
- Rating
- Tools mentioned in the request

Return ONLY valid JSON.

The response must contain the FULL expert object exactly as provided plus a "reason" field explaining why the expert is a good match.

Response format:

[
  {
    "expert": {
      "id": number,
      "name": "string",
      "skills": ["string"],
      "rating": number,
      "experience": "string",
      "location": "string",
      "price": "string",
      "bio": "string"
    },
    "reason": "Short explanation why this expert matches the project"
  }
]
`;

    const userPrompt = `
User Project Request:
${prompt}

Experts:
${JSON.stringify(experts)}
`;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const output = response.output_text;

    return NextResponse.json({
      result: JSON.parse(output),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to match experts" },
      { status: 500 },
    );
  }
}
