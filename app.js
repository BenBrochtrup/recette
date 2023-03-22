import dotenv from 'dotenv'
import DomFetcher from './worker/DomFetcher.js'
import ScraperFactory from './worker/ScraperFactory.js'
// import AllRecipes from './src/scrapers/AllRecipes/AllRecipesScraper.js'
// import NotionHelper from './src/notionApi/NotionHelper.js'

dotenv.config()

// const recipeObject = new AllRecipes(doc, process.env.APPLE_PIE_URL)
// const notion = new NotionHelper(process.env.DB_ID, process.env.PAGE_ID)
// await notion.createRecipe(recipeObject)

import express from 'express'
const app = express();
const router = express.Router()
app.use(express.json());

// Routes
app.get('/recette/:scraperType', async (req, res) => {
    const scraperType = req.params.scraperType
    const link = req.body.link

    const domFetcher = new DomFetcher(link)
    const doc = await domFetcher.retrieveDom()

    const factory = new ScraperFactory()
    const scraper = factory.create(scraperType, doc, link)

    console.log(scraper)

    res.end()
})

const port = 3000

app.listen(port, console.log(`Listening on port ${port}`))