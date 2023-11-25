import {useLocation} from '@remix-run/react';
import type {SelectedOption} from '@shopify/hydrogen/storefront-api-types';
import {useMemo} from 'react';

export function useVariantUrl(
  handle: string,
  selectedOptions: SelectedOption[],
) {
  const {pathname} = useLocation();

  return useMemo(() => {
    return getVariantUrl({
      handle,
      pathname,
      searchParams: new URLSearchParams(),
      selectedOptions,
    });
  }, [handle, selectedOptions, pathname]);
}

export function getVariantUrl({
  handle,
  pathname,
  searchParams,
  selectedOptions,
}: {
  handle: string;
  pathname: string;
  searchParams: URLSearchParams;
  selectedOptions: SelectedOption[];
}) {
  const match = /(\/[a-zA-Z]{2}-[a-zA-Z]{2}\/)/g.exec(pathname);
  const isLocalePathname = match && match.length > 0;

  const path = isLocalePathname
    ? `${match![0]}products/${handle}`
    : `/products/${handle}`;

  selectedOptions.forEach((option) => {
    searchParams.set(option.name, option.value);
  });

  const searchString = searchParams.toString();

  return path + (searchString ? '?' + searchParams.toString() : '');
}

export function getVariantUrlForTreatment({
  handle,
  pathname,
  searchParams,
  selectedOptions,
}: {
  handle: string;
  pathname: string;
  searchParams: URLSearchParams;
  selectedOptions: SelectedOption[];
}) {
  // Split pathname into segments and filter out empty strings
  const pathSegments = pathname.split('/').filter((segment) => segment !== '');

  // Find the index of the handle in the path segments
  const handleIndex = pathSegments.indexOf(handle);
  if (handleIndex === -1) {
    return '';
  }

  // Construct the new path with segments up to and including the handle
  let newPath = '/' + pathSegments.slice(0, handleIndex + 1).join('/');

  // Optionally add extra path segments after the handle if they exist
  if (pathSegments.length > handleIndex + 1) {
    newPath += '/' + pathSegments.slice(handleIndex + 1).join('/');
  }

  // Append selected options to searchParams
  selectedOptions.forEach((option) => {
    searchParams.set(option.name, option.value);
  });

  const searchString = searchParams.toString();

  return newPath + (searchString ? '?' + searchString : '');
}
