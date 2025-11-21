import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non permesso" });
  }

  const filePath = path.join(process.cwd(), "books.json");

  try {
    const { title, author, library } = JSON.parse(req.body);

    if (!title || !author || !library) {
      return res.status(400).json({ error: "Dati mancanti" });
    }

    const data = fs.readFileSync(filePath, "utf8");
    const books = JSON.parse(data);

    books.push({
      title,
      author,
      library,
      arrived: false,
      timestamp: Date.now()
    });

    fs.writeFileSync(filePath, JSON.stringify(books));

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Errore scrittura file" });
  }
}
