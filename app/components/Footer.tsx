import {ActionIcon, Anchor, Group, rem} from '@mantine/core';
import {NavLink} from '@remix-run/react';
import {
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandYoutube,
} from '@tabler/icons-react';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {useRootLoaderData} from '~/root';
import logo from '../../public/logo.avif';
import classes from './Footer.module.css';

export function Footer({
  menu,
  shop,
}: FooterQuery & {shop: HeaderQuery['shop']}) {
  return (
    <footer className={classes.footer}>
      <div className={classes.inner}>
        <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
          <img src={logo} alt={shop.name} width="120" />
        </NavLink>

        <FooterMenu menu={menu} primaryDomainUrl={shop.primaryDomain.url} />

        <Group gap="xs" justify="flex-end" wrap="nowrap">
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandTwitter
              style={{width: rem(18), height: rem(18)}}
              stroke={1.5}
            />
          </ActionIcon>
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandYoutube
              style={{width: rem(18), height: rem(18)}}
              stroke={1.5}
            />
          </ActionIcon>
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandInstagram
              style={{width: rem(18), height: rem(18)}}
              stroke={1.5}
            />
          </ActionIcon>
        </Group>
      </div>
    </footer>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
}) {
  const {publicStoreDomain} = useRootLoaderData();

  return (
    <nav className="footer-menu" role="navigation">
      <Group className={classes.links}>
        {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
          if (!item.url) return null;
          // if the url is internal, we strip the domain
          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
              ? new URL(item.url).pathname
              : item.url;
          const isExternal = !url.startsWith('/');
          return isExternal ? (
            <a
              href={url}
              key={item.id}
              rel="noopener noreferrer"
              target="_blank"
            >
              {item.title}
            </a>
          ) : (
            <Anchor
              component={NavLink}
              c="dimmed"
              lh={1}
              size="sm"
              end
              key={item.id}
              prefetch="intent"
              style={activeLinkStyle}
              to={url}
            >
              {item.title}
            </Anchor>
          );
        })}
      </Group>
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}
