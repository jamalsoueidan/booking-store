import {type NotificationData} from '@mantine/notifications';
import {type AppLoadContext} from '@remix-run/server-runtime';
import {redirect} from '@shopify/remix-oxygen';

export function setNotification(
  context: AppLoadContext,
  data: NotificationData,
) {
  context.session.set('notify', {...data, withBorder: true});
}

export async function redirectWithNotification(
  context: AppLoadContext,
  data: NotificationData & {redirectUrl: string},
) {
  context.session.set('notify', {...data, withBorder: true});

  return redirect(data.redirectUrl, {
    headers: {
      'Set-Cookie': await context.session.commit(),
    },
  });
}
