const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const path = require('path');
const port = 8080;

app.use(cors());

app.use(express.json());



const productsFilePath = path.join(__dirname, 'products.json');

// Получение списка товаров
app.get('/products', (req, res) => {
    fs.readFile(productsFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка при чтении файла');
        }
        res.json(JSON.parse(data));
    });
});

// Добавление нового товара
app.post('/products', (req, res) => {
    const newProduct = req.body;
    fs.readFile(productsFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка при чтении файла');
        }
        const products = JSON.parse(data);
        products.push(newProduct);
        fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Ошибка при сохранении данных');
            }
            res.status(201).send('Товар добавлен');
        });
    });
});

// Редактирование товара по ID
app.put('/products/:id', (req, res) => {
    const productId = req.params.id;
    const updatedProduct = req.body;
    fs.readFile(productsFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка при чтении файла');
        }
        const products = JSON.parse(data);
        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex === -1) {
            return res.status(404).send('Товар не найден');
        }
        products[productIndex] = { ...products[productIndex], ...updatedProduct };
        fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Ошибка при сохранении данных');
            }
            res.send('Товар обновлен');
        });
    });
});

// Удаление товара по ID
app.delete('/products/:id', (req, res) => {
    const productId = req.params.id;
    fs.readFile(productsFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка при чтении файла');
        }
        const products = JSON.parse(data);
        const updatedProducts = products.filter(p => p.id !== productId);
        if (updatedProducts.length === products.length) {
            return res.status(404).send('Товар не найден');
        }
        fs.writeFile(productsFilePath, JSON.stringify(updatedProducts, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Ошибка при сохранении данных');
            }
            res.send('Товар удален');
        });
    });
});

app.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`);
});
