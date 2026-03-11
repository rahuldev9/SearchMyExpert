/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://searchmyexpert-psi.vercel.app",

  generateRobotsTxt: true,
  sitemapSize: 7000,

  changefreq: "weekly",
  priority: 0.7,

  exclude: ["/api/*", "/dashboard/*", "/login", "/signup"],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },

  //   additionalPaths: async (config) => {
  //     const experts = ["john-doe", "zapier-expert"];

  //     return experts.map((slug) => ({
  //       loc: `/experts/${slug}`,
  //       changefreq: "weekly",
  //       priority: 0.8,
  //       lastmod: new Date().toISOString(),
  //     }));
  //   },
};
