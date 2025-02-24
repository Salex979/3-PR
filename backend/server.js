const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const port = 3000;



// Слушаем запросы на порт 3000 для фронтенда
app.use(express.static(path.join(__dirname, 'frontend')));

app.listen(port, () => {
    console.log(`Frontend server running at http://localhost:${port}`);
});
