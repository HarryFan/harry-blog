import { e as createAstro, c as createComponent, r as renderComponent, d as renderHead, b as addAttribute, f as renderSlot, a as renderTemplate } from './astro/server.js';
import 'kleur/colors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { $ as $$BaseHead } from './BaseHead.js';
import { $ as $$Header, a as $$FormattedDate, b as $$Footer } from './FormattedDate.js';
/* empty css               */

const $$Astro = createAstro("https://harryfan.github.io");
const $$BlogPost = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BlogPost;
  const { title, description, pubDate, updatedDate, heroImage } = Astro2.props;
  const publicDir = fileURLToPath(new URL("../../public/", import.meta.url));
  const resolveHeroSrc = (input) => {
    if (!input) return void 0;
    if (!input.startsWith("/")) return input;
    const absolutePath = path.join(publicDir, input.slice(1));
    if (!fs.existsSync(absolutePath)) return void 0;
    return `${"/harry-blog/"}${input.slice(1)}`;
  };
  const heroSrc = resolveHeroSrc(heroImage);
  const hashTitle = (input) => {
    let hash = 5381;
    for (let i = 0; i < input.length; i += 1) {
      hash = (hash << 5) + hash ^ input.charCodeAt(i);
    }
    return hash >>> 0;
  };
  const coverSvgDataUri = (postTitle) => {
    const hash = hashTitle(postTitle);
    const hueA = hash % 360;
    const hueB = (hueA + 60 + (hash >>> 8) % 120) % 360;
    const hueC = (hueB + 40 + (hash >>> 16) % 80) % 360;
    const a = `hsl(${hueA} 85% 55%)`;
    const b = `hsl(${hueB} 90% 50%)`;
    const c = `hsl(${hueC} 85% 60%)`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="720" viewBox="0 0 1440 720"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="0.55" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient><linearGradient id="s" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="rgba(0,0,0,0.55)"/><stop offset="0.65" stop-color="rgba(0,0,0,0)"/></linearGradient><pattern id="p" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(28)"><rect width="18" height="18" fill="none"/><path d="M0 9H18" stroke="rgba(255,255,255,0.13)" stroke-width="2"/></pattern></defs><rect width="1440" height="720" fill="url(#g)"/><rect width="1440" height="720" fill="url(#p)" opacity="0.75"/><rect width="1440" height="720" fill="url(#s)"/><g opacity="0.9" fill="rgba(255,255,255,0.85)" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" font-weight="700" letter-spacing="0.28em" font-size="22"><text x="72" y="92">HARRY BLOG</text></g><g opacity="0.75" fill="rgba(255,255,255,0.9)" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" font-weight="800" font-size="48"><text x="72" y="660">${postTitle.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</text></g><g opacity="0.65" fill="rgba(255,255,255,0.75)" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace" font-size="16"><text x="72" y="138">HASH:${hash.toString(16).padStart(8, "0")}</text></g></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  };
  const coverSrc = heroSrc ?? coverSvgDataUri(title);
  return renderTemplate`<html lang="en" data-astro-cid-bvzihdzo> <head>${renderComponent($$result, "BaseHead", $$BaseHead, { "title": title, "description": description, "data-astro-cid-bvzihdzo": true })}${renderHead()}</head> <body data-astro-cid-bvzihdzo> ${renderComponent($$result, "Header", $$Header, { "data-astro-cid-bvzihdzo": true })} <main data-astro-cid-bvzihdzo> <article data-astro-cid-bvzihdzo> <div class="hero-image" data-astro-cid-bvzihdzo> <img${addAttribute(1020, "width")}${addAttribute(510, "height")}${addAttribute(coverSrc, "src")} alt="" data-astro-cid-bvzihdzo> </div> <div class="prose" data-astro-cid-bvzihdzo> <div class="title" data-astro-cid-bvzihdzo> <div class="date" data-astro-cid-bvzihdzo> ${renderComponent($$result, "FormattedDate", $$FormattedDate, { "date": pubDate, "data-astro-cid-bvzihdzo": true })} ${updatedDate && renderTemplate`<div class="last-updated-on" data-astro-cid-bvzihdzo>
Last updated on ${renderComponent($$result, "FormattedDate", $$FormattedDate, { "date": updatedDate, "data-astro-cid-bvzihdzo": true })} </div>`} </div> <h1 data-astro-cid-bvzihdzo>${title}</h1> <hr data-astro-cid-bvzihdzo> </div> ${renderSlot($$result, $$slots["default"])} </div> </article> </main> ${renderComponent($$result, "Footer", $$Footer, { "data-astro-cid-bvzihdzo": true })} </body></html>`;
}, "/home/runner/work/harry-blog/harry-blog/src/layouts/BlogPost.astro", void 0);

export { $$BlogPost as $ };
