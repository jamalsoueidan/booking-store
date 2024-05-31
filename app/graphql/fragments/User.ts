export const USER_FRAGMENT = `#graphql
  fragment User on Metaobject {
    id
    aboutMe: field(key: "about_me") {
      value
    }
    active: field(key: "active") {
      value
    }
    fullname: field(key: "fullname") {
      value
    }
    professions: field(key: "professions") {
      value
    }
    specialties: field(key: "specialties") {
      value
    }
    social: field(key: "social") {
      value
    }
    shortDescription: field(key: "short_description") {
      value
    }
    username: field(key: "username") {
      value
    }
    theme: field(key: "theme") {
      value
    }
    image: field(key: "image") {
      reference {
        ... on MediaImage {
          image {
            width
            height
            url(transform: { maxHeight: 250, maxWidth: 250, crop: CENTER })
          }
        }
      }
    }
  }
` as const;
