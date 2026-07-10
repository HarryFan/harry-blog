import { e as createAstro, c as createComponent, m as maybeRenderHead, b as addAttribute, s as spreadAttributes, f as renderSlot, a as renderTemplate, r as renderComponent } from './astro/server.js';
import 'kleur/colors';
/* empty css               */
import 'clsx';
import { a as SITE_TITLE } from './consts.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const $$Astro$1 = createAstro("https://harryfan.github.io");
const $$HeaderLink = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$HeaderLink;
  const { href, class: className, ...props } = Astro2.props;
  const rawHref = typeof href === "string" ? href : href?.toString() ?? "/";
  const normalizePath = (input) => {
    const base = "/";
    let path = input.startsWith(base) ? input.slice(base.length - 1) : input;
    if (!path.startsWith("/")) path = `/${path}`;
    path = path.replace(/\/+/g, "/");
    if (path.length > 1) path = path.replace(/\/$/, "");
    return path;
  };
  const currentPath = normalizePath(Astro2.url.pathname);
  const targetPath = normalizePath(rawHref);
  const currentTopLevel = `/${currentPath.split("/").filter(Boolean)[0] ?? ""}`;
  const isActive = targetPath === currentPath || targetPath !== "/" && targetPath === currentTopLevel;
  const resolvedHref = rawHref.startsWith("/") ? `${"/"}${rawHref.slice(1)}` : rawHref;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(resolvedHref, "href")}${addAttribute([className, { active: isActive }], "class:list")}${addAttribute(isActive ? "page" : void 0, "aria-current")}${spreadAttributes(props)} data-astro-cid-eimmu3lg> ${renderSlot($$result, $$slots["default"])} </a> `;
}, "/Users/gangshuanfan/Documents/Astro/harry-blog/src/components/HeaderLink.astro", void 0);

const $$Header = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<header data-astro-cid-3ef6ksr2> <nav data-astro-cid-3ef6ksr2> <h2 data-astro-cid-3ef6ksr2><a${addAttribute(`${"/"}blog/`, "href")} data-astro-cid-3ef6ksr2>${SITE_TITLE}</a></h2> <div class="internal-links" data-astro-cid-3ef6ksr2> ${renderComponent($$result, "HeaderLink", $$HeaderLink, { "href": "/blog/", "data-astro-cid-3ef6ksr2": true }, { "default": ($$result2) => renderTemplate`Blog` })} ${renderComponent($$result, "HeaderLink", $$HeaderLink, { "href": "/about/", "data-astro-cid-3ef6ksr2": true }, { "default": ($$result2) => renderTemplate`About` })} </div> <div class="social-links" data-astro-cid-3ef6ksr2> ${renderComponent($$result, "HeaderLink", $$HeaderLink, { "href": "/resume/", "data-astro-cid-3ef6ksr2": true }, { "default": ($$result2) => renderTemplate`Resume` })} </div> </nav> </header> `;
}, "/Users/gangshuanfan/Documents/Astro/harry-blog/src/components/Header.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const today = /* @__PURE__ */ new Date();
  return renderTemplate`${maybeRenderHead()}<footer data-astro-cid-sz7xmlte>
&copy; ${today.getFullYear()} Harry. All rights reserved.
<div class="social-links" data-astro-cid-sz7xmlte> <a${addAttribute(`${"/"}blog/`, "href")} data-astro-cid-sz7xmlte>Blog</a> <a${addAttribute(`${"/"}about/`, "href")} data-astro-cid-sz7xmlte>About</a> <a href="https://drive.google.com/drive/folders/1R9Y6o3wxsuKGQ9Apyif0nuUccLHtDHHr" target="_blank" rel="noopener noreferrer" data-astro-cid-sz7xmlte>
技術履歷
<span class="sr-only" data-astro-cid-sz7xmlte>（新分頁開啟）</span> </a> <a href="http://linktr.ee/yaonews" target="_blank" rel="noopener noreferrer" data-astro-cid-sz7xmlte>
妖你聽新聞
<span class="sr-only" data-astro-cid-sz7xmlte>（新分頁開啟）</span> </a> </div> </footer> `;
}, "/Users/gangshuanfan/Documents/Astro/harry-blog/src/components/Footer.astro", void 0);

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
}, "/Users/gangshuanfan/Documents/Astro/harry-blog/src/components/FormattedDate.astro", void 0);

const publicDir = fileURLToPath(new URL("../../public/", import.meta.url));
const escapeSvgText = (input) => input.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const hashTitle = (input) => {
  let hash = 5381;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) + hash ^ input.charCodeAt(i);
  }
  return hash >>> 0;
};
const resolveHeroSrc = (input) => {
  if (!input) return void 0;
  if (!input.startsWith("/")) return input;
  const absolutePath = path.join(publicDir, input.slice(1));
  if (!fs.existsSync(absolutePath)) return void 0;
  return `${"/"}${input.slice(1)}`;
};
const coverSvgDataUri = (postTitle) => {
  const hash = hashTitle(postTitle);
  const rotateA = hash % 9 - 4;
  const rotateB = (hash >>> 8) % 13 - 6;
  const stripe = 10 + hash % 8;
  const label = hash.toString(16).padStart(8, "0").slice(0, 6).toUpperCase();
  const title = escapeSvgText(postTitle);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="720" viewBox="0 0 1440 720">
		<defs>
			<pattern id="stripes" width="${stripe * 2}" height="${stripe * 2}" patternUnits="userSpaceOnUse" patternTransform="rotate(32)">
				<rect width="${stripe * 2}" height="${stripe * 2}" fill="#f4e6cf"/>
				<rect width="${stripe}" height="${stripe * 2}" fill="#1f1b17"/>
			</pattern>
			<filter id="paper">
				<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
				<feColorMatrix type="saturate" values="0"/>
				<feComponentTransfer>
					<feFuncA type="table" tableValues="0 0.045"/>
				</feComponentTransfer>
			</filter>
		</defs>
		<rect width="1440" height="720" fill="#f4e6cf"/>
		<rect width="1440" height="720" filter="url(#paper)" opacity="0.55"/>
		<rect x="72" y="72" width="1296" height="576" fill="none" stroke="#1f1b17" stroke-width="8"/>
		<rect x="930" y="82" width="330" height="330" fill="url(#stripes)" stroke="#1f1b17" stroke-width="8" transform="rotate(${rotateA} 1095 247)"/>
		<rect x="790" y="252" width="410" height="220" fill="#137f73" stroke="#1f1b17" stroke-width="8" transform="rotate(${rotateB} 995 362)"/>
		<circle cx="1215" cy="510" r="108" fill="#df3f31" stroke="#1f1b17" stroke-width="8"/>
		<rect x="116" y="112" width="300" height="58" fill="#df3f31" stroke="#1f1b17" stroke-width="6" transform="rotate(-2 266 141)"/>
		<text x="142" y="151" fill="#fbf3e5" font-family="Atkinson, ui-sans-serif, system-ui, sans-serif" font-weight="700" font-size="24" letter-spacing="8">HARRY / TECH</text>
		<rect x="116" y="190" width="185" height="48" fill="#edbd37" stroke="#1f1b17" stroke-width="5"/>
		<text x="138" y="222" fill="#1f1b17" font-family="Atkinson, ui-sans-serif, system-ui, sans-serif" font-weight="700" font-size="18" letter-spacing="5">FIELD ${label}</text>
		<text x="116" y="575" fill="#1f1b17" font-family="Georgia, Times New Roman, serif" font-weight="800" font-size="64">${title}</text>
		<path d="M116 610H760" stroke="#137f73" stroke-width="12"/>
	</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export { $$Header as $, $$FormattedDate as a, $$Footer as b, coverSvgDataUri as c, resolveHeroSrc as r };
