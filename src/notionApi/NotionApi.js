import dotenv from 'dotenv'
import {Client} from '@notionhq/client'

class NotionApi{
    constructor(db_id){
        dotenv.config();
        // Initializing a client
        this.notion = new Client({ auth: process.env.NOTION_TOKEN });
        this.databaseId = db_id;
    }

    async getRecipe() {
        const res = await this.notion.blocks.children.list({
            block_id: 'd11eacb6-ac4e-4496-84cc-a39e9b32a1f5'
        })
    }

    async getRecipes() {
        const res = await this.notion.databases.query({
            database_id: databaseId
        })
        for (let i=0; i<res.results.length; i++){
            console.log(res['results'][i])
        }
    }

    // Append blocks to parent, new_blocks needs to be a list
    async createBlocks(parent, new_blocks){
        const res = await this.notion.blocks.children.append({
            block_id: parent,
            children: new_blocks
        })
        return res
    }

    // Add heading
    async addHeading(parent, headingText){
        const headingObj = [
            {
            'heading_2': {
                "rich_text": [
                {
                    "text": {
                    "content": headingText
                    }
                }
                ]
            }
            }
        ]
        const res = await this.createBlocks(parent, headingObj)
    }

    // Add divider
    async addDivider(parent){
        const dividerObj = [
            {
            'type': 'divider',
            'divider': {}
            }
        ]
        const res = await this.createBlocks(parent, dividerObj)
    }

    // Adds the header image from the website
    async addHeaderImage(parent, imageUrl){
        const headerImgObj = [{
            "type": "image",
            "image": {
            "type": "external",
            "external": {
                "url": imageUrl
            }
            }
        }]
        const res = await this.createBlocks(parent, headerImgObj)
    }

    // Adds the description immediately below the image
    async addDescription(parent, text){
        await this.addHeading(parent, "Description")
        await this.addDivider(parent)
        const descObj = [{
            "type": "paragraph",
            "paragraph": {
            "rich_text": [{
                "type": "text",
                "text": {
                "content": text,
                "link": null
                }
            }],
            "color": "default"
            }
        }]
        const res = await this.createBlocks(parent, descObj)
    }

    // Add details such as the prep time, cook time, servings, etc
    async addDetails(parent, detailObj){
        var detailsMap = {
            'Prep Time': '10 min',
            'Cook Time': '20 min',
            'Total Time': '20 min',
            'Servings': '4',
            'Yield': '4 servings'
        }
        // Column List -> Column Block -> Paragraph
        // Divider
        // Column List -> Column Block -> Paragraph
        let detailsObj = [
            {
            "type": "column_list",
            "column_list": {
                'children': [
                {
                    "type": "column",
                    "column": {
                    'children': []
                    }
                },
                {
                    "type": "column",
                    "column": {
                    'children': []
                    }
                },
                {
                    "type": "column",
                    "column": {
                    'children': []
                    }
                }
                ]
            }
            }
        ]

        // j is the column iterator
        let j=0;
        let keys = Object.keys(detailsMap)
        for (let i=0; i<keys.length; i++){
            if (j > 2){
            j = 0
            }
            detailsObj[0]['column_list']['children'][j]['column']['children'].push(
                {
                "heading_3": {
                    "rich_text": [{
                    "text": {
                        "content": keys[i],
                    }
                    }],
                }
                }
            )
            detailsObj[0]['column_list']['children'][j]['column']['children'].push(
            {
                "type": "paragraph",
                "paragraph": {
                "rich_text": [{
                    "type": "text",
                    "text": {
                    "content": detailsMap[keys[i]],
                    "link": null
                    }
                }],
                "color": "default"
                }
            }
            )
            j+=1;
        }
        const res = await this.createBlocks(parent, detailsObj)
    }

    // Add an itemized list of ingredients
    async addIngredients(parent, ingredients){
        await this.addHeading(parent, 'Ingredients')
        let ingredientsObj = []
        for (let i=0; i<ingredients.length; i++){
            ingredientsObj.push(
            {
                "type": "bulleted_list_item",
                "bulleted_list_item": {
                "rich_text": [{
                    "type": "text",
                    "text": {
                    "content": ingredients[i],
                    "link": null
                    }
                }],
                "color": "default"
                }
            }
            )
        }
        const res = await this.createBlocks(parent, ingredientsObj)
    }

    // Add numbered list of cooking directions
    async addDirections(parent, directions){
        await this.addHeading(parent, 'Directions')
        const directionsObj = []
        for (let i=0; i<directions.length; i++){
            directionsObj.push(
            {
                "type": "numbered_list_item",
                "numbered_list_item": {
                "rich_text": [{
                    "type": "text",
                    "text": {
                    "content": directions[i],
                    "link": null
                    }
                }],
                "color": "default"
                }
            }
            )
        }
        const res = await this.createBlocks(parent, directionsObj)
        await this.addDivider(parent)
    }

    // Add table with nutrition facts
    async addNutrition(parent, nutritionArr){
        await this.addHeading(parent, "Nutrition Facts")

        const nutritionObj = [{
            "type": "table",
            "table": {
            "table_width": 4,
            "has_column_header": true,
            "has_row_header": false,
            "children": [
                {
                "type": "table_row",
                "table_row": {
                    "cells": [
                    [
                        {
                        "type": "text",
                        "text": {
                            "content": "Calories"
                        },
                        "plain_text": "Calories"
                        },
                    ],
                    [
                        {
                        "type": "text",
                        "text": {
                        "content": "Fat"
                        },
                        "plain_text": "Fat"
                        }
                    ],
                    [
                        {
                        "type": "text",
                        "text": {
                            "content": "Carbs"
                        },
                        "plain_text": "Carbs"
                        }
                    ],
                    [
                        {
                        "type": "text",
                        "text": {
                            "content": "Protein"
                        },
                        "plain_text": "Protein"
                        }
                    ]
                    ]
                }
                },
                {
                "type": "table_row",
                "table_row": {
                    "cells": [
                    [
                        {
                        "type": "text",
                        "text": {
                            "content": ""
                        },
                        "plain_text": ""
                        },
                    ],
                    [
                        {
                        "type": "text",
                        "text": {
                        "content": ""
                        },
                        "plain_text": ""
                        }
                    ],
                    [
                        {
                        "type": "text",
                        "text": {
                            "content": ""
                        },
                        "plain_text": ""
                        }
                    ],
                    [
                        {
                        "type": "text",
                        "text": {
                            "content": ""
                        },
                        "plain_text": ""
                        }
                    ]
                    ]
                }
                }
            ]
            }
        }]

        for (let i=0; i<nutritionArr.length; i++){
            nutritionObj[0]["table"]["children"][1]["table_row"]["cells"][i][0]["text"]["content"] = nutritionArr[i]
            nutritionObj[0]["table"]["children"][1]["table_row"]["cells"][i][0]["plain_text"] = nutritionArr[i]
        }
        const res = await this.createBlocks(parent, nutritionObj)
    }

    // Add url embed
    async addBookmark(parent, url){
        const bookmarkObj = [{
        "type": "bookmark",
        "bookmark": {
            "url": url
        }
        }]
        const res = await this.createBlocks(parent, bookmarkObj)
    }

    // Create a recipe
    async createRecipe(recipeObj) {
        const title = recipeObj['title']
        const recipeUrl = recipeObj['url']
        const imageUrl = recipeObj['image']['url']
        const descText = recipeObj['description']
        const details = recipeObj['details']
        const ingredients = recipeObj['ingredients']
        const nutrition = recipeObj['nutrition']
        const directions = recipeObj['directions']

        const createRes = await this.notion.pages.create({
            parent: {
                database_id: this.databaseId
            },
            properties: {
                Name: {
                title: [{ type: "text", text: { content: title } }]
                }
            }
        })
        const parent = createRes['id']
        const imageRes = await this.addHeaderImage(parent, imageUrl)
        const descRes = await this.addDescription(parent, descText)
        const dividerRes2 = await this.addDivider(parent)
        const addDetailsRes = await this.addDetails(parent, details)
        const dividerRes3 = await this.addDivider(parent)
        const ingredientsRes = await this.addIngredients(parent, ingredients)
        const directionsRes = await this.addDirections(parent, directions)
        const nutritionRes = await this.addNutrition(parent, nutrition)
        const bookmarkRes = await this.addBookmark(parent, recipeUrl)
    }
}

export default NotionConnector
