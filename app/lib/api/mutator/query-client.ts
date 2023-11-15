// custom-instance.ts

import {Errors} from '../model';

const baseURL = 'https://booking-shopify-api.azurewebsites.net/api'; // use your own URL here or environment variable

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

export const queryClient = async <T>({
  url,
  method,
  headers,
  params,
  data,
}: {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  params?: any;
  headers?: any;
  data?: BodyType<unknown>;
  responseType?: string;
}): Promise<T> => {
  const response = await fetch(
    `${baseURL}${url.replace(/gid:\/\/shopify\/[A-Za-z]+\//, '')}` +
      paramsToQueryString(params),
    {
      method,
      ...(data ? {body: JSON.stringify(data)} : {}),
    },
  );
  console.log(
    `${baseURL}${url.replace(/gid:\/\/shopify\/[A-Za-z]+\//, '')}` +
      paramsToQueryString(params),
  );
  const responseJson = await response.json();
  if (isError(responseJson)) {
    console.log(JSON.stringify(data), JSON.stringify(responseJson));
    throw convertErrorMessage(responseJson);
  }

  return responseJson as T;
};

export default queryClient;
