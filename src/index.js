const express = require("express");
const fs = require("fs");
const path = require("path");
const readFilesRecursively = require("./getRoutes");
const app = express();
const port = 3000;

readFilesRecursively("./src/routes", "src/routes").then((files) => {
  files?.forEach((file) => {
    const method = String(file.method).toLowerCase();
    console.log("Добавляем маршрут:", file.method, file.url || "/");
    app[method](file.url, (req, res) => {
      const filePath = path.join(__dirname, "routes", file.path);
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          console.error("Ошибка чтения файла:", err);
          return res.status(500).send("Ошибка сервера");
        }

        try {
          const jsonData = JSON.parse(data);
          const delay = Math.floor(Math.random() * 2000) + 100;

          setTimeout(() => {
            res.json(jsonData);
          }, delay);
        } catch (parseErr) {
          console.error("Ошибка парсинга JSON:", parseErr);
          res.status(500).send("Ошибка сервера");
        }
      });
    });
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});
