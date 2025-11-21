import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "books.json");

function loadBooks() {
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath);
    return JSON.parse(raw);
}

function saveBooks(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export default function handler(req, res) {
    if (req.method === "GET") {
        const books = loadBooks();
        const search = req.query.search;
        const id = req.query.id;

        if (search) {
            const q = search.toLowerCase();
            const filtered = books.filter(b =>
                b.title.toLowerCase().includes(q)
            );
            return res.status(200).json(filtered);
        }

        if (id) {
            return res.status(200).json(books.find(b => b.id === id));
        }

        return res.status(200).json(books);
    }

    if (req.method === "POST") {
        const books = loadBooks();
        const { title, author, store } = req.body;

        const newBook = {
            id: Date.now().toString(),
            title,
            author,
            store
        };

        books.push(newBook);
        saveBooks(books);
        return res.status(200).json({ ok: true });
    }

    if (req.method === "DELETE") {
        const id = req.query.id;
        let books = loadBooks();
        books = books.filter(b => b.id !== id);
        saveBooks(books);
        return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: "Metodo non permesso" });
}
