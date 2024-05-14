import {formatDuration, intervalToDuration} from 'date-fns';
import {da} from 'date-fns/locale';

export function durationToTime(minutesString: number | string) {
  const minutes = parseInt(minutesString.toString());
  const milliseconds = minutes * 60 * 1000;
  const duration = intervalToDuration({start: 0, end: milliseconds});
  const format = formatDuration(duration, {
    locale: da,
    ...(milliseconds === 0
      ? {
          zero: true,
          format: ['minutes'],
        }
      : {}),
  });

  return format.replace('minutter', 'min');
}
