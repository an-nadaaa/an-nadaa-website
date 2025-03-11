import Stripe from "stripe"
// this function creates a new product and returns the product
const STRIPE_SK_DEV = process.env.STRIPE_SK_DEV
const STRIPE_SK_PROD = process.env.STRIPE_SK_PROD
const STRIPE_SK =
  process.env.NODE_ENV === "production" ? STRIPE_SK_PROD : STRIPE_SK_DEV
const BASE_URL =
  process.env.CONTEXT === "production"
    ? process.env.BASE_URL
    : "http://localhost:1337"
const headers = {
  "Access-Control-Allow-Origin": BASE_URL,
  "Access-Control-Allow-Headers": "Content-Type",
}
const stripe = new Stripe(STRIPE_SK as string)

export default defineEventHandler(async (event) => {
  // CORS
  // if (event.method === "OPTIONS") {
  //   return {
  //     statusCode: 200,
  //     headers,
  //   }
  // }

  if (event.method === "GET" || event.method === "PUT") {
    throw createError({
      statusCode: 405,
      statusMessage: "Method Not Allowed",
    })
  }

  if (event.method === "POST") {
    const entity = await readBody(event)
    // return

    const DEFAULT_PRODUCT_VALUE = "PRODUCT_WILL_BE_CREATED"

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
      throw createError({
        statusCode: 500,
        statusMessage: "Internal Server Error",
        data: error,
      })
    }

    console.log("Product:", product)

    return product
    // return {
    //   statusCode: 200,
    //   headers,
    //   body: JSON.stringify(product),
    // }
  }

  if (event.method === "DELETE") {
    console.log("Delete Product")

    const entity = await readBody(event)
    const ENV = entity.environment
    const STRIPE_GENERAL_PRODUCT =
      ENV === "production"
        ? process.env.STRIPE_GENERAL_PRODUCT_ID_PROD
        : process.env.STRIPE_GENERAL_PRODUCT_ID_DEV
    const STRIPE_SK = ENV === "production" ? STRIPE_SK_PROD : STRIPE_SK_DEV
    const stripe = require("stripe")(STRIPE_SK)

    if (entity.product === STRIPE_GENERAL_PRODUCT) {
      throw createError({
        statusCode: 400,
        statusMessage: "Cannot delete the general product",
      })
    }

    if (!entity.product) {
      return {
        message: "No product ID provided so no product was deleted",
        // statusCode: 200,
        // headers,
        // body: JSON.stringify(product),
      }
    }
    let product
    try {
      product = await stripe.products.del(entity.product)
    } catch (error) {
      console.error("Error Deleting Product:", error)
      throw createError({
        statusCode: 500,
        statusMessage: "Internal Server Error",
        data: error,
      })
    }
    // console.log("Product Deleted:", product)

    return product
    // return {
    //   statusCode: 200,
    //   headers,
    //   body: JSON.stringify(product),
    // }
  }
})
