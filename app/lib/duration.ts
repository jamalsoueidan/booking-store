import {formatDuration, intervalToDuration} from 'date-fns';
import {ar, da, enUS} from 'date-fns/locale';
import {useCallback} from 'react';
import {useLanguage} from '~/providers/Language';

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

export function useDuration() {
  const lang = useLanguage();

  const durationToTime = useCallback(
    (minutesString: number | string) => {
      const minutes = parseInt(minutesString.toString());
      const milliseconds = minutes * 60 * 1000;
      const duration = intervalToDuration({start: 0, end: milliseconds});
      const format = formatDuration(duration, {
        locale: lang === 'AR' ? ar : lang === 'EN' ? enUS : da,
        ...(milliseconds === 0
          ? {
              zero: true,
              format: ['minutes'],
            }
          : {}),
      });

      return format.replace('minutter', 'min');
    },
    [lang],
  );

  return durationToTime;
}
