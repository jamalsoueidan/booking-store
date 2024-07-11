import {json} from '@shopify/remix-oxygen';
import {professionImages} from '~/components/ProfessionButton';

export async function loader() {
  return json(Object.keys(professionImages).filter((key) => key !== 'all'));
}
