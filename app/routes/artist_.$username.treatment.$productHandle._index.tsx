import {Link, useOutletContext} from '@remix-run/react';

import {Button, Text} from '@mantine/core';
import {ArtistShell} from '~/components/ArtistShell';
import {TreatmentStepper} from '~/components/TreatmentStepper';

export default function ProductDescription() {
  const {product} = useOutletContext<any>();
  const {descriptionHtml} = product;

  return (
    <>
      <ArtistShell.Main>
        <Text
          size="lg"
          c="dimmed"
          fw={400}
          dangerouslySetInnerHTML={{__html: descriptionHtml}}
        ></Text>
      </ArtistShell.Main>
      <ArtistShell.Footer>
        <TreatmentStepper>
          <Button variant="default" component={Link} to="pick-location">
            Bestil tid
          </Button>
        </TreatmentStepper>
      </ArtistShell.Footer>
    </>
  );
}
