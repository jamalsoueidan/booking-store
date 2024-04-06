import {format} from 'date-fns';

export const renderTime = (utcTime: string) => {
  const fixedDate = format(new Date(), 'yyyy-MM-dd');
  const utcDateTime = `${fixedDate}T${utcTime}:00.000Z`;
  return format(new Date(utcDateTime), 'HH:mm');
};
