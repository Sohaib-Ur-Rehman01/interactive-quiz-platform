import OpenAI from "openai";

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // keep in .env
  dangerouslyAllowBrowser: true,
});

export async function fetchQuestions(topic) {
  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini", // or gpt-4.1-mini
    messages: [
      {
        role: "system",
        content:
          "You are a quiz generator. Always return 5 multiple-choice questions in JSON format with id, question, options[], and correctAnswer.",
      },
      {
        role: "user",
        content:
          `Generate 5 random and trending quiz questions about ${topic}. 
          Ensure that the quiz is different each time, even if the same topic is provided.
Exclude literature, books, authors, and poetry. 
Focus only on technology, movies, sports, science, world news, or pop culture. 
Each question must be unique and not repetitive. Provide multiple-choice options with the correct answer.`,
      },
    ],
    temperature: 0.8,
  });

  const raw = response.choices[0].message.content;
  const cleaned = raw.replace(/```json|```/g, "").trim();


  try {
    return JSON.parse(cleaned);
  } catch (error) {
    if (error.status === 429) {
      console.warn("Rate limited, retrying in 20s...");
      await new Promise(r => setTimeout(r, 20000));
      return fetchQuestions(topic);
    }
    throw error;

  }
}
