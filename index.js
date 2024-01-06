const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

app.get('/loker', async (req, res) => {
  try {
    // Ganti URL dengan URL loker yang sesuai
    const url = 'https://bkk.smkdp1jkt.sch.id/category/loker/';
    
    // Lakukan permintaan HTTP menggunakan axios
    const response = await axios.get(url);

    // Gunakan cheerio untuk melakukan parsing HTML
    const $ = cheerio.load(response.data);

    // Lakukan scraping data sesuai dengan struktur HTML situs web
    const jobList = [];
    $('article.post').each((index, element) => {
      const title = $(element).find('.entry-title a').text().trim();
      const company = $(element).find('.entry-content p').text().trim();
      const date = $(element).find('.custom-entry-date .entry-month').text().trim() + ' ' + $(element).find('.custom-entry-date .entry-day').text().trim();
      const detailsUrl = $(element).find('.entry-title a').attr('href');

      jobList.push({
        title,
        company,
        date,
        detailsUrl,
      });
    });

    // Kirim hasil scraping sebagai respons JSON
    res.json(jobList);
  } catch (error) {
    console.error('Error scraping data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
