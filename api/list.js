import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), "books.json");

  try {
    const data = fs.readFileSync(filePath, "utf8");
    const json = JSON.parse(data);
    res.status(200).json(json);
  } catch (err) {
    res.status(500).json({ error: "Errore lettura file" });
  }
}
