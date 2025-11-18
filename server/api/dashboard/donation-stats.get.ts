import { APIResponseCollection } from "../../../types/strapi/types"
import { ApiDonationDonation } from "../../../types/strapi/contentTypes"
import qs from "qs"

import { z } from "zod"

const donationStatsQuerySchema = z.object({
  // Example query parameters: e.g. timeframe, projectId (adjust as needed)
  // You can add more parameters as required for stats endpoints
  // timeframe: z.string().optional(),
  // projectId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  currency: z.string().optional(),
  source: z.string().optional(),
  donationStatus: z.string().optional(),
  causeId: z.string().optional(),
  campaignId: z.string().optional(),
  campaignProgress: z.number().optional(),
})

export default defineEventHandler(async (event: any) => {
  const { user } = await requireUserSession(event)
  // const queryParams = getQuery(event)
  const q = await getValidatedQuery(event, donationStatsQuerySchema.parse)

  const query = {
    populate: {
      cause: {
        populate: "*",
      },
    }, // populate the relation
    filters: {
      users_permissions_user: {
        documentId: {
          $eq: user.user.documentId,
        },
      },
      createdAt:
        q.startDate || q.endDate
          ? {
              $gte: q.startDate
                ? new Date(q.startDate).toISOString()
                : undefined,
              $lte: q.endDate ? new Date(q.endDate).toISOString() : undefined,
            }
          : undefined,
    },
  }

  const donations = await fetch(
    `${useRuntimeConfig().public.STRAPI_API}/donations?${qs.stringify(query)}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${useRuntimeConfig().STRAPI_API_KEY_BACKEND}`,
      },
    }
  )
    .then(async (res) => {
      if (res.ok) {
        return res.json()
      } else {
        throw createError({
          statusCode: res.status,
          statusMessage: res.statusText,
        })
      }
    })
    .then((res) => {
      return res as APIResponseCollection<"api::donation.donation"> & {
        data: ApiDonationDonation[]
      }
    })

  const conversionRates = await fetch("https://open.er-api.com/v6/latest/USD", {
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (res) => {
    return (await res.json()).rates as {
      [key: string]: number
    }
  })

  // Initialize aggregation maps
  const categoryStats = new Map<
    string,
    {
      categoryId: number
      categoryDocumentId: string
      categoryTitle: string
      totalAmountUSD: number
      totalAmountMYR: number
      donationCount: number
    }
  >()

  const countryStats = new Map<
    string,
    {
      countryCode: string
      countryName: string
      totalAmountUSD: number
      totalAmountMYR: number
      donationCount: number
    }
  >()

  // Process each donation
  for (const donation of donations.data.filter(
    (donation) => donation.donationStatus === "success"
  )) {
    const amountUSD = (donation.amountUSD as number) || 0
    const currency = (donation.currency as string)?.toLowerCase()
    // For MYR: use original amount if currency is MYR, otherwise convert USD to MYR
    const amountMYR =
      currency === "myr"
        ? (donation.amount as number) || 0
        : amountUSD * conversionRates["MYR"]

    const cause = donation.cause as any

    // Skip donations without a cause
    if (!cause) continue

    // Process categories
    if (cause.categories && Array.isArray(cause.categories)) {
      for (const category of cause.categories) {
        const categoryKey = `${category.id}`
        const existing = categoryStats.get(categoryKey)

        if (existing) {
          existing.totalAmountUSD += amountUSD
          existing.totalAmountMYR += amountMYR
          existing.donationCount += 1
        } else {
          categoryStats.set(categoryKey, {
            categoryId: category.id,
            categoryDocumentId: category.documentId,
            categoryTitle: category.title,
            totalAmountUSD: amountUSD,
            totalAmountMYR: amountMYR,
            donationCount: 1,
          })
        }
      }
    }

    // Process locations/countries
    if (cause.locations && Array.isArray(cause.locations)) {
      for (const location of cause.locations) {
        const countryKey = location.countryCode || location.countryName
        const existing = countryStats.get(countryKey)

        if (existing) {
          existing.totalAmountUSD += amountUSD
          existing.totalAmountMYR += amountMYR
          existing.donationCount += 1
        } else {
          countryStats.set(countryKey, {
            countryCode: location.countryCode,
            countryName: location.countryName,
            totalAmountUSD: amountUSD,
            totalAmountMYR: amountMYR,
            donationCount: 1,
          })
        }
      }
    }
  }

  // Convert maps to arrays
  const statsByCategory = Array.from(categoryStats.values())
  const statsByCountry = Array.from(countryStats.values())

  // Calculate overall totals
  const totalDonations = donations.data.length
  const totalAmountUSD = donations.data.reduce((acc, donation) => {
    return acc + ((donation.amountUSD as number) || 0)
  }, 0)
  const totalAmountMYR = donations.data.reduce((acc, donation) => {
    const currency = (donation.currency as string)?.toLowerCase()
    const amountUSD = (donation.amountUSD as number) || 0
    return (
      acc +
      (currency === "myr"
        ? (donation.amount as number) || 0
        : amountUSD * conversionRates["MYR"])
    )
  }, 0)

  return {
    totalDonations,
    totalAmountUSD,
    totalAmountMYR,
    byCategory: statsByCategory,
    byCountry: statsByCountry,
  }
})
