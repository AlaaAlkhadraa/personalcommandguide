/**
 * The curated V2 visual library.
 *
 * Every image here was chosen for a specific place on the site. They are
 * stored once, at 1024px square (the size the source library ships at), and
 * next/image narrows them per device. Each carries a 16px placeholder so a
 * slow connection sees the composition rather than an empty box.
 *
 * Sizes are declared here rather than at each call site so a component can
 * never guess an aspect ratio wrong and cause layout shift.
 */

export interface SiteImage {
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
}

export const IMAGES = {
  "hero-horizon": {
    src: "/v2/hero-horizon.webp",
    width: 1024,
    height: 1024,
    blurDataURL:
      "data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADwAQCdASoQABAABABoJQBOj+ADArSnKoAA/vaGAxLpFEDFlkO0u/TXd7npbOl9WZFJJbrr+OBZ3YFXwAA=",
  },
  "hero-floor": {
    src: "/v2/hero-floor.webp",
    width: 1024,
    height: 1024,
    blurDataURL:
      "data:image/webp;base64,UklGRj4AAABXRUJQVlA4IDIAAADwAQCdASoQABAABABoJQBOgCHgWZhD3AAA/vaFZjCHjUCh1eaLjhH0LiDyOJ4XtqPAAA==",
  },
  "global-map": {
    src: "/v2/global-map.webp",
    width: 1024,
    height: 1024,
    blurDataURL:
      "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAAAQAgCdASoQABAABABoJbACdAEN5bdMtgUAAP7vZ3CJrqmE6kvTp5ZvwCtLYR/FvTUKMDGerLSl7KW+OQNKOAAA",
  },
  "global-globe": {
    src: "/v2/global-globe.webp",
    width: 1024,
    height: 1024,
    blurDataURL:
      "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAADwAQCdASoQABAABABoJZACdAEO5uoo+uAA/vRPmT0SfccL3DlwFBc0WB5H0Mq5VtIgh+FfZiqPwd+i+SwXo8JdUgjkmCPAAAA=",
  },
  "atmos-path": {
    src: "/v2/atmos-path.webp",
    width: 1024,
    height: 1024,
    blurDataURL:
      "data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAADwAQCdASoQABAABABoJZgCdAEO+ysirYAA/vaIeVzPOjXJjSfrsWaNv3WhOo06AImd0rShg08VQAAA",
  },
  "atmos-wave": {
    src: "/v2/atmos-wave.webp",
    width: 1024,
    height: 1024,
    blurDataURL:
      "data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAABwAQCdASoQABAABABoJYgCdAF1AAD+8RBuH9MsVFnZ1jlSvXD+2YEn/M0uR458pD5j1rwA",
  },
  "atmos-network": {
    src: "/v2/atmos-network.webp",
    width: 1024,
    height: 1024,
    blurDataURL:
      "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAADwAQCdASoQABAABABoJZACdAEO+M6R/8AA/vaD4aIcmLpCIlcrvX0oD7n9qpAFqsV637yaMpRRizLncEVA2AAA",
  },
  "service-web-design": {
    src: "/v2/service-web-design.webp",
    width: 1024,
    height: 1024,
    blurDataURL:
      "data:image/webp;base64,UklGRnQAAABXRUJQVlA4IGgAAAAwAgCdASoQABAABABoJaACdAEPhiwpHsczAAD+6aaLUW0y7i56rYvf95nY0uTbSrj3f3i5ZJlotKPXfjo5qvNXq8JctE56OMebqX9xcrmSqiBoP0WBOwL35WmFgzHKcZKrC3jQ/9YAAA==",
  },
  "service-web-apps": {
    src: "/v2/service-web-apps.webp",
    width: 1024,
    height: 1024,
    blurDataURL:
      "data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAADQAQCdASoQABAABABoJQBOgCHgSM59AAD+7A+v7fAQBhYM5lcfFBJhe4Nh6M7pHWMLJmlrxfCNNc4ZSOneNHGXsVd3S/WGtgJGF4RaF5F9LzWK4QPMT/YI8AA=",
  },
  "service-uiux": {
    src: "/v2/service-uiux.webp",
    width: 1024,
    height: 1024,
    blurDataURL:
      "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAABQAgCdASoQABAABABoJQBOgMXX3Kn654B+iAAA/vaNcIhR/r1C5m9mAGtFnJEuF06+THqYM7K/moa2iBMD6Gvt21hBiue/QPq33vI6EmAAAA==",
  },
  "service-maintenance": {
    src: "/v2/service-maintenance.webp",
    width: 1024,
    height: 1024,
    blurDataURL:
      "data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAAAwAgCdASoQABAABABoJYgCdAEO+4fa9rAxwAD+8p/FKv753sA3LOXJlu1cEoV3VavwgCETFXKFcpueRqokYdNKYAA=",
  },
  "project-tajex": {
    src: "/v2/project-tajex.webp",
    width: 1024,
    height: 1024,
    blurDataURL:
      "data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAABQAgCdASoQABAABABoJZgCdAEPD34995hWDAAA/vDkOXbo/o7a24ATZnwNC2NSTCrrkHbLByfDcNMvAgw8AA==",
  },
  "project-barbershop": {
    src: "/v2/project-barbershop.webp",
    width: 1024,
    height: 1024,
    blurDataURL:
      "data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAADQAQCdASoQABAABABoJZQAAp/dQg8wAAD+9HAFKjzCO34lIXeDUJ7axC+MsYxAGcJOPsVMUaIH6hAA",
  },
  "project-garage": {
    src: "/v2/project-garage.webp",
    width: 1024,
    height: 1024,
    blurDataURL:
      "data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAAAwAgCdASoQABAABABoJZACdAEQUJViexMfAAD+9FMPoHvXkOuCIxNHxhHsYq/fC/WQqbdy1z9EqxNtrPLQ0MUHsvd752oTQ/MeloUqR9QtPSEai8RgAA==",
  },
  "project-accounting": {
    src: "/v2/project-accounting.webp",
    width: 1024,
    height: 1024,
    blurDataURL:
      "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADQAQCdASoQABAABABoJYgCdAD0g4YfkAD+7ESQ29SLdtZJ/8vQcrrF9X9rEMeal/hd8Hq2BWILnhTgM4Y+pudkUQRdxAAA",
  },
  "project-property": {
    src: "/v2/project-property.webp",
    width: 1024,
    height: 1024,
    blurDataURL:
      "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAABQAgCdASoQABAABABoJagCdAEU+M7X92stSAAA/vFPZMtntQNWlJxVaSLPGxNeT7aQLzMq76t00vbVPz603mpn5SX0P6XcnaRJ+AAA",
  },
  "store-hero": {
    src: "/v2/store-hero.webp",
    width: 1024,
    height: 1024,
    blurDataURL:
      "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAAAQAgCdASoQABAABABoJZACdADRN1hqZpgAAP7w363rIySOxGYXkXFJmVjH1c9tA7w2bliwxIEmbIDnQq5Vu7G+NYtYWRvKILUFk4uTrhIAAA==",
  },
  "store-audio": {
    src: "/v2/store-audio.webp",
    width: 1024,
    height: 1024,
    blurDataURL:
      "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAADwAQCdASoQABAABABoJQBOgB6V7xMgxQAA+9KYoySvZpswjuA14tpL+ryYd1xeJaHkwxeRREUhU38wsswmyCTDgh6IH3jTzyV4OSu3ua0lvk+AAAA=",
  },
  "store-lineup": {
    src: "/v2/store-lineup.webp",
    width: 1024,
    height: 1024,
    blurDataURL:
      "data:image/webp;base64,UklGRkIAAABXRUJQVlA4IDYAAADwAQCdASoQABAABABoJZQCdAEPDet1IAAA/vQpA07LT7I6v1r1Zn073+d1t0kR1Vs5EHjLgAA=",
  },
  "store-desk": {
    src: "/v2/store-desk.webp",
    width: 1024,
    height: 1024,
    blurDataURL:
      "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAAAwAgCdASoQABAABABoJYgCdAEN/wBXSJg+AAD+8rHOq0rcOdndDATgnkgymIhXkE84LMwY/cqnJTXajHCm1gN3MC5biaGYNTDbRSLgUVr8AA==",
  },
  "product-headphones": {
    src: "/v2/product-headphones.webp",
    width: 720,
    height: 720,
    blurDataURL:
      "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAAAwAgCdASoQABAABABoJZACdAEPSV9ICOBoAAD+7o7BHyrwuMWrrORhzcO/z0mh1HfTSQvrx7aAR4cNTtVAmRTIAL6Dwr1ngm6tBFsYAAA=",
  },
  "product-earbuds": {
    src: "/v2/product-earbuds.webp",
    width: 720,
    height: 720,
    blurDataURL:
      "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAAAQAgCdASoQABAABABoJQBOgB9SuEV78OWAAP7y/fRb0BnJbL4/GXjlMtxmS1+3K0eBPlzMgXkU5WaZDwU3VNyvkb0qKbrfgAA=",
  },
  "product-speaker": {
    src: "/v2/product-speaker.webp",
    width: 720,
    height: 720,
    blurDataURL:
      "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAAAwAgCdASoQABAABABoJZgCdAD2BKzZmMt0IAD+5vAimEJqGAMemLgcMEXeRYAkYAHB5YdPH8LUlAL5bF6E0AcD1RhwmLsAAAA=",
  },
  "product-watch": {
    src: "/v2/product-watch.webp",
    width: 720,
    height: 720,
    blurDataURL:
      "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAABwAQCdASoQABAABABoJYwCdAFAAAD+8LewDjJ77u6/dXQ6SgvKG6Lyxw4+o4zAx9N0VlNW9qZfVG/V/TRtgAAA",
  },
  "product-phone": {
    src: "/v2/product-phone.webp",
    width: 720,
    height: 720,
    blurDataURL:
      "data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAADQAQCdASoQABAABABoJZQCdAD2OvLoAAD+8q8fCp70kELSJBE1oqIjQm2AAA==",
  },
  "product-headset": {
    src: "/v2/product-headset.webp",
    width: 720,
    height: 720,
    blurDataURL:
      "data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAABQAgCdASoQABAABABoJYwCdAEQYxht4HsFeAAA/vRUxZN18HJ+UQ533cnluo7IXNfO9YIy47qI87LP2+/m9w2LvhuhqkQTeyjULT6DeRG1c7kt8nwAAA==",
  },
  "env-city": {
    src: "/v2/env-city.webp",
    width: 1400,
    height: 848,
    blurDataURL:
      "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAAAQAgCdASoQABAABABoJZgCdAEPAOIppkoAAP7zIluJjAY9oza+jJk1Hp8X0C2attI7s6S8dNqT0/aYHjz7Bf9DZsMZ4AAA",
  },
  "env-floor": {
    src: "/v2/env-floor.webp",
    width: 1400,
    height: 848,
    blurDataURL:
      "data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAADwAQCdASoQABAABABoJYgCdAD0YRPkcAAA/s9frry3Dtw14F6SGivBwAM/Ss08QA83NAWPr6HO9oAA",
  },
  "env-fog": {
    src: "/v2/env-fog.webp",
    width: 1400,
    height: 766,
    blurDataURL:
      "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAAAQAgCdASoQABAABABoJaACdAD0pcsJ0MbAAP7CYVrXH7T7jG+2HEdYWFa3GKf0UYDh37IooQpqpM/DD6PG+kDcz7xSaG1AAAA=",
  },
  "env-map": {
    src: "/v2/env-map.webp",
    width: 1600,
    height: 1600,
    blurDataURL:
      "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAAAQAgCdASoQABAABABoJbACdAEN5bdMtgUAAP7vZ3CJrqmE6kvTp5ZvwCtLYR/FvTUKMDGerLSl7KW+OQNKOAAA",
  },
  "rock-a": {
    src: "/v2/rock-a.webp",
    width: 512,
    height: 512,
    blurDataURL:
      "data:image/webp;base64,UklGRugAAABXRUJQVlA4WAoAAAAQAAAADwAADwAAQUxQSIMAAAABcBIATGUNeV+FQtIASQTk7FWgwzQh8OcJQAF6EGAF7v/2IkSEwrZtm+ydtGfAjWrQxuhBwRsH6wNi8HZ4weowUkoU0a2P7TbKpdaSaXMDKIu0t87c205o1eBjbnzcyC1HP+hApR8v7IWCNpgqv4FrQiOD7Mgl8iDxH8R/+uMfQfxnAABWUDggPgAAAHABAJ0BKhAAEAAEAGglLsAjABFgAP7wt6ssOKy91Fj7tv4SfsTmzbxmgO0ThVqT0VnzQRjpGsyXCVjBAAAA",
  },
  "rock-b": {
    src: "/v2/rock-b.webp",
    width: 512,
    height: 512,
    blurDataURL:
      "data:image/webp;base64,UklGRu4AAABXRUJQVlA4WAoAAAAQAAAADwAADwAAQUxQSIMAAAABcBIATGUNeV+FQtIASQTk7FWgwzQh8OcJQAF6EGAF7v/2IkSEwrZtm+ydtGfAjWrQxuhBwRsH6wNi8HZ4weowUkoU0a2P7TbKpdaSaXMDKIu0t87c205o1eBjbnzcyC1HP+hApR8v7IWCNpgqv4FrQiOD7Mgl8iDxH8R/+uMfQfxnAABWUDggRAAAABACAJ0BKhAAEAAEAGgllAJ0AN0pMfoi/AAA/vMHM+FTJ27VDv3kv2CWsdGdWQaJCReDOmIjteRrH8UAAYBz3SBNmwAA",
  },
  "rock-c": {
    src: "/v2/rock-c.webp",
    width: 512,
    height: 512,
    blurDataURL:
      "data:image/webp;base64,UklGRugAAABXRUJQVlA4WAoAAAAQAAAADwAADwAAQUxQSIMAAAABcBIATGUNeV+FQtIASQTk7FWgwzQh8OcJQAF6EGAF7v/2IkSEwrZtm+ydtGfAjWrQxuhBwRsH6wNi8HZ4weowUkoU0a2P7TbKpdaSaXMDKIu0t87c205o1eBjbnzcyC1HP+hApR8v7IWCNpgqv4FrQiOD7Mgl8iDxH8R/+uMfQfxnAABWUDggPgAAABACAJ0BKhAAEAAEAGglkAJ0AQ70ltyYvAAA/uv8R+jvkePjXsFd1lZSfiTN5gKd1Yrs5k94ynMPBXXXAAAA",
  },
  "z-still": {
    src: "/v2/z-still.webp",
    width: 900,
    height: 900,
    blurDataURL:
      "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAAAQAgCdASoQABAAA4BaJbACdAEf/x/CgWUAAP713ITxiRNGzbVbtwkA0o5rDKq0qPbhJQJeabw1IiwIbQl+bdBLwtCTnV4Jxq3V5VwAAAA=",
  },
} as const satisfies Record<string, SiteImage>;

export type ImageKey = keyof typeof IMAGES;
