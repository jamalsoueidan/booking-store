/**
 * Generated by orval v6.20.0 🍺
 * Do not edit manually.
 * Booking Shopify Api
 * OpenAPI spec version: 1.0.0
 */
import type {
  CustomerBookingGetParams,
  CustomerBookingGetResponse,
  CustomerBookingListResponse,
  CustomerBookingsListParams,
  CustomerCreateBody,
  CustomerCreateResponse,
  CustomerGetResponse,
  CustomerIsBusinessResponse,
  CustomerLocationAddResponse,
  CustomerLocationCreateBody,
  CustomerLocationCreateResponse,
  CustomerLocationGetAllOriginsRepsonse,
  CustomerLocationGetResponse,
  CustomerLocationListResponse,
  CustomerLocationRemoveResponse,
  CustomerLocationSetDefaultResponse,
  CustomerLocationUpdateBody,
  CustomerLocationUpdateResponse,
  CustomerProductDestroyResponse,
  CustomerProductGetResponse,
  CustomerProductListIdsResponse,
  CustomerProductListResponse,
  CustomerProductUpsertBody,
  CustomerProductUpsertResponse,
  CustomerScheduleCreateBody,
  CustomerScheduleCreateResponse,
  CustomerScheduleDestroyResponse,
  CustomerScheduleGetResponse,
  CustomerScheduleListResponse,
  CustomerScheduleSlotsUpdateBody,
  CustomerScheduleSlotsUpdateResponse,
  CustomerScheduleUpdateBody,
  CustomerScheduleUpdateResponse,
  CustomerStatusResponse,
  CustomerUpdateBody,
  CustomerUpdateResponse,
  LocationGetCoordinatesParams,
  LocationGetCoordinatesResponse,
  LocationGetTravelTimeParams,
  LocationGetTravelTimeResponse,
  LocationValidateAddressParams,
  LocationValidateAddressResponse,
  MetaProfessions200,
  Metaspecialties200,
  ProductsGetUsersByVariantParams,
  ProductsGetUsersByVariantResponse,
  ProductsGetUsersImageBody,
  ProductsGetUsersImageResponse,
  ShippingBody,
  ShippingCalculateResponse,
  ShippingCreateResponse,
  UploadBody,
  UploadResponse,
  UserAvailabilityGeResponse,
  UserAvailabilityGenerateBody,
  UserAvailabilityGenerateResponse,
  UserAvailabilityGetBody,
  UserGetResponse,
  UserLocationGetResponse,
  UserProductsGetProductsBody,
  UserProductsGetProductsResponse,
  UserProductsGetResponse,
  UserProductsListByLocationResponse,
  UserProductsListByScheduleParams,
  UserProductsListByScheduleResponse,
  UserScheduleGetByLocationResponse,
  UserScheduleGetByProductIdResponse,
  UserSchedulesListLocations200,
  UsersListParams,
  UsersListResponse,
  UsersProfessionsResponse,
} from './model';
import {queryClient} from './mutator/query-client';
import type {BodyType} from './mutator/query-client';

export const getBookingShopifyApi = () => {
  /**
   * This endpoint respond with users images
   * @summary POST get users belongs to productIds array
   */
  const productsGetUsersImage = (
    productsGetUsersImageBody: BodyType<ProductsGetUsersImageBody>,
  ) => {
    return queryClient<ProductsGetUsersImageResponse>({
      url: `/products/get-users-image`,
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      data: productsGetUsersImageBody,
    });
  };

  /**
   * This endpoint get all users for specific productId and variantId
   * @summary GET Get all users for specific productId and variantId
   */
  const productsGetUsersByVariant = (
    params: ProductsGetUsersByVariantParams,
  ) => {
    return queryClient<ProductsGetUsersByVariantResponse>({
      url: `/products/get-users-by-variant`,
      method: 'get',
      params,
    });
  };

  /**
   * This endpoint gets user object
   * @summary GET Get user
   */
  const userGet = (username: string) => {
    return queryClient<UserGetResponse>({
      url: `/user/${username}`,
      method: 'get',
    });
  };

  /**
   * This endpoint get product for customer
   * @summary GET Get product that exist in one of the schedules for customer
   */
  const userProductGet = (username: string, productHandle: string) => {
    return queryClient<UserProductsGetResponse>({
      url: `/user/${username}/products/${productHandle}`,
      method: 'get',
    });
  };

  /**
   * This endpoint get products for user (across all schedules or one scheduleId)
   * @summary GET Get products for user
   */
  const userProductsListBySchedule = (
    username: string,
    params?: UserProductsListByScheduleParams,
  ) => {
    return queryClient<UserProductsListByScheduleResponse>({
      url: `/user/${username}/products`,
      method: 'get',
      params,
    });
  };

  /**
   * This endpoint is intended to be used when we need to fetch related products from the same schedule and same location.
   * @summary GET Get products for user
   */
  const userProductsListByLocation = (
    username: string,
    productHandle: string,
    locationId: string,
  ) => {
    return queryClient<UserProductsListByLocationResponse>({
      url: `/user/${username}/product/${productHandle}/location/${locationId}`,
      method: 'get',
    });
  };

  /**
   * This endpoint get products from one schedule by location
   * @summary GET Get products for user
   */
  const userProductsGetProducts = (
    username: string,
    locationId: string,
    userProductsGetProductsBody: BodyType<UserProductsGetProductsBody>,
  ) => {
    return queryClient<UserProductsGetProductsResponse>({
      url: `/user/${username}/products/location/${locationId}`,
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      data: userProductsGetProductsBody,
    });
  };

  /**
   * This endpoint should retrieve a schedule and locations belonging to a specific productHandle, along with the product.
   * @summary GET Get user schedule
   */
  const userScheduleGetByProduct = (
    username: string,
    productHandle: string,
  ) => {
    return queryClient<UserScheduleGetByProductIdResponse>({
      url: `/user/${username}/schedule/get-by-product-id/${productHandle}`,
      method: 'get',
    });
  };

  /**
   * This endpoint should return all locations present in all schedules for specific user
   * @summary GET Get schedules for user
   */
  const userSchedulesListLocations = (username: string) => {
    return queryClient<UserSchedulesListLocations200>({
      url: `/user/${username}/schedules/locations`,
      method: 'get',
    });
  };

  /**
   * This endpoint get one location for user
   * @summary GET Get one location from user
   */
  const userLocationGet = (username: string, locationId: string) => {
    return queryClient<UserLocationGetResponse>({
      url: `/user/${username}/location/${locationId}`,
      method: 'get',
    });
  };

  /**
   * This endpoint should retrieve a schedule with products that only belong to a specific locationId.
   * @summary GET Get user schedule
   */
  const userScheduleGetByLocation = (
    username: string,
    scheduleId: string,
    locationId: string,
  ) => {
    return queryClient<UserScheduleGetByLocationResponse>({
      url: `/user/${username}/schedule/${scheduleId}/location/${locationId}`,
      method: 'get',
    });
  };

  /**
   * This endpoint get all users
   * @summary GET Get all users professions with total count
   */
  const usersProfessions = () => {
    return queryClient<UsersProfessionsResponse>({
      url: `/users/professions`,
      method: 'get',
    });
  };

  /**
   * This endpoint generate availabilty for user
   * @summary POST generate availabilty for user
   */
  const userAvailabilityGenerate = (
    username: string,
    locationId: string,
    userAvailabilityGenerateBody: BodyType<UserAvailabilityGenerateBody>,
  ) => {
    return queryClient<UserAvailabilityGenerateResponse>({
      url: `/user/${username}/availability/${locationId}/generate`,
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      data: userAvailabilityGenerateBody,
    });
  };

  /**
   * This endpoint get's one single availabilty for user
   * @summary POST get single availabilty for user
   */
  const userAvailabilityGet = (
    username: string,
    locationId: string,
    userAvailabilityGetBody: BodyType<UserAvailabilityGetBody>,
  ) => {
    return queryClient<UserAvailabilityGeResponse>({
      url: `/user/${username}/availability/${locationId}/get`,
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      data: userAvailabilityGetBody,
    });
  };

  /**
   * This endpoint get all users
   * @summary GET Get all users
   */
  const usersList = (params?: UsersListParams) => {
    return queryClient<UsersListResponse>({
      url: `/users`,
      method: 'get',
      params,
    });
  };

  /**
   * This endpoint update user
   * @summary PUT Update user
   */
  const customerUpdate = (
    customerId: string,
    customerUpdateBody: BodyType<CustomerUpdateBody>,
  ) => {
    return queryClient<CustomerUpdateResponse>({
      url: `/customer/${customerId}`,
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      data: customerUpdateBody,
    });
  };

  /**
   * This endpoint gets customer object
   * @summary GET Get customer
   */
  const customerGet = (customerId: string) => {
    return queryClient<CustomerGetResponse>({
      url: `/customer/${customerId}`,
      method: 'get',
    });
  };

  /**
   * This endpoint gets customer status
   * @summary GET Get customer status
   */
  const customerStatus = (customerId: string) => {
    return queryClient<CustomerStatusResponse>({
      url: `/customer/${customerId}/status`,
      method: 'get',
    });
  };

  /**
   * This endpoint creates new user
   * @summary PUT Create user
   */
  const customerCreate = (customerCreateBody: BodyType<CustomerCreateBody>) => {
    return queryClient<CustomerCreateResponse>({
      url: `/customer`,
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      data: customerCreateBody,
    });
  };

  /**
   * This endpoint return if customer is business or not
   * @summary GET Get customer is business
   */
  const customerIsBusiness = (customerId: string) => {
    return queryClient<CustomerIsBusinessResponse>({
      url: `/customer/${customerId}/isBusiness`,
      method: 'get',
    });
  };

  /**
   * This endpoint get products for customer
   * @summary GET Get products for customer
   */
  const customerProductsList = (customerId: string) => {
    return queryClient<CustomerProductListResponse>({
      url: `/customer/${customerId}/products`,
      method: 'get',
    });
  };

  /**
   * This endpoint get product ids for customer
   * @summary GET Get product ids for customer
   */
  const customerProductsListIds = (customerId: string) => {
    return queryClient<CustomerProductListIdsResponse>({
      url: `/customer/${customerId}/products/ids`,
      method: 'get',
    });
  };

  /**
   * This endpoint get product for customer
   * @summary GET Get product that exist in one of the schedules for customer
   */
  const customerProductGet = (customerId: string, productId: string) => {
    return queryClient<CustomerProductGetResponse>({
      url: `/customer/${customerId}/product/${productId}`,
      method: 'get',
    });
  };

  /**
   * This endpoint update product that exist in schedule
   * @summary PUT Upsert product to schedule
   */
  const customerProductUpsert = (
    customerId: string,
    productId: string,
    customerProductUpsertBody: BodyType<CustomerProductUpsertBody>,
  ) => {
    return queryClient<CustomerProductUpsertResponse>({
      url: `/customer/${customerId}/product/${productId}`,
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      data: customerProductUpsertBody,
    });
  };

  /**
   * This endpoint remove product from schedule for customer
   * @summary DEL destroy product
   */
  const customerProductDestroy = (customerId: string, productId: string) => {
    return queryClient<CustomerProductDestroyResponse>({
      url: `/customer/${customerId}/product/${productId}`,
      method: 'delete',
    });
  };

  /**
   * This endpoint gets booking object
   * @summary GET Get booking
   */
  const customerBookingGet = (
    customerId: string,
    orderId: string,
    params: CustomerBookingGetParams,
  ) => {
    return queryClient<CustomerBookingGetResponse>({
      url: `/customer/${customerId}/booking/${orderId}`,
      method: 'get',
      params,
    });
  };

  /**
   * This endpoint get all bookings
   * @summary GET Get all bookings for customer
   */
  const customerBookingsList = (
    customerId: string,
    params: CustomerBookingsListParams,
  ) => {
    return queryClient<CustomerBookingListResponse>({
      url: `/customer/${customerId}/bookings`,
      method: 'get',
      params,
    });
  };

  /**
   * This endpoint create new schedule
   * @summary POST Create schedule
   */
  const customerScheduleCreate = (
    customerId: string,
    customerScheduleCreateBody: BodyType<CustomerScheduleCreateBody>,
  ) => {
    return queryClient<CustomerScheduleCreateResponse>({
      url: `/customer/${customerId}/schedule`,
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      data: customerScheduleCreateBody,
    });
  };

  /**
   * This endpoint get all schedule for customer
   * @summary GET Get all schedule for customer
   */
  const customerScheduleList = (customerId: string) => {
    return queryClient<CustomerScheduleListResponse>({
      url: `/customer/${customerId}/schedules`,
      method: 'get',
    });
  };

  /**
   * This endpoint get schedule for customer
   * @summary GET Get schedule for customer
   */
  const customerScheduleGet = (customerId: string, scheduleId: string) => {
    return queryClient<CustomerScheduleGetResponse>({
      url: `/customer/${customerId}/schedule/${scheduleId}`,
      method: 'get',
    });
  };

  /**
   * This endpoint update schedule
   * @summary PUT Update schedule
   */
  const customerScheduleUpdate = (
    customerId: string,
    scheduleId: string,
    customerScheduleUpdateBody: BodyType<CustomerScheduleUpdateBody>,
  ) => {
    return queryClient<CustomerScheduleUpdateResponse>({
      url: `/customer/${customerId}/schedule/${scheduleId}`,
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      data: customerScheduleUpdateBody,
    });
  };

  /**
   * This endpoint destroy schedule for customer
   * @summary DEL destroy schedule
   */
  const customerScheduleDestroy = (customerId: string, scheduleId: string) => {
    return queryClient<CustomerScheduleDestroyResponse>({
      url: `/customer/${customerId}/schedule/${scheduleId}`,
      method: 'delete',
    });
  };

  /**
   * This endpoint update schedule slot
   * @summary PUT Update schedule slot
   */
  const customerScheduleSlotUpdate = (
    customerId: string,
    scheduleId: string,
    customerScheduleSlotsUpdateBody: BodyType<CustomerScheduleSlotsUpdateBody>,
  ) => {
    return queryClient<CustomerScheduleSlotsUpdateResponse>({
      url: `/customer/${customerId}/schedule/${scheduleId}/slots`,
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      data: customerScheduleSlotsUpdateBody,
    });
  };

  /**
   * This endpoint get all professions
   * @summary GET Get all professions
   */
  const metaProfessions = () => {
    return queryClient<MetaProfessions200>({
      url: `/meta/professions`,
      method: 'get',
    });
  };

  /**
   * This endpoint get all specialties
   * @summary GET Get all specialties
   */
  const metaspecialties = () => {
    return queryClient<Metaspecialties200>({
      url: `/meta/specialties`,
      method: 'get',
    });
  };

  /**
   * This endpoint get all origin locations
   * @summary GET Get all origin locations
   */
  const customerLocationGetAllOrigins = (customerId: string) => {
    return queryClient<CustomerLocationGetAllOriginsRepsonse>({
      url: `/customer/${customerId}/locations/get-all-origins`,
      method: 'get',
    });
  };

  /**
   * This endpoint set new default location for user
   * @summary POST Set new default location for user
   */
  const customerLocationSetDefault = (
    customerId: string,
    locationId: string,
  ) => {
    return queryClient<CustomerLocationSetDefaultResponse>({
      url: `/customer/${customerId}/location/${locationId}/setDefault`,
      method: 'put',
    });
  };

  /**
   * This endpoint get one location for user
   * @summary GET Get one location from user
   */
  const customerLocationGet = (customerId: string, locationId: string) => {
    return queryClient<CustomerLocationGetResponse>({
      url: `/customer/${customerId}/location/${locationId}`,
      method: 'get',
    });
  };

  /**
   * This endpoint remove location but does not delete location from db
   * @summary POST Remove location from user
   */
  const customerLocationRemove = (customerId: string, locationId: string) => {
    return queryClient<CustomerLocationRemoveResponse>({
      url: `/customer/${customerId}/location/${locationId}`,
      method: 'delete',
    });
  };

  /**
   * This endpoint add new location
   * @summary POST Add location to user
   */
  const customerLocationAdd = (customerId: string, locationId: string) => {
    return queryClient<CustomerLocationAddResponse>({
      url: `/customer/${customerId}/location/${locationId}`,
      method: 'post',
    });
  };

  /**
   * This endpoint update existing location
   * @summary PUT Update location
   */
  const customerLocationUpdate = (
    customerId: string,
    locationId: string,
    customerLocationUpdateBody: BodyType<CustomerLocationUpdateBody>,
  ) => {
    return queryClient<CustomerLocationUpdateResponse>({
      url: `/customer/${customerId}/location/${locationId}`,
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      data: customerLocationUpdateBody,
    });
  };

  /**
   * This endpoint creates new location
   * @summary POST Create location origin or destination
   */
  const customerLocationCreate = (
    customerId: string,
    customerLocationCreateBody: BodyType<CustomerLocationCreateBody>,
  ) => {
    return queryClient<CustomerLocationCreateResponse>({
      url: `/customer/${customerId}/locations`,
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      data: customerLocationCreateBody,
    });
  };

  /**
   * This endpoint get all locations for user
   * @summary GET Get all locations for user
   */
  const customerLocationList = (customerId: string) => {
    return queryClient<CustomerLocationListResponse>({
      url: `/customer/${customerId}/locations`,
      method: 'get',
    });
  };

  /**
   * This endpoint get coordinates object
   * @summary GET location coordinates
   */
  const locationGetCoordinates = (params?: LocationGetCoordinatesParams) => {
    return queryClient<LocationGetCoordinatesResponse>({
      url: `/location/get-coordinates`,
      method: 'get',
      params,
    });
  };

  /**
   * This endpoint validate address
   * @summary GET location validate address
   */
  const locationValidateAddress = (params?: LocationValidateAddressParams) => {
    return queryClient<LocationValidateAddressResponse>({
      url: `/location/validate-address`,
      method: 'get',
      params,
    });
  };

  /**
   * This endpoint gets traval time object
   * @summary GET location travel time
   */
  const locationGetTravelTime = (params?: LocationGetTravelTimeParams) => {
    return queryClient<LocationGetTravelTimeResponse>({
      url: `/location/get-travel-time`,
      method: 'get',
      params,
    });
  };

  /**
   * @summary POST create shipping
   */
  const shippingCreate = (shippingBody: BodyType<ShippingBody>) => {
    return queryClient<ShippingCreateResponse>({
      url: `/shipping/create`,
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      data: shippingBody,
    });
  };

  /**
   * @summary POST get shipping calculate
   */
  const shippingCalculate = (shippingBody: BodyType<ShippingBody>) => {
    return queryClient<ShippingCalculateResponse>({
      url: `/shipping/calculate`,
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      data: shippingBody,
    });
  };

  /**
   * This endpoint is used to upload new image for customer
   * @summary POST Upload new customer image
   */
  const upload = (uploadBody: BodyType<UploadBody>) => {
    return queryClient<UploadResponse>({
      url: `/orchestrators/upload`,
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      data: uploadBody,
    });
  };

  return {
    productsGetUsersImage,
    productsGetUsersByVariant,
    userGet,
    userProductGet,
    userProductsListBySchedule,
    userProductsListByLocation,
    userProductsGetProducts,
    userScheduleGetByProduct,
    userSchedulesListLocations,
    userLocationGet,
    userScheduleGetByLocation,
    usersProfessions,
    userAvailabilityGenerate,
    userAvailabilityGet,
    usersList,
    customerUpdate,
    customerGet,
    customerStatus,
    customerCreate,
    customerIsBusiness,
    customerProductsList,
    customerProductsListIds,
    customerProductGet,
    customerProductUpsert,
    customerProductDestroy,
    customerBookingGet,
    customerBookingsList,
    customerScheduleCreate,
    customerScheduleList,
    customerScheduleGet,
    customerScheduleUpdate,
    customerScheduleDestroy,
    customerScheduleSlotUpdate,
    metaProfessions,
    metaspecialties,
    customerLocationGetAllOrigins,
    customerLocationSetDefault,
    customerLocationGet,
    customerLocationRemove,
    customerLocationAdd,
    customerLocationUpdate,
    customerLocationCreate,
    customerLocationList,
    locationGetCoordinates,
    locationValidateAddress,
    locationGetTravelTime,
    shippingCreate,
    shippingCalculate,
    upload,
  };
};
export type ProductsGetUsersImageResult = NonNullable<
  Awaited<
    ReturnType<ReturnType<typeof getBookingShopifyApi>['productsGetUsersImage']>
  >
>;
export type ProductsGetUsersByVariantResult = NonNullable<
  Awaited<
    ReturnType<
      ReturnType<typeof getBookingShopifyApi>['productsGetUsersByVariant']
    >
  >
>;
export type UserGetResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getBookingShopifyApi>['userGet']>>
>;
export type UserProductGetResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getBookingShopifyApi>['userProductGet']>>
>;
export type UserProductsListByScheduleResult = NonNullable<
  Awaited<
    ReturnType<
      ReturnType<typeof getBookingShopifyApi>['userProductsListBySchedule']
    >
  >
>;
export type UserProductsListByLocationResult = NonNullable<
  Awaited<
    ReturnType<
      ReturnType<typeof getBookingShopifyApi>['userProductsListByLocation']
    >
  >
>;
export type UserProductsGetProductsResult = NonNullable<
  Awaited<
    ReturnType<
      ReturnType<typeof getBookingShopifyApi>['userProductsGetProducts']
    >
  >
>;
export type UserScheduleGetByProductResult = NonNullable<
  Awaited<
    ReturnType<
      ReturnType<typeof getBookingShopifyApi>['userScheduleGetByProduct']
    >
  >
>;
export type UserSchedulesListLocationsResult = NonNullable<
  Awaited<
    ReturnType<
      ReturnType<typeof getBookingShopifyApi>['userSchedulesListLocations']
    >
  >
>;
export type UserLocationGetResult = NonNullable<
  Awaited<
    ReturnType<ReturnType<typeof getBookingShopifyApi>['userLocationGet']>
  >
>;
export type UserScheduleGetByLocationResult = NonNullable<
  Awaited<
    ReturnType<
      ReturnType<typeof getBookingShopifyApi>['userScheduleGetByLocation']
    >
  >
>;
export type UsersProfessionsResult = NonNullable<
  Awaited<
    ReturnType<ReturnType<typeof getBookingShopifyApi>['usersProfessions']>
  >
>;
export type UserAvailabilityGenerateResult = NonNullable<
  Awaited<
    ReturnType<
      ReturnType<typeof getBookingShopifyApi>['userAvailabilityGenerate']
    >
  >
>;
export type UserAvailabilityGetResult = NonNullable<
  Awaited<
    ReturnType<ReturnType<typeof getBookingShopifyApi>['userAvailabilityGet']>
  >
>;
export type UsersListResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getBookingShopifyApi>['usersList']>>
>;
export type CustomerUpdateResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getBookingShopifyApi>['customerUpdate']>>
>;
export type CustomerGetResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getBookingShopifyApi>['customerGet']>>
>;
export type CustomerStatusResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getBookingShopifyApi>['customerStatus']>>
>;
export type CustomerCreateResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getBookingShopifyApi>['customerCreate']>>
>;
export type CustomerIsBusinessResult = NonNullable<
  Awaited<
    ReturnType<ReturnType<typeof getBookingShopifyApi>['customerIsBusiness']>
  >
>;
export type CustomerProductsListResult = NonNullable<
  Awaited<
    ReturnType<ReturnType<typeof getBookingShopifyApi>['customerProductsList']>
  >
>;
export type CustomerProductsListIdsResult = NonNullable<
  Awaited<
    ReturnType<
      ReturnType<typeof getBookingShopifyApi>['customerProductsListIds']
    >
  >
>;
export type CustomerProductGetResult = NonNullable<
  Awaited<
    ReturnType<ReturnType<typeof getBookingShopifyApi>['customerProductGet']>
  >
>;
export type CustomerProductUpsertResult = NonNullable<
  Awaited<
    ReturnType<ReturnType<typeof getBookingShopifyApi>['customerProductUpsert']>
  >
>;
export type CustomerProductDestroyResult = NonNullable<
  Awaited<
    ReturnType<
      ReturnType<typeof getBookingShopifyApi>['customerProductDestroy']
    >
  >
>;
export type CustomerBookingGetResult = NonNullable<
  Awaited<
    ReturnType<ReturnType<typeof getBookingShopifyApi>['customerBookingGet']>
  >
>;
export type CustomerBookingsListResult = NonNullable<
  Awaited<
    ReturnType<ReturnType<typeof getBookingShopifyApi>['customerBookingsList']>
  >
>;
export type CustomerScheduleCreateResult = NonNullable<
  Awaited<
    ReturnType<
      ReturnType<typeof getBookingShopifyApi>['customerScheduleCreate']
    >
  >
>;
export type CustomerScheduleListResult = NonNullable<
  Awaited<
    ReturnType<ReturnType<typeof getBookingShopifyApi>['customerScheduleList']>
  >
>;
export type CustomerScheduleGetResult = NonNullable<
  Awaited<
    ReturnType<ReturnType<typeof getBookingShopifyApi>['customerScheduleGet']>
  >
>;
export type CustomerScheduleUpdateResult = NonNullable<
  Awaited<
    ReturnType<
      ReturnType<typeof getBookingShopifyApi>['customerScheduleUpdate']
    >
  >
>;
export type CustomerScheduleDestroyResult = NonNullable<
  Awaited<
    ReturnType<
      ReturnType<typeof getBookingShopifyApi>['customerScheduleDestroy']
    >
  >
>;
export type CustomerScheduleSlotUpdateResult = NonNullable<
  Awaited<
    ReturnType<
      ReturnType<typeof getBookingShopifyApi>['customerScheduleSlotUpdate']
    >
  >
>;
export type MetaProfessionsResult = NonNullable<
  Awaited<
    ReturnType<ReturnType<typeof getBookingShopifyApi>['metaProfessions']>
  >
>;
export type MetaspecialtiesResult = NonNullable<
  Awaited<
    ReturnType<ReturnType<typeof getBookingShopifyApi>['metaspecialties']>
  >
>;
export type CustomerLocationGetAllOriginsResult = NonNullable<
  Awaited<
    ReturnType<
      ReturnType<typeof getBookingShopifyApi>['customerLocationGetAllOrigins']
    >
  >
>;
export type CustomerLocationSetDefaultResult = NonNullable<
  Awaited<
    ReturnType<
      ReturnType<typeof getBookingShopifyApi>['customerLocationSetDefault']
    >
  >
>;
export type CustomerLocationGetResult = NonNullable<
  Awaited<
    ReturnType<ReturnType<typeof getBookingShopifyApi>['customerLocationGet']>
  >
>;
export type CustomerLocationRemoveResult = NonNullable<
  Awaited<
    ReturnType<
      ReturnType<typeof getBookingShopifyApi>['customerLocationRemove']
    >
  >
>;
export type CustomerLocationAddResult = NonNullable<
  Awaited<
    ReturnType<ReturnType<typeof getBookingShopifyApi>['customerLocationAdd']>
  >
>;
export type CustomerLocationUpdateResult = NonNullable<
  Awaited<
    ReturnType<
      ReturnType<typeof getBookingShopifyApi>['customerLocationUpdate']
    >
  >
>;
export type CustomerLocationCreateResult = NonNullable<
  Awaited<
    ReturnType<
      ReturnType<typeof getBookingShopifyApi>['customerLocationCreate']
    >
  >
>;
export type CustomerLocationListResult = NonNullable<
  Awaited<
    ReturnType<ReturnType<typeof getBookingShopifyApi>['customerLocationList']>
  >
>;
export type LocationGetCoordinatesResult = NonNullable<
  Awaited<
    ReturnType<
      ReturnType<typeof getBookingShopifyApi>['locationGetCoordinates']
    >
  >
>;
export type LocationValidateAddressResult = NonNullable<
  Awaited<
    ReturnType<
      ReturnType<typeof getBookingShopifyApi>['locationValidateAddress']
    >
  >
>;
export type LocationGetTravelTimeResult = NonNullable<
  Awaited<
    ReturnType<ReturnType<typeof getBookingShopifyApi>['locationGetTravelTime']>
  >
>;
export type ShippingCreateResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getBookingShopifyApi>['shippingCreate']>>
>;
export type ShippingCalculateResult = NonNullable<
  Awaited<
    ReturnType<ReturnType<typeof getBookingShopifyApi>['shippingCalculate']>
  >
>;
export type UploadResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getBookingShopifyApi>['upload']>>
>;
