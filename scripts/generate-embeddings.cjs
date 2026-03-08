require("dotenv").config({ path: ".env.local"});

const fs = require("fs");
const csv = require("csv-parser");
const OpenAI = require("openai");
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const resources = [];


fs.createReadStream("data/resources.csv")
  .pipe(csv())
  .on("data", (row) => resources.push(row))
  .on("end", async () => {
    console.log("CSV loaded:", resources.length);

    const results = [];

    for (let r of resources) {
      const text = `${r.title} ${r.tags}`;
      const embeddingResponse = await client.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
      });

      r.embedding = embeddingResponse.data[0].embedding;
      results.push(r);
    }

    fs.writeFileSync(
      "data/resources-embeddings.json",
      JSON.stringify(results, null, 2)
    );


    console.log("Embeddings saved!");
  });