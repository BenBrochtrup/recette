import AllRecipesScraper from './AllRecipes/AllRecipesScraper.js'

class ScraperFactory {
    create(scraperType, doc, url) {
        switch(scraperType) {
            case 'AllRecipes' :
                return new AllRecipesScraper(doc, url);
            default:
                return new Error('Scraper type not supported');
        }
    }
}

export default ScraperFactory
