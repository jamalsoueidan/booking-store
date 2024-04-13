import {json} from '@remix-run/server-runtime';

export async function loader() {
  return json({});
}

export default function AccountIndex() {
  return <>asd</>;
}
