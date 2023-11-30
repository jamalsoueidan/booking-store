import {useOutletContext} from '@remix-run/react';

import {Text} from '@mantine/core';

export default function ProductDescription() {
  const {product} = useOutletContext<any>();
  const {descriptionHtml} = product;

  return (
    <>
      <Text
        size="xl"
        c="dimmed"
        fw={400}
        dangerouslySetInnerHTML={{__html: descriptionHtml}}
      ></Text>
    </>
  );
}
