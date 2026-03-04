import { createFileRoute } from "@tanstack/react-router";
import { ensureAuth, sdk } from "@/lib/storefront";

const SITE_URL = "https://linea-static.demo.commercengine.com";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        await ensureAuth();

        const [categoriesResult, productsResult] = await Promise.all([
          sdk.catalog.listCategories(),
          sdk.catalog.listProducts({ page: 1, limit: 100 }),
        ]);

        const categories = categoriesResult.data?.categories ?? [];
        const products = productsResult.data?.products ?? [];

        const staticPages = [
          { loc: SITE_URL, priority: "1.0", changefreq: "daily" },
          { loc: `${SITE_URL}/about/our-story`, priority: "0.5", changefreq: "monthly" },
          { loc: `${SITE_URL}/about/sustainability`, priority: "0.5", changefreq: "monthly" },
          { loc: `${SITE_URL}/about/size-guide`, priority: "0.5", changefreq: "monthly" },
          { loc: `${SITE_URL}/about/customer-care`, priority: "0.5", changefreq: "monthly" },
          { loc: `${SITE_URL}/about/store-locator`, priority: "0.5", changefreq: "monthly" },
          { loc: `${SITE_URL}/privacy-policy`, priority: "0.3", changefreq: "yearly" },
          { loc: `${SITE_URL}/terms-of-service`, priority: "0.3", changefreq: "yearly" },
        ];

        const categoryPages = categories.map((c) => ({
          loc: `${SITE_URL}/category/${c.slug}`,
          priority: "0.8",
          changefreq: "daily",
        }));

        const productPages = products.map((p) => ({
          loc: `${SITE_URL}/product/${p.slug}`,
          priority: "0.9",
          changefreq: "weekly",
        }));

        const allPages = [...staticPages, ...categoryPages, ...productPages];

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

        return new Response(sitemap, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
