import DomFetcher from './src/scrapers/DomFetcher.js'
import AllRecipes from './src/scrapers/AllRecipes/AllRecipesScraper.js'
import NotionHelper from './src/notionApi/NotionHelper.js'
import dotenv from 'dotenv'

dotenv.config()

const domFetcher = new DomFetcher(process.env.APPLE_PIE_URL)
const doc = await domFetcher.retrieveDom()
const recipeObject = new AllRecipes(doc, process.env.APPLE_PIE_URL)
const notion = new NotionHelper(process.env.DB_ID, process.env.PAGE_ID)
await notion.createRecipe(recipeObject)
