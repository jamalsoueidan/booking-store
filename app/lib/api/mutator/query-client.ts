// custom-instance.ts

import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {Errors} from '../model';

export const baseURL = 'https://booking-shopify-api.azurewebsites.net/api'; // use your own URL here or environment variable

export type ErrorType<ErrorData> = ErrorData;
// In case you want to wrap the body type (optional)
// (if the custom instance is processing data before sending it, like changing the case for example)
export type BodyType<BodyData> = BodyData & {headers?: any};

function paramsToQueryString(params: Record<string, string | Date>) {
  if (!params) {
    return '';
  }
  const queryString = Object.keys(params)
    .map((key) => {
      let value = params[key];
      if (value instanceof Date) {
        value = value.toJSON();
      }
      if (!value || value === '') {
        return null;
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .filter((value) => value)
    .join('&');

  return `?${queryString}`;
}

function convertErrorMessage(errorObject: Errors) {
  const result = errorObject.errors.reduce((accumulator, error) => {
    // Iterate over the paths array and create keys for each path
    error.path.forEach((path) => {
      // If the key doesn't exist, add it to the accumulator with the error message
      if (!accumulator[path]) {
        accumulator[path] = error.message;
      }
    });
    return accumulator;
  }, {} as Record<string, string>);

  return {fieldErrors: result};
}
export function isValidatorError(obj: any) {
  return obj && Object.keys(obj.fieldErrors).length > 0;
}

export function isError(obj: any): obj is Errors {
  return obj && (obj as Errors).success === false;
}

export type Config = {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  params?: any;
  headers?: any;
  data?: BodyType<unknown>;
  responseType?: string;
};

export const queryClient = async <T>(
  {url, method, headers, params, data}: Config,
  context?: LoaderFunctionArgs['context'],
): Promise<T> => {
  if (context && method === 'GET' && context.storefront.cache) {
    const cache = await context?.storefront.cache;
    const cacheKey =
      `${baseURL}${url.replace(/gid:\/\/shopify\/[A-Za-z]+\//, '')}` +
      paramsToQueryString(params);

    let response = await cache.match(cacheKey);
    if (!response) {
      console.log('Cache/Write', cacheKey);
      response = await fetch(
        `${baseURL}${url.replace(/gid:\/\/shopify\/[A-Za-z]+\//, '')}` +
          paramsToQueryString(params),
        {
          method,
          ...(data ? {body: JSON.stringify(data)} : {}),
        },
      );
      response = new Response(response.body, response);
      response.headers.set('Cache-Control', 'public, max-age=3600');
      context.waitUntil(
        context.storefront.cache.put(cacheKey, response.clone()),
      );
    } else {
      console.log('Cache/Read', cacheKey);
    }

    const responseJson = await response.json();
    return responseJson as T;
  } else {
    console.log(
      `Request ${method}`,
      `${baseURL}${url.replace(/gid:\/\/shopify\/[A-Za-z]+\//, '')}` +
        paramsToQueryString(params),
    );

    console.log(JSON.stringify(data, null, 2));
    const response = await fetch(
      `${baseURL}${url.replace(/gid:\/\/shopify\/[A-Za-z]+\//, '')}` +
        paramsToQueryString(params),
      {
        method,
        ...(data ? {body: JSON.stringify(data)} : {}),
      },
    );

    const responseJson = await response.json();
    if (isError(responseJson)) {
      console.log('ERROR', JSON.stringify(responseJson));
      throw convertErrorMessage(responseJson);
    }

    return responseJson as T;
  }
};

export default queryClient;
