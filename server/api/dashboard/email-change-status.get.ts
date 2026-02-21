import { APIResponseCollection } from "../../../types/strapi/types"
import { ApiDonationDonation } from "../../../types/strapi/contentTypes"
import qs from "qs"
import z from "zod"

const donationsQuerySchema = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export default defineEventHandler(async (event: any) => {
  const { user } = await requireUserSession(event)
  // const queryParams = await getValidatedQuery(event, donationsQuerySchema.parse)

  return fetch(`${useRuntimeConfig().public.STRAPI_API}/email-change/status?userId=${user.user.documentId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useRuntimeConfig().STRAPI_API_KEY_BACKEND}`,
    }
  }).then(res=> {
    if(!res.ok){
      throw createError({
        statusCode: res.status,
        statusMessage: res.statusText,
      })
    }
    return res.json() as Promise<{
      pending: boolean
      expired?: boolean
      newEmail?: string
    }>
  })
})
