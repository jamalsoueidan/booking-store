// https://github.com/sergiodxa/remix-i18next/blob/main/src/client.ts
export function getInitialNamespaces(): string[] {
  const namespaces = Object.values(window.__remixRouteModules).flatMap(
    (route) => {
      if (typeof route?.handle !== 'object') return [];
      if (!route.handle) return [];
      if (!('i18n' in route.handle)) return [];
      if (typeof route.handle.i18n === 'string') return [route.handle.i18n];
      if (
        Array.isArray(route.handle.i18n) &&
        route.handle.i18n.every((value) => typeof value === 'string')
      ) {
        return route.handle.i18n as string[];
      }
      return [];
    },
  );

  return [...namespaces];
}
