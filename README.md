<h1 align="center">Beauty Proffesional Store</h1>

<p align="center">
  <img src="https://github.com/jamalsoueidan/booking-store/blob/main/screens/artist.png?raw=true" width="600"/>
</p>

This platform is a place specially designed for beauty professionals. It functions as a digital marketplace where these professionals can sell their services to customers using a booking system and online payment options. It's important to note that it's not about beauty locations, but about beauty professionals themselves.

The main idea of this platform is to gather all beauty professionals on one website. Customers can find any beauty professional in any city, in a short period of time. They have the opportunity to see all beauty professionals, their information, Instagram, and their work, before they book any appointment.

Beauty professionals can create an account and offer their services through this platform.

## Mantine UI?

I wouldn't recommend using Tailwind for personal projects, as it can be time-consuming to create all the different components from scratch. It's often better to opt for UI libraries like Radix or Chakra. These libraries offer ready-to-use components that only require styling, and they handle accessibility concerns for you.

In my search for a UI library that includes most of the components I need, I discovered Mantine UI. It's an excellent choice, offering a range of features including a theme style, modal manager, notification system, dropdown menus, grid system, autocomplete fields, a calendar component, and even app shell for admin dashboard.

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
