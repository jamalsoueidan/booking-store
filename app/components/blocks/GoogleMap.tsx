import {type MapsFragment} from 'storefrontapi.generated';
import {Wrapper} from '../Wrapper';
import classes from './GoogleMap.module.css';

export function GoogleMap({component}: {component: MapsFragment}) {
  const url = component.url?.value;

  return (
    <Wrapper>
      <div className={classes.googleMap}>
        <iframe
          title="Google Maps"
          src={url + '&key=AIzaSyCRthKA4QW7B1UPbpWuiMJiZ8pPBh4l8uc' || ''}
          width="600"
          height="450"
          allowFullScreen={false}
          className={classes.googleMapIframe}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </Wrapper>
  );
}
