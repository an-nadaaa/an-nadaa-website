import { APIResponseCollection } from "../../../types/strapi/types"
import { ApiDonationDonation } from "../../../types/strapi/contentTypes"
import qs from "qs"
import z from "zod"

const donationsQuerySchema = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional(),
})

export default defineEventHandler(async (event: any) => {
  const { user } = await requireUserSession(event)
  const queryParams = await getValidatedQuery(event, donationsQuerySchema.parse)
  const { page = "1", pageSize = "20" } = queryParams

  const query = qs.stringify(
    {
      populate: {
        users_permissions_user: true,
        cause: {
          populate: "*",
        },
        // cause: {
        //   populate: ["cause.campaign", "cause.project"],
        // },
      }, // populate the relation
      filters: {
        users_permissions_user: {
          documentId: {
            $eq: user.user.documentId,
          },
        },
      },
      sort: ["createdAt:desc"],
      pagination: {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
      },
    },
    { encodeValuesOnly: true }
  )

  const donations = await fetch(
    `${useRuntimeConfig().public.STRAPI_API}/donations?${query}`,
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

  return {
    data: donations,
    success: true,
  }
})
