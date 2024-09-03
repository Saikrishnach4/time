const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Use the CORS middleware
app.use(cors());

app.get('/getTimeStories', async (req, res) => {
    try {
        const url = 'https://time.com';
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const stories = [];
    
        $('article.latest-stories__item').slice(0, 6).each((index, element) => {
            const title = $(element).find('h3').text().trim();
            const link = url + $(element).find('a').attr('href');
            stories.push({ title, link });
        });

        res.json(stories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching stories' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
