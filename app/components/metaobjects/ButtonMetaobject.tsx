import {Button} from '@mantine/core';
import {Link} from '@remix-run/react';
import {type PageComponentMetaobjectFragment} from 'storefrontapi.generated';
import {useField} from './utils';

export function ButtonMetaobject({
  metaobject,
}: {
  metaobject: PageComponentMetaobjectFragment | null;
}) {
  const field = useField(metaobject);
  if (!metaobject) return null;

  const text = field.getFieldValue('text');
  const linkTo = field.getFieldValue('link_to');

  return (
    <Button size="xl" component={Link} to={linkTo || ''}>
      {text || 'mangler tekst'}
    </Button>
  );
}
