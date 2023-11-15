export function durationToTime(minutesString: number | string) {
  let minutes;
  if (typeof minutesString === 'string') {
    minutes = parseInt(minutesString, 2);
  } else {
    minutes = minutesString;
  }

  const hours = Math.floor(minutes / 60); // Get the whole number of hours
  const remainingMinutes = minutes % 60; // Get the remaining minutes

  if (remainingMinutes === 0) {
    return hours + ' time(r)';
  }
  if (hours === 0) {
    return remainingMinutes + ' min';
  }

  return hours + ' time(r) ' + remainingMinutes + ' min';
}
