import { c as createComponent, m as maybeRenderHead, b as addAttribute, r as renderComponent, a as renderTemplate, e as createAstro } from './astro/server.js';
import 'kleur/colors';
import { $ as $$HeaderLink } from './HeaderLink.js';
import { a as SITE_TITLE } from './consts.js';
/* empty css               */
import 'clsx';

const $$Header = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<header data-astro-cid-3ef6ksr2> <nav data-astro-cid-3ef6ksr2> <h2 data-astro-cid-3ef6ksr2><a${addAttribute(`${"/harry-blog/"}blog/`, "href")} data-astro-cid-3ef6ksr2>${SITE_TITLE}</a></h2> <div class="internal-links" data-astro-cid-3ef6ksr2> ${renderComponent($$result, "HeaderLink", $$HeaderLink, { "href": "/blog/", "data-astro-cid-3ef6ksr2": true }, { "default": ($$result2) => renderTemplate`Blog` })} ${renderComponent($$result, "HeaderLink", $$HeaderLink, { "href": "/about/", "data-astro-cid-3ef6ksr2": true }, { "default": ($$result2) => renderTemplate`About` })} </div> <div class="social-links" data-astro-cid-3ef6ksr2> ${renderComponent($$result, "HeaderLink", $$HeaderLink, { "href": "/resume/", "data-astro-cid-3ef6ksr2": true }, { "default": ($$result2) => renderTemplate`履歷` })} </div> </nav> </header> `;
}, "/home/runner/work/harry-blog/harry-blog/src/components/Header.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const today = /* @__PURE__ */ new Date();
  return renderTemplate`${maybeRenderHead()}<footer data-astro-cid-sz7xmlte>
&copy; ${today.getFullYear()} Harry. All rights reserved.
<div class="social-links" data-astro-cid-sz7xmlte> <a${addAttribute(`${"/harry-blog/"}blog/`, "href")} data-astro-cid-sz7xmlte>Blog</a> <a${addAttribute(`${"/harry-blog/"}about/`, "href")} data-astro-cid-sz7xmlte>About</a> <a href="https://drive.google.com/drive/folders/1R9Y6o3wxsuKGQ9Apyif0nuUccLHtDHHr" target="_blank" rel="noreferrer" data-astro-cid-sz7xmlte>
技術履歷
</a> <a href="https://podcasts.apple.com/tw/podcast/%E5%A6%96%E4%BD%A0%E8%81%BD%E6%96%B0%E8%81%9E/id1836788949" target="_blank" rel="noreferrer" data-astro-cid-sz7xmlte>
妖你聽新聞（Podcast）
</a> </div> </footer> `;
}, "/home/runner/work/harry-blog/harry-blog/src/components/Footer.astro", void 0);

const $$Astro = createAstro("https://harryfan.github.io");
const $$FormattedDate = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$FormattedDate;
  const { date } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<time${addAttribute(date.toISOString(), "datetime")}> ${date.toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })} </time>`;
}, "/home/runner/work/harry-blog/harry-blog/src/components/FormattedDate.astro", void 0);

export { $$Header as $, $$FormattedDate as a, $$Footer as b };
