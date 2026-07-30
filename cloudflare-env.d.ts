// Declares our Wrangler bindings on the global CloudflareEnv type used by @opennextjs/cloudflare.
// Keep this in sync with the bindings declared in wrangler.toml.
interface CloudflareEnv {
  DB: D1Database;
  PRODUCT_IMAGES: R2Bucket;
}
