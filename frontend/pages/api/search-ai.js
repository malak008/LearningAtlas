import fs from "fs";
import path from "path";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


const resourcesPath = path.join(
  process.cwd(),
  "..",
  "data",
  "resources-embeddings.json"
);

let resources = [];

if (fs.existsSync(resourcesPath)) {
  resources = JSON.parse(fs.readFileSync(resourcesPath, "utf-8"));
  console.log("Resources loaded:", resources.length);
} else {
  console.error("Embeddings file not found at:", resourcesPath);
}

// cosine similarity function
function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
}

export default async function handler(req, res) {
  const query = req.query.q || "";

  if (!query) {
    return res.status(200).json([]);
  }

  if (resources.length === 0) {
    return res.status(500).json({ error: "No resources loaded. Check embeddings file path." });
  }

  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });

    const queryEmbedding = response.data[0].embedding;

    const scored = resources.map((r) => ({
      ...r,
      score: cosineSimilarity(queryEmbedding, r.embedding),
    }));

    scored.sort((a, b) => b.score - a.score);

    const top5 = scored.slice(0, 10).map(({ embedding, score, ...rest }) => ({
      ...rest,
      score: Math.round(score * 100) / 100,
    }));

    res.status(200).json(top5);
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "Failed to generate embedding." });
  }
}