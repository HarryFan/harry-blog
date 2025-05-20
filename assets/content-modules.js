const contentModules = new Map([
["src/content/blog/using-mdx.mdx", () => import('./using-mdx.js')]]);

export { contentModules as default };
