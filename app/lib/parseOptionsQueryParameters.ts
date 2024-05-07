export function parseOptionsFromQuery(searchParams: URLSearchParams) {
  const options = {};

  for (const [key, value] of searchParams.entries()) {
    if (key.startsWith('options[') && key.endsWith(']')) {
      const keys = key.slice(8, -1).split('][');
      let current: Record<string, any> = options;

      keys.forEach((k, index) => {
        if (index === keys.length - 1) {
          // Before setting the value, ensure the correct structure exists
          if (typeof current[k] !== 'object' || current[k] instanceof String) {
            current[k] = {};
          }
          current[k] = value;
        } else {
          if (!current[k]) {
            current[k] = {};
          }
          current = current[k];
        }
      });
    }
  }

  return options;
}
