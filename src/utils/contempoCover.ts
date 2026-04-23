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
