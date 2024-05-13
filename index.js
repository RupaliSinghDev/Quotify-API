import express from "express";
import { promises as fsPromises } from 'fs';
import path from 'path'

const app = express();
const fs = fsPromises;
const quotesDir = '/Quotes-API/Quotes';

//Function to read quotes from file
const getQuotes = async (language) => {
    
    const filePath = path.join(quotesDir, `${language}_quotes.json`);
    try {
        const data = await fs.readFile(filePath);
        return JSON.parse(data);
    } catch {
        res.status(404).json({error: error.message});
    }
};


//Route to GET all quotes in a specified language
app.get("/quote/:language", async (req, res) => {
    const language = req.params.language.toLowerCase();
    try{
        const quotes = await getQuotes(language);
        res.json(quotes);
    } catch (error) {
        res.status(404).json({error: 'Quote not found for specified language'});
    }
});


//Function to filter quotes by genre
const filterQuotes = async (language, genre) => {
    
    try{
        const quotes = await getQuotes(language);
        if (genre){
            return quotes.filter(quote => quote.genre.toLowerCase() === genre.toLowerCase());
        } else {
            return quotes;
        }
    } catch (error){
        res.status(404).json({error: error.message});
    }
};


//Route to GET all quotes in a specified language and genre
app.get('/quote/:language/:genre', async (req, res) => {
    const language = req.params.language.toLowerCase();
    const genre = req.params.genre.toLowerCase();
    try {
        const quotes = await filterQuotes(language, genre);
        res.json(quotes);
    } catch (error) {
        res.status(404).json({error: error.message});
    }
});


//Function to GET random quote in specified genre
const getRandomQuoteByGenre = (quotes, genre) => {
    const quotesByGenre =  quotes.filter(quote => quote.genre.toLowerCase() === genre.toLowerCase());
    if (quotesByGenre.length === 0) {
        res.status(404).json({error: error.message});
    }
    return quotesByGenre[Math.floor(Math.random() * quotesByGenre.length)];
};

//Route to GET random quote in specified genre
app.get('/quote/:language/:genre/random', async (req, res) => {
    const language = req.params.language.toLowerCase();
    const genre = req.params.genre.toLowerCase();
    try {
        const quotes = await getQuotes(language);
        const randomQuote = getRandomQuoteByGenre(quotes, genre);
        res.json(randomQuote);
    } catch (error) {
        res.status(404).json({error: error.message}); 
    }
});

app.get('/quote/:language/random', async (req, res) => {
    const language = req.params.language.toLowerCase();
    try {
        const quotes = await getQuotes(language);

        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        res.json(randomQuote);
    } catch (error) {
        res.status(404).json({error: error.message});
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
