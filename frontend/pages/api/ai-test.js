import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
    try {
        const response = await client.embeddings.create({
            model: "text-embedding-3-small",
            input: "learn python programming",

        });
        res.status(200).json(response.data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}