export function determineStepFromURL(
  paths: Array<{path: string}>,
  currentPath: string,
) {
  const index = paths.findIndex((data) => {
    if (data.path !== '') {
      if (currentPath.includes(data.path)) {
        return true;
      }
    }
    return false;
  });
  return index ? index : 0;
}
