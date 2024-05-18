import express from "express";
import cors from "cors";

// Importing data file for each language
import english_quotes from "./Quotes/english_quotes.js"
import hindi_quotes from "./Quotes/hindi_quotes.js"
import japanese_quotes from "./Quotes/japanese_quotes.js"


const app = express();

app.use(cors({
    origin: "*",
    methods: ['GET']
}));

//Function to read quotes from file
const getQuotes = async (language) => {

    let quotes;

    switch (language) {
        case 'english': quotes = english_quotes;
            break;
        case 'hindi': quotes = hindi_quotes;
            break;
        case 'japanese': quotes = japanese_quotes;
            break;
    }

    return quotes;
};


//Route to GET all quotes in a specified language
app.get("/quote/:language", async (req, res) => {
    const language = req.params.language.toLowerCase();
    try {
        const quotes = await getQuotes(language);
        res.json(quotes);
    } catch (error) {
        res.status(404).json({ error: 'Quote not found for specified language' });
    }
});


//Function to filter quotes by genre
const filterQuotes = async (language, genre) => {

    try {
        const quotes = await getQuotes(language);
        if (genre) {
            return quotes.filter(quote => quote.genre.toLowerCase() === genre.toLowerCase());
        } else {
            return quotes;
        }
    } catch (error) {
        res.status(404).json({ error: error.message });
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
        res.status(404).json({ error: error.message });
    }
});


//Function to GET random quote in specified genre
const getRandomQuoteByGenre = (quotes, genre) => {
    const quotesByGenre = quotes.filter(quote => quote.genre.toLowerCase() === genre.toLowerCase());
    if (quotesByGenre.length === 0) {
        res.status(404).json({ error: error.message });
    }
    return quotesByGenre[Math.floor(Math.random() * quotesByGenre.length)];
};

//Route to GET random quote in specified genre
app.get('/quote/random/:language/:genre', async (req, res) => {
    const language = req.params.language.toLowerCase();
    const genre = req.params.genre.toLowerCase();
    console.log(language)
    try {
        const quotes = await getQuotes(language);
        const randomQuote = getRandomQuoteByGenre(quotes, genre);
        res.json(randomQuote);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

app.get('/quote/random/:language', async (req, res) => {
    const {language} = req.params;
    console.log(language);
    try {
        const quotes = await getQuotes(language);

        // const randomIndex = Math.floor(Math.random() * quotes.length);
        // const randomQuote = quotes[randomIndex];
        // res.json(randomQuote);
        res.json(quotes[Math.floor(Math.random() * quotes.length)])
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
