import {formatDuration, intervalToDuration} from 'date-fns';
import {da} from 'date-fns/locale';

export function durationToTime(minutesString: number | string) {
  let minutes;
  if (typeof minutesString === 'string') {
    minutes = parseInt(minutesString, 2);
  } else {
    minutes = minutesString;
  }
  const milliseconds = minutes * 60 * 1000;

  const duration = intervalToDuration({start: 0, end: milliseconds});
  const format = formatDuration(duration, {locale: da});

  return format.replace('minutter', 'min');
}
