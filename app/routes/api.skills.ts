import {json} from '@shopify/remix-oxygen';
import {skills} from '~/components/ProfessionButton';

export async function loader() {
  return json(Object.keys(skills));
}
