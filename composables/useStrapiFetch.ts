import qs from "qs"

type Method = "GET" | "POST" | "PUT" | "DELETE"
type StrapiResponse = {
  data: any
  meta: Record<string, any>
  error?: Record<string, any>
}

// Infer the return type of useFetch
type UseFetchReturnType = Awaited<ReturnType<typeof useFetch>>

// Extend the return type with the StrapiResponse data type
type ExtendedFetchReturnType = Omit<UseFetchReturnType, "data"> & {
  data: Ref<StrapiResponse>
}

export const useStrapiFetch = () => {
  const runtimeConfig = useRuntimeConfig()
  const STRAPI_API = runtimeConfig.public.STRAPI_API

  async function fetchStrapi(
    route: string,
    method: Method,
    urlSearchParams: Record<string, any> = {},
    qsQueryObject: Record<string, any> = {},
    qsOptions: qs.IStringifyOptions<qs.BooleanOptional> = {}
  ) {
    const response = await useFetch(
      `${STRAPI_API}${route}?${
        Object.keys(qsQueryObject).length > 0
          ? `${qs.stringify(qsQueryObject, {
              ...qsOptions,
              encodeValuesOnly: true,
            })}&`
          : ""
      }${new URLSearchParams(urlSearchParams).toString()}`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${runtimeConfig.public.STRAPI_API_KEY}`,
        },
      }
    )

    return response as unknown as ExtendedFetchReturnType
  }

  return fetchStrapi
}
