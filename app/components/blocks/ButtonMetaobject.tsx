import {Button} from '@mantine/core';
import {Link} from '@remix-run/react';
import {type ButtonFragment} from 'storefrontapi.generated';

export function ButtonMetaobject({data}: {data: ButtonFragment}) {
  const text = data.text?.value;
  const linkTo = data.linkTo?.value;

  return (
    <Button size="xl" component={Link} to={linkTo || ''}>
      {text || 'mangler tekst'}
    </Button>
  );
}
