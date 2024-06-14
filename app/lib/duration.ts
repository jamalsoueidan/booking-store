import {format as f, formatDuration, intervalToDuration} from 'date-fns';
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

export function useDate() {
  const lang = useLanguage();

  const format = useCallback(
    (
      date: Date | number,
      format: string,
      options?: {
        locale?: Locale;
        weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
        firstWeekContainsDate?: number;
        useAdditionalWeekYearTokens?: boolean;
        useAdditionalDayOfYearTokens?: boolean;
      },
    ) => {
      return f(date, format, {
        ...options,
        locale: lang === 'AR' ? ar : lang === 'EN' ? enUS : da,
      });
    },
    [lang],
  );

  return {format};
}
