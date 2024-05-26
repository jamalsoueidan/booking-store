/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';

export type CollectionFragment = Pick<
  StorefrontAPI.Collection,
  'id' | 'title' | 'handle' | 'description'
> & {
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
  >;
  icon?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'type' | 'value'>>;
  color?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'type' | 'value'>>;
};

export type ProductCollectionFragment = Pick<
  StorefrontAPI.Collection,
  'title' | 'handle'
> & {
  icon?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'type' | 'value'>>;
};

export type ProductSimpleFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'description' | 'handle' | 'publishedAt'
> & {
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
  >;
};

export type MoneyProductItemFragment = Pick<
  StorefrontAPI.MoneyV2,
  'amount' | 'currencyCode'
>;

export type ProductItemFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'description' | 'handle' | 'publishedAt'
> & {
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
  >;
  priceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    maxVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
  variants: {
    nodes: Array<
      Pick<StorefrontAPI.ProductVariant, 'id'> & {
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      }
    >;
  };
  collections: {
    nodes: Array<
      Pick<StorefrontAPI.Collection, 'title' | 'handle'> & {
        icon?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Metafield, 'type' | 'value'>
        >;
      }
    >;
  };
};

export type ProductVariantFragment = Pick<
  StorefrontAPI.ProductVariant,
  'availableForSale' | 'id' | 'sku' | 'title'
> & {
  compareAtPrice?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
  image?: StorefrontAPI.Maybe<
    {__typename: 'Image'} & Pick<
      StorefrontAPI.Image,
      'id' | 'url' | 'altText' | 'width' | 'height'
    >
  >;
  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
  selectedOptions: Array<Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>>;
  unitPrice?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
};

export type ProductVariantsFragment = {
  variants: {
    nodes: Array<
      Pick<
        StorefrontAPI.ProductVariant,
        'availableForSale' | 'id' | 'sku' | 'title'
      > & {
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        image?: StorefrontAPI.Maybe<
          {__typename: 'Image'} & Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
        unitPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
      }
    >;
  };
};

export type ProductFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'vendor' | 'handle' | 'descriptionHtml' | 'description'
> & {
  options: Array<Pick<StorefrontAPI.ProductOption, 'name' | 'values'>>;
  selectedVariant?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.ProductVariant,
      'availableForSale' | 'id' | 'sku' | 'title'
    > & {
      compareAtPrice?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
      image?: StorefrontAPI.Maybe<
        {__typename: 'Image'} & Pick<
          StorefrontAPI.Image,
          'id' | 'url' | 'altText' | 'width' | 'height'
        >
      >;
      price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
      selectedOptions: Array<
        Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
      >;
      unitPrice?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
    }
  >;
  variants: {
    nodes: Array<
      Pick<
        StorefrontAPI.ProductVariant,
        'availableForSale' | 'id' | 'sku' | 'title'
      > & {
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        image?: StorefrontAPI.Maybe<
          {__typename: 'Image'} & Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
        unitPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
      }
    >;
  };
  collections: {
    nodes: Array<
      Pick<StorefrontAPI.Collection, 'title' | 'handle'> & {
        icon?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Metafield, 'type' | 'value'>
        >;
      }
    >;
  };
  seo: Pick<StorefrontAPI.Seo, 'description' | 'title'>;
};

export type ProductValidateHandlerFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'vendor'
> & {
  selectedVariant?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.ProductVariant, 'id'>
  >;
};

export type PageComponentMediaImageFragment = Pick<
  StorefrontAPI.MediaImage,
  'id'
> & {
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'url' | 'width' | 'height'>
  >;
};

export type PageComponentCollectionFragment = Pick<
  StorefrontAPI.Collection,
  'id' | 'title' | 'handle'
> & {
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'height' | 'width' | 'url'>
  >;
};

export type PageComponentMetaobjectFragment = Pick<
  StorefrontAPI.Metaobject,
  'id' | 'type'
> & {
  fields: Array<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'> & {
      reference?: StorefrontAPI.Maybe<
        | (Pick<StorefrontAPI.MediaImage, 'id'> & {
            image?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'url' | 'width' | 'height'>
            >;
          })
        | (Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
            fields: Array<
              Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'> & {
                references?: StorefrontAPI.Maybe<{
                  nodes: Array<
                    Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                      fields: Array<
                        Pick<
                          StorefrontAPI.MetaobjectField,
                          'key' | 'value' | 'type'
                        >
                      >;
                    }
                  >;
                }>;
              }
            >;
          })
      >;
      references?: StorefrontAPI.Maybe<{
        nodes: Array<
          | (Pick<StorefrontAPI.Collection, 'id' | 'title' | 'handle'> & {
              image?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Image, 'height' | 'width' | 'url'>
              >;
            })
          | (Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
              fields: Array<
                Pick<
                  StorefrontAPI.MetaobjectField,
                  'key' | 'value' | 'type'
                > & {
                  reference?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                      fields: Array<
                        Pick<
                          StorefrontAPI.MetaobjectField,
                          'key' | 'value' | 'type'
                        >
                      >;
                    }
                  >;
                }
              >;
            })
        >;
      }>;
    }
  >;
};

export type PageComponentFragment = Pick<
  StorefrontAPI.Metaobject,
  'id' | 'type'
> & {
  fields: Array<
    Pick<StorefrontAPI.MetaobjectField, 'value' | 'type' | 'key'> & {
      references?: StorefrontAPI.Maybe<{
        nodes: Array<
          Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
            fields: Array<
              Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'> & {
                reference?: StorefrontAPI.Maybe<
                  | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                      image?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.Image, 'url' | 'width' | 'height'>
                      >;
                    })
                  | (Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                      fields: Array<
                        Pick<
                          StorefrontAPI.MetaobjectField,
                          'key' | 'value' | 'type'
                        > & {
                          references?: StorefrontAPI.Maybe<{
                            nodes: Array<
                              Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                                fields: Array<
                                  Pick<
                                    StorefrontAPI.MetaobjectField,
                                    'key' | 'value' | 'type'
                                  >
                                >;
                              }
                            >;
                          }>;
                        }
                      >;
                    })
                >;
                references?: StorefrontAPI.Maybe<{
                  nodes: Array<
                    | (Pick<
                        StorefrontAPI.Collection,
                        'id' | 'title' | 'handle'
                      > & {
                        image?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.Image, 'height' | 'width' | 'url'>
                        >;
                      })
                    | (Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                        fields: Array<
                          Pick<
                            StorefrontAPI.MetaobjectField,
                            'key' | 'value' | 'type'
                          > & {
                            reference?: StorefrontAPI.Maybe<
                              Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                                fields: Array<
                                  Pick<
                                    StorefrontAPI.MetaobjectField,
                                    'key' | 'value' | 'type'
                                  >
                                >;
                              }
                            >;
                          }
                        >;
                      })
                  >;
                }>;
              }
            >;
          }
        >;
      }>;
      reference?: StorefrontAPI.Maybe<
        | (Pick<StorefrontAPI.MediaImage, 'id'> & {
            image?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'url' | 'width' | 'height'>
            >;
          })
        | (Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
            fields: Array<
              Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'> & {
                reference?: StorefrontAPI.Maybe<
                  | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                      image?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.Image, 'url' | 'width' | 'height'>
                      >;
                    })
                  | (Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                      fields: Array<
                        Pick<
                          StorefrontAPI.MetaobjectField,
                          'key' | 'value' | 'type'
                        > & {
                          references?: StorefrontAPI.Maybe<{
                            nodes: Array<
                              Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                                fields: Array<
                                  Pick<
                                    StorefrontAPI.MetaobjectField,
                                    'key' | 'value' | 'type'
                                  >
                                >;
                              }
                            >;
                          }>;
                        }
                      >;
                    })
                >;
                references?: StorefrontAPI.Maybe<{
                  nodes: Array<
                    | (Pick<
                        StorefrontAPI.Collection,
                        'id' | 'title' | 'handle'
                      > & {
                        image?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.Image, 'height' | 'width' | 'url'>
                        >;
                      })
                    | (Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                        fields: Array<
                          Pick<
                            StorefrontAPI.MetaobjectField,
                            'key' | 'value' | 'type'
                          > & {
                            reference?: StorefrontAPI.Maybe<
                              Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                                fields: Array<
                                  Pick<
                                    StorefrontAPI.MetaobjectField,
                                    'key' | 'value' | 'type'
                                  >
                                >;
                              }
                            >;
                          }
                        >;
                      })
                  >;
                }>;
              }
            >;
          })
      >;
    }
  >;
};

export type PageFragment = Pick<StorefrontAPI.Page, 'id' | 'title' | 'body'> & {
  seo?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Seo, 'description' | 'title'>>;
  components?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
          fields: Array<
            Pick<StorefrontAPI.MetaobjectField, 'value' | 'type' | 'key'> & {
              references?: StorefrontAPI.Maybe<{
                nodes: Array<
                  Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                    fields: Array<
                      Pick<
                        StorefrontAPI.MetaobjectField,
                        'key' | 'value' | 'type'
                      > & {
                        reference?: StorefrontAPI.Maybe<
                          | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                              image?: StorefrontAPI.Maybe<
                                Pick<
                                  StorefrontAPI.Image,
                                  'url' | 'width' | 'height'
                                >
                              >;
                            })
                          | (Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                              fields: Array<
                                Pick<
                                  StorefrontAPI.MetaobjectField,
                                  'key' | 'value' | 'type'
                                > & {
                                  references?: StorefrontAPI.Maybe<{
                                    nodes: Array<
                                      Pick<
                                        StorefrontAPI.Metaobject,
                                        'id' | 'type'
                                      > & {
                                        fields: Array<
                                          Pick<
                                            StorefrontAPI.MetaobjectField,
                                            'key' | 'value' | 'type'
                                          >
                                        >;
                                      }
                                    >;
                                  }>;
                                }
                              >;
                            })
                        >;
                        references?: StorefrontAPI.Maybe<{
                          nodes: Array<
                            | (Pick<
                                StorefrontAPI.Collection,
                                'id' | 'title' | 'handle'
                              > & {
                                image?: StorefrontAPI.Maybe<
                                  Pick<
                                    StorefrontAPI.Image,
                                    'height' | 'width' | 'url'
                                  >
                                >;
                              })
                            | (Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                                fields: Array<
                                  Pick<
                                    StorefrontAPI.MetaobjectField,
                                    'key' | 'value' | 'type'
                                  > & {
                                    reference?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.Metaobject,
                                        'id' | 'type'
                                      > & {
                                        fields: Array<
                                          Pick<
                                            StorefrontAPI.MetaobjectField,
                                            'key' | 'value' | 'type'
                                          >
                                        >;
                                      }
                                    >;
                                  }
                                >;
                              })
                          >;
                        }>;
                      }
                    >;
                  }
                >;
              }>;
              reference?: StorefrontAPI.Maybe<
                | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                    image?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Image, 'url' | 'width' | 'height'>
                    >;
                  })
                | (Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                    fields: Array<
                      Pick<
                        StorefrontAPI.MetaobjectField,
                        'key' | 'value' | 'type'
                      > & {
                        reference?: StorefrontAPI.Maybe<
                          | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                              image?: StorefrontAPI.Maybe<
                                Pick<
                                  StorefrontAPI.Image,
                                  'url' | 'width' | 'height'
                                >
                              >;
                            })
                          | (Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                              fields: Array<
                                Pick<
                                  StorefrontAPI.MetaobjectField,
                                  'key' | 'value' | 'type'
                                > & {
                                  references?: StorefrontAPI.Maybe<{
                                    nodes: Array<
                                      Pick<
                                        StorefrontAPI.Metaobject,
                                        'id' | 'type'
                                      > & {
                                        fields: Array<
                                          Pick<
                                            StorefrontAPI.MetaobjectField,
                                            'key' | 'value' | 'type'
                                          >
                                        >;
                                      }
                                    >;
                                  }>;
                                }
                              >;
                            })
                        >;
                        references?: StorefrontAPI.Maybe<{
                          nodes: Array<
                            | (Pick<
                                StorefrontAPI.Collection,
                                'id' | 'title' | 'handle'
                              > & {
                                image?: StorefrontAPI.Maybe<
                                  Pick<
                                    StorefrontAPI.Image,
                                    'height' | 'width' | 'url'
                                  >
                                >;
                              })
                            | (Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                                fields: Array<
                                  Pick<
                                    StorefrontAPI.MetaobjectField,
                                    'key' | 'value' | 'type'
                                  > & {
                                    reference?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.Metaobject,
                                        'id' | 'type'
                                      > & {
                                        fields: Array<
                                          Pick<
                                            StorefrontAPI.MetaobjectField,
                                            'key' | 'value' | 'type'
                                          >
                                        >;
                                      }
                                    >;
                                  }
                                >;
                              })
                          >;
                        }>;
                      }
                    >;
                  })
              >;
            }
          >;
        }
      >;
    }>;
  }>;
  options?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
          fields: Array<
            Pick<StorefrontAPI.MetaobjectField, 'value' | 'type' | 'key'> & {
              references?: StorefrontAPI.Maybe<{
                nodes: Array<
                  Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                    fields: Array<
                      Pick<
                        StorefrontAPI.MetaobjectField,
                        'key' | 'value' | 'type'
                      > & {
                        reference?: StorefrontAPI.Maybe<
                          | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                              image?: StorefrontAPI.Maybe<
                                Pick<
                                  StorefrontAPI.Image,
                                  'url' | 'width' | 'height'
                                >
                              >;
                            })
                          | (Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                              fields: Array<
                                Pick<
                                  StorefrontAPI.MetaobjectField,
                                  'key' | 'value' | 'type'
                                > & {
                                  references?: StorefrontAPI.Maybe<{
                                    nodes: Array<
                                      Pick<
                                        StorefrontAPI.Metaobject,
                                        'id' | 'type'
                                      > & {
                                        fields: Array<
                                          Pick<
                                            StorefrontAPI.MetaobjectField,
                                            'key' | 'value' | 'type'
                                          >
                                        >;
                                      }
                                    >;
                                  }>;
                                }
                              >;
                            })
                        >;
                        references?: StorefrontAPI.Maybe<{
                          nodes: Array<
                            | (Pick<
                                StorefrontAPI.Collection,
                                'id' | 'title' | 'handle'
                              > & {
                                image?: StorefrontAPI.Maybe<
                                  Pick<
                                    StorefrontAPI.Image,
                                    'height' | 'width' | 'url'
                                  >
                                >;
                              })
                            | (Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                                fields: Array<
                                  Pick<
                                    StorefrontAPI.MetaobjectField,
                                    'key' | 'value' | 'type'
                                  > & {
                                    reference?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.Metaobject,
                                        'id' | 'type'
                                      > & {
                                        fields: Array<
                                          Pick<
                                            StorefrontAPI.MetaobjectField,
                                            'key' | 'value' | 'type'
                                          >
                                        >;
                                      }
                                    >;
                                  }
                                >;
                              })
                          >;
                        }>;
                      }
                    >;
                  }
                >;
              }>;
              reference?: StorefrontAPI.Maybe<
                | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                    image?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Image, 'url' | 'width' | 'height'>
                    >;
                  })
                | (Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                    fields: Array<
                      Pick<
                        StorefrontAPI.MetaobjectField,
                        'key' | 'value' | 'type'
                      > & {
                        reference?: StorefrontAPI.Maybe<
                          | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                              image?: StorefrontAPI.Maybe<
                                Pick<
                                  StorefrontAPI.Image,
                                  'url' | 'width' | 'height'
                                >
                              >;
                            })
                          | (Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                              fields: Array<
                                Pick<
                                  StorefrontAPI.MetaobjectField,
                                  'key' | 'value' | 'type'
                                > & {
                                  references?: StorefrontAPI.Maybe<{
                                    nodes: Array<
                                      Pick<
                                        StorefrontAPI.Metaobject,
                                        'id' | 'type'
                                      > & {
                                        fields: Array<
                                          Pick<
                                            StorefrontAPI.MetaobjectField,
                                            'key' | 'value' | 'type'
                                          >
                                        >;
                                      }
                                    >;
                                  }>;
                                }
                              >;
                            })
                        >;
                        references?: StorefrontAPI.Maybe<{
                          nodes: Array<
                            | (Pick<
                                StorefrontAPI.Collection,
                                'id' | 'title' | 'handle'
                              > & {
                                image?: StorefrontAPI.Maybe<
                                  Pick<
                                    StorefrontAPI.Image,
                                    'height' | 'width' | 'url'
                                  >
                                >;
                              })
                            | (Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                                fields: Array<
                                  Pick<
                                    StorefrontAPI.MetaobjectField,
                                    'key' | 'value' | 'type'
                                  > & {
                                    reference?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.Metaobject,
                                        'id' | 'type'
                                      > & {
                                        fields: Array<
                                          Pick<
                                            StorefrontAPI.MetaobjectField,
                                            'key' | 'value' | 'type'
                                          >
                                        >;
                                      }
                                    >;
                                  }
                                >;
                              })
                          >;
                        }>;
                      }
                    >;
                  })
              >;
            }
          >;
        }
      >;
    }>;
  }>;
};

export type PageQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
}>;

export type PageQuery = {
  page?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Page, 'id' | 'title' | 'body'> & {
      seo?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Seo, 'description' | 'title'>
      >;
      components?: StorefrontAPI.Maybe<{
        references?: StorefrontAPI.Maybe<{
          nodes: Array<
            Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
              fields: Array<
                Pick<
                  StorefrontAPI.MetaobjectField,
                  'value' | 'type' | 'key'
                > & {
                  references?: StorefrontAPI.Maybe<{
                    nodes: Array<
                      Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                        fields: Array<
                          Pick<
                            StorefrontAPI.MetaobjectField,
                            'key' | 'value' | 'type'
                          > & {
                            reference?: StorefrontAPI.Maybe<
                              | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                  image?: StorefrontAPI.Maybe<
                                    Pick<
                                      StorefrontAPI.Image,
                                      'url' | 'width' | 'height'
                                    >
                                  >;
                                })
                              | (Pick<
                                  StorefrontAPI.Metaobject,
                                  'id' | 'type'
                                > & {
                                  fields: Array<
                                    Pick<
                                      StorefrontAPI.MetaobjectField,
                                      'key' | 'value' | 'type'
                                    > & {
                                      references?: StorefrontAPI.Maybe<{
                                        nodes: Array<
                                          Pick<
                                            StorefrontAPI.Metaobject,
                                            'id' | 'type'
                                          > & {
                                            fields: Array<
                                              Pick<
                                                StorefrontAPI.MetaobjectField,
                                                'key' | 'value' | 'type'
                                              >
                                            >;
                                          }
                                        >;
                                      }>;
                                    }
                                  >;
                                })
                            >;
                            references?: StorefrontAPI.Maybe<{
                              nodes: Array<
                                | (Pick<
                                    StorefrontAPI.Collection,
                                    'id' | 'title' | 'handle'
                                  > & {
                                    image?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.Image,
                                        'height' | 'width' | 'url'
                                      >
                                    >;
                                  })
                                | (Pick<
                                    StorefrontAPI.Metaobject,
                                    'id' | 'type'
                                  > & {
                                    fields: Array<
                                      Pick<
                                        StorefrontAPI.MetaobjectField,
                                        'key' | 'value' | 'type'
                                      > & {
                                        reference?: StorefrontAPI.Maybe<
                                          Pick<
                                            StorefrontAPI.Metaobject,
                                            'id' | 'type'
                                          > & {
                                            fields: Array<
                                              Pick<
                                                StorefrontAPI.MetaobjectField,
                                                'key' | 'value' | 'type'
                                              >
                                            >;
                                          }
                                        >;
                                      }
                                    >;
                                  })
                              >;
                            }>;
                          }
                        >;
                      }
                    >;
                  }>;
                  reference?: StorefrontAPI.Maybe<
                    | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                        image?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.Image, 'url' | 'width' | 'height'>
                        >;
                      })
                    | (Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                        fields: Array<
                          Pick<
                            StorefrontAPI.MetaobjectField,
                            'key' | 'value' | 'type'
                          > & {
                            reference?: StorefrontAPI.Maybe<
                              | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                  image?: StorefrontAPI.Maybe<
                                    Pick<
                                      StorefrontAPI.Image,
                                      'url' | 'width' | 'height'
                                    >
                                  >;
                                })
                              | (Pick<
                                  StorefrontAPI.Metaobject,
                                  'id' | 'type'
                                > & {
                                  fields: Array<
                                    Pick<
                                      StorefrontAPI.MetaobjectField,
                                      'key' | 'value' | 'type'
                                    > & {
                                      references?: StorefrontAPI.Maybe<{
                                        nodes: Array<
                                          Pick<
                                            StorefrontAPI.Metaobject,
                                            'id' | 'type'
                                          > & {
                                            fields: Array<
                                              Pick<
                                                StorefrontAPI.MetaobjectField,
                                                'key' | 'value' | 'type'
                                              >
                                            >;
                                          }
                                        >;
                                      }>;
                                    }
                                  >;
                                })
                            >;
                            references?: StorefrontAPI.Maybe<{
                              nodes: Array<
                                | (Pick<
                                    StorefrontAPI.Collection,
                                    'id' | 'title' | 'handle'
                                  > & {
                                    image?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.Image,
                                        'height' | 'width' | 'url'
                                      >
                                    >;
                                  })
                                | (Pick<
                                    StorefrontAPI.Metaobject,
                                    'id' | 'type'
                                  > & {
                                    fields: Array<
                                      Pick<
                                        StorefrontAPI.MetaobjectField,
                                        'key' | 'value' | 'type'
                                      > & {
                                        reference?: StorefrontAPI.Maybe<
                                          Pick<
                                            StorefrontAPI.Metaobject,
                                            'id' | 'type'
                                          > & {
                                            fields: Array<
                                              Pick<
                                                StorefrontAPI.MetaobjectField,
                                                'key' | 'value' | 'type'
                                              >
                                            >;
                                          }
                                        >;
                                      }
                                    >;
                                  })
                              >;
                            }>;
                          }
                        >;
                      })
                  >;
                }
              >;
            }
          >;
        }>;
      }>;
      options?: StorefrontAPI.Maybe<{
        references?: StorefrontAPI.Maybe<{
          nodes: Array<
            Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
              fields: Array<
                Pick<
                  StorefrontAPI.MetaobjectField,
                  'value' | 'type' | 'key'
                > & {
                  references?: StorefrontAPI.Maybe<{
                    nodes: Array<
                      Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                        fields: Array<
                          Pick<
                            StorefrontAPI.MetaobjectField,
                            'key' | 'value' | 'type'
                          > & {
                            reference?: StorefrontAPI.Maybe<
                              | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                  image?: StorefrontAPI.Maybe<
                                    Pick<
                                      StorefrontAPI.Image,
                                      'url' | 'width' | 'height'
                                    >
                                  >;
                                })
                              | (Pick<
                                  StorefrontAPI.Metaobject,
                                  'id' | 'type'
                                > & {
                                  fields: Array<
                                    Pick<
                                      StorefrontAPI.MetaobjectField,
                                      'key' | 'value' | 'type'
                                    > & {
                                      references?: StorefrontAPI.Maybe<{
                                        nodes: Array<
                                          Pick<
                                            StorefrontAPI.Metaobject,
                                            'id' | 'type'
                                          > & {
                                            fields: Array<
                                              Pick<
                                                StorefrontAPI.MetaobjectField,
                                                'key' | 'value' | 'type'
                                              >
                                            >;
                                          }
                                        >;
                                      }>;
                                    }
                                  >;
                                })
                            >;
                            references?: StorefrontAPI.Maybe<{
                              nodes: Array<
                                | (Pick<
                                    StorefrontAPI.Collection,
                                    'id' | 'title' | 'handle'
                                  > & {
                                    image?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.Image,
                                        'height' | 'width' | 'url'
                                      >
                                    >;
                                  })
                                | (Pick<
                                    StorefrontAPI.Metaobject,
                                    'id' | 'type'
                                  > & {
                                    fields: Array<
                                      Pick<
                                        StorefrontAPI.MetaobjectField,
                                        'key' | 'value' | 'type'
                                      > & {
                                        reference?: StorefrontAPI.Maybe<
                                          Pick<
                                            StorefrontAPI.Metaobject,
                                            'id' | 'type'
                                          > & {
                                            fields: Array<
                                              Pick<
                                                StorefrontAPI.MetaobjectField,
                                                'key' | 'value' | 'type'
                                              >
                                            >;
                                          }
                                        >;
                                      }
                                    >;
                                  })
                              >;
                            }>;
                          }
                        >;
                      }
                    >;
                  }>;
                  reference?: StorefrontAPI.Maybe<
                    | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                        image?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.Image, 'url' | 'width' | 'height'>
                        >;
                      })
                    | (Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                        fields: Array<
                          Pick<
                            StorefrontAPI.MetaobjectField,
                            'key' | 'value' | 'type'
                          > & {
                            reference?: StorefrontAPI.Maybe<
                              | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                  image?: StorefrontAPI.Maybe<
                                    Pick<
                                      StorefrontAPI.Image,
                                      'url' | 'width' | 'height'
                                    >
                                  >;
                                })
                              | (Pick<
                                  StorefrontAPI.Metaobject,
                                  'id' | 'type'
                                > & {
                                  fields: Array<
                                    Pick<
                                      StorefrontAPI.MetaobjectField,
                                      'key' | 'value' | 'type'
                                    > & {
                                      references?: StorefrontAPI.Maybe<{
                                        nodes: Array<
                                          Pick<
                                            StorefrontAPI.Metaobject,
                                            'id' | 'type'
                                          > & {
                                            fields: Array<
                                              Pick<
                                                StorefrontAPI.MetaobjectField,
                                                'key' | 'value' | 'type'
                                              >
                                            >;
                                          }
                                        >;
                                      }>;
                                    }
                                  >;
                                })
                            >;
                            references?: StorefrontAPI.Maybe<{
                              nodes: Array<
                                | (Pick<
                                    StorefrontAPI.Collection,
                                    'id' | 'title' | 'handle'
                                  > & {
                                    image?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.Image,
                                        'height' | 'width' | 'url'
                                      >
                                    >;
                                  })
                                | (Pick<
                                    StorefrontAPI.Metaobject,
                                    'id' | 'type'
                                  > & {
                                    fields: Array<
                                      Pick<
                                        StorefrontAPI.MetaobjectField,
                                        'key' | 'value' | 'type'
                                      > & {
                                        reference?: StorefrontAPI.Maybe<
                                          Pick<
                                            StorefrontAPI.Metaobject,
                                            'id' | 'type'
                                          > & {
                                            fields: Array<
                                              Pick<
                                                StorefrontAPI.MetaobjectField,
                                                'key' | 'value' | 'type'
                                              >
                                            >;
                                          }
                                        >;
                                      }
                                    >;
                                  })
                              >;
                            }>;
                          }
                        >;
                      })
                  >;
                }
              >;
            }
          >;
        }>;
      }>;
    }
  >;
};

export type MetaobjectQueryQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
  type: StorefrontAPI.Scalars['String']['input'];
}>;

export type MetaobjectQueryQuery = {
  metaobject?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
      fields: Array<
        Pick<StorefrontAPI.MetaobjectField, 'value' | 'type' | 'key'> & {
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                fields: Array<
                  Pick<
                    StorefrontAPI.MetaobjectField,
                    'key' | 'value' | 'type'
                  > & {
                    reference?: StorefrontAPI.Maybe<
                      | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                          image?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'url' | 'width' | 'height'
                            >
                          >;
                        })
                      | (Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                          fields: Array<
                            Pick<
                              StorefrontAPI.MetaobjectField,
                              'key' | 'value' | 'type'
                            > & {
                              references?: StorefrontAPI.Maybe<{
                                nodes: Array<
                                  Pick<
                                    StorefrontAPI.Metaobject,
                                    'id' | 'type'
                                  > & {
                                    fields: Array<
                                      Pick<
                                        StorefrontAPI.MetaobjectField,
                                        'key' | 'value' | 'type'
                                      >
                                    >;
                                  }
                                >;
                              }>;
                            }
                          >;
                        })
                    >;
                    references?: StorefrontAPI.Maybe<{
                      nodes: Array<
                        | (Pick<
                            StorefrontAPI.Collection,
                            'id' | 'title' | 'handle'
                          > & {
                            image?: StorefrontAPI.Maybe<
                              Pick<
                                StorefrontAPI.Image,
                                'height' | 'width' | 'url'
                              >
                            >;
                          })
                        | (Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                            fields: Array<
                              Pick<
                                StorefrontAPI.MetaobjectField,
                                'key' | 'value' | 'type'
                              > & {
                                reference?: StorefrontAPI.Maybe<
                                  Pick<
                                    StorefrontAPI.Metaobject,
                                    'id' | 'type'
                                  > & {
                                    fields: Array<
                                      Pick<
                                        StorefrontAPI.MetaobjectField,
                                        'key' | 'value' | 'type'
                                      >
                                    >;
                                  }
                                >;
                              }
                            >;
                          })
                      >;
                    }>;
                  }
                >;
              }
            >;
          }>;
          reference?: StorefrontAPI.Maybe<
            | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                image?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Image, 'url' | 'width' | 'height'>
                >;
              })
            | (Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                fields: Array<
                  Pick<
                    StorefrontAPI.MetaobjectField,
                    'key' | 'value' | 'type'
                  > & {
                    reference?: StorefrontAPI.Maybe<
                      | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                          image?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'url' | 'width' | 'height'
                            >
                          >;
                        })
                      | (Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                          fields: Array<
                            Pick<
                              StorefrontAPI.MetaobjectField,
                              'key' | 'value' | 'type'
                            > & {
                              references?: StorefrontAPI.Maybe<{
                                nodes: Array<
                                  Pick<
                                    StorefrontAPI.Metaobject,
                                    'id' | 'type'
                                  > & {
                                    fields: Array<
                                      Pick<
                                        StorefrontAPI.MetaobjectField,
                                        'key' | 'value' | 'type'
                                      >
                                    >;
                                  }
                                >;
                              }>;
                            }
                          >;
                        })
                    >;
                    references?: StorefrontAPI.Maybe<{
                      nodes: Array<
                        | (Pick<
                            StorefrontAPI.Collection,
                            'id' | 'title' | 'handle'
                          > & {
                            image?: StorefrontAPI.Maybe<
                              Pick<
                                StorefrontAPI.Image,
                                'height' | 'width' | 'url'
                              >
                            >;
                          })
                        | (Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                            fields: Array<
                              Pick<
                                StorefrontAPI.MetaobjectField,
                                'key' | 'value' | 'type'
                              > & {
                                reference?: StorefrontAPI.Maybe<
                                  Pick<
                                    StorefrontAPI.Metaobject,
                                    'id' | 'type'
                                  > & {
                                    fields: Array<
                                      Pick<
                                        StorefrontAPI.MetaobjectField,
                                        'key' | 'value' | 'type'
                                      >
                                    >;
                                  }
                                >;
                              }
                            >;
                          })
                      >;
                    }>;
                  }
                >;
              })
          >;
        }
      >;
    }
  >;
};

export type ProductItemByIdQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  Id: StorefrontAPI.Scalars['ID']['input'];
}>;

export type ProductItemByIdQuery = {
  product?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Product,
      'id' | 'title' | 'description' | 'handle' | 'publishedAt'
    > & {
      featuredImage?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
      >;
      priceRange: {
        minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        maxVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      };
      variants: {
        nodes: Array<
          Pick<StorefrontAPI.ProductVariant, 'id'> & {
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          }
        >;
      };
      collections: {
        nodes: Array<
          Pick<StorefrontAPI.Collection, 'title' | 'handle'> & {
            icon?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'type' | 'value'>
            >;
          }
        >;
      };
    }
  >;
};

export type ProductItemQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
}>;

export type ProductItemQuery = {
  product?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Product,
      'id' | 'title' | 'description' | 'handle' | 'publishedAt'
    > & {
      featuredImage?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
      >;
      priceRange: {
        minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        maxVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      };
      variants: {
        nodes: Array<
          Pick<StorefrontAPI.ProductVariant, 'id'> & {
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          }
        >;
      };
      collections: {
        nodes: Array<
          Pick<StorefrontAPI.Collection, 'title' | 'handle'> & {
            icon?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'type' | 'value'>
            >;
          }
        >;
      };
    }
  >;
};

export type ProductVariantsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
}>;

export type ProductVariantsQuery = {
  product?: StorefrontAPI.Maybe<{
    variants: {
      nodes: Array<
        Pick<
          StorefrontAPI.ProductVariant,
          'availableForSale' | 'id' | 'sku' | 'title'
        > & {
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          image?: StorefrontAPI.Maybe<
            {__typename: 'Image'} & Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
          unitPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
        }
      >;
    };
  }>;
};

export type ProductVariantsByIdQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  handle: StorefrontAPI.Scalars['ID']['input'];
}>;

export type ProductVariantsByIdQuery = {
  product?: StorefrontAPI.Maybe<{
    variants: {
      nodes: Array<
        Pick<
          StorefrontAPI.ProductVariant,
          'availableForSale' | 'id' | 'sku' | 'title'
        > & {
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          image?: StorefrontAPI.Maybe<
            {__typename: 'Image'} & Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
          unitPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
        }
      >;
    };
  }>;
};

export type ProductIdQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  Id: StorefrontAPI.Scalars['ID']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  selectedOptions:
    | Array<StorefrontAPI.SelectedOptionInput>
    | StorefrontAPI.SelectedOptionInput;
}>;

export type ProductIdQuery = {
  product?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Product,
      'id' | 'title' | 'vendor' | 'handle' | 'descriptionHtml' | 'description'
    > & {
      options: Array<Pick<StorefrontAPI.ProductOption, 'name' | 'values'>>;
      selectedVariant?: StorefrontAPI.Maybe<
        Pick<
          StorefrontAPI.ProductVariant,
          'availableForSale' | 'id' | 'sku' | 'title'
        > & {
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          image?: StorefrontAPI.Maybe<
            {__typename: 'Image'} & Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
          unitPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
        }
      >;
      variants: {
        nodes: Array<
          Pick<
            StorefrontAPI.ProductVariant,
            'availableForSale' | 'id' | 'sku' | 'title'
          > & {
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
            image?: StorefrontAPI.Maybe<
              {__typename: 'Image'} & Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
            unitPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
          }
        >;
      };
      collections: {
        nodes: Array<
          Pick<StorefrontAPI.Collection, 'title' | 'handle'> & {
            icon?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'type' | 'value'>
            >;
          }
        >;
      };
      seo: Pick<StorefrontAPI.Seo, 'description' | 'title'>;
    }
  >;
};

export type ProductQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  productHandle: StorefrontAPI.Scalars['String']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  selectedOptions:
    | Array<StorefrontAPI.SelectedOptionInput>
    | StorefrontAPI.SelectedOptionInput;
}>;

export type ProductQuery = {
  product?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Product,
      'id' | 'title' | 'vendor' | 'handle' | 'descriptionHtml' | 'description'
    > & {
      options: Array<Pick<StorefrontAPI.ProductOption, 'name' | 'values'>>;
      selectedVariant?: StorefrontAPI.Maybe<
        Pick<
          StorefrontAPI.ProductVariant,
          'availableForSale' | 'id' | 'sku' | 'title'
        > & {
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          image?: StorefrontAPI.Maybe<
            {__typename: 'Image'} & Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
          unitPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
        }
      >;
      variants: {
        nodes: Array<
          Pick<
            StorefrontAPI.ProductVariant,
            'availableForSale' | 'id' | 'sku' | 'title'
          > & {
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
            image?: StorefrontAPI.Maybe<
              {__typename: 'Image'} & Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
            unitPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
          }
        >;
      };
      collections: {
        nodes: Array<
          Pick<StorefrontAPI.Collection, 'title' | 'handle'> & {
            icon?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'type' | 'value'>
            >;
          }
        >;
      };
      seo: Pick<StorefrontAPI.Seo, 'description' | 'title'>;
    }
  >;
};

export type ProductValidateHandlerQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  productHandle: StorefrontAPI.Scalars['String']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type ProductValidateHandlerQuery = {
  product?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Product, 'id' | 'title' | 'vendor'> & {
      selectedVariant?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.ProductVariant, 'id'>
      >;
    }
  >;
};

export type LocationFragment = Pick<
  StorefrontAPI.Metaobject,
  'id' | 'handle'
> & {fields: Array<Pick<StorefrontAPI.MetaobjectField, 'value' | 'key'>>};

export type TreatmentCollectionFragment = Pick<
  StorefrontAPI.Product,
  | 'id'
  | 'title'
  | 'descriptionHtml'
  | 'description'
  | 'productType'
  | 'handle'
  | 'vendor'
> & {
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
  >;
  variants: {
    nodes: Array<
      Pick<StorefrontAPI.ProductVariant, 'id'> & {
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      }
    >;
  };
  collection?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<{
      products: {
        filters: Array<
          Pick<StorefrontAPI.Filter, 'id' | 'label'> & {
            values: Array<Pick<StorefrontAPI.FilterValue, 'count'>>;
          }
        >;
        nodes: Array<
          Pick<
            StorefrontAPI.Product,
            | 'id'
            | 'title'
            | 'descriptionHtml'
            | 'productType'
            | 'handle'
            | 'vendor'
          > & {
            featuredImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'altText' | 'url' | 'width' | 'height'
              >
            >;
            variants: {
              nodes: Array<
                Pick<StorefrontAPI.ProductVariant, 'id'> & {
                  compareAtPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                  >;
                  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                }
              >;
            };
            user?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Metaobject, 'id'> & {
                  fields: Array<
                    Pick<StorefrontAPI.MetaobjectField, 'value' | 'key'> & {
                      reference?: StorefrontAPI.Maybe<{
                        image?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.Image, 'width' | 'height' | 'url'>
                        >;
                      }>;
                    }
                  >;
                }
              >;
            }>;
          }
        >;
      };
    }>;
  }>;
};

export type TreatmentOptionVariantFragment = Pick<
  StorefrontAPI.ProductVariant,
  'id' | 'title'
> & {
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
  >;
  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  compareAtPrice?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
  selectedOptions: Array<Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>>;
  duration?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
};

export type TreatmentOptionFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'handle' | 'description'
> & {
  options: Array<Pick<StorefrontAPI.ProductOption, 'name' | 'values'>>;
  variants: {
    nodes: Array<
      Pick<StorefrontAPI.ProductVariant, 'id' | 'title'> & {
        image?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
        duration?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      }
    >;
  };
  parentId?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  required?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
};

export type TreatmentProductFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'descriptionHtml' | 'productType' | 'handle' | 'vendor'
> & {
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
  >;
  variants: {
    nodes: Array<
      Pick<StorefrontAPI.ProductVariant, 'id'> & {
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      }
    >;
  };
  parentId?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'id' | 'value'>>;
  options?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'id' | 'value'>>;
  scheduleId?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metafield, 'id' | 'value'>
  >;
  locations?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
          fields: Array<Pick<StorefrontAPI.MetaobjectField, 'value' | 'key'>>;
        }
      >;
    }>;
  }>;
  bookingPeriodValue?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metafield, 'id' | 'value'>
  >;
  bookingPeriodUnit?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metafield, 'id' | 'value'>
  >;
  noticePeriodValue?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metafield, 'id' | 'value'>
  >;
  noticePeriodUnit?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metafield, 'id' | 'value'>
  >;
  duration?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'id' | 'value'>>;
  breaktime?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metafield, 'id' | 'value'>
  >;
};

export type TreatmentUserFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'descriptionHtml' | 'productType' | 'handle' | 'vendor'
> & {
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
  >;
  variants: {
    nodes: Array<
      Pick<StorefrontAPI.ProductVariant, 'id'> & {
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      }
    >;
  };
  user?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Metaobject, 'id'> & {
        fields: Array<
          Pick<StorefrontAPI.MetaobjectField, 'value' | 'key'> & {
            reference?: StorefrontAPI.Maybe<{
              image?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Image, 'width' | 'height' | 'url'>
              >;
            }>;
          }
        >;
      }
    >;
  }>;
};

export type UserFragment = Pick<StorefrontAPI.Metaobject, 'id'> & {
  fields: Array<
    Pick<StorefrontAPI.MetaobjectField, 'value' | 'key'> & {
      reference?: StorefrontAPI.Maybe<{
        image?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'width' | 'height' | 'url'>
        >;
      }>;
    }
  >;
};

export type UserCollectionProductsFiltersFragment = Pick<
  StorefrontAPI.Filter,
  'label'
> & {
  values: Array<Pick<StorefrontAPI.FilterValue, 'label' | 'input' | 'count'>>;
};

export type UserCollectionWithProductsFragment = Pick<
  StorefrontAPI.Collection,
  'id' | 'title'
> & {
  products: {
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        'id' | 'title' | 'descriptionHtml' | 'productType' | 'handle' | 'vendor'
      > & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'altText' | 'url' | 'width' | 'height'
          >
        >;
        variants: {
          nodes: Array<
            Pick<StorefrontAPI.ProductVariant, 'id'> & {
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            }
          >;
        };
        parentId?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Metafield, 'id' | 'value'>
        >;
        options?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Metafield, 'id' | 'value'>
        >;
        scheduleId?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Metafield, 'id' | 'value'>
        >;
        locations?: StorefrontAPI.Maybe<{
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                fields: Array<
                  Pick<StorefrontAPI.MetaobjectField, 'value' | 'key'>
                >;
              }
            >;
          }>;
        }>;
        bookingPeriodValue?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Metafield, 'id' | 'value'>
        >;
        bookingPeriodUnit?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Metafield, 'id' | 'value'>
        >;
        noticePeriodValue?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Metafield, 'id' | 'value'>
        >;
        noticePeriodUnit?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Metafield, 'id' | 'value'>
        >;
        duration?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Metafield, 'id' | 'value'>
        >;
        breaktime?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Metafield, 'id' | 'value'>
        >;
      }
    >;
    filters: Array<
      Pick<StorefrontAPI.Filter, 'label'> & {
        values: Array<
          Pick<StorefrontAPI.FilterValue, 'label' | 'input' | 'count'>
        >;
      }
    >;
  };
};

export type ArtistUserQueryVariables = StorefrontAPI.Exact<{
  username: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type ArtistUserQuery = {
  metaobject?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metaobject, 'id'> & {
      fields: Array<
        Pick<StorefrontAPI.MetaobjectField, 'value' | 'key'> & {
          reference?: StorefrontAPI.Maybe<{
            image?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'width' | 'height' | 'url'>
            >;
          }>;
        }
      >;
    }
  >;
};

export type GetUserProductsQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  filters?: StorefrontAPI.InputMaybe<
    Array<StorefrontAPI.ProductFilter> | StorefrontAPI.ProductFilter
  >;
}>;

export type GetUserProductsQuery = {
  collection?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Collection, 'id' | 'title'> & {
      products: {
        nodes: Array<
          Pick<
            StorefrontAPI.Product,
            | 'id'
            | 'title'
            | 'descriptionHtml'
            | 'productType'
            | 'handle'
            | 'vendor'
          > & {
            featuredImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'altText' | 'url' | 'width' | 'height'
              >
            >;
            variants: {
              nodes: Array<
                Pick<StorefrontAPI.ProductVariant, 'id'> & {
                  compareAtPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                  >;
                  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                }
              >;
            };
            parentId?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'id' | 'value'>
            >;
            options?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'id' | 'value'>
            >;
            scheduleId?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'id' | 'value'>
            >;
            locations?: StorefrontAPI.Maybe<{
              references?: StorefrontAPI.Maybe<{
                nodes: Array<
                  Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                    fields: Array<
                      Pick<StorefrontAPI.MetaobjectField, 'value' | 'key'>
                    >;
                  }
                >;
              }>;
            }>;
            bookingPeriodValue?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'id' | 'value'>
            >;
            bookingPeriodUnit?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'id' | 'value'>
            >;
            noticePeriodValue?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'id' | 'value'>
            >;
            noticePeriodUnit?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'id' | 'value'>
            >;
            duration?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'id' | 'value'>
            >;
            breaktime?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'id' | 'value'>
            >;
          }
        >;
        filters: Array<
          Pick<StorefrontAPI.Filter, 'label'> & {
            values: Array<
              Pick<StorefrontAPI.FilterValue, 'label' | 'input' | 'count'>
            >;
          }
        >;
      };
    }
  >;
};

export type CategoryWithChildrenFragment = Pick<
  StorefrontAPI.Collection,
  'id' | 'title' | 'handle' | 'description'
> & {
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
  >;
  children?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metafield, 'id' | 'type'> & {
      references?: StorefrontAPI.Maybe<{
        nodes: Array<
          Pick<
            StorefrontAPI.Collection,
            'id' | 'title' | 'handle' | 'description'
          > & {
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
          }
        >;
      }>;
    }
  >;
};

export type CategoriesWithChildrenQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type CategoriesWithChildrenQuery = {
  collection?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Collection,
      'id' | 'title' | 'handle' | 'description'
    > & {
      image?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
      >;
      children?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'id' | 'type'> & {
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              Pick<
                StorefrontAPI.Collection,
                'id' | 'title' | 'handle' | 'description'
              > & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'url' | 'altText' | 'width' | 'height'
                  >
                >;
              }
            >;
          }>;
        }
      >;
    }
  >;
};

export type ProductCreateVariantFragment = Pick<
  StorefrontAPI.ProductVariant,
  'id' | 'title'
> & {
  compareAtPrice?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
  selectedOptions: Array<Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>>;
};

export type ProductCreateVariantIdQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  Id: StorefrontAPI.Scalars['ID']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  selectedOptions:
    | Array<StorefrontAPI.SelectedOptionInput>
    | StorefrontAPI.SelectedOptionInput;
}>;

export type ProductCreateVariantIdQuery = {
  product?: StorefrontAPI.Maybe<{
    selectedVariant?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ProductVariant, 'id' | 'title'> & {
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
      }
    >;
  }>;
};

export type MoneyFragment = Pick<
  StorefrontAPI.MoneyV2,
  'currencyCode' | 'amount'
>;

export type CartLineFragment = Pick<
  StorefrontAPI.CartLine,
  'id' | 'quantity'
> & {
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  cost: {
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    amountPerQuantity: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  merchandise: Pick<
    StorefrontAPI.ProductVariant,
    'id' | 'availableForSale' | 'requiresShipping' | 'title'
  > & {
    compareAtPrice?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
    >;
    product: Pick<StorefrontAPI.Product, 'handle' | 'title' | 'id' | 'vendor'>;
    selectedOptions: Array<
      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
    >;
  };
};

export type CartApiQueryFragment = Pick<
  StorefrontAPI.Cart,
  'updatedAt' | 'id' | 'checkoutUrl' | 'totalQuantity' | 'note'
> & {
  buyerIdentity: Pick<
    StorefrontAPI.CartBuyerIdentity,
    'countryCode' | 'email' | 'phone'
  > & {
    customer?: StorefrontAPI.Maybe<
      Pick<
        StorefrontAPI.Customer,
        'id' | 'email' | 'firstName' | 'lastName' | 'displayName'
      >
    >;
  };
  lines: {
    nodes: Array<
      Pick<StorefrontAPI.CartLine, 'id' | 'quantity'> & {
        attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
        cost: {
          totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
          amountPerQuantity: Pick<
            StorefrontAPI.MoneyV2,
            'currencyCode' | 'amount'
          >;
          compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
          >;
        };
        merchandise: Pick<
          StorefrontAPI.ProductVariant,
          'id' | 'availableForSale' | 'requiresShipping' | 'title'
        > & {
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          product: Pick<
            StorefrontAPI.Product,
            'handle' | 'title' | 'id' | 'vendor'
          >;
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
        };
      }
    >;
  };
  cost: {
    subtotalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    totalDutyAmount?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    totalTaxAmount?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  discountCodes: Array<
    Pick<StorefrontAPI.CartDiscountCode, 'code' | 'applicable'>
  >;
};

export type MenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
>;

export type ChildMenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
>;

export type ParentMenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
> & {
  items: Array<
    Pick<
      StorefrontAPI.MenuItem,
      'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
    >
  >;
};

export type MenuFragment = Pick<StorefrontAPI.Menu, 'id'> & {
  items: Array<
    Pick<
      StorefrontAPI.MenuItem,
      'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
    > & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        >
      >;
    }
  >;
};

export type ShopFragment = Pick<
  StorefrontAPI.Shop,
  'id' | 'name' | 'description'
> & {
  primaryDomain: Pick<StorefrontAPI.Domain, 'url'>;
  brand?: StorefrontAPI.Maybe<{
    logo?: StorefrontAPI.Maybe<{
      image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
    }>;
  }>;
};

export type HeaderQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  headerMenuHandle: StorefrontAPI.Scalars['String']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type HeaderQuery = {
  shop: Pick<StorefrontAPI.Shop, 'id' | 'name' | 'description'> & {
    primaryDomain: Pick<StorefrontAPI.Domain, 'url'>;
    brand?: StorefrontAPI.Maybe<{
      logo?: StorefrontAPI.Maybe<{
        image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
      }>;
    }>;
  };
  menu?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            >
          >;
        }
      >;
    }
  >;
};

export type FooterQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  footerMenuHandle: StorefrontAPI.Scalars['String']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type FooterQuery = {
  menu?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            >
          >;
        }
      >;
    }
  >;
};

export type StoreRobotsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type StoreRobotsQuery = {shop: Pick<StorefrontAPI.Shop, 'id'>};

export type SitemapQueryVariables = StorefrontAPI.Exact<{
  urlLimits?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type SitemapQuery = {
  products: {
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        'updatedAt' | 'handle' | 'onlineStoreUrl' | 'title'
      > & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText'>
        >;
      }
    >;
  };
  collections: {
    nodes: Array<
      Pick<StorefrontAPI.Collection, 'updatedAt' | 'handle' | 'onlineStoreUrl'>
    >;
  };
  pages: {
    nodes: Array<
      Pick<StorefrontAPI.Page, 'updatedAt' | 'handle' | 'onlineStoreUrl'>
    >;
  };
};

export type RecommendedTreatmentsQueryVariables = StorefrontAPI.Exact<{
  query: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type RecommendedTreatmentsQuery = {
  products: {
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        | 'id'
        | 'title'
        | 'descriptionHtml'
        | 'description'
        | 'productType'
        | 'handle'
        | 'vendor'
      > & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'altText' | 'url' | 'width' | 'height'
          >
        >;
        variants: {
          nodes: Array<
            Pick<StorefrontAPI.ProductVariant, 'id'> & {
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            }
          >;
        };
        collection?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<{
            products: {
              filters: Array<
                Pick<StorefrontAPI.Filter, 'id' | 'label'> & {
                  values: Array<Pick<StorefrontAPI.FilterValue, 'count'>>;
                }
              >;
              nodes: Array<
                Pick<
                  StorefrontAPI.Product,
                  | 'id'
                  | 'title'
                  | 'descriptionHtml'
                  | 'productType'
                  | 'handle'
                  | 'vendor'
                > & {
                  featuredImage?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'altText' | 'url' | 'width' | 'height'
                    >
                  >;
                  variants: {
                    nodes: Array<
                      Pick<StorefrontAPI.ProductVariant, 'id'> & {
                        compareAtPrice?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                        >;
                        price: Pick<
                          StorefrontAPI.MoneyV2,
                          'amount' | 'currencyCode'
                        >;
                      }
                    >;
                  };
                  user?: StorefrontAPI.Maybe<{
                    reference?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Metaobject, 'id'> & {
                        fields: Array<
                          Pick<
                            StorefrontAPI.MetaobjectField,
                            'value' | 'key'
                          > & {
                            reference?: StorefrontAPI.Maybe<{
                              image?: StorefrontAPI.Maybe<
                                Pick<
                                  StorefrontAPI.Image,
                                  'width' | 'height' | 'url'
                                >
                              >;
                            }>;
                          }
                        >;
                      }
                    >;
                  }>;
                }
              >;
            };
          }>;
        }>;
      }
    >;
  };
};

export type FrontUsersQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type FrontUsersQuery = {
  metaobjects: {
    nodes: Array<
      Pick<StorefrontAPI.Metaobject, 'id'> & {
        fields: Array<
          Pick<StorefrontAPI.MetaobjectField, 'value' | 'key'> & {
            reference?: StorefrontAPI.Maybe<{
              image?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Image, 'width' | 'height' | 'url'>
              >;
            }>;
          }
        >;
      }
    >;
  };
};

export type ProductSearchSimpleFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'handle'
>;

export type ProductSearchQueryQueryVariables = StorefrontAPI.Exact<{
  collectionId: StorefrontAPI.Scalars['ID']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
}>;

export type ProductSearchQueryQuery = {
  collection?: StorefrontAPI.Maybe<{
    products: {
      nodes: Array<Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle'>>;
    };
  }>;
};

export type ProductVariantIdsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  variantId:
    | Array<StorefrontAPI.Scalars['ID']['input']>
    | StorefrontAPI.Scalars['ID']['input'];
}>;

export type ProductVariantIdsQuery = {
  nodes: Array<
    StorefrontAPI.Maybe<
      Pick<
        StorefrontAPI.ProductVariant,
        'availableForSale' | 'id' | 'sku' | 'title'
      > & {
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        image?: StorefrontAPI.Maybe<
          {__typename: 'Image'} & Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
        unitPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
      }
    >
  >;
};

export type ServicesOptionsTagProductFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'handle' | 'title'
> & {
  options: Array<Pick<StorefrontAPI.ProductOption, 'name' | 'values'>>;
  variants: {
    nodes: Array<
      Pick<StorefrontAPI.ProductVariant, 'id' | 'title'> & {
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      }
    >;
  };
};

export type ServicesOptionsTagOptionsQueryQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  query: StorefrontAPI.Scalars['String']['input'];
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
}>;

export type ServicesOptionsTagOptionsQueryQuery = {
  products: {
    nodes: Array<
      Pick<StorefrontAPI.Product, 'id' | 'handle' | 'title'> & {
        options: Array<Pick<StorefrontAPI.ProductOption, 'name' | 'values'>>;
        variants: {
          nodes: Array<
            Pick<StorefrontAPI.ProductVariant, 'id' | 'title'> & {
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            }
          >;
        };
      }
    >;
  };
};

export type CategoryStorefrontFragment = Pick<
  StorefrontAPI.Collection,
  'id' | 'title'
> & {
  children?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<StorefrontAPI.Collection, 'id' | 'title'> & {
          products: {
            nodes: Array<
              Pick<StorefrontAPI.Product, 'id' | 'title' | 'descriptionHtml'>
            >;
          };
        }
      >;
    }>;
  }>;
};

export type CategoriesStorefrontQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type CategoriesStorefrontQuery = {
  collection?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Collection, 'id' | 'title'> & {
      children?: StorefrontAPI.Maybe<{
        references?: StorefrontAPI.Maybe<{
          nodes: Array<
            Pick<StorefrontAPI.Collection, 'id' | 'title'> & {
              products: {
                nodes: Array<
                  Pick<
                    StorefrontAPI.Product,
                    'id' | 'title' | 'descriptionHtml'
                  >
                >;
              };
            }
          >;
        }>;
      }>;
    }
  >;
};

export type PredictiveArticleFragment = {__typename: 'Article'} & Pick<
  StorefrontAPI.Article,
  'id' | 'title' | 'handle' | 'trackingParameters'
> & {
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
    >;
  };

export type PredictiveCollectionFragment = {__typename: 'Collection'} & Pick<
  StorefrontAPI.Collection,
  'id' | 'title' | 'handle' | 'trackingParameters'
> & {
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
    >;
  };

export type PredictivePageFragment = {__typename: 'Page'} & Pick<
  StorefrontAPI.Page,
  'id' | 'title' | 'handle' | 'trackingParameters'
>;

export type PredictiveProductFragment = {__typename: 'Product'} & Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'handle' | 'trackingParameters'
> & {
    variants: {
      nodes: Array<
        Pick<StorefrontAPI.ProductVariant, 'id'> & {
          image?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        }
      >;
    };
  };

export type PredictiveQueryFragment = {
  __typename: 'SearchQuerySuggestion';
} & Pick<
  StorefrontAPI.SearchQuerySuggestion,
  'text' | 'styledText' | 'trackingParameters'
>;

export type PredictiveSearchQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  limit: StorefrontAPI.Scalars['Int']['input'];
  limitScope: StorefrontAPI.PredictiveSearchLimitScope;
  searchTerm: StorefrontAPI.Scalars['String']['input'];
  types?: StorefrontAPI.InputMaybe<
    | Array<StorefrontAPI.PredictiveSearchType>
    | StorefrontAPI.PredictiveSearchType
  >;
}>;

export type PredictiveSearchQuery = {
  predictiveSearch?: StorefrontAPI.Maybe<{
    articles: Array<
      {__typename: 'Article'} & Pick<
        StorefrontAPI.Article,
        'id' | 'title' | 'handle' | 'trackingParameters'
      > & {
          image?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
          >;
        }
    >;
    collections: Array<
      {__typename: 'Collection'} & Pick<
        StorefrontAPI.Collection,
        'id' | 'title' | 'handle' | 'trackingParameters'
      > & {
          image?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
          >;
        }
    >;
    pages: Array<
      {__typename: 'Page'} & Pick<
        StorefrontAPI.Page,
        'id' | 'title' | 'handle' | 'trackingParameters'
      >
    >;
    products: Array<
      {__typename: 'Product'} & Pick<
        StorefrontAPI.Product,
        'id' | 'title' | 'handle' | 'trackingParameters'
      > & {
          variants: {
            nodes: Array<
              Pick<StorefrontAPI.ProductVariant, 'id'> & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'url' | 'altText' | 'width' | 'height'
                  >
                >;
                price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              }
            >;
          };
        }
    >;
    queries: Array<
      {__typename: 'SearchQuerySuggestion'} & Pick<
        StorefrontAPI.SearchQuerySuggestion,
        'text' | 'styledText' | 'trackingParameters'
      >
    >;
  }>;
};

export type CartProductsFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'description'
> & {
  variants: {
    nodes: Array<
      Pick<StorefrontAPI.ProductVariant, 'id' | 'title'> & {
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        duration?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Metafield, 'id' | 'value'>
        >;
      }
    >;
  };
  type?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  required?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  duration?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'id' | 'value'>>;
};

export type GetTreatmentProductsInCartQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  query?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['String']['input']>;
}>;

export type GetTreatmentProductsInCartQuery = {
  products: {
    nodes: Array<
      Pick<StorefrontAPI.Product, 'id' | 'title' | 'description'> & {
        variants: {
          nodes: Array<
            Pick<StorefrontAPI.ProductVariant, 'id' | 'title'> & {
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              duration?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Metafield, 'id' | 'value'>
              >;
            }
          >;
        };
        type?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        required?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        duration?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Metafield, 'id' | 'value'>
        >;
      }
    >;
  };
};

export type GetProductScheduleIdQueryVariables = StorefrontAPI.Exact<{
  productHandle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type GetProductScheduleIdQuery = {
  product?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Product, 'id'> & {
      scheduleId?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Metaobject, 'handle'>
        >;
      }>;
    }
  >;
};

export type PickMoreTreatmentProductFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'descriptionHtml' | 'productType' | 'handle'
> & {
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
  >;
  variants: {
    nodes: Array<{
      compareAtPrice?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
      price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    }>;
  };
  options?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metafield, 'value'> & {
      references?: StorefrontAPI.Maybe<{
        nodes: Array<
          Pick<
            StorefrontAPI.Product,
            'id' | 'title' | 'handle' | 'description'
          > & {
            options: Array<
              Pick<StorefrontAPI.ProductOption, 'name' | 'values'>
            >;
            variants: {
              nodes: Array<
                Pick<StorefrontAPI.ProductVariant, 'id' | 'title'> & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                  compareAtPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                  >;
                  selectedOptions: Array<
                    Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                  >;
                  duration?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.Metafield, 'value'>
                  >;
                }
              >;
            };
            parentId?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'value'>
            >;
            required?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'value'>
            >;
          }
        >;
      }>;
    }
  >;
  duration?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'id' | 'value'>>;
};

export type PickMoreProductsQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  filters?: StorefrontAPI.InputMaybe<
    Array<StorefrontAPI.ProductFilter> | StorefrontAPI.ProductFilter
  >;
}>;

export type PickMoreProductsQuery = {
  collection?: StorefrontAPI.Maybe<{
    products: {
      nodes: Array<
        Pick<
          StorefrontAPI.Product,
          'id' | 'title' | 'descriptionHtml' | 'productType' | 'handle'
        > & {
          featuredImage?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'altText' | 'url' | 'width' | 'height'
            >
          >;
          variants: {
            nodes: Array<{
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            }>;
          };
          options?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metafield, 'value'> & {
              references?: StorefrontAPI.Maybe<{
                nodes: Array<
                  Pick<
                    StorefrontAPI.Product,
                    'id' | 'title' | 'handle' | 'description'
                  > & {
                    options: Array<
                      Pick<StorefrontAPI.ProductOption, 'name' | 'values'>
                    >;
                    variants: {
                      nodes: Array<
                        Pick<StorefrontAPI.ProductVariant, 'id' | 'title'> & {
                          image?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'id' | 'url' | 'altText' | 'width' | 'height'
                            >
                          >;
                          price: Pick<
                            StorefrontAPI.MoneyV2,
                            'amount' | 'currencyCode'
                          >;
                          compareAtPrice?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.MoneyV2,
                              'amount' | 'currencyCode'
                            >
                          >;
                          selectedOptions: Array<
                            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                          >;
                          duration?: StorefrontAPI.Maybe<
                            Pick<StorefrontAPI.Metafield, 'value'>
                          >;
                        }
                      >;
                    };
                    parentId?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Metafield, 'value'>
                    >;
                    required?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Metafield, 'value'>
                    >;
                  }
                >;
              }>;
            }
          >;
          duration?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metafield, 'id' | 'value'>
          >;
        }
      >;
    };
  }>;
};

export type TreatmentProductWithOptionsFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'description' | 'descriptionHtml' | 'productType' | 'handle'
> & {
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
  >;
  variants: {
    nodes: Array<{
      compareAtPrice?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
      price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    }>;
  };
  parentId?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'id' | 'value'>>;
  options?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<
          StorefrontAPI.Product,
          'id' | 'title' | 'handle' | 'description'
        > & {
          options: Array<Pick<StorefrontAPI.ProductOption, 'name' | 'values'>>;
          variants: {
            nodes: Array<
              Pick<StorefrontAPI.ProductVariant, 'id' | 'title'> & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'url' | 'altText' | 'width' | 'height'
                  >
                >;
                price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                compareAtPrice?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                >;
                selectedOptions: Array<
                  Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                >;
                duration?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Metafield, 'value'>
                >;
              }
            >;
          };
          parentId?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metafield, 'value'>
          >;
          required?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metafield, 'value'>
          >;
        }
      >;
    }>;
  }>;
  scheduleId?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metafield, 'id' | 'value'>
  >;
  locations?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
          fields: Array<Pick<StorefrontAPI.MetaobjectField, 'value' | 'key'>>;
        }
      >;
    }>;
  }>;
  duration?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'id' | 'value'>>;
};

export type ArtistOptionsQueryVariables = StorefrontAPI.Exact<{
  productHandle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type ArtistOptionsQuery = {
  product?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Product,
      | 'id'
      | 'title'
      | 'description'
      | 'descriptionHtml'
      | 'productType'
      | 'handle'
    > & {
      featuredImage?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
      >;
      variants: {
        nodes: Array<{
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        }>;
      };
      parentId?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'id' | 'value'>
      >;
      options?: StorefrontAPI.Maybe<{
        references?: StorefrontAPI.Maybe<{
          nodes: Array<
            Pick<
              StorefrontAPI.Product,
              'id' | 'title' | 'handle' | 'description'
            > & {
              options: Array<
                Pick<StorefrontAPI.ProductOption, 'name' | 'values'>
              >;
              variants: {
                nodes: Array<
                  Pick<StorefrontAPI.ProductVariant, 'id' | 'title'> & {
                    image?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'id' | 'url' | 'altText' | 'width' | 'height'
                      >
                    >;
                    price: Pick<
                      StorefrontAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >;
                    compareAtPrice?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                    >;
                    selectedOptions: Array<
                      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                    >;
                    duration?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Metafield, 'value'>
                    >;
                  }
                >;
              };
              parentId?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Metafield, 'value'>
              >;
              required?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Metafield, 'value'>
              >;
            }
          >;
        }>;
      }>;
      scheduleId?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'id' | 'value'>
      >;
      locations?: StorefrontAPI.Maybe<{
        references?: StorefrontAPI.Maybe<{
          nodes: Array<
            Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
              fields: Array<
                Pick<StorefrontAPI.MetaobjectField, 'value' | 'key'>
              >;
            }
          >;
        }>;
      }>;
      duration?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'id' | 'value'>
      >;
    }
  >;
};

export type ArticleQueryVariables = StorefrontAPI.Exact<{
  articleHandle: StorefrontAPI.Scalars['String']['input'];
  blogHandle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type ArticleQuery = {
  blog?: StorefrontAPI.Maybe<{
    articleByHandle?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Article, 'title' | 'contentHtml' | 'publishedAt'> & {
        author?: StorefrontAPI.Maybe<Pick<StorefrontAPI.ArticleAuthor, 'name'>>;
        image?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'altText' | 'url' | 'width' | 'height'
          >
        >;
        seo?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Seo, 'description' | 'title'>
        >;
      }
    >;
  }>;
};

export type BlogQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  blogHandle: StorefrontAPI.Scalars['String']['input'];
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type BlogQuery = {
  blog?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Blog, 'title'> & {
      seo?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Seo, 'title' | 'description'>
      >;
      articles: {
        nodes: Array<
          Pick<
            StorefrontAPI.Article,
            'contentHtml' | 'handle' | 'id' | 'publishedAt' | 'title'
          > & {
            author?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.ArticleAuthor, 'name'>
            >;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'altText' | 'url' | 'width' | 'height'
              >
            >;
            blog: Pick<StorefrontAPI.Blog, 'handle'>;
          }
        >;
        pageInfo: Pick<
          StorefrontAPI.PageInfo,
          'hasPreviousPage' | 'hasNextPage' | 'endCursor' | 'startCursor'
        >;
      };
    }
  >;
};

export type ArticleItemFragment = Pick<
  StorefrontAPI.Article,
  'contentHtml' | 'handle' | 'id' | 'publishedAt' | 'title'
> & {
  author?: StorefrontAPI.Maybe<Pick<StorefrontAPI.ArticleAuthor, 'name'>>;
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
  >;
  blog: Pick<StorefrontAPI.Blog, 'handle'>;
};

export type BlogsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type BlogsQuery = {
  blogs: {
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'
    >;
    nodes: Array<
      Pick<StorefrontAPI.Blog, 'title' | 'handle'> & {
        seo?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Seo, 'title' | 'description'>
        >;
      }
    >;
  };
};

export type CategoriesCollectionProductUserFragment = Pick<
  StorefrontAPI.Metaobject,
  'id'
> & {
  image?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<{
      image?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'width' | 'height' | 'url'>
      >;
    }>;
  }>;
};

export type CategoriesCollectionProductFragment = Pick<
  StorefrontAPI.Product,
  'id'
> & {
  user?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Metaobject, 'id'> & {
        image?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<{
            image?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'width' | 'height' | 'url'>
            >;
          }>;
        }>;
      }
    >;
  }>;
};

export type CategoriesCollectionFilterFragment = Pick<
  StorefrontAPI.Filter,
  'id' | 'label'
> & {values: Array<Pick<StorefrontAPI.FilterValue, 'count'>>};

export type CategoriesCollectionFragment = Pick<
  StorefrontAPI.Product,
  | 'id'
  | 'title'
  | 'descriptionHtml'
  | 'description'
  | 'productType'
  | 'handle'
  | 'vendor'
> & {
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
  >;
  collection?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<{
      products: {
        filters: Array<
          Pick<StorefrontAPI.Filter, 'id' | 'label'> & {
            values: Array<Pick<StorefrontAPI.FilterValue, 'count'>>;
          }
        >;
        nodes: Array<
          Pick<StorefrontAPI.Product, 'id'> & {
            user?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Metaobject, 'id'> & {
                  image?: StorefrontAPI.Maybe<{
                    reference?: StorefrontAPI.Maybe<{
                      image?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.Image, 'width' | 'height' | 'url'>
                      >;
                    }>;
                  }>;
                }
              >;
            }>;
          }
        >;
      };
    }>;
  }>;
};

export type CategoriesCollectionQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type CategoriesCollectionQuery = {
  collection?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Collection,
      'id' | 'handle' | 'title' | 'description'
    > & {
      products: {
        nodes: Array<
          Pick<
            StorefrontAPI.Product,
            | 'id'
            | 'title'
            | 'descriptionHtml'
            | 'description'
            | 'productType'
            | 'handle'
            | 'vendor'
          > & {
            featuredImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'altText' | 'url' | 'width' | 'height'
              >
            >;
            collection?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<{
                products: {
                  filters: Array<
                    Pick<StorefrontAPI.Filter, 'id' | 'label'> & {
                      values: Array<Pick<StorefrontAPI.FilterValue, 'count'>>;
                    }
                  >;
                  nodes: Array<
                    Pick<StorefrontAPI.Product, 'id'> & {
                      user?: StorefrontAPI.Maybe<{
                        reference?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.Metaobject, 'id'> & {
                            image?: StorefrontAPI.Maybe<{
                              reference?: StorefrontAPI.Maybe<{
                                image?: StorefrontAPI.Maybe<
                                  Pick<
                                    StorefrontAPI.Image,
                                    'width' | 'height' | 'url'
                                  >
                                >;
                              }>;
                            }>;
                          }
                        >;
                      }>;
                    }
                  >;
                };
              }>;
            }>;
          }
        >;
        pageInfo: Pick<
          StorefrontAPI.PageInfo,
          'hasPreviousPage' | 'hasNextPage' | 'endCursor' | 'startCursor'
        >;
      };
    }
  >;
};

export type CollectionQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type CollectionQuery = {
  collection?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Collection,
      'id' | 'handle' | 'title' | 'description'
    > & {
      products: {
        nodes: Array<
          Pick<
            StorefrontAPI.Product,
            'id' | 'title' | 'description' | 'handle' | 'publishedAt'
          > & {
            featuredImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'altText' | 'url' | 'width' | 'height'
              >
            >;
            priceRange: {
              minVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
              maxVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            };
            variants: {
              nodes: Array<
                Pick<StorefrontAPI.ProductVariant, 'id'> & {
                  selectedOptions: Array<
                    Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                  >;
                  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                }
              >;
            };
            collections: {
              nodes: Array<
                Pick<StorefrontAPI.Collection, 'title' | 'handle'> & {
                  icon?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.Metafield, 'type' | 'value'>
                  >;
                }
              >;
            };
          }
        >;
        pageInfo: Pick<
          StorefrontAPI.PageInfo,
          'hasPreviousPage' | 'hasNextPage' | 'endCursor' | 'startCursor'
        >;
      };
    }
  >;
};

export type StoreCollectionsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type StoreCollectionsQuery = {
  collections: {
    nodes: Array<
      Pick<
        StorefrontAPI.Collection,
        'id' | 'title' | 'handle' | 'description'
      > & {
        image?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        icon?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Metafield, 'type' | 'value'>
        >;
        color?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Metafield, 'type' | 'value'>
        >;
      }
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'
    >;
  };
};

export type PolicyFragment = Pick<
  StorefrontAPI.ShopPolicy,
  'body' | 'handle' | 'id' | 'title' | 'url'
>;

export type PolicyQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  privacyPolicy: StorefrontAPI.Scalars['Boolean']['input'];
  refundPolicy: StorefrontAPI.Scalars['Boolean']['input'];
  shippingPolicy: StorefrontAPI.Scalars['Boolean']['input'];
  termsOfService: StorefrontAPI.Scalars['Boolean']['input'];
}>;

export type PolicyQuery = {
  shop: {
    privacyPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    shippingPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    termsOfService?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    refundPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
  };
};

export type PolicyItemFragment = Pick<
  StorefrontAPI.ShopPolicy,
  'id' | 'title' | 'handle'
>;

export type PoliciesQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type PoliciesQuery = {
  shop: {
    privacyPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    shippingPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    termsOfService?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    refundPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    subscriptionPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicyWithDefault, 'id' | 'title' | 'handle'>
    >;
  };
};

export type SearchProductFragment = {__typename: 'Product'} & Pick<
  StorefrontAPI.Product,
  'handle' | 'id' | 'publishedAt' | 'title' | 'trackingParameters' | 'vendor'
> & {
    variants: {
      nodes: Array<
        Pick<StorefrontAPI.ProductVariant, 'id'> & {
          image?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
          product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
        }
      >;
    };
  };

export type SearchPageFragment = {__typename: 'Page'} & Pick<
  StorefrontAPI.Page,
  'handle' | 'id' | 'title' | 'trackingParameters'
>;

export type SearchArticleFragment = {__typename: 'Article'} & Pick<
  StorefrontAPI.Article,
  'handle' | 'id' | 'title' | 'trackingParameters'
>;

export type SearchQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  query: StorefrontAPI.Scalars['String']['input'];
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type SearchQuery = {
  products: {
    nodes: Array<
      {__typename: 'Product'} & Pick<
        StorefrontAPI.Product,
        | 'handle'
        | 'id'
        | 'publishedAt'
        | 'title'
        | 'trackingParameters'
        | 'vendor'
      > & {
          variants: {
            nodes: Array<
              Pick<StorefrontAPI.ProductVariant, 'id'> & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'url' | 'altText' | 'width' | 'height'
                  >
                >;
                price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                compareAtPrice?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                >;
                selectedOptions: Array<
                  Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                >;
                product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
              }
            >;
          };
        }
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'
    >;
  };
  pages: {
    nodes: Array<
      {__typename: 'Page'} & Pick<
        StorefrontAPI.Page,
        'handle' | 'id' | 'title' | 'trackingParameters'
      >
    >;
  };
  articles: {
    nodes: Array<
      {__typename: 'Article'} & Pick<
        StorefrontAPI.Article,
        'handle' | 'id' | 'title' | 'trackingParameters'
      >
    >;
  };
};

export type TreatmentWithCollectionHandlerFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'description' | 'productType' | 'handle' | 'vendor'
> & {
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
  >;
  variants: {
    nodes: Array<
      Pick<StorefrontAPI.ProductVariant, 'id'> & {
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      }
    >;
  };
  collection?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Collection, 'handle'>>;
  }>;
};

export type UserCollectionFragment = Pick<StorefrontAPI.Metaobject, 'id'> & {
  aboutMe?: StorefrontAPI.Maybe<Pick<StorefrontAPI.MetaobjectField, 'value'>>;
  active?: StorefrontAPI.Maybe<Pick<StorefrontAPI.MetaobjectField, 'value'>>;
  fullname?: StorefrontAPI.Maybe<Pick<StorefrontAPI.MetaobjectField, 'value'>>;
  professions?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'value'>
  >;
  shortDescription?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MetaobjectField, 'value'>
  >;
  username?: StorefrontAPI.Maybe<Pick<StorefrontAPI.MetaobjectField, 'value'>>;
  theme?: StorefrontAPI.Maybe<Pick<StorefrontAPI.MetaobjectField, 'value'>>;
  image?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<{
      image?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'width' | 'height' | 'url'>
      >;
    }>;
  }>;
  collection?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Collection, 'id'> & {
        products: {
          nodes: Array<
            Pick<
              StorefrontAPI.Product,
              | 'id'
              | 'title'
              | 'description'
              | 'handle'
              | 'vendor'
              | 'productType'
            > & {
              variants: {
                nodes: Array<
                  Pick<StorefrontAPI.ProductVariant, 'id'> & {
                    compareAtPrice?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                    >;
                    price: Pick<
                      StorefrontAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >;
                  }
                >;
              };
              duration?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Metafield, 'id' | 'value'>
              >;
              locations?: StorefrontAPI.Maybe<{
                references?: StorefrontAPI.Maybe<{
                  nodes: Array<
                    Pick<StorefrontAPI.Metaobject, 'id'> & {
                      locationType?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.MetaobjectField, 'value'>
                      >;
                      originType?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.MetaobjectField, 'value'>
                      >;
                    }
                  >;
                }>;
              }>;
            }
          >;
        };
      }
    >;
  }>;
};

export type TreatmentsForCollectionFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'description' | 'handle' | 'vendor' | 'productType'
> & {
  variants: {
    nodes: Array<
      Pick<StorefrontAPI.ProductVariant, 'id'> & {
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      }
    >;
  };
  locations?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<StorefrontAPI.Metaobject, 'id'> & {
          locationType?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MetaobjectField, 'value'>
          >;
          originType?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MetaobjectField, 'value'>
          >;
        }
      >;
    }>;
  }>;
  duration?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'id' | 'value'>>;
  user?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Metaobject, 'id'> & {
        aboutMe?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'value'>
        >;
        active?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'value'>
        >;
        fullname?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'value'>
        >;
        professions?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'value'>
        >;
        shortDescription?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'value'>
        >;
        username?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'value'>
        >;
        theme?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'value'>
        >;
        image?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<{
            image?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'width' | 'height' | 'url'>
            >;
          }>;
        }>;
        collection?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Collection, 'id'> & {
              products: {
                nodes: Array<
                  Pick<
                    StorefrontAPI.Product,
                    | 'id'
                    | 'title'
                    | 'description'
                    | 'handle'
                    | 'vendor'
                    | 'productType'
                  > & {
                    variants: {
                      nodes: Array<
                        Pick<StorefrontAPI.ProductVariant, 'id'> & {
                          compareAtPrice?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.MoneyV2,
                              'amount' | 'currencyCode'
                            >
                          >;
                          price: Pick<
                            StorefrontAPI.MoneyV2,
                            'amount' | 'currencyCode'
                          >;
                        }
                      >;
                    };
                    duration?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Metafield, 'id' | 'value'>
                    >;
                    locations?: StorefrontAPI.Maybe<{
                      references?: StorefrontAPI.Maybe<{
                        nodes: Array<
                          Pick<StorefrontAPI.Metaobject, 'id'> & {
                            locationType?: StorefrontAPI.Maybe<
                              Pick<StorefrontAPI.MetaobjectField, 'value'>
                            >;
                            originType?: StorefrontAPI.Maybe<
                              Pick<StorefrontAPI.MetaobjectField, 'value'>
                            >;
                          }
                        >;
                      }>;
                    }>;
                  }
                >;
              };
            }
          >;
        }>;
      }
    >;
  }>;
};

export type GetProductWithCollectionHandleQueryVariables = StorefrontAPI.Exact<{
  productHandle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type GetProductWithCollectionHandleQuery = {
  product?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Product,
      'id' | 'title' | 'description' | 'productType' | 'handle' | 'vendor'
    > & {
      featuredImage?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
      >;
      variants: {
        nodes: Array<
          Pick<StorefrontAPI.ProductVariant, 'id'> & {
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          }
        >;
      };
      collection?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Collection, 'handle'>
        >;
      }>;
    }
  >;
};

export type TreatmentCollectionQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type TreatmentCollectionQuery = {
  collection?: StorefrontAPI.Maybe<{
    products: {
      filters: Array<
        Pick<StorefrontAPI.Filter, 'id' | 'label'> & {
          values: Array<
            Pick<StorefrontAPI.FilterValue, 'input' | 'label' | 'count'>
          >;
        }
      >;
      nodes: Array<
        Pick<
          StorefrontAPI.Product,
          'id' | 'title' | 'description' | 'handle' | 'vendor' | 'productType'
        > & {
          variants: {
            nodes: Array<
              Pick<StorefrontAPI.ProductVariant, 'id'> & {
                compareAtPrice?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                >;
                price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              }
            >;
          };
          locations?: StorefrontAPI.Maybe<{
            references?: StorefrontAPI.Maybe<{
              nodes: Array<
                Pick<StorefrontAPI.Metaobject, 'id'> & {
                  locationType?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MetaobjectField, 'value'>
                  >;
                  originType?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MetaobjectField, 'value'>
                  >;
                }
              >;
            }>;
          }>;
          duration?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metafield, 'id' | 'value'>
          >;
          user?: StorefrontAPI.Maybe<{
            reference?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metaobject, 'id'> & {
                aboutMe?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'value'>
                >;
                active?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'value'>
                >;
                fullname?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'value'>
                >;
                professions?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'value'>
                >;
                shortDescription?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'value'>
                >;
                username?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'value'>
                >;
                theme?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'value'>
                >;
                image?: StorefrontAPI.Maybe<{
                  reference?: StorefrontAPI.Maybe<{
                    image?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Image, 'width' | 'height' | 'url'>
                    >;
                  }>;
                }>;
                collection?: StorefrontAPI.Maybe<{
                  reference?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.Collection, 'id'> & {
                      products: {
                        nodes: Array<
                          Pick<
                            StorefrontAPI.Product,
                            | 'id'
                            | 'title'
                            | 'description'
                            | 'handle'
                            | 'vendor'
                            | 'productType'
                          > & {
                            variants: {
                              nodes: Array<
                                Pick<StorefrontAPI.ProductVariant, 'id'> & {
                                  compareAtPrice?: StorefrontAPI.Maybe<
                                    Pick<
                                      StorefrontAPI.MoneyV2,
                                      'amount' | 'currencyCode'
                                    >
                                  >;
                                  price: Pick<
                                    StorefrontAPI.MoneyV2,
                                    'amount' | 'currencyCode'
                                  >;
                                }
                              >;
                            };
                            duration?: StorefrontAPI.Maybe<
                              Pick<StorefrontAPI.Metafield, 'id' | 'value'>
                            >;
                            locations?: StorefrontAPI.Maybe<{
                              references?: StorefrontAPI.Maybe<{
                                nodes: Array<
                                  Pick<StorefrontAPI.Metaobject, 'id'> & {
                                    locationType?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.MetaobjectField,
                                        'value'
                                      >
                                    >;
                                    originType?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.MetaobjectField,
                                        'value'
                                      >
                                    >;
                                  }
                                >;
                              }>;
                            }>;
                          }
                        >;
                      };
                    }
                  >;
                }>;
              }
            >;
          }>;
        }
      >;
      pageInfo: Pick<
        StorefrontAPI.PageInfo,
        'hasPreviousPage' | 'hasNextPage' | 'endCursor' | 'startCursor'
      >;
    };
  }>;
};

interface GeneratedQueryTypes {
  '#graphql\n  #graphql\n  fragment PageComponentMediaImage on MediaImage {\n    id\n    image {\n      url\n      width\n      height\n    }\n  }\n\n  fragment PageComponentCollection on Collection {\n    id\n    title\n    handle\n    image {\n      height\n      width\n      url(transform: { maxHeight: 250, maxWidth: 250, crop: CENTER })\n    }\n  }\n\n  fragment PageComponentMetaobject on Metaobject {\n    id\n    type\n    fields {\n      key\n      value\n      type\n      reference {\n        ...PageComponentMediaImage\n        ... on Metaobject {\n          id\n          type\n          fields {\n            key\n            value\n            type\n            references(first: 10) {\n              nodes {\n                ... on Metaobject {\n                  id\n                  type\n                  fields {\n                    key\n                    value\n                    type\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n      references(first: 10){\n        nodes {\n          ...PageComponentCollection\n          ...on Metaobject {\n            id\n            type\n            fields {\n              key\n              value\n              type\n              reference {\n                ... on Metaobject {\n                  id\n                  type\n                  fields {\n                    key\n                    value\n                    type\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n\n  fragment PageComponent on Metaobject {\n    id\n    type\n    fields {\n      value\n      type\n      key\n      references(first: 10) {\n        nodes {\n          ...PageComponentMetaobject\n        }\n      }\n      reference {\n        ...PageComponentMediaImage\n        ...PageComponentMetaobject\n      }\n    }\n  }\n\n  #graphql\n  fragment Page on Page {\n    id\n    title\n    body\n    seo {\n      description\n      title\n    }\n    components: metafield(namespace: "custom", key: "components") {\n      references(first: 10) {\n        nodes {\n          ...PageComponent\n        }\n      }\n    }\n\n    options: metafield(namespace: "custom", key: "options") {\n      references(first: 10) {\n        nodes {\n          ...PageComponent\n        }\n      }\n    }\n  }\n\n  query Page(\n    $language: LanguageCode,\n    $country: CountryCode,\n    $handle: String!\n  )\n  @inContext(language: $language, country: $country) {\n    page(handle: $handle) {\n      ...Page\n    }\n  }\n': {
    return: PageQuery;
    variables: PageQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment PageComponentMediaImage on MediaImage {\n    id\n    image {\n      url\n      width\n      height\n    }\n  }\n\n  fragment PageComponentCollection on Collection {\n    id\n    title\n    handle\n    image {\n      height\n      width\n      url(transform: { maxHeight: 250, maxWidth: 250, crop: CENTER })\n    }\n  }\n\n  fragment PageComponentMetaobject on Metaobject {\n    id\n    type\n    fields {\n      key\n      value\n      type\n      reference {\n        ...PageComponentMediaImage\n        ... on Metaobject {\n          id\n          type\n          fields {\n            key\n            value\n            type\n            references(first: 10) {\n              nodes {\n                ... on Metaobject {\n                  id\n                  type\n                  fields {\n                    key\n                    value\n                    type\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n      references(first: 10){\n        nodes {\n          ...PageComponentCollection\n          ...on Metaobject {\n            id\n            type\n            fields {\n              key\n              value\n              type\n              reference {\n                ... on Metaobject {\n                  id\n                  type\n                  fields {\n                    key\n                    value\n                    type\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n\n  fragment PageComponent on Metaobject {\n    id\n    type\n    fields {\n      value\n      type\n      key\n      references(first: 10) {\n        nodes {\n          ...PageComponentMetaobject\n        }\n      }\n      reference {\n        ...PageComponentMediaImage\n        ...PageComponentMetaobject\n      }\n    }\n  }\n\n  query MetaobjectQuery ($country: CountryCode, $language: LanguageCode, $handle: String!, $type: String!)\n    @inContext(country: $country, language: $language) {\n    metaobject(handle: {handle: $handle, type: $type}) {\n      ...PageComponent\n    }\n  }\n': {
    return: MetaobjectQueryQuery;
    variables: MetaobjectQueryQueryVariables;
  };
  '#graphql\n  #graphql\n  #graphql\n  fragment ProductCollection on Collection {\n    title\n    handle\n    icon:  metafield(namespace:"custom",  key: "icon") {\n      type\n      value\n    }\n  }\n\n  fragment MoneyProductItem on MoneyV2 {\n    amount\n    currencyCode\n  }\n\n  fragment ProductItem on Product {\n    id\n    title\n    description\n    handle\n    publishedAt\n    featuredImage {\n      id\n      altText\n      url(transform: { maxHeight: 250, maxWidth: 250, crop: CENTER })\n      width\n      height\n    }\n    priceRange {\n      minVariantPrice {\n        ...MoneyProductItem\n      }\n      maxVariantPrice {\n        ...MoneyProductItem\n      }\n    }\n    variants(first: 1) {\n      nodes {\n        id\n        selectedOptions {\n          name\n          value\n        }\n        price {\n          amount\n          currencyCode\n        }\n      }\n    }\n    collections(first:2) {\n      nodes {\n        ...ProductCollection\n      }\n    }\n  }\n\n  query ProductItemById(\n    $country: CountryCode\n    $language: LanguageCode\n    $Id: ID!\n  ) @inContext(country: $country, language: $language) {\n    product(id: $Id) {\n      ...ProductItem\n    }\n  }\n': {
    return: ProductItemByIdQuery;
    variables: ProductItemByIdQueryVariables;
  };
  '#graphql\n  #graphql\n  #graphql\n  fragment ProductCollection on Collection {\n    title\n    handle\n    icon:  metafield(namespace:"custom",  key: "icon") {\n      type\n      value\n    }\n  }\n\n  fragment MoneyProductItem on MoneyV2 {\n    amount\n    currencyCode\n  }\n\n  fragment ProductItem on Product {\n    id\n    title\n    description\n    handle\n    publishedAt\n    featuredImage {\n      id\n      altText\n      url(transform: { maxHeight: 250, maxWidth: 250, crop: CENTER })\n      width\n      height\n    }\n    priceRange {\n      minVariantPrice {\n        ...MoneyProductItem\n      }\n      maxVariantPrice {\n        ...MoneyProductItem\n      }\n    }\n    variants(first: 1) {\n      nodes {\n        id\n        selectedOptions {\n          name\n          value\n        }\n        price {\n          amount\n          currencyCode\n        }\n      }\n    }\n    collections(first:2) {\n      nodes {\n        ...ProductCollection\n      }\n    }\n  }\n\n  query ProductItem(\n    $country: CountryCode\n    $language: LanguageCode\n    $handle: String!\n  ) @inContext(country: $country, language: $language) {\n    product(handle: $handle) {\n      ...ProductItem\n    }\n  }\n': {
    return: ProductItemQuery;
    variables: ProductItemQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment ProductVariants on Product {\n    variants(first: 250) {\n      nodes {\n        ...ProductVariant\n      }\n    }\n  }\n  #graphql\n  fragment ProductVariant on ProductVariant {\n    availableForSale\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    id\n    image {\n      __typename\n      id\n      url\n      altText\n      width\n      height\n    }\n    price {\n      amount\n      currencyCode\n    }\n    product {\n      title\n      handle\n    }\n    selectedOptions {\n      name\n      value\n    }\n    sku\n    title\n    unitPrice {\n      amount\n      currencyCode\n    }\n  }\n\n\n  query ProductVariants(\n    $country: CountryCode\n    $language: LanguageCode\n    $handle: String!\n  ) @inContext(country: $country, language: $language) {\n    product(handle: $handle) {\n      ...ProductVariants\n    }\n  }\n': {
    return: ProductVariantsQuery;
    variables: ProductVariantsQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment ProductVariants on Product {\n    variants(first: 250) {\n      nodes {\n        ...ProductVariant\n      }\n    }\n  }\n  #graphql\n  fragment ProductVariant on ProductVariant {\n    availableForSale\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    id\n    image {\n      __typename\n      id\n      url\n      altText\n      width\n      height\n    }\n    price {\n      amount\n      currencyCode\n    }\n    product {\n      title\n      handle\n    }\n    selectedOptions {\n      name\n      value\n    }\n    sku\n    title\n    unitPrice {\n      amount\n      currencyCode\n    }\n  }\n\n\n  query ProductVariantsById(\n    $country: CountryCode\n    $language: LanguageCode\n    $handle: ID!\n  ) @inContext(country: $country, language: $language) {\n    product(id: $handle) {\n      ...ProductVariants\n    }\n  }\n': {
    return: ProductVariantsByIdQuery;
    variables: ProductVariantsByIdQueryVariables;
  };
  '#graphql\n#graphql\n  #graphql\n  fragment ProductCollection on Collection {\n    title\n    handle\n    icon:  metafield(namespace:"custom",  key: "icon") {\n      type\n      value\n    }\n  }\n\n  #graphql\n  fragment ProductVariant on ProductVariant {\n    availableForSale\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    id\n    image {\n      __typename\n      id\n      url\n      altText\n      width\n      height\n    }\n    price {\n      amount\n      currencyCode\n    }\n    product {\n      title\n      handle\n    }\n    selectedOptions {\n      name\n      value\n    }\n    sku\n    title\n    unitPrice {\n      amount\n      currencyCode\n    }\n  }\n\n\n  fragment Product on Product {\n    id\n    title\n    vendor\n    handle\n    descriptionHtml\n    description\n    options {\n      name\n      values\n    }\n    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {\n      ...ProductVariant\n    }\n    variants(first: 1) {\n      nodes {\n        ...ProductVariant\n      }\n    }\n    collections(first: 2) {\n      nodes {\n        ...ProductCollection\n      }\n    }\n    seo {\n      description\n      title\n    }\n  }\n\n  query ProductId(\n    $country: CountryCode\n    $Id: ID!\n    $language: LanguageCode\n    $selectedOptions: [SelectedOptionInput!]!\n  ) @inContext(country: $country, language: $language) {\n    product(id: $Id) {\n      ...Product\n    }\n  }\n': {
    return: ProductIdQuery;
    variables: ProductIdQueryVariables;
  };
  '#graphql\n#graphql\n  #graphql\n  fragment ProductCollection on Collection {\n    title\n    handle\n    icon:  metafield(namespace:"custom",  key: "icon") {\n      type\n      value\n    }\n  }\n\n  #graphql\n  fragment ProductVariant on ProductVariant {\n    availableForSale\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    id\n    image {\n      __typename\n      id\n      url\n      altText\n      width\n      height\n    }\n    price {\n      amount\n      currencyCode\n    }\n    product {\n      title\n      handle\n    }\n    selectedOptions {\n      name\n      value\n    }\n    sku\n    title\n    unitPrice {\n      amount\n      currencyCode\n    }\n  }\n\n\n  fragment Product on Product {\n    id\n    title\n    vendor\n    handle\n    descriptionHtml\n    description\n    options {\n      name\n      values\n    }\n    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {\n      ...ProductVariant\n    }\n    variants(first: 1) {\n      nodes {\n        ...ProductVariant\n      }\n    }\n    collections(first: 2) {\n      nodes {\n        ...ProductCollection\n      }\n    }\n    seo {\n      description\n      title\n    }\n  }\n\n  query Product(\n    $country: CountryCode\n    $productHandle: String!\n    $language: LanguageCode\n    $selectedOptions: [SelectedOptionInput!]!\n  ) @inContext(country: $country, language: $language) {\n    product(handle: $productHandle) {\n      ...Product\n    }\n  }\n': {
    return: ProductQuery;
    variables: ProductQueryVariables;
  };
  '#graphql\n#graphql\n  fragment ProductValidateHandler on Product {\n    id\n    title\n    vendor\n    selectedVariant: variantBySelectedOptions(selectedOptions: [{name: "asd", value: "asd"}]) {\n      id\n    }\n  }\n\n  query ProductValidateHandler(\n    $country: CountryCode\n    $productHandle: String!\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    product(handle: $productHandle) {\n      ...ProductValidateHandler\n    }\n  }\n': {
    return: ProductValidateHandlerQuery;
    variables: ProductValidateHandlerQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment User on Metaobject {\n    id #for key={id}\n    fields {\n      value\n      key\n      reference {\n        ... on MediaImage {\n          image {\n            width\n            height\n            url(transform: {})\n          }\n        }\n      }\n    }\n  }\n\n  query ArtistUser(\n    $username: String!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    metaobject(handle: {handle: $username, type: "user"}) {\n      ...User\n    }\n  }\n': {
    return: ArtistUserQuery;
    variables: ArtistUserQueryVariables;
  };
  '#graphql\n  #graphql\n  #graphql\n  #graphql\n  fragment Location on Metaobject {\n    id\n    handle\n    fields {\n      value\n      key\n    }\n  }\n\n  fragment TreatmentProduct on Product {\n    id\n    title\n    descriptionHtml\n    productType\n    handle\n    vendor\n    featuredImage {\n      id\n      altText\n      url(transform: { maxHeight: 250, maxWidth: 250, crop: CENTER })\n      width\n      height\n    }\n    variants(first: 1) {\n      nodes {\n        id\n        compareAtPrice {\n          amount\n          currencyCode\n        }\n        price {\n          amount\n          currencyCode\n        }\n      }\n    }\n    parentId: metafield(key: "parentId", namespace: "booking") {\n      id\n      value\n    }\n    options: metafield(key: "options", namespace: "booking") {\n      id\n      value\n    }\n    scheduleId: metafield(key: "scheduleId", namespace: "booking") {\n      id\n      value\n    }\n    locations: metafield(key: "locations", namespace: "booking") {\n      references(first: 10) {\n        nodes {\n          ...Location\n        }\n      }\n    }\n    bookingPeriodValue: metafield(key: "booking_period_value", namespace: "booking") {\n      id\n      value\n    }\n    bookingPeriodUnit: metafield(key: "booking_period_unit", namespace: "booking") {\n      id\n      value\n    }\n    noticePeriodValue: metafield(key: "notice_period_value", namespace: "booking") {\n      id\n      value\n    }\n    noticePeriodUnit: metafield(key: "notice_period_unit", namespace: "booking") {\n      id\n      value\n    }\n    duration: metafield(key: "duration", namespace: "booking") {\n      id\n      value\n    }\n    breaktime: metafield(key: "breaktime", namespace: "booking") {\n      id\n      value\n    }\n  }\n\n\n  fragment UserCollectionProductsFilters on Filter {\n    label\n    values {\n      label\n      input\n      count\n    }\n  }\n\n  fragment UserCollectionWithProducts on Collection {\n    id\n    title\n    products(first: 20, sortKey: TITLE, filters: $filters) {\n      nodes {\n        ...TreatmentProduct\n      }\n      filters {\n        ...UserCollectionProductsFilters\n      }\n    }\n  }\n\n\n  query GetUserProducts(\n    $handle: String!\n    $country: CountryCode\n    $language: LanguageCode\n    $filters: [ProductFilter!] = {}\n  ) @inContext(country: $country, language: $language) {\n    collection(handle: $handle) {\n      ...UserCollectionWithProducts\n    }\n  }\n': {
    return: GetUserProductsQuery;
    variables: GetUserProductsQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment CategoryWithChildren on Collection {\n    id\n    title\n    handle\n    description\n    image {\n      id\n      url\n      altText\n      width\n      height\n    }\n    children: metafield(key: "children", namespace: "booking") {\n      id\n      type\n      references(first: 20) {\n        nodes {\n          ... on Collection {\n            id\n            title\n            handle\n            description\n            image {\n              id\n              url\n              altText\n              width\n              height\n            }\n          }\n        }\n      }\n    }\n  }\n\n  query CategoriesWithChildren(\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    collection(handle: "alle-behandlinger") {\n      ...CategoryWithChildren\n    }\n  }\n': {
    return: CategoriesWithChildrenQuery;
    variables: CategoriesWithChildrenQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment ProductCreateVariant on ProductVariant {\n    id\n    title\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    price {\n      amount\n      currencyCode\n    }\n    product {\n      title\n      handle\n    }\n    selectedOptions {\n      name\n      value\n    }\n  }\n\n  query ProductCreateVariantId(\n    $country: CountryCode\n    $Id: ID!\n    $language: LanguageCode\n    $selectedOptions: [SelectedOptionInput!]!\n  ) @inContext(country: $country, language: $language) {\n    product(id: $Id) {\n      ...on Product {\n        selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {\n          ...ProductCreateVariant\n        }\n      }\n    }\n  }\n': {
    return: ProductCreateVariantIdQuery;
    variables: ProductCreateVariantIdQueryVariables;
  };
  '#graphql\n  fragment Shop on Shop {\n    id\n    name\n    description\n    primaryDomain {\n      url\n    }\n    brand {\n      logo {\n        image {\n          url\n        }\n      }\n    }\n  }\n  query Header(\n    $country: CountryCode\n    $headerMenuHandle: String!\n    $language: LanguageCode\n  ) @inContext(language: $language, country: $country) {\n    shop {\n      ...Shop\n    }\n    menu(handle: $headerMenuHandle) {\n      ...Menu\n    }\n  }\n  #graphql\n  fragment MenuItem on MenuItem {\n    id\n    resourceId\n    tags\n    title\n    type\n    url\n  }\n  fragment ChildMenuItem on MenuItem {\n    ...MenuItem\n  }\n  fragment ParentMenuItem on MenuItem {\n    ...MenuItem\n    items {\n      ...ChildMenuItem\n    }\n  }\n  fragment Menu on Menu {\n    id\n    items {\n      ...ParentMenuItem\n    }\n  }\n\n': {
    return: HeaderQuery;
    variables: HeaderQueryVariables;
  };
  '#graphql\n  query Footer(\n    $country: CountryCode\n    $footerMenuHandle: String!\n    $language: LanguageCode\n  ) @inContext(language: $language, country: $country) {\n    menu(handle: $footerMenuHandle) {\n      ...Menu\n    }\n  }\n  #graphql\n  fragment MenuItem on MenuItem {\n    id\n    resourceId\n    tags\n    title\n    type\n    url\n  }\n  fragment ChildMenuItem on MenuItem {\n    ...MenuItem\n  }\n  fragment ParentMenuItem on MenuItem {\n    ...MenuItem\n    items {\n      ...ChildMenuItem\n    }\n  }\n  fragment Menu on Menu {\n    id\n    items {\n      ...ParentMenuItem\n    }\n  }\n\n': {
    return: FooterQuery;
    variables: FooterQueryVariables;
  };
  '#graphql\n  query StoreRobots($country: CountryCode, $language: LanguageCode)\n   @inContext(country: $country, language: $language) {\n    shop {\n      id\n    }\n  }\n': {
    return: StoreRobotsQuery;
    variables: StoreRobotsQueryVariables;
  };
  '#graphql\n  query Sitemap($urlLimits: Int, $language: LanguageCode)\n  @inContext(language: $language) {\n    products(\n      first: $urlLimits\n      query: "published_status:\'online_store:visible\'"\n    ) {\n      nodes {\n        updatedAt\n        handle\n        onlineStoreUrl\n        title\n        featuredImage {\n          url\n          altText\n        }\n      }\n    }\n    collections(\n      first: $urlLimits\n      query: "published_status:\'online_store:visible\'"\n    ) {\n      nodes {\n        updatedAt\n        handle\n        onlineStoreUrl\n      }\n    }\n    pages(first: $urlLimits, query: "published_status:\'published\'") {\n      nodes {\n        updatedAt\n        handle\n        onlineStoreUrl\n      }\n    }\n  }\n': {
    return: SitemapQuery;
    variables: SitemapQueryVariables;
  };
  '#graphql\n  #graphql\n  #graphql\n  #graphql\n  fragment User on Metaobject {\n    id #for key={id}\n    fields {\n      value\n      key\n      reference {\n        ... on MediaImage {\n          image {\n            width\n            height\n            url(transform: {})\n          }\n        }\n      }\n    }\n  }\n\n\n  fragment TreatmentUser on Product {\n    id\n    title\n    descriptionHtml\n    productType\n    handle\n    vendor\n    featuredImage {\n      id\n      altText\n      url(transform: { maxHeight: 500, maxWidth: 500, crop: CENTER })\n      width\n      height\n    }\n    variants(first: 1) {\n      nodes {\n        id\n        compareAtPrice {\n          amount\n          currencyCode\n        }\n        price {\n          amount\n          currencyCode\n        }\n      }\n    }\n    user: metafield(key: "user", namespace: "booking") {\n      reference {\n        ...User\n      }\n    }\n  }\n\n\n  fragment TreatmentCollection on Product {\n    id\n    title\n    descriptionHtml\n    description\n    productType\n    handle\n    vendor\n    featuredImage {\n      id\n      altText\n      url(transform: { maxHeight: 500, maxWidth: 500, crop: CENTER })\n      width\n      height\n    }\n    variants(first: 1) {\n      nodes {\n        id\n        compareAtPrice {\n          amount\n          currencyCode\n        }\n        price {\n          amount\n          currencyCode\n        }\n      }\n    }\n    collection: metafield(key: "collection", namespace: "system") {\n      reference {\n        ... on Collection {\n          products(first: 5, sortKey: RELEVANCE, filters: [{productMetafield: {namespace: "booking", key: "hide_from_profile", value: "false"}}, {productMetafield: {namespace: "system", key: "active",value: "true"}}]) {\n            filters {\n              id\n              label\n              values {\n                count\n              }\n            }\n            nodes {\n              ...TreatmentUser\n            }\n          }\n        }\n      }\n    }\n  }\n\n  query RecommendedTreatments(\n    $query: String!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    products(first: 10, sortKey: RELEVANCE, query: $query) {\n      nodes {\n        ...TreatmentCollection\n      }\n    }\n  }\n': {
    return: RecommendedTreatmentsQuery;
    variables: RecommendedTreatmentsQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment User on Metaobject {\n    id #for key={id}\n    fields {\n      value\n      key\n      reference {\n        ... on MediaImage {\n          image {\n            width\n            height\n            url(transform: {})\n          }\n        }\n      }\n    }\n  }\n\n  query FrontUsers(\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    metaobjects(type: "user", first: 20) { #we have increased to 20 incase some users is active=false, we cannot filtre on metaobjects\n      nodes {\n        ...User\n      }\n    }\n  }\n': {
    return: FrontUsersQuery;
    variables: FrontUsersQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment ProductSearchSimple on Product {\n    id\n    title\n    handle\n  }\n\n  query ProductSearchQuery(\n    $collectionId: ID!\n    $country: CountryCode\n    $language: LanguageCode\n    $first: Int\n  ) @inContext(country: $country, language: $language) {\n    collection(id: $collectionId) {\n      products(first: $first) {\n        nodes {\n          ...ProductSearchSimple\n        }\n      }\n    }\n  }\n': {
    return: ProductSearchQueryQuery;
    variables: ProductSearchQueryQueryVariables;
  };
  '#graphql\n  query ProductVariantIds(\n    $country: CountryCode\n    $language: LanguageCode\n    $variantId: [ID!]!\n  ) @inContext(country: $country, language: $language) {\n    nodes(ids: $variantId){\n      ...on ProductVariant{\n        ...ProductVariant\n      }\n    }\n  }\n  #graphql\n  fragment ProductVariant on ProductVariant {\n    availableForSale\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    id\n    image {\n      __typename\n      id\n      url\n      altText\n      width\n      height\n    }\n    price {\n      amount\n      currencyCode\n    }\n    product {\n      title\n      handle\n    }\n    selectedOptions {\n      name\n      value\n    }\n    sku\n    title\n    unitPrice {\n      amount\n      currencyCode\n    }\n  }\n\n': {
    return: ProductVariantIdsQuery;
    variables: ProductVariantIdsQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment MoneyProductItem on MoneyV2 {\n    amount\n    currencyCode\n  }\n\n  fragment ServicesOptionsTagProduct on Product {\n    id\n    handle\n    title\n    options {\n      name\n      values\n    }\n    variants(first: 5) {\n      nodes {\n        id\n        title\n        price {\n          ...MoneyProductItem\n        }\n      }\n    }\n  }\n\n  query ServicesOptionsTagOptionsQuery(\n    $country: CountryCode\n    $language: LanguageCode\n    $query: String!\n    $first: Int\n  ) @inContext(country: $country, language: $language) {\n    products(first: $first, query: $query) {\n      nodes {\n        ...ServicesOptionsTagProduct\n      }\n    }\n  }\n': {
    return: ServicesOptionsTagOptionsQueryQuery;
    variables: ServicesOptionsTagOptionsQueryQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment CategoryStorefront on Collection {\n    id\n    title\n    children: metafield(key: "children", namespace: "booking") {\n      references(first: 20) {\n        nodes {\n          ... on Collection {\n            id\n            title\n            products(first: 30) {\n              nodes {\n                id\n                title\n                descriptionHtml\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n\n  query CategoriesStorefront(\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    collection(handle: "alle-behandlinger") {\n      ...CategoryStorefront\n    }\n  }\n': {
    return: CategoriesStorefrontQuery;
    variables: CategoriesStorefrontQueryVariables;
  };
  '#graphql\n  fragment PredictiveArticle on Article {\n    __typename\n    id\n    title\n    handle\n    image {\n      url\n      altText\n      width\n      height\n    }\n    trackingParameters\n  }\n  fragment PredictiveCollection on Collection {\n    __typename\n    id\n    title\n    handle\n    image {\n      url\n      altText\n      width\n      height\n    }\n    trackingParameters\n  }\n  fragment PredictivePage on Page {\n    __typename\n    id\n    title\n    handle\n    trackingParameters\n  }\n  fragment PredictiveProduct on Product {\n    __typename\n    id\n    title\n    handle\n    trackingParameters\n    variants(first: 1) {\n      nodes {\n        id\n        image {\n          url\n          altText\n          width\n          height\n        }\n        price {\n          amount\n          currencyCode\n        }\n      }\n    }\n  }\n  fragment PredictiveQuery on SearchQuerySuggestion {\n    __typename\n    text\n    styledText\n    trackingParameters\n  }\n  query predictiveSearch(\n    $country: CountryCode\n    $language: LanguageCode\n    $limit: Int!\n    $limitScope: PredictiveSearchLimitScope!\n    $searchTerm: String!\n    $types: [PredictiveSearchType!]\n  ) @inContext(country: $country, language: $language) {\n    predictiveSearch(\n      limit: $limit,\n      limitScope: $limitScope,\n      query: $searchTerm,\n      types: $types,\n    ) {\n      articles {\n        ...PredictiveArticle\n      }\n      collections {\n        ...PredictiveCollection\n      }\n      pages {\n        ...PredictivePage\n      }\n      products {\n        ...PredictiveProduct\n      }\n      queries {\n        ...PredictiveQuery\n      }\n    }\n  }\n': {
    return: PredictiveSearchQuery;
    variables: PredictiveSearchQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment CartProducts on Product {\n    id\n    title\n    description\n    variants(first: 1) {\n      nodes {\n        id\n        title\n        compareAtPrice {\n          amount\n          currencyCode\n        }\n        price {\n          amount\n          currencyCode\n        }\n        duration: metafield(key: "duration", namespace: "booking") {\n          id\n          value\n        }\n      }\n    }\n    type: metafield(key: "type", namespace: "system") {\n      value\n    }\n    required: metafield(key: "required", namespace: "system") {\n      value\n    }\n    duration: metafield(key: "duration", namespace: "booking") {\n      id\n      value\n    }\n  }\n\n  query getTreatmentProductsInCart(\n    $country: CountryCode\n    $language: LanguageCode\n    $first: Int\n    $query: String\n  ) @inContext(country: $country, language: $language) {\n    products(first: $first, query: $query, sortKey: TITLE) {\n      nodes {\n        ...CartProducts\n      }\n    }\n  }\n': {
    return: GetTreatmentProductsInCartQuery;
    variables: GetTreatmentProductsInCartQueryVariables;
  };
  '#graphql\n  query GetProductScheduleId(\n    $productHandle: String!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    product(handle: $productHandle) {\n      id\n      scheduleId: metafield(key: "scheduleId", namespace: "booking") {\n        reference {\n          ... on Metaobject {\n            handle\n          }\n        }\n      }\n    }\n  }\n': {
    return: GetProductScheduleIdQuery;
    variables: GetProductScheduleIdQueryVariables;
  };
  '#graphql\n  #graphql\n  #graphql\n  #graphql\n  fragment TreatmentOptionVariant on ProductVariant {\n    id\n    title\n    image {\n      id\n      url(transform: { maxHeight: 100, maxWidth: 100, crop: CENTER })\n      altText\n      width\n      height\n    }\n    price {\n      amount\n      currencyCode\n    }\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    selectedOptions {\n      name\n      value\n    }\n    duration: metafield(key: "duration", namespace: "booking") {\n      value\n    }\n  }\n\n\n  fragment TreatmentOption on Product {\n    id\n    title\n    handle\n    description\n    options {\n      name\n      values\n    }\n    variants(first: 5) {\n      nodes {\n        ...TreatmentOptionVariant\n      }\n    }\n    parentId: metafield(key: "parentId", namespace: "booking") {\n      value\n    }\n    required: metafield(key: "required", namespace: "system") {\n      value\n    }\n  }\n\n  fragment PickMoreTreatmentProduct on Product {\n    id\n    title\n    descriptionHtml\n    productType\n    handle\n    featuredImage {\n      id\n      altText\n      url(transform: { maxHeight: 250, maxWidth: 250, crop: CENTER })\n      width\n      height\n    }\n    variants(first: 1) {\n      nodes {\n        compareAtPrice {\n          amount\n          currencyCode\n        }\n        price {\n          amount\n          currencyCode\n        }\n      }\n    }\n    options: metafield(key: "options", namespace: "booking") {\n      value\n      references(first: 10) {\n        nodes {\n          ...TreatmentOption\n        }\n      }\n    }\n    duration: metafield(key: "duration", namespace: "booking") {\n      id\n      value\n    }\n  }\n\n\n  query PickMoreProducts(\n    $handle: String!\n    $country: CountryCode\n    $language: LanguageCode\n    $filters: [ProductFilter!] = {}\n  ) @inContext(country: $country, language: $language) {\n    collection(handle: $handle) {\n      products(first: 20, sortKey: TITLE, filters: $filters) {\n        nodes {\n          ...PickMoreTreatmentProduct\n        }\n      }\n    }\n  }\n': {
    return: PickMoreProductsQuery;
    variables: PickMoreProductsQueryVariables;
  };
  '#graphql\n  #graphql\n  #graphql\n  #graphql\n  fragment TreatmentOptionVariant on ProductVariant {\n    id\n    title\n    image {\n      id\n      url(transform: { maxHeight: 100, maxWidth: 100, crop: CENTER })\n      altText\n      width\n      height\n    }\n    price {\n      amount\n      currencyCode\n    }\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    selectedOptions {\n      name\n      value\n    }\n    duration: metafield(key: "duration", namespace: "booking") {\n      value\n    }\n  }\n\n\n  fragment TreatmentOption on Product {\n    id\n    title\n    handle\n    description\n    options {\n      name\n      values\n    }\n    variants(first: 5) {\n      nodes {\n        ...TreatmentOptionVariant\n      }\n    }\n    parentId: metafield(key: "parentId", namespace: "booking") {\n      value\n    }\n    required: metafield(key: "required", namespace: "system") {\n      value\n    }\n  }\n\n  #graphql\n  fragment Location on Metaobject {\n    id\n    handle\n    fields {\n      value\n      key\n    }\n  }\n\n\n  fragment TreatmentProductWithOptions on Product {\n    id\n    title\n    description\n    descriptionHtml\n    productType\n    handle\n    featuredImage {\n      id\n      altText\n      url(transform: { maxHeight: 250, maxWidth: 250, crop: CENTER })\n      width\n      height\n    }\n    variants(first: 1) {\n      nodes {\n        compareAtPrice {\n          amount\n          currencyCode\n        }\n        price {\n          amount\n          currencyCode\n        }\n      }\n    }\n    parentId: metafield(key: "parentId", namespace: "booking") {\n      id\n      value\n    }\n    options: metafield(key: "options", namespace: "booking") {\n      references(first: 10) {\n        nodes {\n          ...TreatmentOption\n        }\n      }\n    }\n    scheduleId: metafield(key: "scheduleId", namespace: "booking") {\n      id\n      value\n    }\n    locations: metafield(key: "locations", namespace: "booking") {\n      references(first: 10) {\n        nodes {\n          ...Location\n        }\n      }\n    }\n    duration: metafield(key: "duration", namespace: "booking") {\n      id\n      value\n    }\n  }\n\n  query ArtistOptions(\n    $productHandle: String!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    product(handle: $productHandle) {\n      ...TreatmentProductWithOptions\n    }\n  }\n': {
    return: ArtistOptionsQuery;
    variables: ArtistOptionsQueryVariables;
  };
  '#graphql\n  query Article(\n    $articleHandle: String!\n    $blogHandle: String!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(language: $language, country: $country) {\n    blog(handle: $blogHandle) {\n      articleByHandle(handle: $articleHandle) {\n        title\n        contentHtml\n        publishedAt\n        author: authorV2 {\n          name\n        }\n        image {\n          id\n          altText\n          url\n          width\n          height\n        }\n        seo {\n          description\n          title\n        }\n      }\n    }\n  }\n': {
    return: ArticleQuery;
    variables: ArticleQueryVariables;
  };
  '#graphql\n  query Blog(\n    $language: LanguageCode\n    $blogHandle: String!\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n  ) @inContext(language: $language) {\n    blog(handle: $blogHandle) {\n      title\n      seo {\n        title\n        description\n      }\n      articles(\n        first: $first,\n        last: $last,\n        before: $startCursor,\n        after: $endCursor\n      ) {\n        nodes {\n          ...ArticleItem\n        }\n        pageInfo {\n          hasPreviousPage\n          hasNextPage\n          hasNextPage\n          endCursor\n          startCursor\n        }\n\n      }\n    }\n  }\n  fragment ArticleItem on Article {\n    author: authorV2 {\n      name\n    }\n    contentHtml\n    handle\n    id\n    image {\n      id\n      altText\n      url\n      width\n      height\n    }\n    publishedAt\n    title\n    blog {\n      handle\n    }\n  }\n': {
    return: BlogQuery;
    variables: BlogQueryVariables;
  };
  '#graphql\n  query Blogs(\n    $country: CountryCode\n    $endCursor: String\n    $first: Int\n    $language: LanguageCode\n    $last: Int\n    $startCursor: String\n  ) @inContext(country: $country, language: $language) {\n    blogs(\n      first: $first,\n      last: $last,\n      before: $startCursor,\n      after: $endCursor\n    ) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n      nodes {\n        title\n        handle\n        seo {\n          title\n          description\n        }\n      }\n    }\n  }\n': {
    return: BlogsQuery;
    variables: BlogsQueryVariables;
  };
  '#graphql\n  #graphql\n  #graphql\n  #graphql\n  fragment CategoriesCollectionProductUser on Metaobject {\n    id\n    image: field(key: "image") {\n      reference {\n        ... on MediaImage {\n          image {\n            width\n            height\n            url(transform: { maxHeight: 100, maxWidth: 100, crop: CENTER })\n          }\n        }\n      }\n    }\n  }\n\n\n  fragment CategoriesCollectionProduct on Product {\n    id\n    user: metafield(key: "user", namespace: "booking") {\n      reference {\n        ...CategoriesCollectionProductUser\n      }\n    }\n  }\n\n  #graphql\n  fragment CategoriesCollectionFilter on Filter {\n    id\n    label\n    values {\n      count\n    }\n  }\n\n\n  fragment CategoriesCollection on Product {\n    id\n    title\n    descriptionHtml\n    description\n    productType\n    handle\n    vendor\n    featuredImage {\n      id\n      altText\n      url(transform: { maxHeight: 250, maxWidth: 250, crop: CENTER })\n      width\n      height\n    }\n    collection: metafield(key: "collection", namespace: "system") {\n      reference {\n        ... on Collection {\n          products(first: 5, sortKey: RELEVANCE, filters: [{productMetafield: {namespace: "booking", key: "hide_from_profile", value: "false"}}, {productMetafield: {namespace: "system", key: "active",value: "true"}}]) {\n            filters {\n              ...CategoriesCollectionFilter\n            }\n            nodes {\n              ...CategoriesCollectionProduct\n            }\n          }\n        }\n      }\n    }\n  }\n\n  query categoriesCollection(\n    $handle: String!\n    $country: CountryCode\n    $language: LanguageCode\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n  ) @inContext(country: $country, language: $language) {\n    collection(handle: $handle) {\n      id\n      handle\n      title\n      description\n      products(\n        first: $first,\n        last: $last,\n        before: $startCursor,\n        after: $endCursor,\n        sortKey: TITLE\n      ) {\n        nodes {\n          ...CategoriesCollection\n        }\n        pageInfo {\n          hasPreviousPage\n          hasNextPage\n          endCursor\n          startCursor\n        }\n      }\n    }\n  }\n': {
    return: CategoriesCollectionQuery;
    variables: CategoriesCollectionQueryVariables;
  };
  '#graphql\n  #graphql\n  #graphql\n  fragment ProductCollection on Collection {\n    title\n    handle\n    icon:  metafield(namespace:"custom",  key: "icon") {\n      type\n      value\n    }\n  }\n\n  fragment MoneyProductItem on MoneyV2 {\n    amount\n    currencyCode\n  }\n\n  fragment ProductItem on Product {\n    id\n    title\n    description\n    handle\n    publishedAt\n    featuredImage {\n      id\n      altText\n      url(transform: { maxHeight: 250, maxWidth: 250, crop: CENTER })\n      width\n      height\n    }\n    priceRange {\n      minVariantPrice {\n        ...MoneyProductItem\n      }\n      maxVariantPrice {\n        ...MoneyProductItem\n      }\n    }\n    variants(first: 1) {\n      nodes {\n        id\n        selectedOptions {\n          name\n          value\n        }\n        price {\n          amount\n          currencyCode\n        }\n      }\n    }\n    collections(first:2) {\n      nodes {\n        ...ProductCollection\n      }\n    }\n  }\n\n  query Collection(\n    $handle: String!\n    $country: CountryCode\n    $language: LanguageCode\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n  ) @inContext(country: $country, language: $language) {\n    collection(handle: $handle) {\n      id\n      handle\n      title\n      description\n      products(\n        first: $first,\n        last: $last,\n        before: $startCursor,\n        after: $endCursor,\n        sortKey: TITLE\n      ) {\n        nodes {\n          ...ProductItem\n        }\n        pageInfo {\n          hasPreviousPage\n          hasNextPage\n          endCursor\n          startCursor\n        }\n      }\n    }\n  }\n': {
    return: CollectionQuery;
    variables: CollectionQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment Collection on Collection {\n    id\n    title\n    handle\n    description\n    image {\n      id\n      url\n      altText\n      width\n      height\n    }\n    icon:  metafield(namespace:"custom",  key: "icon") {\n      type\n      value\n    }\n    color:  metafield(namespace:"custom",  key: "color") {\n      type\n      value\n    }\n  }\n\n  query StoreCollections(\n    $country: CountryCode\n    $endCursor: String\n    $first: Int\n    $language: LanguageCode\n    $last: Int\n    $startCursor: String\n  ) @inContext(country: $country, language: $language) {\n    collections(\n      first: $first,\n      last: $last,\n      before: $startCursor,\n      after: $endCursor,\n      query: "title:products:*",\n      sortKey: TITLE\n    ) {\n      nodes {\n        ...Collection\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n': {
    return: StoreCollectionsQuery;
    variables: StoreCollectionsQueryVariables;
  };
  '#graphql\n  fragment Policy on ShopPolicy {\n    body\n    handle\n    id\n    title\n    url\n  }\n  query Policy(\n    $country: CountryCode\n    $language: LanguageCode\n    $privacyPolicy: Boolean!\n    $refundPolicy: Boolean!\n    $shippingPolicy: Boolean!\n    $termsOfService: Boolean!\n  ) @inContext(language: $language, country: $country) {\n    shop {\n      privacyPolicy @include(if: $privacyPolicy) {\n        ...Policy\n      }\n      shippingPolicy @include(if: $shippingPolicy) {\n        ...Policy\n      }\n      termsOfService @include(if: $termsOfService) {\n        ...Policy\n      }\n      refundPolicy @include(if: $refundPolicy) {\n        ...Policy\n      }\n    }\n  }\n': {
    return: PolicyQuery;
    variables: PolicyQueryVariables;
  };
  '#graphql\n  fragment PolicyItem on ShopPolicy {\n    id\n    title\n    handle\n  }\n  query Policies ($country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    shop {\n      privacyPolicy {\n        ...PolicyItem\n      }\n      shippingPolicy {\n        ...PolicyItem\n      }\n      termsOfService {\n        ...PolicyItem\n      }\n      refundPolicy {\n        ...PolicyItem\n      }\n      subscriptionPolicy {\n        id\n        title\n        handle\n      }\n    }\n  }\n': {
    return: PoliciesQuery;
    variables: PoliciesQueryVariables;
  };
  '#graphql\n  fragment SearchProduct on Product {\n    __typename\n    handle\n    id\n    publishedAt\n    title\n    trackingParameters\n    vendor\n    variants(first: 1) {\n      nodes {\n        id\n        image {\n          url\n          altText\n          width\n          height\n        }\n        price {\n          amount\n          currencyCode\n        }\n        compareAtPrice {\n          amount\n          currencyCode\n        }\n        selectedOptions {\n          name\n          value\n        }\n        product {\n          handle\n          title\n        }\n      }\n    }\n  }\n  fragment SearchPage on Page {\n     __typename\n     handle\n    id\n    title\n    trackingParameters\n  }\n  fragment SearchArticle on Article {\n    __typename\n    handle\n    id\n    title\n    trackingParameters\n  }\n  query search(\n    $country: CountryCode\n    $endCursor: String\n    $first: Int\n    $language: LanguageCode\n    $last: Int\n    $query: String!\n    $startCursor: String\n  ) @inContext(country: $country, language: $language) {\n    products: search(\n      query: $query,\n      unavailableProducts: HIDE,\n      types: [PRODUCT],\n      first: $first,\n      sortKey: RELEVANCE,\n      last: $last,\n      before: $startCursor,\n      after: $endCursor\n    ) {\n      nodes {\n        ...on Product {\n          ...SearchProduct\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n    pages: search(\n      query: $query,\n      types: [PAGE],\n      first: 10\n    ) {\n      nodes {\n        ...on Page {\n          ...SearchPage\n        }\n      }\n    }\n    articles: search(\n      query: $query,\n      types: [ARTICLE],\n      first: 10\n    ) {\n      nodes {\n        ...on Article {\n          ...SearchArticle\n        }\n      }\n    }\n  }\n': {
    return: SearchQuery;
    variables: SearchQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment TreatmentWithCollectionHandler on Product {\n    id\n    title\n    description\n    productType\n    handle\n    vendor\n    featuredImage {\n      id\n      altText\n      url(transform: { maxHeight: 500, maxWidth: 500, crop: CENTER })\n      width\n      height\n    }\n    variants(first: 1) {\n      nodes {\n        id\n        compareAtPrice {\n          amount\n          currencyCode\n        }\n        price {\n          amount\n          currencyCode\n        }\n      }\n    }\n    collection: metafield(key: "collection", namespace: "system") {\n      reference {\n        ... on Collection {\n          handle\n        }\n      }\n    }\n  }\n\n\n  query GetProductWithCollectionHandle(\n    $productHandle: String!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    product(handle: $productHandle) {\n      ...TreatmentWithCollectionHandler\n    }\n  }\n': {
    return: GetProductWithCollectionHandleQuery;
    variables: GetProductWithCollectionHandleQueryVariables;
  };
  '#graphql\n  #graphql\n  #graphql\n  fragment UserCollection on Metaobject {\n    id\n    aboutMe: field(key: "about_me") {\n      value\n    }\n    active: field(key: "active") {\n      value\n    }\n    fullname: field(key: "fullname") {\n      value\n    }\n    professions: field(key: "professions") {\n      value\n    }\n    shortDescription: field(key: "short_description") {\n      value\n    }\n    username: field(key: "username") {\n      value\n    }\n    theme: field(key: "theme") {\n      value\n    }\n    image: field(key: "image") {\n      reference {\n        ... on MediaImage {\n          image {\n            width\n            height\n            url(transform: {})\n          }\n        }\n      }\n    }\n    collection: field(key: "collection") {\n      reference {\n        ... on Collection {\n          id\n          products(first: 3, sortKey: BEST_SELLING) {\n            nodes {\n              id\n              title\n              description\n              handle\n              vendor\n              productType\n              variants(first: 1) {\n                nodes {\n                  id\n                  compareAtPrice {\n                    amount\n                    currencyCode\n                  }\n                  price {\n                    amount\n                    currencyCode\n                  }\n                }\n              }\n              duration: metafield(key: "duration", namespace: "booking") {\n                id\n                value\n              }\n              locations: metafield(key: "locations", namespace: "booking") {\n                references(first: 3) {\n                  nodes {\n                    ... on Metaobject {\n                      id\n                      locationType: field(key: "location_type") {\n                        value\n                      }\n                      originType: field(key: "origin_type") {\n                        value\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n\n  fragment TreatmentsForCollection on Product {\n    id\n    title\n    description\n    handle\n    vendor\n    productType\n    variants(first: 1) {\n      nodes {\n        id\n        compareAtPrice {\n          amount\n          currencyCode\n        }\n        price {\n          amount\n          currencyCode\n        }\n      }\n    }\n    locations: metafield(key: "locations", namespace: "booking") {\n      references(first: 3) {\n        nodes {\n          ... on Metaobject {\n            id\n            locationType: field(key: "location_type") {\n              value\n            }\n            originType: field(key: "origin_type") {\n              value\n            }\n          }\n        }\n      }\n    }\n    duration: metafield(key: "duration", namespace: "booking") {\n      id\n      value\n    }\n    user: metafield(key: "user", namespace: "booking") {\n      reference {\n        ...UserCollection\n      }\n    }\n\n  }\n\n  query TreatmentCollection(\n    $handle: String!\n    $country: CountryCode\n    $language: LanguageCode\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n  ) @inContext(country: $country, language: $language) {\n    collection(handle: $handle) {\n      products(\n        first: $first,\n        last: $last,\n        before: $startCursor,\n        after: $endCursor,\n        filters: [{productMetafield: {namespace: "booking", key: "hide_from_profile", value: "false"}}, {productMetafield: {namespace: "system", key: "active",value: "true"}}]\n      ) {\n        filters {\n          id\n          label\n          values {\n            input\n            label\n            count\n          }\n        }\n        nodes {\n          ...TreatmentsForCollection\n        }\n        pageInfo {\n          hasPreviousPage\n          hasNextPage\n          endCursor\n          startCursor\n        }\n      }\n    }\n  }\n': {
    return: TreatmentCollectionQuery;
    variables: TreatmentCollectionQueryVariables;
  };
}

interface GeneratedMutationTypes {}

declare module '@shopify/hydrogen' {
  interface StorefrontQueries extends GeneratedQueryTypes {}
  interface StorefrontMutations extends GeneratedMutationTypes {}
}
