import { APIResponseCollection } from "../../../types/strapi/types"
import { ApiDonationDonation } from "../../../types/strapi/contentTypes"
import qs from "qs"

import { z } from "zod"

const donationStatsQuerySchema = z.object({
  // Example query parameters: e.g. timeframe, projectId (adjust as needed)
  // You can add more parameters as required for stats endpoints
  // timeframe: z.string().optional(),
  // projectId: z.string().optional(),
  startDate: z.number().optional(),
  endDate: z.number().optional(),
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
  // const q = await readValidatedBody(event, donationStatsQuerySchema.parse)

  const query = {
    populate: "*", // populate the relation
    filters: {
      users_permissions_user: {
        documentId: {
          $eq: user.user.documentId,
        },
      },
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

  const stats = {
    totalDonations: donations.data.length,
    totalAmountUSD: donations.data.reduce((acc, donation) => {
      return acc + (donation.amountUSD as number)
    }, 0),
    totalAmountMYR:
      donations.data.reduce((acc, donation) => {
        return acc + (donation.amountUSD as number)
      }, 0) * conversionRates["MYR"],
  }

  return stats
})
