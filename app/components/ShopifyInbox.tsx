// filename: app/components/ShopifyInbox.tsx
import {Script} from '@shopify/hydrogen';

export type ShopifyInboxProps = {
  env?: 'production' | 'development';
  button?: {
    color?: string;
    style?: 'icon' | 'text';
    horizontalPosition?: 'button_left' | 'button_right';
    verticalPosition?: 'lowest' | 'higher' | 'highest';
    /* Chat Button Text */
    text?:
      | 'chat_with_us'
      | 'assistance'
      | 'contact'
      | 'help'
      | 'support'
      | 'live_chat'
      | 'message_us'
      | 'need_help'
      | 'no_text';
    icon?:
      | 'chat_bubble'
      | 'agent'
      | 'speech_bubble'
      | 'text_message'
      | 'email'
      | 'hand_wave'
      | 'lifebuoy'
      | 'paper_plane'
      | 'service_bell'
      | 'smiley_face'
      | 'question_mark'
      | 'team'
      | 'no_icon';
  };
  shop: {
    domain: string;
    id: string;
  };
  version?: 'V1';
};

export function ShopifyInbox({
  button,
  shop,
  env = 'production',
  version = 'V1',
}: ShopifyInboxProps) {
  if (!shop?.domain || !shop?.id) {
    // eslint-disable-next-line no-console
    console.error(
      'ShopifyInbox: shop domain and id are required. You can get these values from the app settings.',
    );
    return null;
  }

  const defaultButton = {
    color: 'black',
    style: 'icon',
    horizontalPosition: 'button_right',
    verticalPosition: 'lowest',
    text: 'chat_with_us',
    icon: 'chat_bubble',
  } as NonNullable<ShopifyInboxProps['button']>;

  const buttonKeyMap = {
    color: 'c',
    style: 's',
    horizontalPosition: 'p',
    verticalPosition: 'vp',
    text: 't',
    icon: 'i',
  };

  if (typeof button === 'undefined') {
    button = defaultButton;
  }

  // create the button search params based on the button object props
  const buttonParams = Object.keys(button).reduce((acc, key) => {
    const value = button?.[key as keyof typeof button];

    if (typeof value !== 'undefined') {
      const paramKey = buttonKeyMap[key as keyof typeof buttonKeyMap];
      acc[paramKey] = value;
    } else {
      const defaultValue = defaultButton?.[key as keyof typeof defaultButton];
      if (!defaultValue) return acc;
      const paramKey = buttonKeyMap[key as keyof typeof buttonKeyMap];
      acc[paramKey] = defaultValue;
    }
    return acc;
  }, {} as Record<string, string>);

  const baseUrl = `https://cdn.shopify.com/shopifycloud/shopify_chat/storefront/shopifyChat${version}.js`;
  const buttonSearch = new URLSearchParams(buttonParams).toString();

  return (
    <Script
      id="shopify-inbox"
      suppressHydrationWarning
      async={true}
      src={`${baseUrl}?v=${version}&api_env=${env}&shop_id=${shop.id}&shop=${shop.domain}&${buttonSearch}`}
    />
  );
}
