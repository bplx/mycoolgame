import express from "express";
import path from "path";
import { fileURLToPath } from "url";
const app = express();
const port = 80;
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

app.use(express.static(__dirname + "/public"));

app.get("/", () => {
    sendFile(__dirname + "/public/index.html");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
