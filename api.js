import dotenv from 'dotenv'
import DomFetcher from './worker/DomFetcher.js'
import ScraperFactory from './worker/ScraperFactory.js'

dotenv.config()

import express from 'express'
import cors from 'cors'
const api = express();
const router = express.Router()
api.use(cors());
api.use(express.json());

// Routes
api.get('/recette/:scraperType', async (req, res) => {
    const scraperType = req.params.scraperType
    const link = req.query.link

    const domFetcher = new DomFetcher(link)
    const doc = await domFetcher.retrieveDom()

    const factory = new ScraperFactory()
    const receipeObj = factory.create(scraperType, doc, link)

    res.send(receipeObj)

    res.end()
})

const port = 3030

api.listen(port, console.log(`API | ${port}`))