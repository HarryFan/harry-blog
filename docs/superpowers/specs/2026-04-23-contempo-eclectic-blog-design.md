# Contempo Eclectic Blog Design

Date: 2026-04-23
Project: `harry-blog`

## Goal

Redesign the blog with a Contempo Eclectic editorial system: warm, postmodern, slightly playful, and visibly more distinctive, while preserving the current blog's strongest qualities: fast static pages, readable technical articles, and a clear personal-professional identity.

## Approved Direction

Use the **Editorial System** approach.

The site should feel like a restrained 1980s postmodern editorial object rather than a loud portfolio experiment. The style draws from New Wave graphic design, Memphis-adjacent geometry, Deco-Luxe contrast, and abstract poster-like covers, but uses those references as accents around the writing.

## Design Principles

- Content remains primary: article titles, dates, summaries, and body text must stay easy to scan and read.
- The visual system should be clear, restrained, and angular, matching the existing project context.
- Decorative elements should live in surfaces such as headers, covers, navigation states, section dividers, and cards, not in dense article paragraphs.
- The implementation should stay maintainable: CSS tokens first, then page/component styles, with no UI framework added.
- The site should retain local performance characteristics and avoid remote font dependencies.

## Visual System

### Palette

Use a warm paper and ink base with a small set of high-contrast accents:

- Warm paper background for the page base.
- Near-black ink for headings, borders, and primary text.
- Tomato red for active navigation, labels, and selected accents.
- Ochre yellow for highlight blocks, shadows, and secondary accents.
- Teal green for links, rules, and alternate accents.
- Muted clay or brown-gray for secondary text.

The palette should avoid becoming a one-hue theme. Red, yellow, and teal should appear as distinct editorial punctuation, not as gradients covering the whole UI.

### Typography

- Keep the local Atkinson font for body text and general UI because it is already available and readable.
- Use serif/system display stacks for large editorial headings where appropriate, without adding a remote dependency.
- Keep article prose at roughly 68-72 characters wide with comfortable line height.
- Avoid negative letter spacing and viewport-scaled font sizing.

### Shapes And Motifs

Use a small controlled set of motifs:

- Thick black editorial rules.
- Offset shadows in ochre or red.
- Skewed labels and sticker-like tags.
- Stripes, circles, blocks, and rotated rectangles.
- Hard corners or lightly rounded corners only; do not make the system soft or card-heavy.

## Page-Level Design

### Global CSS

Update `src/styles/global.css` to define the new design tokens and shared base styling:

- Color tokens for paper, ink, muted text, red, yellow, teal, and border.
- Revised body background with warm paper tone and subtle editorial texture using CSS only.
- Shared heading, link, image, code, pre, blockquote, hr, and prose treatment.
- Stable responsive defaults for text, media, and content width.

### Header

Update `src/components/Header.astro`:

- Make the header feel like a compact editorial masthead.
- Use a warm paper surface, thick bottom rule, active-link sticker treatment, and strong focus/hover states.
- Keep navigation concise: Blog, About, Resume.
- Maintain mobile layout without horizontal overflow.

### Footer

Update `src/components/Footer.astro`:

- Match the editorial system with warm paper, ink rules, and restrained link styling.
- Keep the footer functional and light; it should not become another hero.

### Blog Index

Update `src/pages/blog/index.astro`:

- Replace the current neutral intro shell with an editorial deck: strong heading, intro text, contact links, and portrait treatment.
- Use asymmetric but readable layout on desktop.
- Use a single-column layout on mobile.
- Style article cards with thick borders, offset shadows, and clear hierarchy.
- Keep the first article emphasized, but avoid making the rest feel like repetitive identical cards.

### Blog Post Layout

Update `src/layouts/BlogPost.astro`:

- Make the hero cover and title area feel like a magazine article opener.
- Keep article body readable and quiet.
- Use the same deterministic cover logic as the blog index.
- Use postmodern fallback covers built from deterministic geometry rather than generic gradients.

### About And Resume

Update local styles in `src/pages/about.astro` and `src/pages/resume.astro`:

- Bring their section headers, lists, links, and content grids into the same token system.
- Keep these pages text-forward and professional.
- Avoid overdecorating resume content.

## Fallback Cover System

Replace the current generic gradient SVG fallback with deterministic Contempo Eclectic covers.

The generator should:

- Continue using the post title hash so covers are stable per article.
- Use warm paper, ink, red, yellow, and teal motifs.
- Include stripes, blocks, circles, and skewed labels.
- Preserve title legibility on article pages.
- Avoid relying on external assets.

Both `src/pages/blog/index.astro` and `src/layouts/BlogPost.astro` currently define similar cover helpers. The implementation may consolidate or carefully keep them in sync, depending on the lowest-risk code path.

## Accessibility And Responsiveness

- Maintain readable contrast for body text, links, navigation, code, and blockquotes.
- Preserve keyboard focus visibility.
- Ensure long Chinese and English titles wrap cleanly in cards and article headers.
- Ensure contact links and navigation fit on mobile.
- Keep images responsive and avoid layout shifts through fixed aspect ratios where practical.

## Testing And Verification

Run:

- `npm run build`

If possible, preview locally and inspect:

- `/blog/`
- `/blog/<one-existing-post>/`
- `/about/`
- `/resume/`

Check desktop and mobile widths for:

- No text overlap.
- No horizontal scrolling.
- Article body remains readable.
- Header navigation remains usable.
- Fallback cover rendering is visually consistent.

## Out Of Scope

- No content rewrites.
- No new CMS or content schema.
- No external design library.
- No remote font service dependency.
- No full art-object redesign that sacrifices readability.
