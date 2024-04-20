/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';

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
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type RecommendedTreatmentsQuery = {
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

export type ArtistServicesProductsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  query?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['String']['input']>;
}>;

export type ArtistServicesProductsQuery = {
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
  };
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

export type StoreTreatmentQueryVariables = StorefrontAPI.Exact<{
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

export type StoreTreatmentQuery = {
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
  '#graphql\n  #graphql\n  #graphql\n  fragment ProductCollection on Collection {\n    title\n    handle\n    icon:  metafield(namespace:"custom",  key: "icon") {\n      type\n      value\n    }\n  }\n\n  fragment MoneyProductItem on MoneyV2 {\n    amount\n    currencyCode\n  }\n\n  fragment ProductItem on Product {\n    id\n    title\n    description\n    handle\n    publishedAt\n    featuredImage {\n      id\n      altText\n      url(transform: { maxHeight: 250, maxWidth: 250, crop: CENTER })\n      width\n      height\n    }\n    priceRange {\n      minVariantPrice {\n        ...MoneyProductItem\n      }\n      maxVariantPrice {\n        ...MoneyProductItem\n      }\n    }\n    variants(first: 1) {\n      nodes {\n        id\n        selectedOptions {\n          name\n          value\n        }\n        price {\n          amount\n          currencyCode\n        }\n      }\n    }\n    collections(first:2) {\n      nodes {\n        ...ProductCollection\n      }\n    }\n  }\n\n  query RecommendedTreatments ($country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    products(first: 12, sortKey: RELEVANCE, reverse: true, query: "tag:treatments") {\n      nodes {\n        ...ProductItem\n      }\n    }\n  }\n': {
    return: RecommendedTreatmentsQuery;
    variables: RecommendedTreatmentsQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment ProductSearchSimple on Product {\n    id\n    title\n    handle\n  }\n\n  query ProductSearchQuery(\n    $collectionId: ID!\n    $country: CountryCode\n    $language: LanguageCode\n    $first: Int\n  ) @inContext(country: $country, language: $language) {\n    collection(id: $collectionId) {\n      products(first: $first) {\n        nodes {\n          ...ProductSearchSimple\n        }\n      }\n    }\n  }\n': {
    return: ProductSearchQueryQuery;
    variables: ProductSearchQueryQueryVariables;
  };
  '#graphql\n  query ProductVariantIds(\n    $country: CountryCode\n    $language: LanguageCode\n    $variantId: [ID!]!\n  ) @inContext(country: $country, language: $language) {\n    nodes(ids: $variantId){\n      ...on ProductVariant{\n        ...ProductVariant\n      }\n    }\n  }\n  #graphql\n  fragment ProductVariant on ProductVariant {\n    availableForSale\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    id\n    image {\n      __typename\n      id\n      url\n      altText\n      width\n      height\n    }\n    price {\n      amount\n      currencyCode\n    }\n    product {\n      title\n      handle\n    }\n    selectedOptions {\n      name\n      value\n    }\n    sku\n    title\n    unitPrice {\n      amount\n      currencyCode\n    }\n  }\n\n': {
    return: ProductVariantIdsQuery;
    variables: ProductVariantIdsQueryVariables;
  };
  '#graphql\n  fragment PredictiveArticle on Article {\n    __typename\n    id\n    title\n    handle\n    image {\n      url\n      altText\n      width\n      height\n    }\n    trackingParameters\n  }\n  fragment PredictiveCollection on Collection {\n    __typename\n    id\n    title\n    handle\n    image {\n      url\n      altText\n      width\n      height\n    }\n    trackingParameters\n  }\n  fragment PredictivePage on Page {\n    __typename\n    id\n    title\n    handle\n    trackingParameters\n  }\n  fragment PredictiveProduct on Product {\n    __typename\n    id\n    title\n    handle\n    trackingParameters\n    variants(first: 1) {\n      nodes {\n        id\n        image {\n          url\n          altText\n          width\n          height\n        }\n        price {\n          amount\n          currencyCode\n        }\n      }\n    }\n  }\n  fragment PredictiveQuery on SearchQuerySuggestion {\n    __typename\n    text\n    styledText\n    trackingParameters\n  }\n  query predictiveSearch(\n    $country: CountryCode\n    $language: LanguageCode\n    $limit: Int!\n    $limitScope: PredictiveSearchLimitScope!\n    $searchTerm: String!\n    $types: [PredictiveSearchType!]\n  ) @inContext(country: $country, language: $language) {\n    predictiveSearch(\n      limit: $limit,\n      limitScope: $limitScope,\n      query: $searchTerm,\n      types: $types,\n    ) {\n      articles {\n        ...PredictiveArticle\n      }\n      collections {\n        ...PredictiveCollection\n      }\n      pages {\n        ...PredictivePage\n      }\n      products {\n        ...PredictiveProduct\n      }\n      queries {\n        ...PredictiveQuery\n      }\n    }\n  }\n': {
    return: PredictiveSearchQuery;
    variables: PredictiveSearchQueryVariables;
  };
  '#graphql\n  #graphql\n  #graphql\n  fragment ProductCollection on Collection {\n    title\n    handle\n    icon:  metafield(namespace:"custom",  key: "icon") {\n      type\n      value\n    }\n  }\n\n  fragment MoneyProductItem on MoneyV2 {\n    amount\n    currencyCode\n  }\n\n  fragment ProductItem on Product {\n    id\n    title\n    description\n    handle\n    publishedAt\n    featuredImage {\n      id\n      altText\n      url(transform: { maxHeight: 250, maxWidth: 250, crop: CENTER })\n      width\n      height\n    }\n    priceRange {\n      minVariantPrice {\n        ...MoneyProductItem\n      }\n      maxVariantPrice {\n        ...MoneyProductItem\n      }\n    }\n    variants(first: 1) {\n      nodes {\n        id\n        selectedOptions {\n          name\n          value\n        }\n        price {\n          amount\n          currencyCode\n        }\n      }\n    }\n    collections(first:2) {\n      nodes {\n        ...ProductCollection\n      }\n    }\n  }\n\n  query ArtistServicesProducts(\n    $country: CountryCode\n    $language: LanguageCode\n    $first: Int\n    $query: String\n  ) @inContext(country: $country, language: $language) {\n    products(first: $first, sortKey: TITLE, query: $query) {\n      nodes {\n        ...ProductItem\n      }\n    }\n  }\n': {
    return: ArtistServicesProductsQuery;
    variables: ArtistServicesProductsQueryVariables;
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
  '#graphql\n  #graphql\n  #graphql\n  fragment ProductCollection on Collection {\n    title\n    handle\n    icon:  metafield(namespace:"custom",  key: "icon") {\n      type\n      value\n    }\n  }\n\n  fragment MoneyProductItem on MoneyV2 {\n    amount\n    currencyCode\n  }\n\n  fragment ProductItem on Product {\n    id\n    title\n    description\n    handle\n    publishedAt\n    featuredImage {\n      id\n      altText\n      url(transform: { maxHeight: 250, maxWidth: 250, crop: CENTER })\n      width\n      height\n    }\n    priceRange {\n      minVariantPrice {\n        ...MoneyProductItem\n      }\n      maxVariantPrice {\n        ...MoneyProductItem\n      }\n    }\n    variants(first: 1) {\n      nodes {\n        id\n        selectedOptions {\n          name\n          value\n        }\n        price {\n          amount\n          currencyCode\n        }\n      }\n    }\n    collections(first:2) {\n      nodes {\n        ...ProductCollection\n      }\n    }\n  }\n\n  query Collection(\n    $handle: String!\n    $country: CountryCode\n    $language: LanguageCode\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n  ) @inContext(country: $country, language: $language) {\n    collection(handle: $handle) {\n      id\n      handle\n      title\n      description\n      products(\n        first: $first,\n        last: $last,\n        before: $startCursor,\n        after: $endCursor,\n        sortKey: TITLE\n      ) {\n        nodes {\n          ...ProductItem\n        }\n        pageInfo {\n          hasPreviousPage\n          hasNextPage\n          endCursor\n          startCursor\n        }\n      }\n    }\n  }\n': {
    return: CollectionQuery;
    variables: CollectionQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment Collection on Collection {\n    id\n    title\n    handle\n    description\n    image {\n      id\n      url\n      altText\n      width\n      height\n    }\n    icon:  metafield(namespace:"custom",  key: "icon") {\n      type\n      value\n    }\n    color:  metafield(namespace:"custom",  key: "color") {\n      type\n      value\n    }\n  }\n\n  query StoreTreatment(\n    $country: CountryCode\n    $endCursor: String\n    $first: Int\n    $language: LanguageCode\n    $last: Int\n    $startCursor: String\n  ) @inContext(country: $country, language: $language) {\n    collections(\n      first: $first,\n      last: $last,\n      before: $startCursor,\n      sortKey: TITLE,\n      after: $endCursor,\n      query: "title:treatments:*"\n    ) {\n      nodes {\n        ...Collection\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n': {
    return: StoreTreatmentQuery;
    variables: StoreTreatmentQueryVariables;
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
}

interface GeneratedMutationTypes {}

declare module '@shopify/hydrogen' {
  interface StorefrontQueries extends GeneratedQueryTypes {}
  interface StorefrontMutations extends GeneratedMutationTypes {}
}
