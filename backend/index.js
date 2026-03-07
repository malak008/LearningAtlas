import express from "express";
import fs from "fs";
import csv from "csv-parser";
import cors from "cors";

const app = express();
const port = 3000;
app.use(cors());

let resources = [];
fs.createReadStream("../data/resources.csv")
  .pipe(csv())
  .on("data", (row) => {
    resources.push(row);
  })
  .on("end", () => {
    console.log("Resources Loaded:", resources.length);
  });

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.get("/search", (req, res) => {
  const q = req.query.q ? req.query.q.toLowerCase() : "";
  if (!q) return res.json([]);

  const results = resources.filter((r) => {
    const title = r.title ? r.title.toLowerCase() : "";
    const tags = r.tags ? r.tags.toLowerCase() : "";

    const titleMatch = title.includes(q);
    const tagsMatch = tags.includes(q);

    return titleMatch || tagsMatch;
  });

  res.json(results.slice(0, 10));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});