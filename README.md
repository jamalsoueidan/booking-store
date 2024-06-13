<h1 align="center">Beauty Platform</h1>

<p align="center">
  <img src="https://github.com/jamalsoueidan/booking-store/blob/main/screens/artist.png?raw=true" width="600"/>
</p>

This platform is a place specially designed for beauty professionals. It functions as a digital marketplace where these professionals can sell their services to customers using a booking system and online payment options. It's important to note that it's not about beauty locations, but about beauty professionals themselves.

The main idea of this platform is to gather all beauty professionals on one website. Customers can find any beauty professional in any city, in a short period of time. They have the opportunity to see all beauty professionals, their information, Instagram, and their work, before they book any appointment.

Beauty professionals can create an account and offer their services through this platform.

## Mantine UI?

I wouldn't recommend using Tailwind for personal projects, as it can be time-consuming to create all the different components from scratch. It's often better to opt for UI libraries like Radix or Chakra. These libraries offer ready-to-use components that only require styling, and they handle accessibility concerns for you.

In my search for a UI library that includes most of the components I need, I discovered Mantine UI. It's an excellent choice, offering a range of features including a theme style, modal manager, notification system, dropdown menus, grid system, autocomplete fields, a calendar component, and even app shell for admin dashboard.

## Translations

We manage all translations in Shopify by creating a meta definition (Translation with key and value pairs) and then adding meta objects with these keys and values. The key is used in React to retrieve the corresponding translation value.

We chose this method because Shopify allows us to automatically translate our app this way.
All our product titles, and descriptions etc. can be translated!

```
const {page} = await context.storefront.query(PAGE_QUERY, {
  variables: {
    handle: params.handle,
    country: context.storefront.i18n.country, // <<
    language: context.storefront.i18n.language, // <<
  },
});
```

One particular issue we encountered with this method, as opposed to using an internal i18n package, is that tags cannot be mixed with filters when using GraphQL. In Shopify, if you request translations in a language other than the default, you cannot use tags in filters; they are only allowed in queries.

After adding the translations, we receive them in our frontend and add them to the respective pages. The pages that load the translations will provide the translation to all nested components using the TranslationProvider.

```
{
  "handle": "jamal-soueidan",
  "filters": [
    {
      "tag": "treatments" // this is not allowed <<
    },
    {
      "productMetafield": {
        "namespace": "booking",
        "key": "hide_from_profile",
        "value": "false"
      }
    }
  ],
  "country": "US",
  "language": "EN"
}
```

## Notifications

Here is how to set and display notification messages:

In an action function, call context.session.set('notify', {message, type}) to set a notification message. For example:

```js
context.session.set('notify', {
  title: 'Vagtplan',
  message: 'Vagtplan navn er opdateret!',
  color: 'green',
});
```

Remember to commit it in the response header.

```js
return redirect(`/account/schedules/${response.payload._id}`, {
  headers: {
    'Set-Cookie': await context.session.commit(),
  },
});
```

In the root.tsx we handle this notify object, we unset the notify everytime the user navigate to a new page, so the notication will only be shown once.

```js
useEffect(() => {
  if (data.notify) {
    notifications.show(data.notify);
    // for some reason some notifications are published twice!
    notifications.cleanQueue();
  }
}, [data.notify]);
```

## What's included

- [Remix](https://www.npmjs.com/package/remix)
- [Shopify Hydrogen](https://www.npmjs.com/package/@shopify/hydrogen)
- [Shopify CLI](https://www.npmjs.com/package/@shopify/cli)
- [ESLint](https://www.npmjs.com/package/eslint)
- [Prettier](https://www.npmjs.com/package/prettier)
- [GraphQL CLI](https://www.npmjs.com/package/@graphql-codegen/cli)
- [TypeScript](https://www.npmjs.com/package/typescript)
- [Mantine UI](https://www.npmjs.com/package/@mantine/core)
- [Orval](https://www.npmjs.com/package/orval)
- [Tabler Icons](https://www.npmjs.com/package/@tabler/icons)
- [Conform-To](https://github.com/edmundhung/conform)
- [Tiptap](https://github.com/ueberdosis/tiptap)
- [embla-carousel-react](https://www.npmjs.com/package/embla-carousel-react)
- [framer-motion](https://www.framer.com/motion/animation/)
