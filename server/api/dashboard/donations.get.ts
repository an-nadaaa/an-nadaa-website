import { APIResponseCollection } from "../../../types/strapi/types"
import { ApiDonationDonation } from "../../../types/strapi/contentTypes"
import qs from "qs"

export default defineEventHandler(async (event: any) => {
  const { user } = await requireUserSession(event)

  const query = qs.stringify(
    {
      populate: "*", // populate the relation
      filters: {
        users_permissions_user: {
          documentId: {
            $eq: user.user.documentId,
          },
        },
      },
      sort: ["createdAt:desc"],
      pagination: {
        page: 1,
        pageSize: 20,
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
