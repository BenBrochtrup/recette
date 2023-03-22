class AllRecipes {
    constructor(doc, url) {
        // this.doc = doc;
        this.url = url;
        this.title = this.getTitle(doc);
        this.image = {};
        this.image['url'] = this.getImage(doc);
        this.description = this.getDescription(doc);
        this.details = this.getDetails(doc);
        this.ingredients = this.getIngredients(doc);
        this.nutrition = this.getNutrition(doc);
        this.directions = this.getDirections(doc);
    }

    // Get recipe title from AllRecipe
    getTitle(doc) {
        const recipeTitle = doc.getElementById("article-heading_1-0").textContent.trim();
        return recipeTitle;
    }

    // Get image URL from AllRecipe site
    getImage(doc) {
        const imageUrl = doc.querySelector('#mntl-sc-block-image_1-0-1').getAttribute('data-src');
        return imageUrl;
    }

    // Gets description from AllRecipe site
    getDescription(doc) {
        const descriptionText = doc.querySelector('#article-subheading_1-0').textContent.trim();
        return descriptionText;
    }

    // Get quick details about recipe, like prep time, cook time, servings, etc
    getDetails(doc) {
        const recipeDetailsCollection = doc.getElementsByClassName("mntl-recipe-details__item");
        let recipeDetails = {}
        for (let i = 0; i < recipeDetailsCollection.length; i++) {
            let key = recipeDetailsCollection[i].getElementsByClassName("mntl-recipe-details__label")[0].textContent
            let value = recipeDetailsCollection[i].getElementsByClassName("mntl-recipe-details__value")[0].textContent
            key = key.trim()
            value = value.trim()
            recipeDetails[key] = value
        }
        return recipeDetails;
    }

    // Get list of recipe ingredients
    getIngredients(doc) {
        const ingredientsCollection = doc.getElementById('mntl-structured-ingredients_1-0')
        const ingredients = ingredientsCollection.getElementsByClassName('mntl-structured-ingredients__list-item ')
        let ingredientList = []
        for (let i = 0; i < ingredients.length; i++) {
            const lineItems = ingredients[i].querySelectorAll('p > span')
            let ingredient = ""
            for (let j = 0; j < lineItems.length; j++) {
                const lineItemUnit = lineItems[j].textContent
                if (lineItemUnit.length > 0) {
                    ingredient += lineItemUnit.trim() + " "
                }
            }
            ingredientList.push(ingredient.trim())
        }
        return ingredientList;
    }

    // Get nutrition list from AllRecipe site
    getNutrition(doc) {
        let nutritionList = []
        const nutritionCollection = doc.querySelectorAll('#mntl-nutrition-facts-summary_1-0 > table > tbody > tr');
        for (let i = 0; i < nutritionCollection.length; i++) {
            let nutritionCell = nutritionCollection[i].querySelector('td.mntl-nutrition-facts-summary__table-cell.type--dog-bold');
            nutritionList.push(nutritionCell.textContent.trim())
        }

        return nutritionList;
    }

    // Get recipe directions
    getDirections(doc) {
        const directionsCollection = doc.getElementById('recipe__steps_1-0')
        const directions = directionsCollection.getElementsByClassName('comp mntl-sc-block-group--LI mntl-sc-block mntl-sc-block-startgroup')
        let directionList = []
        for (let i = 0; i < directions.length; i++) {
            const lineItems = directions[i].querySelectorAll('p')
            let direction = ""
            for (let j = 0; j < lineItems.length; j++) {
                const lineItemUnit = lineItems[j].textContent
                if (lineItemUnit.length > 0) {
                    direction += lineItemUnit.trim() + " "
                }
            }
            directionList.push(direction.trim())
        }
        return directionList;
    }
}

export default AllRecipes
