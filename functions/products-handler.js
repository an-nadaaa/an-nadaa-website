import dotenv from "dotenv"

// this function creates a new product and returns the product

dotenv.config()
const STRIPE_SK_DEV = process.env.STRIPE_SK_DEV
const STRIPE_SK_PROD = process.env.STRIPE_SK_PROD
const BASE_URL =
  process.env.CONTEXT === "production"
    ? process.env.BASE_URL
    : "http://localhost:1337"
const headers = {
  "Access-Control-Allow-Origin": BASE_URL,
  "Access-Control-Allow-Headers": "Content-Type",
}

export const handler = async function (event, context) {
  // CORS
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
    }
  }

  if (event.httpMethod === "GET" || event.httpMethod === "PUT") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        message: "Method Not Allowed",
      }),
    }
  }

  if (event.httpMethod === "POST") {
    const entity = JSON.parse(event.body)

    console.log("Entity:", entity)

    // return

    const ENV = entity.environment
    const DEFAULT_PRODUCT_VALUE = "PRODUCT_WILL_BE_CREATED"
    const STRIPE_SK = ENV === "production" ? STRIPE_SK_PROD : STRIPE_SK_DEV
    const stripe = require("stripe")(STRIPE_SK)

    // if (entity.product !== DEFAULT_PRODUCT_VALUE && entity.product) {
    //   // if product is already created
    //   console.log(entity.product)

    //   return {
    //     statusCode: 400,
    //     headers,
    //     body: JSON.stringify({
    //       message: "Product field already populated",
    //     }),
    //   }
    // }
    let product

    try {
      if (!entity.product || entity.product === DEFAULT_PRODUCT_VALUE) {
        product = await stripe.products.create({
          name: entity.title,
          // description: entity.description,
          images: [entity.cover],
        })
      } else {
        try {
          product = await stripe.products.update(entity.product, {
            name: entity.title,
            // description: entity.description,
            images: [entity.cover],
          })
        } catch (error) {
          if (JSON.stringify(error).includes("No such product")) {
            product = await stripe.products.create({
              name: entity.title,
              // description: entity.description,
              images: [entity.cover],
            })
          } else {
            throw error
          }
        }
      }
    } catch (error) {
      console.error("Error Creating product:", error)

      return {
        statusCode: 500,
        headers,
        body: JSON.stringify(error),
      }
    }

    console.log("Product:", product)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(product),
    }
  }

  if (event.httpMethod === "DELETE") {
    console.log("Delete Product")

    const entity = JSON.parse(event.body)
    const ENV = entity.environment
    const STRIPE_GENERAL_PRODUCT =
      ENV === "production"
        ? Netlify.env.STRIPE_GENERAL_PRODUCT_ID_PROD
        : Netlify.env.STRIPE_GENERAL_PRODUCT_ID_DEV
    const STRIPE_SK = ENV === "production" ? STRIPE_SK_PROD : STRIPE_SK_DEV
    const stripe = require("stripe")(STRIPE_SK)

    if (entity.product === STRIPE_GENERAL_PRODUCT) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          message: "Cannot delete the general product",
        }),
      }
    }

    if (!entity.product) {
      return {
        statusCode: 200,
        headers,
        // body: JSON.stringify(product),
      }
    }
    let product
    try {
      product = await stripe.products.del(entity.product)
    } catch (error) {
      console.error("Error Deleting Product:", error)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify(error),
      }
    }
    // console.log("Product Deleted:", product)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(product),
    }
  }
}
