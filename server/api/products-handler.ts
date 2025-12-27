import Stripe from "stripe"

// this function creates a new product and returns the product
const STRIPE_SK_DEV = process.env.STRIPE_SK_DEV
const STRIPE_SK_PROD = process.env.STRIPE_SK_PROD
const STRIPE_SK =
  process.env.NODE_ENV === "production" ? STRIPE_SK_PROD : STRIPE_SK_DEV
const STRIPE_GENERAL_PRODUCT =
  process.env.NODE_ENV === "production"
    ? process.env.STRIPE_GENERAL_PRODUCT_ID_PROD
    : process.env.STRIPE_GENERAL_PRODUCT_ID_DEV
const stripe = new Stripe(STRIPE_SK as string)

async function deleteProductWithPrices(productId: string) {
  try {
    // 1. Get all prices for this product
    const prices = await stripe.prices.list({
      product: productId,
      limit: 100,
    })

    // 2. Archive each price. It is not possible to completely delete a price through stripe API so we archive it instead.
    for (const price of prices.data) {
      await stripe.prices.update(price.id, {
        active: false,
      })
      console.log("Price archived:", price.id)
    }

    // 3. Now archive the product. It is not possible to completely delete a product through stripe API so we archive it instead.
    const product = await stripe.products.update(productId, {
      active: false,
    })

    console.log("Product archived:", product.id)

    return product
  } catch (error) {
    console.error("Error:", error)
    throw error
  }
}

export default defineEventHandler(async (event) => {
  if (event.method === "GET" || event.method === "PUT") {
    throw createError({
      statusCode: 405,
      statusMessage: "Method Not Allowed",
    })
  }

  if (event.method === "POST") {
    const entity = await readBody(event)

    const DEFAULT_PRODUCT_VALUE = "PRODUCT_WILL_BE_CREATED"
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
            images: entity.cover ? [entity.cover] : undefined,
          })
        } catch (error) {
          if (JSON.stringify(error).includes("No such product")) {
            product = await stripe.products.create({
              name: entity.title,
              // description: entity.description,
              images: entity.cover ? [entity.cover] : undefined,
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

    return product
  }

  if (event.method === "DELETE") {
    console.log("Delete product")
    const entity = await readBody(event)

    if (entity.product === STRIPE_GENERAL_PRODUCT) {
      throw createError({
        statusCode: 400,
        statusMessage: "Cannot delete the general product",
      })
    }

    if (!entity.product) {
      throw createError({
        statusCode: 400,
        statusMessage: "No product ID provided so no product was deleted",
      })
    }

    let product
    try {
      product = await deleteProductWithPrices(entity.product)
    } catch (error) {
      console.error("Error Deleting Product:", error)
      throw createError({
        statusCode: 500,
        statusMessage: "Internal Server Error",
        data: error,
      })
    }

    return product
  }
})
