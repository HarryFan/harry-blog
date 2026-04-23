# Contempo Eclectic Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert `harry-blog` into a maintainable Contempo Eclectic editorial system while preserving fast Astro static pages and readable long-form technical posts.

**Architecture:** Add a small shared deterministic cover generator, then update the existing Astro components and page-local CSS to consume a consistent global token system. Keep the implementation CSS-first, local, and framework-free; page structure changes stay close to existing files.

**Tech Stack:** Astro 5, TypeScript, plain CSS, local Atkinson font files, npm build verification.

---

## File Structure

- Create: `src/utils/contempoCover.ts`
  - Owns deterministic SVG fallback cover generation and local `public/` hero image resolution.
  - Replaces duplicated helper logic currently in `src/pages/blog/index.astro` and `src/layouts/BlogPost.astro`.
- Modify: `src/styles/global.css`
  - Owns design tokens, base typography, prose, code, blockquote, media, and global focus states.
- Modify: `src/components/Header.astro`
  - Owns masthead navigation styling and active-link treatment.
- Modify: `src/components/Footer.astro`
  - Owns footer layout and editorial link styling.
- Modify: `src/pages/blog/index.astro`
  - Owns blog homepage intro deck and article list/card layout.
- Modify: `src/layouts/BlogPost.astro`
  - Owns article hero, title/date block, and prose container.
- Modify: `src/pages/about.astro`
  - Aligns About page sections with the new token system.
- Modify: `src/pages/resume.astro`
  - Aligns Resume page sections with the new token system while keeping it professional.

## Task 1: Global Editorial Tokens

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Replace the root tokens**

Replace the existing `:root` block with:

```css
:root {
	--accent: #137f73;
	--accent-dark: #0c5149;
	--paper: #f4e6cf;
	--paper-soft: #fbf3e5;
	--paper-deep: #e9cfaa;
	--ink: 31, 27, 23;
	--black: 31, 27, 23;
	--muted: 104, 87, 70;
	--gray: 104, 87, 70;
	--gray-light: 226, 199, 161;
	--gray-dark: 52, 43, 35;
	--red: #df3f31;
	--yellow: #edbd37;
	--teal: #137f73;
	--clay: #a3543f;
	--rule: rgba(var(--ink), 0.9);
	--soft-rule: rgba(var(--ink), 0.18);
	--gray-gradient: color-mix(in srgb, var(--paper-deep) 42%, transparent), var(--paper);
	--box-shadow: 10px 10px 0 var(--yellow);
	--box-shadow-red: 10px 10px 0 var(--red);
	--content-width: 720px;
	--wide-width: 1080px;
	--radius: 6px;
}
```

- [ ] **Step 2: Replace global base styles**

Keep the two `@font-face` blocks, then replace the body/main/headings/link/media/code/blockquote/hr section before `.sr-only` with:

```css
* {
	box-sizing: border-box;
}

body {
	font-family: 'Atkinson', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
	margin: 0;
	padding: 0;
	text-align: left;
	background:
		linear-gradient(90deg, rgba(var(--ink), 0.035) 1px, transparent 1px),
		linear-gradient(180deg, rgba(var(--ink), 0.025) 1px, transparent 1px),
		var(--paper);
	background-size: 42px 42px, 42px 42px, auto;
	word-wrap: break-word;
	overflow-wrap: break-word;
	color: rgb(var(--gray-dark));
	font-size: 20px;
	line-height: 1.72;
}

body::before {
	content: '';
	position: fixed;
	inset: 0;
	z-index: -1;
	pointer-events: none;
	background:
		radial-gradient(circle at 10% 8%, rgba(223, 63, 49, 0.12) 0 90px, transparent 92px),
		radial-gradient(circle at 92% 16%, rgba(19, 127, 115, 0.11) 0 120px, transparent 122px),
		linear-gradient(135deg, transparent 0 78%, rgba(237, 189, 55, 0.18) 78% 82%, transparent 82%);
}

main {
	width: var(--content-width);
	max-width: calc(100% - 2rem);
	margin: auto;
	padding: clamp(2rem, 5vw, 4.5rem) 0;
}

h1,
h2,
h3,
h4,
h5,
h6 {
	margin: 0 0 0.5rem 0;
	color: rgb(var(--ink));
	line-height: 1.08;
	font-weight: 800;
}

h1 {
	font-size: clamp(2.4rem, 6vw, 4.2rem);
}

h2 {
	font-size: clamp(1.9rem, 4vw, 3rem);
}

h3 {
	font-size: clamp(1.45rem, 3vw, 2.2rem);
}

h4 {
	font-size: clamp(1.15rem, 2vw, 1.55rem);
}

h5 {
	font-size: 1.15rem;
}

strong,
b {
	font-weight: 700;
}

a {
	color: var(--teal);
	text-decoration-thickness: 0.08em;
	text-underline-offset: 0.18em;
}

a:hover {
	color: var(--red);
}

a:focus-visible,
button:focus-visible {
	outline: 3px solid var(--yellow);
	outline-offset: 4px;
}

p {
	margin: 0 0 1em;
}

.prose p {
	margin-bottom: 1.65em;
}

.prose {
	font-size: clamp(1.05rem, 2vw, 1.18rem);
}

textarea,
input {
	width: 100%;
	font: inherit;
}

table {
	width: 100%;
	border-collapse: collapse;
}

img {
	max-width: 100%;
	height: auto;
	border-radius: var(--radius);
}

code {
	padding: 0.12em 0.32em;
	background-color: var(--paper-soft);
	border: 1px solid var(--soft-rule);
	border-radius: 3px;
	color: rgb(var(--ink));
}

pre {
	padding: 1.35em;
	border: 2px solid var(--rule);
	border-radius: var(--radius);
	background: var(--paper-soft);
	box-shadow: 6px 6px 0 rgba(19, 127, 115, 0.25);
	overflow-x: auto;
}

pre > code {
	all: unset;
}

blockquote {
	position: relative;
	border-left: 8px solid var(--red);
	padding: 0.3rem 0 0.3rem 1.2rem;
	margin: 2rem 0;
	font-size: clamp(1.25rem, 3vw, 1.6rem);
	color: rgb(var(--ink));
}

blockquote::before {
	content: '';
	position: absolute;
	left: -8px;
	bottom: -10px;
	width: 72px;
	height: 10px;
	background: var(--yellow);
}

hr {
	border: none;
	border-top: 3px solid var(--rule);
	margin: 2rem 0;
}

@media (max-width: 720px) {
	body {
		font-size: 18px;
	}

	main {
		max-width: calc(100% - 1.25rem);
		padding: 1.25rem 0 2.5rem;
	}
}
```

- [ ] **Step 3: Run build**

Run:

```bash
npm run build
```

Expected: build succeeds. Visual differences are not complete yet because page/component styles still need updates.

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "style: add contempo editorial tokens"
```

## Task 2: Shared Fallback Cover Utility

**Files:**
- Create: `src/utils/contempoCover.ts`
- Modify: `src/pages/blog/index.astro`
- Modify: `src/layouts/BlogPost.astro`

- [ ] **Step 1: Create the utility**

Create `src/utils/contempoCover.ts`:

```ts
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const publicDir = fileURLToPath(new URL('../../public/', import.meta.url));

const escapeSvgText = (input: string) =>
	input.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export const hashTitle = (input: string) => {
	let hash = 5381;
	for (let i = 0; i < input.length; i += 1) {
		hash = ((hash << 5) + hash) ^ input.charCodeAt(i);
	}
	return hash >>> 0;
};

export const resolveHeroSrc = (input?: string) => {
	if (!input) return undefined;
	if (!input.startsWith('/')) return input;
	const absolutePath = path.join(publicDir, input.slice(1));
	if (!fs.existsSync(absolutePath)) return undefined;
	return `${import.meta.env.BASE_URL}${input.slice(1)}`;
};

export const coverSvgDataUri = (postTitle: string) => {
	const hash = hashTitle(postTitle);
	const rotateA = (hash % 9) - 4;
	const rotateB = ((hash >>> 8) % 13) - 6;
	const stripe = 10 + (hash % 8);
	const label = hash.toString(16).padStart(8, '0').slice(0, 6).toUpperCase();
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
```

- [ ] **Step 2: Update blog index imports and remove duplicate helpers**

In `src/pages/blog/index.astro`, remove these imports:

```ts
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
```

Remove the local `publicDir`, `hashTitle`, `resolveHeroSrc`, and `coverSvgDataUri` definitions.

Add:

```ts
import { coverSvgDataUri, resolveHeroSrc } from '../../utils/contempoCover';
```

- [ ] **Step 3: Update BlogPost imports and remove duplicate helpers**

In `src/layouts/BlogPost.astro`, remove these imports:

```ts
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
```

Remove the local `publicDir`, `resolveHeroSrc`, `hashTitle`, and `coverSvgDataUri` definitions.

Add:

```ts
import { coverSvgDataUri, resolveHeroSrc } from '../utils/contempoCover';
```

- [ ] **Step 4: Run build**

Run:

```bash
npm run build
```

Expected: build succeeds and generated fallback cover URLs still render as data URIs.

- [ ] **Step 5: Commit**

```bash
git add src/utils/contempoCover.ts src/pages/blog/index.astro src/layouts/BlogPost.astro
git commit -m "refactor: share contempo cover generation"
```

## Task 3: Header And Footer Masthead System

**Files:**
- Modify: `src/components/Header.astro`
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Update Header markup**

In `src/components/Header.astro`, change the resume link text from `履歷` to `Resume`:

```astro
<div class="social-links">
	<HeaderLink href="/resume/">Resume</HeaderLink>
</div>
```

- [ ] **Step 2: Replace Header styles**

Replace the entire `<style>` block in `src/components/Header.astro` with:

```astro
<style>
	header {
		position: sticky;
		top: 0;
		z-index: 10;
		margin: 0;
		padding: 0 clamp(0.75rem, 3vw, 1.4rem);
		background: color-mix(in srgb, var(--paper-soft) 94%, transparent);
		border-bottom: 4px solid var(--rule);
		backdrop-filter: blur(10px);
	}

	h2 {
		margin: 0;
		font-size: 1rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	h2 a,
	h2 a.active {
		text-decoration: none;
	}

	nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		max-width: var(--wide-width);
		margin: 0 auto;
		min-height: 72px;
	}

	.internal-links,
	.social-links {
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}

	nav a {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		padding: 0.45rem 0.65rem;
		color: rgb(var(--ink));
		border: 2px solid transparent;
		text-decoration: none;
		font-size: 0.95rem;
		font-weight: 700;
		line-height: 1;
	}

	nav a:hover {
		color: rgb(var(--ink));
		border-color: var(--rule);
		background: var(--paper);
		transform: rotate(-1deg);
	}

	nav a.active {
		color: var(--paper-soft);
		background: var(--red);
		border-color: var(--rule);
		box-shadow: 5px 5px 0 var(--yellow);
		text-decoration: none;
		transform: rotate(-1deg);
	}

	@media (max-width: 720px) {
		nav {
			min-height: auto;
			padding: 0.75rem 0;
			align-items: flex-start;
			flex-wrap: wrap;
		}

		h2 {
			width: 100%;
		}

		.internal-links,
		.social-links {
			flex-wrap: wrap;
		}

		nav a {
			padding: 0.5rem 0.55rem;
		}
	}
</style>
```

- [ ] **Step 3: Replace Footer styles**

Replace the entire `<style>` block in `src/components/Footer.astro` with:

```astro
<style>
	footer {
		margin-top: clamp(2rem, 6vw, 5rem);
		padding: 2rem 1rem 5rem;
		background: var(--paper-soft);
		border-top: 4px solid var(--rule);
		color: rgb(var(--muted));
		text-align: center;
	}

	.social-links {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.65rem 1rem;
		margin-top: 1em;
	}

	.social-links a {
		color: rgb(var(--ink));
		text-decoration: none;
		border-bottom: 3px solid var(--teal);
		font-weight: 700;
	}

	.social-links a:hover {
		color: var(--red);
		border-bottom-color: var(--red);
	}
</style>
```

- [ ] **Step 4: Run build**

Run:

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/Header.astro src/components/Footer.astro
git commit -m "style: update masthead and footer"
```

## Task 4: Blog Index Editorial Deck And Cards

**Files:**
- Modify: `src/pages/blog/index.astro`

- [ ] **Step 1: Replace blog index CSS**

In `src/pages/blog/index.astro`, replace the whole `<style>` block with:

```astro
<style>
	main {
		width: var(--wide-width);
	}

	.intro-section {
		margin-bottom: clamp(2rem, 5vw, 4rem);
	}

	.intro-shell {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) clamp(190px, 24vw, 280px);
		grid-template-areas: 'copy portrait';
		gap: clamp(1.5rem, 4vw, 3rem);
		padding: clamp(1.25rem, 4vw, 3rem);
		background: var(--paper-soft);
		border: 4px solid var(--rule);
		box-shadow: var(--box-shadow);
		overflow: hidden;
	}

	.intro-shell::before,
	.intro-shell::after {
		content: '';
		position: absolute;
		pointer-events: none;
		border: 3px solid var(--rule);
	}

	.intro-shell::before {
		right: clamp(1rem, 4vw, 3rem);
		top: clamp(1rem, 4vw, 2.5rem);
		width: clamp(80px, 12vw, 140px);
		aspect-ratio: 1;
		background: repeating-linear-gradient(135deg, rgb(var(--ink)) 0 6px, var(--paper-soft) 6px 14px);
		transform: rotate(7deg);
	}

	.intro-shell::after {
		right: clamp(5rem, 20vw, 16rem);
		bottom: clamp(1rem, 5vw, 3rem);
		width: clamp(90px, 14vw, 160px);
		height: 34px;
		background: var(--yellow);
		transform: rotate(-4deg);
	}

	.intro-copy {
		position: relative;
		z-index: 1;
		grid-area: copy;
		min-width: 0;
	}

	.intro-kicker {
		display: inline-flex;
		margin: 0 0 1rem;
		padding: 0.38rem 0.62rem;
		background: var(--red);
		border: 2px solid var(--rule);
		color: var(--paper-soft);
		font-size: 0.82rem;
		font-weight: 700;
		line-height: 1;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		transform: rotate(-1.5deg);
	}

	.intro-section h2 {
		margin: 0 0 1rem;
		max-width: 11ch;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: clamp(2.5rem, 7vw, 5.4rem);
		line-height: 0.88;
	}

	.intro-lede,
	.intro-note {
		max-width: 60ch;
		color: rgb(var(--gray-dark));
	}

	.intro-contacts {
		display: flex;
		flex-wrap: wrap;
		gap: 0.65rem;
		list-style: none;
		margin: 1.5rem 0 0;
		padding: 1.2rem 0 0;
		border-top: 3px solid var(--rule);
	}

	.intro-contacts li {
		display: inline-flex;
		align-items: baseline;
		gap: 0.5rem;
		min-width: 0;
		padding: 0.4rem 0.55rem;
		background: var(--paper);
		border: 2px solid var(--soft-rule);
	}

	.intro-contacts__label {
		font-size: 0.82rem;
		font-weight: 700;
		color: rgb(var(--muted));
		text-transform: uppercase;
	}

	.intro-contacts__value {
		font-weight: 700;
		color: rgb(var(--ink));
		overflow-wrap: anywhere;
	}

	.intro-contacts a {
		color: rgb(var(--ink));
		text-decoration: none;
	}

	.intro-contacts a:hover {
		color: var(--red);
	}

	.intro-portrait {
		position: relative;
		z-index: 1;
		grid-area: portrait;
		margin: 0;
		justify-self: end;
		align-self: center;
		display: grid;
		justify-items: center;
		gap: 0.65rem;
		text-align: center;
	}

	.intro-portrait img {
		width: clamp(160px, 22vw, 260px);
		aspect-ratio: 1 / 1;
		object-fit: cover;
		border-radius: var(--radius);
		border: 4px solid var(--rule);
		box-shadow: 10px 10px 0 var(--teal);
		transform: rotate(2deg);
	}

	.intro-portrait figcaption {
		max-width: 24ch;
		margin: 0;
		padding: 0.35rem 0.55rem;
		background: var(--yellow);
		border: 2px solid var(--rule);
		font-size: 0.85rem;
		color: rgb(var(--ink));
		transform: rotate(-2deg);
	}

	.post-list {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: clamp(1rem, 3vw, 2rem);
		list-style-type: none;
		margin: 0;
		padding: 0;
	}

	.post-list li:first-child {
		grid-column: 1 / -1;
	}

	.post-card {
		display: grid;
		height: 100%;
		color: rgb(var(--ink));
		background: var(--paper-soft);
		border: 3px solid var(--rule);
		text-decoration: none;
		transition: transform 0.18s ease, box-shadow 0.18s ease;
	}

	.post-card:hover {
		color: rgb(var(--ink));
		box-shadow: var(--box-shadow-red);
		transform: translate(-3px, -3px) rotate(-0.4deg);
	}

	.post-card img {
		width: 100%;
		aspect-ratio: 2 / 1;
		object-fit: cover;
		border-radius: 0;
		border-bottom: 3px solid var(--rule);
	}

	.post-card__body {
		padding: clamp(0.9rem, 2vw, 1.35rem);
	}

	.post-list li:first-child .post-card {
		grid-template-columns: 1.15fr 0.85fr;
		align-items: stretch;
	}

	.post-list li:first-child .post-card img {
		height: 100%;
		border-bottom: 0;
		border-right: 3px solid var(--rule);
	}

	.post-list li:first-child .title {
		font-family: Georgia, 'Times New Roman', serif;
		font-size: clamp(2rem, 5vw, 4rem);
		line-height: 0.94;
	}

	.title {
		margin: 0;
		color: rgb(var(--ink));
		line-height: 1.05;
	}

	.date {
		margin: 0.8rem 0 0;
		color: rgb(var(--muted));
		font-size: 0.95rem;
		font-weight: 700;
	}

	@media (max-width: 720px) {
		.intro-shell {
			grid-template-columns: 1fr;
			grid-template-areas:
				'portrait'
				'copy';
			padding: 1rem;
			box-shadow: 6px 6px 0 var(--yellow);
		}

		.intro-shell::before,
		.intro-shell::after {
			opacity: 0.35;
		}

		.intro-section h2 {
			max-width: 12ch;
		}

		.intro-portrait {
			justify-self: start;
		}

		.post-list {
			grid-template-columns: 1fr;
		}

		.post-list li:first-child .post-card {
			grid-template-columns: 1fr;
		}

		.post-list li:first-child .post-card img {
			border-right: 0;
			border-bottom: 3px solid var(--rule);
		}
	}
</style>
```

- [ ] **Step 2: Change the post list markup**

Replace:

```astro
<ul>
```

with:

```astro
<ul class="post-list">
```

Replace the post card contents inside `posts.map` with:

```astro
<li>
	<a class="post-card" href={`${import.meta.env.BASE_URL}blog/${post.id}/`}>
		<img
			width={720}
			height={360}
			src={resolveHeroSrc(post.data.heroImage) ?? coverSvgDataUri(post.data.title)}
			alt=""
		/>
		<div class="post-card__body">
			<h4 class="title">{post.data.title}</h4>
			<p class="date">
				<FormattedDate date={post.data.pubDate} />
			</p>
		</div>
	</a>
</li>
```

- [ ] **Step 3: Run build**

Run:

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/pages/blog/index.astro
git commit -m "style: redesign blog index editorial deck"
```

## Task 5: Blog Post Article Opener

**Files:**
- Modify: `src/layouts/BlogPost.astro`

- [ ] **Step 1: Replace BlogPost styles**

In `src/layouts/BlogPost.astro`, replace the entire `<style>` block with:

```astro
<style>
	main {
		width: calc(100% - 2rem);
		max-width: var(--wide-width);
		margin: 0 auto;
		padding-top: clamp(1.5rem, 4vw, 3rem);
	}

	article {
		display: grid;
		gap: clamp(1.5rem, 4vw, 3rem);
	}

	.hero-image {
		width: 100%;
		background: var(--paper-soft);
		border: 4px solid var(--rule);
		box-shadow: var(--box-shadow);
	}

	.hero-image img {
		display: block;
		width: 100%;
		margin: 0;
		border-radius: 0;
	}

	.prose {
		width: var(--content-width);
		max-width: 100%;
		margin: auto;
		padding: 0 0 clamp(2rem, 6vw, 5rem);
		color: rgb(var(--gray-dark));
	}

	.title {
		position: relative;
		margin-bottom: clamp(1.5rem, 4vw, 2.5rem);
		padding: clamp(1.2rem, 4vw, 2rem) 0;
		text-align: left;
		line-height: 1;
		border-top: 4px solid var(--rule);
		border-bottom: 4px solid var(--rule);
	}

	.title::after {
		content: '';
		position: absolute;
		right: 0;
		bottom: -11px;
		width: min(38vw, 280px);
		height: 18px;
		background: var(--yellow);
		border: 3px solid var(--rule);
		transform: rotate(-1.5deg);
	}

	.title h1 {
		margin: 0;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: clamp(2.4rem, 7vw, 5.2rem);
		line-height: 0.92;
	}

	.date {
		display: inline-flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1rem;
		padding: 0.4rem 0.6rem;
		background: var(--red);
		border: 2px solid var(--rule);
		color: var(--paper-soft);
		font-size: 0.9rem;
		font-weight: 700;
		line-height: 1.2;
		transform: rotate(-1deg);
	}

	.last-updated-on {
		font-style: normal;
		opacity: 0.88;
	}

	@media (max-width: 720px) {
		main {
			width: calc(100% - 1.25rem);
		}

		.hero-image {
			box-shadow: 6px 6px 0 var(--yellow);
		}
	}
</style>
```

- [ ] **Step 2: Run build**

Run:

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BlogPost.astro
git commit -m "style: redesign article opener"
```

## Task 6: About And Resume Alignment

**Files:**
- Modify: `src/pages/about.astro`
- Modify: `src/pages/resume.astro`

- [ ] **Step 1: Update About styles**

In `src/pages/about.astro`, replace the local `<style>` block with:

```astro
<style>
	.about-hero,
	.about-grid,
	.about-human {
		background: var(--paper-soft);
		border: 3px solid var(--rule);
		padding: clamp(1rem, 3vw, 1.5rem);
	}

	.about-hero {
		margin-bottom: 1.5rem;
		box-shadow: 8px 8px 0 var(--yellow);
	}

	.about-kicker {
		display: inline-flex;
		margin: 0 0 0.75rem;
		padding: 0.35rem 0.55rem;
		background: var(--teal);
		border: 2px solid var(--rule);
		color: var(--paper-soft);
		font-size: 0.85rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.about-name {
		margin: 0;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: clamp(1.8rem, 4vw, 2.8rem);
	}

	.about-lede {
		margin: 0.9rem 0 0;
		max-width: 68ch;
	}

	.about-grid {
		display: grid;
		grid-template-columns: 1.05fr 0.95fr;
		gap: 2rem;
		margin-bottom: 1.5rem;
	}

	.about-list {
		margin: 0.75rem 0 0;
		padding-left: 1.15rem;
	}

	.about-list li::marker {
		color: var(--red);
	}

	.about-links {
		list-style: none;
		margin: 0.75rem 0 0;
		padding: 0;
		display: grid;
		gap: 0.8rem;
	}

	.about-links a {
		color: rgb(var(--ink));
		text-decoration: none;
		border-bottom: 3px solid var(--teal);
		font-weight: 700;
	}

	.about-links a:hover {
		color: var(--red);
		border-bottom-color: var(--red);
	}

	.about-podcast {
		display: grid;
		grid-template-columns: auto 1fr;
		column-gap: 1rem;
		align-items: start;
	}

	.about-cover {
		margin: 0;
	}

	.about-cover img {
		border-radius: var(--radius);
		border: 3px solid var(--rule);
		width: 112px;
		height: 112px;
	}

	.about-cover figcaption {
		margin-top: 0.45rem;
		font-size: 0.85rem;
		color: rgb(var(--muted));
	}

	.about-human p {
		max-width: 72ch;
	}

	@media (max-width: 720px) {
		.about-grid {
			grid-template-columns: 1fr;
		}

		.about-podcast {
			grid-template-columns: 1fr;
		}

		.about-cover img {
			width: 96px;
			height: 96px;
		}
	}
</style>
```

- [ ] **Step 2: Update Resume styles**

In `src/pages/resume.astro`, replace the local `<style>` block with:

```astro
<style>
	.resume-hero,
	.resume-grid,
	.resume-block {
		background: var(--paper-soft);
		border: 3px solid var(--rule);
		padding: clamp(1rem, 3vw, 1.5rem);
	}

	.resume-hero {
		margin-bottom: 1.5rem;
		box-shadow: 8px 8px 0 var(--teal);
	}

	.resume-kicker {
		display: inline-flex;
		margin: 0 0 0.75rem;
		padding: 0.35rem 0.55rem;
		background: var(--red);
		border: 2px solid var(--rule);
		color: var(--paper-soft);
		font-size: 0.85rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.resume-name {
		margin: 0;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: clamp(2rem, 5vw, 3.3rem);
	}

	.resume-summary {
		margin: 0.9rem 0 0;
		max-width: 72ch;
	}

	.resume-grid {
		display: grid;
		grid-template-columns: 1.1fr 0.9fr;
		gap: 2rem;
		margin-bottom: 1.5rem;
	}

	.resume-list {
		margin: 0.75rem 0 0;
		padding-left: 1.15rem;
	}

	.resume-list li::marker {
		color: var(--teal);
	}

	.resume-contacts {
		list-style: none;
		margin: 0.75rem 0 0;
		padding: 0;
		display: grid;
		gap: 0.7rem;
	}

	.resume-contacts li {
		display: grid;
		grid-template-columns: 4.5rem 1fr;
		gap: 0.75rem;
		align-items: baseline;
	}

	.resume-contacts__label {
		font-size: 0.9rem;
		font-weight: 700;
		color: rgb(var(--muted));
		text-transform: uppercase;
	}

	.resume-contacts__value {
		font-weight: 700;
		color: rgb(var(--ink));
		overflow-wrap: anywhere;
	}

	.resume-block {
		margin: 1.5rem 0 0;
	}

	.resume-links {
		list-style: none;
		margin: 0.75rem 0 0;
		padding: 0;
		display: grid;
		gap: 0.8rem;
	}

	.resume-links a,
	.resume-block a,
	.resume-contacts a {
		color: rgb(var(--ink));
		text-decoration: none;
		border-bottom: 3px solid var(--teal);
		font-weight: 700;
	}

	.resume-links a:hover,
	.resume-block a:hover,
	.resume-contacts a:hover {
		color: var(--red);
		border-bottom-color: var(--red);
	}

	.resume-muted {
		margin: 0.75rem 0 0.9rem;
		color: rgb(var(--gray-dark));
	}

	@media (max-width: 720px) {
		.resume-grid {
			grid-template-columns: 1fr;
		}

		.resume-contacts li {
			grid-template-columns: 1fr;
			gap: 0.1rem;
		}
	}
</style>
```

- [ ] **Step 3: Run build**

Run:

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/pages/about.astro src/pages/resume.astro
git commit -m "style: align profile pages with editorial system"
```

## Task 7: Final Verification And Visual QA

**Files:**
- No required code changes unless verification finds a problem.

- [ ] **Step 1: Run production build**

Run:

```bash
npm run build
```

Expected: build succeeds with no Astro errors.

- [ ] **Step 2: Start preview server**

Run:

```bash
npm run preview -- --host 127.0.0.1
```

Expected: Astro preview prints a local URL.

- [ ] **Step 3: Inspect required pages**

Open these paths in the preview server:

```text
/blog/
/blog/2026-03-19-claude-md-collaboration/
/about/
/resume/
```

Expected:

- Header navigation is usable and does not wrap awkwardly.
- Blog index has the approved editorial deck and post cards.
- Article page has a magazine-style opener and readable prose.
- About and Resume match the visual system without becoming visually loud.
- No page has horizontal scrolling at mobile width.
- Long Chinese and English titles wrap inside their containers.
- Fallback covers render as postmodern SVG compositions.

- [ ] **Step 4: Fix visual defects if found**

If text overlaps or mobile horizontal scrolling appears, make targeted CSS fixes in the smallest relevant file. Use this pattern:

```css
selector {
	min-width: 0;
	overflow-wrap: anywhere;
}
```

For image/card overflow, use:

```css
selector {
	max-width: 100%;
}
```

Then rerun:

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 5: Commit final QA fixes**

Only run this commit if Step 4 required changes:

```bash
git add src
git commit -m "fix: polish contempo responsive details"
```

## Self-Review

Spec coverage:

- Global tokens and visual system are covered by Task 1.
- Shared deterministic fallback covers are covered by Task 2.
- Header and footer masthead treatment is covered by Task 3.
- Blog index intro deck and card system are covered by Task 4.
- Blog post opener and prose preservation are covered by Task 5.
- About and Resume alignment are covered by Task 6.
- Build, preview, mobile, overflow, readability, and cover rendering checks are covered by Task 7.

Placeholder scan:

- No task uses banned vague wording, undefined future behavior, or fill-in instructions.

Type consistency:

- The cover helper exports `hashTitle`, `resolveHeroSrc`, and `coverSvgDataUri`.
- Both Astro consumers import `coverSvgDataUri` and `resolveHeroSrc`.
- CSS token names used by component/page tasks are defined in Task 1.
