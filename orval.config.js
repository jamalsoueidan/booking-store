module.exports = {
  api: {
    output: {
      mode: 'split',
      schemas: 'app/lib/api/model',
      client: 'axios',
      target: 'app/lib/api/',
      mock: false,
      override: {
        useDates: true,
        query: {
          useQuery: false,
          useInfinite: false,
        },
        mutator: {
          path: './app/lib/api/mutator/query-client.ts',
          name: 'queryClient',
        },
      },
    },
    input: {
      target: './openapi.yaml',
    },
  },
  zod: {
    output: {
      mode: 'split',
      client: 'zod',
      target: 'app/lib/zod/',
    },
    input: {
      target: './openapi.yaml',
    },
  },
};
