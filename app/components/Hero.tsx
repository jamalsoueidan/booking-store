import image from '../../public/background3.webp';
import classes from './Hero.module.css';

export function FrontpageHero() {
  return (
    <div
      className={classes.root}
      style={{
        backgroundImage: `url('${image}')`,
      }}
    ></div>
  );
}
