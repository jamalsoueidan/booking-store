import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

export interface ApiAutoCompleteProposal
  extends Record<string, object | string | number> {
  type: string;
  tekst: string;
  forslagstekst: string;
  caretpos: number;
}

export async function loader({request, context}: LoaderFunctionArgs) {
  // Get URLSearchParams object from request
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  // Get 'q' parameter from URL
  const q = searchParams.get('q');

  let dawaData: any = {};
  if (q) {
    // Fetch from DAWA API if 'q' is not null
    const dawaResponse = await fetch(
      `https://dawa.aws.dk/autocomplete?q=${encodeURIComponent(
        q || '',
      )}&type=adresse&caretpos=8&supplerendebynavn=true&stormodtagerpostnumre=true&multilinje=true&fuzzy=`,
    );
    // handle the response as you need
    // for example, you can get the json data as following
    dawaData = await dawaResponse.json();
  }

  return json(dawaData);
}
