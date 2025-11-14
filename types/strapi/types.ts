import type { Modules, Schema, UID } from "@strapi/strapi"

export type GetValues<TSchemaUID extends UID.Schema> =
  Modules.Documents.Params.Attribute.GetValues<TSchemaUID>

export type GetDynamicZoneValues<TComponentUID extends UID.Schema> =
  GetValues<TComponentUID>

export type APIResponseData<TContentTypeUID extends UID.ContentType> =
  GetValues<TContentTypeUID>

export interface APIResponseCollectionMetadata {
  pagination: {
    page: number
    pageSize: number
    pageCount: number
    total: number
  }
}

export interface APIResponse<TContentTypeUID extends UID.ContentType> {
  // FIXME: this won't be null most of the time, but it will be null in case of an optional upload attribute.
  //        The Strapi utils cannot correctly infer this, so it is safer to assume all of data attributes may be null
  data: APIResponseData<TContentTypeUID> | null
}

export interface APIResponseCollection<
  TContentTypeUID extends UID.ContentType,
> {
  data: APIResponseData<TContentTypeUID>[]
  meta: APIResponseCollectionMetadata
}
