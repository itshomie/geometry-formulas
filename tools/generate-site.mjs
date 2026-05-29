import { cp, copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import katex from "katex";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = (process.env.SITE_URL || "https://geometry-formulas.com").replace(/\/$/, "");
const lastmod = process.env.LASTMOD || "2026-05-16";
const brandName = "Geometry Formulas";
const brandAlternateName = "geometry formulas";
const companyName = "Blue Core Technologies LLC";
const contactEmailDisplay = "Ding [at] bluecoretechnologiesllc [dot] com";
const googleAnalyticsId = "G-MTGR0VENZ1";
const socialImage = {
  path: "/assets/img/geometry-formulas-og.svg",
  width: 1200,
  height: 630,
  type: "image/svg+xml",
  alt: "Geometry Formulas visual reference with formulas and shape diagrams"
};
const socialImageUrl = `${siteUrl}${socialImage.path}`;

const navItems = [
  ["Geometry Formulas", "/"],
  ["Area", "/area-formulas/"],
  ["Perimeter", "/perimeter-formulas/"],
  ["Volume", "/volume-formulas/"],
  ["Surface Area", "/surface-area-formulas/"],
  ["Calculators", "/geometry-calculator/"],
  ["Solver", "/geometry-solver/"]
];

const shapeLinks = [
  ["Circle Formulas", "/circle-formulas/", "Area, circumference, radius, diameter"],
  ["Triangle Formulas", "/triangle-formulas/", "Area, perimeter, right triangle formulas"],
  ["Rectangle Formulas", "/rectangle-formulas/", "Area, perimeter, diagonal"],
  ["Square Formulas", "/square-formulas/", "Area, perimeter, diagonal"],
  ["Cylinder Formulas", "/cylinder-formulas/", "Volume and surface area"],
  ["Cone Formulas", "/cone-formulas/", "Volume, surface area, slant height"],
  ["Sphere Formulas", "/sphere-formulas/", "Volume, surface area, diameter"],
  ["Rectangular Prism Formulas", "/rectangular-prism-formulas/", "Volume and surface area"]
];

const calculatorLinks = [
  ["Geometry Solver", "/geometry-solver/", "Choose a shape, known values, and the value to solve."],
  ["Geometry Calculator", "/geometry-calculator/", "Use common geometry calculators in one place."],
  ["Circle Calculator", "/circle-calculator/", "Find radius, diameter, circumference, and area."],
  ["Triangle Calculator", "/triangle-calculator/", "Calculate triangle area, perimeter, and right triangle values."],
  ["Cylinder Calculator", "/cylinder-calculator/", "Calculate volume, lateral area, and total surface area."],
  ["Sphere Calculator", "/sphere-calculator/", "Calculate sphere volume and surface area."]
];

const companyLinks = [
  ["About", "/about/"],
  ["Team & Services", "/team-services/"],
  ["Contact", "/contact/"]
];

const policyLinks = [
  ["Privacy Policy", "/privacy-policy/"],
  ["Terms of Use", "/terms-of-use/"]
];

const formulaCards = {
  circle: {
    title: "Circle Formulas",
    slug: "circle-formulas",
    file: "circle-formula-card.png",
    formulas: [
      { label: "Area", html: "A = &pi;r<sup>2</sup>", text: "Area: A = pi r^2", latex: "A = \\pi r^2" },
      { label: "Circumference", html: "C = 2&pi;r = &pi;d", text: "Circumference: C = 2 pi r = pi d", latex: "C = 2\\pi r = \\pi d" },
      { label: "Diameter", html: "d = 2r", text: "Diameter: d = 2r", latex: "d = 2r" },
      { label: "Radius", html: "r = d / 2", text: "Radius: r = d / 2", latex: "r = \\frac{d}{2}" }
    ]
  },
  triangle: {
    title: "Triangle Formulas",
    slug: "triangle-formulas",
    file: "triangle-formula-card.png",
    formulas: [
      { label: "Area", html: "A = 1/2 &times; b &times; h", text: "Area: A = 1/2 x b x h", latex: "A = \\frac{1}{2}bh" },
      { label: "Perimeter", html: "P = a + b + c", text: "Perimeter: P = a + b + c", latex: "P = a + b + c" },
      { label: "Right triangle", html: "a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup>", text: "Right triangle: a^2 + b^2 = c^2", latex: "a^2 + b^2 = c^2" },
      { label: "Heron's formula", html: "A = &radic;(s(s-a)(s-b)(s-c))", text: "Heron's formula: A = sqrt(s(s-a)(s-b)(s-c))", latex: "A = \\sqrt{s(s-a)(s-b)(s-c)}" }
    ]
  },
  rectangle: {
    title: "Rectangle Formulas",
    slug: "rectangle-formulas",
    file: "rectangle-formula-card.png",
    formulas: [
      { label: "Area", html: "A = lw", text: "Area: A = lw", latex: "A = lw" },
      { label: "Perimeter", html: "P = 2(l + w)", text: "Perimeter: P = 2(l + w)", latex: "P = 2(l + w)" },
      { label: "Diagonal", html: "d = &radic;(l<sup>2</sup> + w<sup>2</sup>)", text: "Diagonal: d = sqrt(l^2 + w^2)", latex: "d = \\sqrt{l^2 + w^2}" }
    ]
  },
  square: {
    title: "Square Formulas",
    slug: "square-formulas",
    file: "square-formula-card.png",
    formulas: [
      { label: "Area", html: "A = s<sup>2</sup>", text: "Area: A = s^2", latex: "A = s^2" },
      { label: "Perimeter", html: "P = 4s", text: "Perimeter: P = 4s", latex: "P = 4s" },
      { label: "Diagonal", html: "d = s&radic;2", text: "Diagonal: d = s sqrt(2)", latex: "d = s\\sqrt{2}" }
    ]
  },
  cylinder: {
    title: "Cylinder Formulas",
    slug: "cylinder-formulas",
    file: "cylinder-formula-card.png",
    formulas: [
      { label: "Volume", html: "V = &pi;r<sup>2</sup>h", text: "Volume: V = pi r^2 h", latex: "V = \\pi r^2 h" },
      { label: "Lateral surface area", html: "LSA = 2&pi;rh", text: "Lateral surface area: LSA = 2 pi r h", latex: "LSA = 2\\pi rh" },
      { label: "Total surface area", html: "TSA = 2&pi;r(r + h)", text: "Total surface area: TSA = 2 pi r(r + h)", latex: "TSA = 2\\pi r(r+h)" },
      { label: "Base area", html: "B = &pi;r<sup>2</sup>", text: "Base area: B = pi r^2", latex: "B = \\pi r^2" }
    ]
  },
  cone: {
    title: "Cone Formulas",
    slug: "cone-formulas",
    file: "cone-formula-card.png",
    formulas: [
      { label: "Volume", html: "V = 1/3&pi;r<sup>2</sup>h", text: "Volume: V = 1/3 pi r^2 h", latex: "V = \\frac{1}{3}\\pi r^2 h" },
      { label: "Lateral surface area", html: "LSA = &pi;rl", text: "Lateral surface area: LSA = pi r l", latex: "LSA = \\pi rl" },
      { label: "Total surface area", html: "TSA = &pi;r(r + l)", text: "Total surface area: TSA = pi r(r + l)", latex: "TSA = \\pi r(r+l)" },
      { label: "Slant height", html: "l = &radic;(r<sup>2</sup> + h<sup>2</sup>)", text: "Slant height: l = sqrt(r^2 + h^2)", latex: "l = \\sqrt{r^2 + h^2}" }
    ]
  },
  sphere: {
    title: "Sphere Formulas",
    slug: "sphere-formulas",
    file: "sphere-formula-card.png",
    formulas: [
      { label: "Volume", html: "V = 4/3&pi;r<sup>3</sup>", text: "Volume: V = 4/3 pi r^3", latex: "V = \\frac{4}{3}\\pi r^3" },
      { label: "Surface area", html: "SA = 4&pi;r<sup>2</sup>", text: "Surface area: SA = 4 pi r^2", latex: "SA = 4\\pi r^2" },
      { label: "Diameter", html: "d = 2r", text: "Diameter: d = 2r", latex: "d = 2r" },
      { label: "Radius", html: "r = d / 2", text: "Radius: r = d / 2", latex: "r = \\frac{d}{2}" }
    ]
  },
  "rectangular-prism": {
    title: "Rectangular Prism Formulas",
    slug: "rectangular-prism-formulas",
    file: "rectangular-prism-formula-card.png",
    formulas: [
      { label: "Volume", html: "V = lwh", text: "Volume: V = lwh", latex: "V = lwh" },
      { label: "Surface area", html: "SA = 2(lw + lh + wh)", text: "Surface area: SA = 2(lw + lh + wh)", latex: "SA = 2(lw + lh + wh)" },
      { label: "Base area", html: "B = lw", text: "Base area: B = lw", latex: "B = lw" }
    ]
  }
};

const twoDRows = [
  ["Square", formula("A = s<sup>2</sup>"), "Area from side length s"],
  ["Square", formula("P = 4s"), "Perimeter from side length s"],
  ["Square", formula("d = s&radic;2"), "Diagonal from side length s"],
  ["Rectangle", formula("A = lw"), "Area from length l and width w"],
  ["Rectangle", formula("P = 2(l + w)"), "Perimeter from length and width"],
  ["Rectangle", formula("d = &radic;(l<sup>2</sup> + w<sup>2</sup>)"), "Diagonal from the Pythagorean theorem"],
  ["Triangle", formula("A = 1/2 &times; b &times; h"), "Area from base b and height h"],
  ["Triangle", formula("P = a + b + c"), "Perimeter from side lengths"],
  ["Circle", formula("A = &pi;r<sup>2</sup>"), "Area from radius r"],
  ["Circle", formula("C = 2&pi;r = &pi;d"), "Circumference from radius or diameter"],
  ["Parallelogram", formula("A = bh"), "Area from base b and height h"],
  ["Parallelogram", formula("P = 2(a + b)"), "Perimeter from adjacent side lengths"],
  ["Trapezoid", formula("A = 1/2(a + b)h"), "Area from parallel bases a, b and height h"],
  ["Rhombus", formula("A = 1/2 d<sub>1</sub>d<sub>2</sub>"), "Area from diagonals"],
  ["Rhombus", formula("P = 4s"), "Perimeter from side length s"]
];

const threeDRows = [
  ["Cube", formula("V = s<sup>3</sup>"), "Volume from side length s"],
  ["Cube", formula("SA = 6s<sup>2</sup>"), "Surface area from side length s"],
  ["Rectangular prism", formula("V = lwh"), "Volume from length, width, and height"],
  ["Rectangular prism", formula("SA = 2(lw + lh + wh)"), "Surface area"],
  ["Cylinder", formula("V = &pi;r<sup>2</sup>h"), "Volume from radius r and height h"],
  ["Cylinder", formula("TSA = 2&pi;r(r + h)"), "Total surface area"],
  ["Cone", formula("V = 1/3&pi;r<sup>2</sup>h"), "Volume from radius and height"],
  ["Cone", formula("TSA = &pi;r(r + l)"), "Total surface area using slant height l"],
  ["Sphere", formula("V = 4/3&pi;r<sup>3</sup>"), "Volume from radius r"],
  ["Sphere", formula("SA = 4&pi;r<sup>2</sup>"), "Surface area from radius r"]
];

const pages = [
  homePage(),
  areaPage(),
  perimeterPage(),
  volumePage(),
  surfaceAreaPage(),
  ...shapePages(),
  ...calculatorPages(),
  solverPage(),
  ...trustPages()
];

await writeAssets();
for (const page of pages) {
  await writePage(page);
}
await writeGeometryRedirect();
await writeText("_redirects", redirectsText());
await writeText("_headers", headersText());
await writeText("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
await writeText("sitemap.xml", sitemapXml());

function formula(value) {
  const tex = htmlFormulaToTex(value);
  return `<span class="formula" data-tex="${escapeHtml(tex)}">${renderMath(tex)}</span>`;
}

function renderMath(tex, options = {}) {
  return katex.renderToString(tex, {
    displayMode: Boolean(options.displayMode),
    throwOnError: false,
    strict: "ignore",
    output: "html"
  });
}

function replaceRootExpressions(tex, marker, replacement) {
  let output = "";
  let index = 0;

  while (index < tex.length) {
    const start = tex.indexOf(`${marker}(`, index);
    if (start === -1) {
      output += tex.slice(index);
      break;
    }

    output += tex.slice(index, start);
    let cursor = start + marker.length + 1;
    let depth = 1;
    let expression = "";

    while (cursor < tex.length && depth > 0) {
      const char = tex[cursor];
      if (char === "(") {
        depth += 1;
        expression += char;
      } else if (char === ")") {
        depth -= 1;
        if (depth > 0) expression += char;
      } else {
        expression += char;
      }
      cursor += 1;
    }

    if (depth === 0) {
      output += `${replacement}{${expression}}`;
      index = cursor;
    } else {
      output += tex.slice(start);
      break;
    }
  }

  return output;
}

function htmlFormulaToTex(value) {
  let tex = String(value)
    .replace(/<sup>(.*?)<\/sup>/g, "^{$1}")
    .replace(/<sub>(.*?)<\/sub>/g, "_{$1}")
    .replace(/&pi;/g, "\\pi ")
    .replace(/&times;/g, "\\times")
    .replace(/&radic;/g, "\\sqrt")
    .replace(/&#8731;/g, "\\cuberoot")
    .replace(/&asymp;/g, "\\approx")
    .replace(/&frac12;/g, "\\frac{1}{2}")
    .replace(/&amp;/g, "&")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();

  tex = replaceRootExpressions(tex, "\\sqrt", "\\sqrt");
  tex = replaceRootExpressions(tex, "\\cuberoot", "\\sqrt[3]");
  tex = tex
    .replace(/\\sqrt([A-Za-z0-9]+)/g, "\\sqrt{$1}")
    .replace(/\\cuberoot([A-Za-z0-9]+)/g, "\\sqrt[3]{$1}")
    .replace(/\b1\/2\b/g, "\\frac{1}{2}")
    .replace(/\b1\/3\b/g, "\\frac{1}{3}")
    .replace(/\b4\/3\b/g, "\\frac{4}{3}");

  return tex;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pageUrl(slug) {
  if (slug === "geometry-formulas") return "/";
  return `/${slug}/`;
}

function absoluteUrl(slug) {
  return `${siteUrl}${pageUrl(slug)}`;
}

function table(rows, headings = ["Shape", "Formula", "Use"]) {
  return `
    <div class="table-wrap">
      <table class="formula-table">
        <thead><tr>${headings.map((heading) => `<th>${heading}</th>`).join("")}</tr></thead>
        <tbody>
          ${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function linkTiles(items) {
  return `<div class="related-grid">${items.map(([label, href, text]) => `
    <a class="link-tile" href="${href}">
      <strong>${label}</strong>
      <span>${text}</span>
    </a>
  `).join("")}</div>`;
}

function startsWithFormula(value) {
  return /^(?:A|V|SA|TSA|LSA|B|C|P|d|r|h|w|l|s|c)\s*(?:=|&asymp;)/.test(value.trim());
}

function renderFormulaSentence(value) {
  const input = String(value);
  if (input.includes("class=\"formula\"")) return input;

  const trimmed = input.trim();
  const period = trimmed.endsWith(".") ? "." : "";
  const body = period ? trimmed.slice(0, -1) : trimmed;

  if (body.includes(", so ")) {
    const [before, after] = body.split(", so ");
    if (startsWithFormula(before) && startsWithFormula(after)) {
      return `${formula(before)}, so ${formula(after)}${period}`;
    }
  }

  if (startsWithFormula(body)) {
    return `${formula(body)}${period}`;
  }

  return input;
}

function examples(items) {
  return `<div class="grid-3">${items.map((item) => `
    <article class="example">
      <h3>${item.title}</h3>
      <ol>${item.steps.map((step) => `<li>${renderFormulaSentence(step)}</li>`).join("")}</ol>
    </article>
  `).join("")}</div>`;
}

function faqs(items) {
  return items.map((item) => `
    <details>
      <summary>${item.q}</summary>
      <p>${item.a}</p>
    </details>
  `).join("");
}

function mistakes(items) {
  return `<ul class="mistake-list">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function formulaCard(card, options = {}) {
  const actionHref = options.calculatorHref || `/${card.slug.replace("-formulas", "-calculator")}/`;
  const linesText = card.formulas.map((item) => item.text).join("\n");
  const linesLatex = card.formulas.map((item) => item.latex).join("\n");
  const saveName = card.file || `${card.slug}.png`;

  return `
    <article class="formula-card js-formula-card" data-card-title="${escapeHtml(card.title)}" data-formula-text="${escapeHtml(linesText)}" data-latex="${escapeHtml(linesLatex)}" data-image-name="${escapeHtml(saveName)}">
      <div class="formula-card-head">
        <p class="section-kicker">Formula card</p>
        <h2>${card.title}</h2>
      </div>
      <div class="formula-card-list">
        ${card.formulas.map((item) => `
          <div class="formula-card-row">
            <span>${item.label}</span>
            <strong class="formula-card-math">${renderMath(item.latex)}</strong>
          </div>
        `).join("")}
      </div>
      <div class="formula-tools" aria-label="${escapeHtml(card.title)} tools">
        <button type="button" class="tool-button js-copy-formula">Copy Formula</button>
        <button type="button" class="tool-button js-copy-latex">Copy LaTeX</button>
        <button type="button" class="tool-button js-save-card">Save as Image</button>
        <button type="button" class="tool-button js-print-page">Print</button>
        <a class="tool-button link" href="${actionHref}">Use Calculator</a>
      </div>
      <p class="tool-status" aria-live="polite"></p>
    </article>
  `;
}

function formulaCardGrid(cards) {
  return `<div class="formula-card-grid">${cards.map((card) => formulaCard(card, { calculatorHref: calculatorHrefFor(card.slug.replace("-formulas", ""), card.slug) })).join("")}</div>`;
}

function calculatorHrefFor(type, slug) {
  const calculatorPages = new Set(["circle", "triangle", "cylinder", "sphere"]);
  return calculatorPages.has(type) ? `/${type}-calculator/` : `/${slug}/#calculator`;
}

function practiceProblems(items) {
  return `<div class="practice-list">${items.map((item, index) => `
    <details class="practice-item">
      <summary>${index + 1}. ${item.q}</summary>
      <p>${renderFormulaSentence(item.a)}</p>
    </details>
  `).join("")}</div>`;
}

function reverseList(items) {
  return `<div class="table-wrap">
    <table class="formula-table reverse-table">
      <thead><tr><th>Task</th><th>Formula</th><th>When to use it</th></tr></thead>
      <tbody>${items.map((item) => `<tr><td>${item.task}</td><td>${formula(item.formula)}</td><td>${item.use}</td></tr>`).join("")}</tbody>
    </table>
  </div>`;
}

function breadcrumbHtml(page) {
  const current = escapeHtml(page.h1);
  if (page.slug === "geometry-formulas") {
    return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li>${current}</li></ol></nav>`;
  }
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Geometry Formulas</a></li><li>${current}</li></ol></nav>`;
}

function brandMark() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 3 20h18L12 3Zm0 5.2 4.9 9.3H7.1L12 8.2Z" fill="currentColor"/></svg>`;
}

function heroArt() {
  return `
    <svg viewBox="0 0 420 320" role="img" aria-label="Geometry formulas sheet with circle, triangle, and prism diagrams">
      <defs>
        <marker id="arrow" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="12" viewBox="0 0 12 12" refX="10" refY="6" orient="auto">
          <path d="M0,0 L12,6 L0,12 Z" fill="#b7791f"/>
        </marker>
      </defs>
      <rect x="28" y="24" width="364" height="272" rx="8" fill="#fffdfa" stroke="#ddd7cc"/>
      <text x="62" y="58" fill="#17211d" font-size="20" font-weight="800">Geometry Formulas Sheet</text>
      <line x1="62" y1="72" x2="358" y2="72" stroke="#17211d" stroke-width="3"/>

      <circle cx="112" cy="132" r="43" fill="#e6f4ef" stroke="#137c5a" stroke-width="4"/>
      <line x1="112" y1="132" x2="148" y2="132" stroke="#b7791f" stroke-width="3" marker-end="url(#arrow)"/>
      <text x="119" y="121" fill="#22312b" font-size="14" font-weight="800">r</text>

      <path d="M232 174 280 86 336 174 Z" fill="#e6f4ef" stroke="#137c5a" stroke-width="4"/>
      <line x1="280" y1="86" x2="280" y2="174" stroke="#b7791f" stroke-width="2" stroke-dasharray="5 5"/>
      <text x="289" y="133" fill="#22312b" font-size="14" font-weight="800">h</text>

      <path d="M82 228h88l28-22h-88Z" fill="#f6ead7" stroke="#137c5a" stroke-width="3"/>
      <path d="M170 228v-42l28-22v42" fill="#e6f4ef" stroke="#137c5a" stroke-width="3"/>
      <path d="M82 228v-42h88v42Z" fill="#e6f4ef" stroke="#137c5a" stroke-width="3"/>

      <rect x="222" y="196" width="126" height="26" rx="5" fill="#f6ead7" stroke="#ddd7cc"/>
      <foreignObject x="235" y="200" width="100" height="20">
        <div xmlns="http://www.w3.org/1999/xhtml" class="hero-formula-math">${renderMath("A = \\pi r^2")}</div>
      </foreignObject>
      <rect x="222" y="232" width="126" height="26" rx="5" fill="#f6ead7" stroke="#ddd7cc"/>
      <foreignObject x="235" y="236" width="100" height="20">
        <div xmlns="http://www.w3.org/1999/xhtml" class="hero-formula-math">${renderMath("A = \\frac{1}{2}bh")}</div>
      </foreignObject>
      <rect x="62" y="252" width="136" height="26" rx="5" fill="#f6ead7" stroke="#ddd7cc"/>
      <foreignObject x="82" y="256" width="92" height="20">
        <div xmlns="http://www.w3.org/1999/xhtml" class="hero-formula-math">${renderMath("V = lwh")}</div>
      </foreignObject>
    </svg>
  `;
}

function diagram(type) {
  const svgClass = "diagram-svg";
  const diagrams = {
    circle: `
      <figure class="diagram-panel">
        <svg class="${svgClass}" viewBox="0 0 420 260" role="img" aria-label="Circle diagram showing radius, diameter, circumference, and center">
          <circle cx="210" cy="130" r="82" class="shape-fill" stroke="#137c5a" stroke-width="4"/>
          <circle cx="210" cy="130" r="4" fill="#17211d"/>
          <line x1="128" y1="130" x2="292" y2="130" class="thin-line"/>
          <line x1="210" y1="130" x2="292" y2="130" class="guide-line"/>
          <path d="M126 95a92 92 0 0 1 168 0" class="guide-line"/>
          <text x="214" y="116">radius</text>
          <text x="181" y="153">diameter</text>
          <text x="296" y="83">circumference</text>
          <text x="218" y="139">center</text>
        </svg>
        <figcaption>Circle variables: radius r, diameter d, circumference C, and center.</figcaption>
      </figure>
    `,
    triangle: `
      <figure class="diagram-panel">
        <svg class="${svgClass}" viewBox="0 0 420 280" role="img" aria-label="Triangle diagram showing base, height, and side lengths a b c">
          <path d="M76 222 214 52 344 222 Z" class="shape-fill" stroke="#137c5a" stroke-width="4"/>
          <line x1="214" y1="52" x2="214" y2="222" class="guide-line"/>
          <text x="202" y="150">height</text>
          <text x="188" y="246">base</text>
          <text x="122" y="131">side a</text>
          <text x="281" y="132">side b</text>
          <text x="202" y="215">side c</text>
        </svg>
        <figcaption>Triangle variables: base b, height h, and side lengths a, b, and c.</figcaption>
      </figure>
    `,
    rectangle: `
      <figure class="diagram-panel">
        <svg class="${svgClass}" viewBox="0 0 420 260" role="img" aria-label="Rectangle diagram showing length, width, and diagonal">
          <rect x="70" y="70" width="280" height="130" class="shape-fill" stroke="#137c5a" stroke-width="4"/>
          <line x1="70" y1="70" x2="350" y2="200" class="guide-line"/>
          <text x="190" y="224">length l</text>
          <text x="30" y="140">width w</text>
          <text x="208" y="124">diagonal d</text>
        </svg>
        <figcaption>Rectangle variables: length l, width w, and diagonal d.</figcaption>
      </figure>
    `,
    square: `
      <figure class="diagram-panel">
        <svg class="${svgClass}" viewBox="0 0 420 260" role="img" aria-label="Square diagram showing side length and diagonal">
          <rect x="125" y="42" width="170" height="170" class="shape-fill" stroke="#137c5a" stroke-width="4"/>
          <line x1="125" y1="42" x2="295" y2="212" class="guide-line"/>
          <text x="197" y="236">side s</text>
          <text x="226" y="121">diagonal d</text>
        </svg>
        <figcaption>Square variables: side length s and diagonal d.</figcaption>
      </figure>
    `,
    cylinder: `
      <figure class="diagram-panel">
        <svg class="${svgClass}" viewBox="0 0 420 300" role="img" aria-label="Cylinder diagram showing radius and height">
          <ellipse cx="210" cy="72" rx="92" ry="34" class="shape-fill" stroke="#137c5a" stroke-width="4"/>
          <path d="M118 72v150c0 19 41 34 92 34s92-15 92-34V72" fill="#e6f4ef" stroke="#137c5a" stroke-width="4"/>
          <ellipse cx="210" cy="222" rx="92" ry="34" fill="none" stroke="#137c5a" stroke-width="4"/>
          <line x1="210" y1="72" x2="302" y2="72" class="guide-line"/>
          <line x1="326" y1="72" x2="326" y2="222" class="guide-line"/>
          <text x="244" y="61">radius r</text>
          <text x="334" y="151">height h</text>
        </svg>
        <figcaption>Cylinder variables: radius r and height h.</figcaption>
      </figure>
    `,
    cone: `
      <figure class="diagram-panel">
        <svg class="${svgClass}" viewBox="0 0 420 300" role="img" aria-label="Cone diagram showing radius, height, and slant height">
          <path d="M210 42 112 232h196Z" class="shape-fill" stroke="#137c5a" stroke-width="4"/>
          <ellipse cx="210" cy="232" rx="98" ry="30" fill="none" stroke="#137c5a" stroke-width="4"/>
          <line x1="210" y1="42" x2="210" y2="232" class="guide-line"/>
          <line x1="210" y1="232" x2="308" y2="232" class="guide-line"/>
          <text x="219" y="142">height h</text>
          <text x="252" y="220">radius r</text>
          <text x="272" y="138">slant height l</text>
        </svg>
        <figcaption>Cone variables: radius r, height h, and slant height l.</figcaption>
      </figure>
    `,
    sphere: `
      <figure class="diagram-panel">
        <svg class="${svgClass}" viewBox="0 0 420 280" role="img" aria-label="Sphere diagram showing radius and diameter">
          <circle cx="210" cy="140" r="88" class="shape-fill" stroke="#137c5a" stroke-width="4"/>
          <ellipse cx="210" cy="140" rx="88" ry="28" fill="none" stroke="#137c5a" stroke-width="2"/>
          <line x1="122" y1="140" x2="298" y2="140" class="thin-line"/>
          <line x1="210" y1="140" x2="298" y2="140" class="guide-line"/>
          <text x="222" y="129">radius r</text>
          <text x="178" y="165">diameter d</text>
        </svg>
        <figcaption>Sphere variables: radius r and diameter d.</figcaption>
      </figure>
    `,
    prism: `
      <figure class="diagram-panel">
        <svg class="${svgClass}" viewBox="0 0 420 290" role="img" aria-label="Rectangular prism diagram showing length, width, and height">
          <path d="M95 220h180l54-56H149Z" fill="#f6ead7" stroke="#137c5a" stroke-width="4"/>
          <path d="M275 220V92l54-56v128" fill="#e6f4ef" stroke="#137c5a" stroke-width="4"/>
          <path d="M95 220V92h180v128Z" class="shape-fill" stroke="#137c5a" stroke-width="4"/>
          <path d="M95 92 149 36h180" fill="none" stroke="#137c5a" stroke-width="4"/>
          <text x="162" y="244">length l</text>
          <text x="290" y="206">width w</text>
          <text x="61" y="158">height h</text>
        </svg>
        <figcaption>Rectangular prism variables: length l, width w, and height h.</figcaption>
      </figure>
    `
  };
  return diagrams[type];
}

function calculatorWidget(type, title, intro = "", anchorId = "calculator") {
  const unit = `<label><span>Unit</span><select name="unit"><option value="cm">cm</option><option value="m">m</option><option value="in">in</option><option value="ft">ft</option></select></label>`;
  const result = `<output class="calculator-result" aria-live="polite"><span class="lead">Enter values and select Calculate to see the result, formula, and steps.</span></output>`;
  const button = `<div class="calculator-actions"><button class="button" type="submit">Calculate with steps</button><button class="button secondary js-copy-result" type="button">Copy Result</button></div>`;
  let fields = "";

  if (type === "circle") {
    fields = `
      <label><span>I know</span><select name="known"><option value="radius">Radius</option><option value="diameter">Diameter</option><option value="circumference">Circumference</option><option value="area">Area</option></select></label>
      <label><span>Value</span><input type="number" name="value" min="0" step="any" placeholder="5"></label>
      ${unit}
    `;
  } else if (type === "triangle") {
    fields = `
      <label><span>Base</span><input type="number" name="base" min="0" step="any" placeholder="10"></label>
      <label><span>Height</span><input type="number" name="height" min="0" step="any" placeholder="6"></label>
      <label><span>Area</span><input type="number" name="area" min="0" step="any" placeholder="30"></label>
      <label><span>Side a</span><input type="number" name="sideA" min="0" step="any" placeholder="3"></label>
      <label><span>Side b</span><input type="number" name="sideB" min="0" step="any" placeholder="4"></label>
      <label><span>Side c</span><input type="number" name="sideC" min="0" step="any" placeholder="5"></label>
      ${unit}
    `;
  } else if (type === "rectangle") {
    fields = `
      <label><span>Length</span><input type="number" name="length" min="0" step="any" placeholder="8"></label>
      <label><span>Width</span><input type="number" name="width" min="0" step="any" placeholder="3"></label>
      ${unit}
    `;
  } else if (type === "square") {
    fields = `
      <label><span>Side length</span><input type="number" name="side" min="0" step="any" placeholder="9"></label>
      ${unit}
    `;
  } else if (type === "cylinder" || type === "cone") {
    fields = `
      <label><span>Solve</span><select name="solve"><option value="all">All values from radius and height</option><option value="height-from-volume">Height from volume and radius</option><option value="radius-from-volume">Radius from volume and height</option></select></label>
      <label><span>Radius</span><input type="number" name="radius" min="0" step="any" placeholder="3"></label>
      <label><span>Height</span><input type="number" name="height" min="0" step="any" placeholder="10"></label>
      <label><span>Volume</span><input type="number" name="volume" min="0" step="any" placeholder="282.74"></label>
      ${unit}
    `;
  } else if (type === "sphere") {
    fields = `
      <label><span>I know</span><select name="known"><option value="radius">Radius</option><option value="diameter">Diameter</option><option value="volume">Volume</option><option value="surfaceArea">Surface area</option></select></label>
      <label><span>Value</span><input type="number" name="value" min="0" step="any" placeholder="6"></label>
      ${unit}
    `;
  } else if (type === "rectangular-prism") {
    fields = `
      <label><span>Length</span><input type="number" name="length" min="0" step="any" placeholder="8"></label>
      <label><span>Width</span><input type="number" name="width" min="0" step="any" placeholder="4"></label>
      <label><span>Height</span><input type="number" name="height" min="0" step="any" placeholder="3"></label>
      ${unit}
    `;
  } else if (type === "solver") {
    fields = `
      <label><span>Shape</span><select name="shape"><option value="circle">Circle</option><option value="triangle">Triangle</option><option value="rectangle">Rectangle</option><option value="cylinder">Cylinder</option><option value="cone">Cone</option><option value="sphere">Sphere</option></select></label>
      <label><span>Find</span><select name="target"><option value="auto">Best result from known values</option><option value="area">Area</option><option value="perimeter">Perimeter</option><option value="circumference">Circumference</option><option value="volume">Volume</option><option value="surfaceArea">Surface area</option><option value="radius">Radius</option><option value="height">Height</option></select></label>
      <label><span>Radius</span><input type="number" name="radius" min="0" step="any" placeholder="5"></label>
      <label><span>Diameter</span><input type="number" name="diameter" min="0" step="any" placeholder="10"></label>
      <label><span>Circumference</span><input type="number" name="circumference" min="0" step="any" placeholder="31.42"></label>
      <label><span>Area</span><input type="number" name="area" min="0" step="any" placeholder="78.54"></label>
      <label><span>Volume</span><input type="number" name="volume" min="0" step="any" placeholder="282.74"></label>
      <label><span>Base / length</span><input type="number" name="base" min="0" step="any" placeholder="10"></label>
      <label><span>Width</span><input type="number" name="width" min="0" step="any" placeholder="4"></label>
      <label><span>Height</span><input type="number" name="height" min="0" step="any" placeholder="6"></label>
      <label><span>Side a</span><input type="number" name="sideA" min="0" step="any" placeholder="3"></label>
      <label><span>Side b</span><input type="number" name="sideB" min="0" step="any" placeholder="4"></label>
      <label><span>Side c</span><input type="number" name="sideC" min="0" step="any" placeholder="5"></label>
      ${unit}
    `;
  }

  return `
    <section class="section-block calculator-section" id="${anchorId}">
      <p class="section-kicker">Calculator</p>
      <h2>${title}</h2>
      ${intro ? `<p>${intro}</p>` : ""}
      <form class="calculator js-calculator" data-calculator="${type}">
        <div class="calculator-fields">${fields}</div>
        ${button}
        ${result}
      </form>
    </section>
  `;
}

function pageShell(page, body) {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": page.schemaType || "WebPage",
      name: page.title,
      description: page.description,
      url: absoluteUrl(page.slug),
      inLanguage: "en",
      dateModified: lastmod,
      isPartOf: {
        "@type": "WebSite",
        name: brandName,
        alternateName: brandAlternateName,
        url: `${siteUrl}/`
      },
      publisher: organizationSchema(),
      isAccessibleForFree: true,
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: socialImageUrl,
        width: socialImage.width,
        height: socialImage.height,
        caption: `${page.h1} visual formula reference`
      }
    },
    breadcrumbSchema(page),
    websiteSchema(),
    {
      "@context": "https://schema.org",
      "@type": "ImageObject",
      url: socialImageUrl,
      width: socialImage.width,
      height: socialImage.height,
      caption: `${page.h1} diagram and formula card`
    },
    organizationSchema()
  ];

  if (page.hasCalculator) {
    schema.push({
      "@context": "https://schema.org",
      "@type": ["WebApplication", "SoftwareApplication"],
      name: page.h1,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      url: absoluteUrl(page.slug),
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD"
      }
    });
  }

  return `<!doctype html>
<html lang="en">
<head>
  ${googleTag()}
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="${escapeHtml(page.description)}">
  <meta name="robots" content="index,follow">
  <meta name="theme-color" content="#137c5a">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${brandName}">
  <meta property="og:title" content="${escapeHtml(page.title)}">
  <meta property="og:description" content="${escapeHtml(page.description)}">
  <meta property="og:url" content="${absoluteUrl(page.slug)}">
  <meta property="og:image" content="${socialImageUrl}">
  <meta property="og:image:type" content="${socialImage.type}">
  <meta property="og:image:width" content="${socialImage.width}">
  <meta property="og:image:height" content="${socialImage.height}">
  <meta property="og:image:alt" content="${escapeHtml(socialImage.alt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(page.title)}">
  <meta name="twitter:description" content="${escapeHtml(page.description)}">
  <meta name="twitter:image" content="${socialImageUrl}">
  <meta name="twitter:image:alt" content="${escapeHtml(socialImage.alt)}">
  <link rel="canonical" href="${absoluteUrl(page.slug)}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/assets/vendor/katex/katex.min.css">
  <link rel="stylesheet" href="/assets/css/styles.css">
  <script defer src="/assets/vendor/katex/katex.min.js"></script>
  <script defer src="/assets/js/calculators.js"></script>
  ${schema.map((item) => `<script type="application/ld+json">${JSON.stringify(item)}</script>`).join("\n  ")}
</head>
<body>
  <a class="skip-link" href="#content">Skip to content</a>
  <header class="site-header">
    <div class="header-inner">
      <a class="brand" href="/"><span class="brand-mark">${brandMark()}</span><span>${brandName}</span></a>
      <nav class="site-nav" aria-label="Primary navigation">
        ${navItems.map(([label, href]) => `<a href="${href}"${href === pageUrl(page.slug) ? " class=\"active\"" : ""}>${label}</a>`).join("")}
      </nav>
    </div>
    <div class="search-row">
      <form class="formula-search js-formula-search" role="search">
        <label class="sr-only" for="formula-search-${page.slug}">Search formulas and calculators</label>
        <input id="formula-search-${page.slug}" name="q" type="search" autocomplete="off" placeholder="Search circle area, cone volume, triangle height...">
        <button type="submit">Search</button>
        <div class="search-results" aria-live="polite"></div>
      </form>
    </div>
  </header>
  <main id="content">
    ${body}
  </main>
  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-about">
        <p><strong>Geometry Formulas & Calculators for Students</strong><br>Fast reference pages, diagrams, and calculators for common geometry homework.</p>
        <p class="footer-company">Operated by ${companyName}. <a href="/contact/">Contact us</a></p>
      </div>
      <nav class="footer-links" aria-label="Footer navigation">
        <div>
          <strong>Learn</strong>
          <a href="/">${brandName}</a>
          <a href="/area-formulas/">Area</a>
          <a href="/volume-formulas/">Volume</a>
          <a href="/surface-area-formulas/">Surface Area</a>
        </div>
        <div>
          <strong>Tools</strong>
          <a href="/geometry-calculator/">Calculators</a>
          <a href="/geometry-solver/">Solver</a>
          <a href="/circle-calculator/">Circle Calculator</a>
          <a href="/triangle-calculator/">Triangle Calculator</a>
        </div>
        <div>
          <strong>Company</strong>
          ${companyLinks.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}
        </div>
        <div>
          <strong>Policies</strong>
          ${policyLinks.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}
        </div>
      </nav>
    </div>
  </footer>
</body>
</html>`;
}

function googleTag() {
  return `<!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', '${googleAnalyticsId}');
  </script>`;
}

function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: companyName,
    url: `${siteUrl}/`
  };
}

function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brandName,
    alternateName: brandAlternateName,
    url: `${siteUrl}/`,
    inLanguage: "en",
    publisher: organizationSchema()
  };
}

function breadcrumbSchema(page) {
  const items = page.slug === "geometry-formulas"
    ? [{ name: brandName, item: absoluteUrl("geometry-formulas") }]
    : [
        { name: brandName, item: absoluteUrl("geometry-formulas") },
        { name: page.h1, item: absoluteUrl(page.slug) }
      ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item
    }))
  };
}

function stripTags(html) {
  return html
    .replace(/<sup>(.*?)<\/sup>/g, "^$1")
    .replace(/<sub>(.*?)<\/sub>/g, "_$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&pi;/g, "pi")
    .replace(/&times;/g, "x")
    .replace(/&radic;/g, "sqrt")
    .replace(/&asymp;/g, "approximately")
    .replace(/&frac12;/g, "1/2")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function renderHero(page, visual = heroArt()) {
  return `
    <section class="page-hero">
      <div class="container">
        ${breadcrumbHtml(page)}
        <div class="hero-grid">
          <div>
            <p class="eyebrow">${page.kicker || "Geometry Formulas & Calculators for Students"}</p>
            <h1>${page.h1}</h1>
            <p class="hero-copy">${page.intro}</p>
            <div class="hero-actions">
              <a class="button" href="#quick-table">View formulas</a>
              <a class="button secondary" href="#calculator">Use calculator</a>
            </div>
          </div>
          <div class="hero-visual">${visual}</div>
        </div>
      </div>
    </section>
  `;
}

function shapeHeroVisual(page) {
  return `<div class="hero-tool-stack">${formulaCard(page.card, {
    calculatorHref: calculatorHrefFor(page.calculator, page.slug)
  })}${diagram(page.diagram)}</div>`;
}

function directAnswerBlock(page) {
  if (!page.directAnswer) return "";
  return `
    <section class="section-block direct-answer" id="direct-answer">
      <p class="section-kicker">Direct answer</p>
      <h2>${page.directAnswerTitle || page.h1}</h2>
      <p>${page.directAnswer}</p>
    </section>
  `;
}

function directAnswerBand(page) {
  if (!page.directAnswer) return "";
  return `
    <section class="direct-answer-section">
      <div class="container">
        ${directAnswerBlock(page)}
      </div>
    </section>
  `;
}

function infoHero(page) {
  return `
    <section class="page-hero info-hero">
      <div class="container">
        ${breadcrumbHtml(page)}
        <p class="eyebrow">${page.kicker || "Geometry Formulas"}</p>
        <h1>${page.h1}</h1>
        <p class="hero-copy">${page.intro}</p>
      </div>
    </section>
  `;
}

function infoBody(page, sections) {
  return `
    ${infoHero(page)}
    <section class="section">
      <div class="container info-layout">
        <article class="section-block info-content">
          ${sections.map((section) => `
            <section class="info-section">
              <h2>${section.title}</h2>
              ${section.body}
            </section>
          `).join("")}
        </article>
        <aside class="note-panel info-aside">
          <h2>Site Information</h2>
          <p><strong>Operator:</strong><br>${companyName}</p>
          <p><strong>Email:</strong><br>${contactEmailText()}</p>
          <p><strong>Website:</strong><br><a href="${siteUrl}/">${siteUrl.replace(/^https?:\/\//, "")}</a></p>
        </aside>
      </div>
    </section>
  `;
}

function contactEmailText() {
  return `<span class="contact-email">${contactEmailDisplay}</span>`;
}

function trustPages() {
  return [
    aboutPage(),
    teamServicesPage(),
    contactPage(),
    privacyPolicyPage(),
    termsOfUsePage()
  ];
}

function aboutPage() {
  const page = {
    slug: "about",
    h1: "About Geometry Formulas",
    title: "About Geometry Formulas",
    description: "Learn about Geometry Formulas, a student-focused site operated by Blue Core Technologies LLC with visual formulas and calculators.",
    intro: "Geometry Formulas is a student-focused reference site for common 2D and 3D geometry formulas, visual diagrams, examples, and calculators.",
    kicker: "About",
    schemaType: "AboutPage"
  };

  const body = infoBody(page, [
    {
      title: "What we publish",
      body: `<p>We publish geometry formula sheets, calculator pages, SVG diagrams, step-by-step examples, and practice problems for students who need quick homework checks and clearer formula explanations.</p>`
    },
    {
      title: "Editorial approach",
      body: `<p>Each core formula page is built around the same structure: a direct answer, a formula card, a labeled diagram, a calculator, examples, common mistakes, practice problems, and related pages. Formula content is written as text and rendered with KaTeX so it remains readable and accessible.</p>`
    },
    {
      title: "Who operates this website",
      body: `<p>Geometry Formulas is operated by ${companyName}. For questions, corrections, or feedback, use the <a href="/contact/">contact page</a>.</p>`
    }
  ]);

  return { ...page, body };
}

function teamServicesPage() {
  const page = {
    slug: "team-services",
    h1: "Team & Services",
    title: "Team & Services | Geometry Formulas",
    description: "Learn about the Geometry Formulas team, educational content services, calculator planning, and contact information.",
    intro: "Our work focuses on clear educational content, visual math references, and lightweight web calculators for student learning.",
    kicker: "Team & Services"
  };

  const body = infoBody(page, [
    {
      title: "Our team focus",
      body: `<p>The Geometry Formulas team focuses on turning common geometry topics into useful study pages. We prioritize accuracy, clear diagrams, fast pages, and calculators that show the formula and the steps behind each answer.</p>`
    },
    {
      title: "Educational content services",
      body: `<p>${companyName} can support educational web content planning, formula reference pages, calculator concepts, content structure, and search-focused information architecture for learning websites.</p>`
    },
    {
      title: "What we do not provide",
      body: `<p>The website does not provide private tutoring, graded homework completion, legal advice, or financial advice. Geometry calculators are educational tools and should be checked against class instructions when precision or rounding rules matter.</p>`
    },
    {
      title: "Service inquiries",
      body: `<p>For service or partnership inquiries, use the <a href="/contact/">contact page</a> with a short description of your project, timeline, and website or organization.</p>`
    }
  ]);

  return { ...page, body };
}

function contactPage() {
  const page = {
    slug: "contact",
    h1: "Contact Geometry Formulas",
    title: "Contact Geometry Formulas",
    description: "Contact Geometry Formulas for corrections, feedback, advertising questions, service inquiries, or website support.",
    intro: "Use this page to contact the team about corrections, calculator feedback, partnership questions, or website support.",
    kicker: "Contact",
    schemaType: "ContactPage"
  };

  const body = infoBody(page, [
    {
      title: "Email",
      body: `<p>The best way to reach us is by email: ${contactEmailText()}.</p>`
    },
    {
      title: "What to include",
      body: `<ul class="info-list"><li>The page URL you are writing about.</li><li>A short description of the issue or question.</li><li>If reporting a formula or calculator issue, include the values entered and the expected result.</li></ul>`
    },
    {
      title: "Corrections and feedback",
      body: `<p>We review correction requests for formula accuracy, wording clarity, calculator behavior, and page usability. Educational content may be updated when a correction improves clarity or accuracy for students.</p>`
    },
    {
      title: "Advertising and privacy questions",
      body: `<p>For advertising, privacy, or data questions, include “Privacy” or “Advertising” in the email subject so the message can be routed appropriately.</p>`
    }
  ]);

  return { ...page, body };
}

function privacyPolicyPage() {
  const page = {
    slug: "privacy-policy",
    h1: "Privacy Policy",
    title: "Privacy Policy | Geometry Formulas",
    description: "Read the Geometry Formulas privacy policy, including contact information, cookies, analytics, advertising, and data choices.",
    intro: `This Privacy Policy explains how ${companyName} handles information for Geometry Formulas.`,
    kicker: "Policy"
  };

  const body = infoBody(page, [
    {
      title: "Last updated",
      body: `<p>May 15, 2026</p>`
    },
    {
      title: "Who we are",
      body: `<p>Geometry Formulas is operated by ${companyName}. You can contact us through the <a href="/contact/">contact page</a>.</p>`
    },
    {
      title: "Information we may collect",
      body: `<p>When you visit the website, standard technical information may be processed automatically, such as browser type, device information, pages viewed, approximate location derived from IP address, referring pages, and interaction data. If you email us, we receive the information you choose to send.</p>`
    },
    {
      title: "Cookies, analytics, and advertising",
      body: `<p>The website may use cookies or similar technologies for site functionality, analytics, performance measurement, and advertising. If Google ads are enabled, Google and its partners may use cookies or identifiers to serve ads, limit repeated ads, measure ad performance, and help show more relevant advertising where permitted.</p><p>You can control cookies through your browser settings. You can also learn about Google advertising controls through Google’s ad settings and privacy tools.</p>`
    },
    {
      title: "How information is used",
      body: `<ul class="info-list"><li>To operate and improve the website.</li><li>To understand which formulas, calculators, and pages are useful.</li><li>To respond to messages sent by email.</li><li>To protect the website from abuse, spam, or technical problems.</li><li>To support advertising, measurement, and compliance when ads are used.</li></ul>`
    },
    {
      title: "Third-party services",
      body: `<p>We may use third-party services for hosting, analytics, security, or advertising. These services may process information according to their own policies. The website is designed as a public educational resource and does not require user accounts.</p>`
    },
    {
      title: "Children’s privacy",
      body: `<p>Geometry Formulas is an educational website, but it is not designed to collect personal information from children. If you believe a child has sent personal information to us, use the <a href="/contact/">contact page</a> so we can review and delete it where appropriate.</p>`
    },
    {
      title: "Contact",
      body: `<p>For privacy questions or requests, use the <a href="/contact/">contact page</a>.</p>`
    }
  ]);

  return { ...page, body };
}

function termsOfUsePage() {
  const page = {
    slug: "terms-of-use",
    h1: "Terms of Use",
    title: "Terms of Use | Geometry Formulas",
    description: "Read the Geometry Formulas terms of use for educational content, calculators, acceptable use, and contact information.",
    intro: "These Terms of Use explain the basic rules for using Geometry Formulas and its educational calculators.",
    kicker: "Policy"
  };

  const body = infoBody(page, [
    {
      title: "Last updated",
      body: `<p>May 15, 2026</p>`
    },
    {
      title: "Educational use",
      body: `<p>Geometry Formulas provides educational reference content, visual diagrams, formula cards, examples, practice problems, and calculators. The content is intended to support learning and homework checking, not to replace teacher instructions or course requirements.</p>`
    },
    {
      title: "Calculator accuracy",
      body: `<p>We work to keep formulas and calculators accurate, but results can depend on rounding, units, and entered values. Users should verify important results and follow the rounding rules required by their class, teacher, or assignment.</p>`
    },
    {
      title: "Acceptable use",
      body: `<ul class="info-list"><li>Do not use the website in a way that disrupts or damages the service.</li><li>Do not copy large parts of the website for automated or misleading pages.</li><li>Do not use calculators for unlawful, harmful, or deceptive purposes.</li></ul>`
    },
    {
      title: "Intellectual property",
      body: `<p>Unless otherwise stated, the website content, page structure, diagrams, formula cards, and calculator interface are owned or controlled by ${companyName}. You may use the website for personal study and classroom reference, subject to these terms.</p>`
    },
    {
      title: "Changes and contact",
      body: `<p>We may update these terms as the website changes. Questions about these terms can be sent through the <a href="/contact/">contact page</a>.</p>`
    }
  ]);

  return { ...page, body };
}

function homePage() {
  const page = {
    slug: "geometry-formulas",
    h1: "Geometry Formulas",
    title: "Geometry Formulas: Area, Perimeter, Volume & Surface Area",
    description: "A student-friendly geometry formulas sheet with 2D and 3D formulas, diagrams, examples, and geometry calculators.",
    intro: "A simple geometry formulas sheet for the most common 2D and 3D shapes, with examples and calculators for homework checks.",
    directAnswerTitle: "What are geometry formulas?",
    directAnswer: `Geometry formulas are equations used to calculate measurements such as area, perimeter, circumference, volume, and surface area. Common examples include circle area ${formula("A = &pi;r<sup>2</sup>")}, rectangle area ${formula("A = lw")}, cylinder volume ${formula("V = &pi;r<sup>2</sup>h")}, and sphere surface area ${formula("SA = 4&pi;r<sup>2</sup>")}.`,
    faqs: [
      { q: "What are the most important geometry formulas to memorize?", a: "Start with area, perimeter, circumference, volume, and surface area formulas for square, rectangle, triangle, circle, cylinder, cone, and sphere." },
      { q: "Is this page a geometry formulas sheet?", a: "Yes. It is designed as a geometry formulas sheet for quick reference, with tables, diagrams, examples, and calculators." },
      { q: "What is the difference between perimeter and area?", a: "Perimeter measures distance around a 2D shape. Area measures the amount of flat space inside the shape." },
      { q: "What is the difference between volume and surface area?", a: "Volume measures the space inside a 3D object. Surface area measures the total area of its outside faces or curved surfaces." }
    ]
  };

  const body = `
    ${renderHero(page)}
    ${directAnswerBand(page)}
    <section class="section" id="quick-table">
      <div class="container">
        <div class="section-head">
          <p class="section-kicker">Basic Geometry Formulas</p>
          <h2>Core measurements</h2>
          <p>Most geometry problems ask for one of five measurements: area, perimeter, circumference, volume, or surface area.</p>
        </div>
        ${table([
          ["Area", formula("A"), "Space inside a 2D shape, measured in square units"],
          ["Perimeter", formula("P"), "Distance around a polygon"],
          ["Circumference", formula("C"), "Distance around a circle"],
          ["Volume", formula("V"), "Space inside a 3D solid, measured in cubic units"],
          ["Surface area", formula("SA"), "Total outside area of a 3D solid"]
        ], ["Measurement", "Symbol", "Meaning"])}
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="section-head">
          <p class="section-kicker">2D Geometry Formulas</p>
          <h2>Area, perimeter, and circumference formulas</h2>
        </div>
        ${table(twoDRows)}
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="section-head">
          <p class="section-kicker">3D Geometry Formulas</p>
          <h2>Volume and surface area formulas</h2>
        </div>
        ${table(threeDRows)}
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="section-head">
          <p class="section-kicker">Formula Cards</p>
          <h2>Copy, save, or print common formulas</h2>
          <p>Use these cards when you need a formula for notes, class materials, or a quick image export.</p>
        </div>
        ${formulaCardGrid([formulaCards.circle, formulaCards.triangle, formulaCards.cylinder, formulaCards.cone, formulaCards.sphere, formulaCards["rectangular-prism"]])}
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="section-head">
          <p class="section-kicker">Geometry Formula Examples</p>
          <h2>Worked examples</h2>
        </div>
        ${examples([
          { title: "Area of a circle", steps: ["Given r = 5 cm.", `Use ${formula("A = &pi;r<sup>2</sup>")}.`, `A = &pi; &times; 5<sup>2</sup> = 25&pi; &asymp; 78.54 cm<sup>2</sup>.`] },
          { title: "Volume of a cylinder", steps: ["Given r = 3 m and h = 10 m.", `Use ${formula("V = &pi;r<sup>2</sup>h")}.`, `V = &pi; &times; 3<sup>2</sup> &times; 10 = 90&pi; &asymp; 282.74 m<sup>3</sup>.`] },
          { title: "Surface area of a sphere", steps: ["Given r = 6 in.", `Use ${formula("SA = 4&pi;r<sup>2</sup>")}.`, `SA = 4&pi; &times; 6<sup>2</sup> = 144&pi; &asymp; 452.39 in<sup>2</sup>.`] }
        ])}
      </div>
    </section>
    <section class="section" id="calculator">
      <div class="container">
        <div class="section-head">
          <p class="section-kicker">Geometry Calculators</p>
          <h2>Popular geometry calculators</h2>
          <p>Use the calculators after reading a formula to check the result, unit, formula, and calculation steps.</p>
        </div>
        ${linkTiles(calculatorLinks)}
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="section-head">
          <p class="section-kicker">Formula Pages</p>
          <h2>Common shapes</h2>
        </div>
        ${linkTiles(shapeLinks)}
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="section-head">
          <p class="section-kicker">FAQ</p>
          <h2>Geometry formulas FAQ</h2>
        </div>
        ${faqs(page.faqs)}
      </div>
    </section>
  `;
  return { ...page, body };
}

function areaPage() {
  const page = {
    slug: "area-formulas",
    h1: "Area Formulas",
    title: "Area Formulas for 2D Shapes and Common Solids",
    description: "Learn area formulas for square, rectangle, triangle, circle, parallelogram, trapezoid, rhombus, and 3D bases.",
    intro: "Area formulas measure the flat space inside a shape. Use square units such as cm2, m2, or in2.",
    directAnswerTitle: "What is an area formula?",
    directAnswer: `Area formulas calculate the flat space inside a 2D shape or the base of a 3D solid. Common area formulas include square area ${formula("A = s<sup>2</sup>")}, rectangle area ${formula("A = lw")}, triangle area ${formula("A = 1/2bh")}, and circle area ${formula("A = &pi;r<sup>2</sup>")}.`,
    faqs: [
      { q: "What is the area formula for a rectangle?", a: `The rectangle area formula is ${formula("A = lw")}, where l is length and w is width.` },
      { q: "What is the area formula for a circle?", a: `The circle area formula is ${formula("A = &pi;r<sup>2</sup>")}, where r is the radius.` },
      { q: "Do area answers need square units?", a: "Yes. Area is always written in square units, such as cm2 or square meters." }
    ]
  };
  const areaRows = [
    ["Square", formula("A = s<sup>2</sup>"), "s = side length"],
    ["Rectangle", formula("A = lw"), "l = length, w = width"],
    ["Triangle", formula("A = 1/2 &times; b &times; h"), "b = base, h = height"],
    ["Circle", formula("A = &pi;r<sup>2</sup>"), "r = radius"],
    ["Parallelogram", formula("A = bh"), "b = base, h = height"],
    ["Trapezoid", formula("A = 1/2(a + b)h"), "a and b = parallel bases, h = height"],
    ["Rhombus", formula("A = 1/2d<sub>1</sub>d<sub>2</sub>"), "d1 and d2 = diagonals"],
    ["Cube face", formula("A = s<sup>2</sup>"), "Area of one square face"],
    ["Cylinder base", formula("A = &pi;r<sup>2</sup>"), "Area of the circular base"]
  ];
  const body = aggregateBody(page, "Area formulas table", table(areaRows), examples([
    { title: "Rectangle area", steps: ["Given l = 12 cm and w = 4 cm.", `Use ${formula("A = lw")}.`, `A = 12 &times; 4 = 48 cm<sup>2</sup>.`] },
    { title: "Triangle area", steps: ["Given b = 10 m and h = 7 m.", `Use ${formula("A = 1/2bh")}.`, `A = 1/2 &times; 10 &times; 7 = 35 m<sup>2</sup>.`] },
    { title: "Circle area", steps: ["Given r = 3 in.", `Use ${formula("A = &pi;r<sup>2</sup>")}.`, `A = 9&pi; &asymp; 28.27 in<sup>2</sup>.`] }
  ]));
  return { ...page, body };
}

function perimeterPage() {
  const page = {
    slug: "perimeter-formulas",
    h1: "Perimeter Formulas",
    title: "Perimeter Formulas for Common 2D Shapes",
    description: "Learn perimeter formulas for square, rectangle, triangle, parallelogram, rhombus, trapezoid, and circumference for circles.",
    intro: "Perimeter is the distance around a 2D shape. For circles, the perimeter is called circumference.",
    directAnswerTitle: "What is a perimeter formula?",
    directAnswer: `Perimeter formulas calculate the distance around a 2D shape. For polygons, perimeter usually adds side lengths, such as triangle perimeter ${formula("P = a + b + c")} or rectangle perimeter ${formula("P = 2(l + w)")}. For circles, perimeter is circumference: ${formula("C = 2&pi;r = &pi;d")}.`,
    faqs: [
      { q: "What is perimeter?", a: "Perimeter is the total distance around the outside of a polygon." },
      { q: "Is circumference the same as perimeter?", a: "Circumference is the perimeter of a circle." },
      { q: "What units does perimeter use?", a: "Perimeter uses linear units such as cm, m, in, or ft." }
    ]
  };
  const rows = [
    ["Square", formula("P = 4s"), "s = side length"],
    ["Rectangle", formula("P = 2(l + w)"), "l = length, w = width"],
    ["Triangle", formula("P = a + b + c"), "a, b, c = side lengths"],
    ["Circle", formula("C = 2&pi;r = &pi;d"), "r = radius, d = diameter"],
    ["Parallelogram", formula("P = 2(a + b)"), "a and b = adjacent sides"],
    ["Rhombus", formula("P = 4s"), "s = side length"],
    ["Regular polygon", formula("P = ns"), "n = number of sides, s = side length"]
  ];
  const body = aggregateBody(page, "Perimeter formulas table", table(rows), examples([
    { title: "Rectangle perimeter", steps: ["Given l = 9 cm and w = 5 cm.", `Use ${formula("P = 2(l + w)")}.`, `P = 2(9 + 5) = 28 cm.`] },
    { title: "Triangle perimeter", steps: ["Given sides 4 m, 6 m, and 8 m.", `Use ${formula("P = a + b + c")}.`, "P = 4 + 6 + 8 = 18 m."] },
    { title: "Circle circumference", steps: ["Given d = 12 in.", `Use ${formula("C = &pi;d")}.`, "C = 12&pi; &asymp; 37.70 in."] }
  ]));
  return { ...page, body };
}

function volumePage() {
  const page = {
    slug: "volume-formulas",
    h1: "Volume Formulas",
    title: "Volume Formulas for 3D Shapes",
    description: "Learn volume formulas for cube, rectangular prism, cylinder, cone, sphere, and pyramid-style solids.",
    intro: "Volume formulas measure how much space a 3D solid contains. Answers use cubic units.",
    directAnswerTitle: "What is a volume formula?",
    directAnswer: `Volume formulas calculate the space inside a 3D solid. Common examples are cube volume ${formula("V = s<sup>3</sup>")}, rectangular prism volume ${formula("V = lwh")}, cylinder volume ${formula("V = &pi;r<sup>2</sup>h")}, cone volume ${formula("V = 1/3&pi;r<sup>2</sup>h")}, and sphere volume ${formula("V = 4/3&pi;r<sup>3</sup>")}.`,
    faqs: [
      { q: "What is the easiest volume formula?", a: `For prisms, volume is usually base area times height, or ${formula("V = Bh")}.` },
      { q: "Why does a cone use one third?", a: "A cone with the same base and height as a cylinder has one third of the cylinder volume." },
      { q: "Do volume answers need cubic units?", a: "Yes. Volume is written in cubic units, such as cm3 or cubic meters." }
    ]
  };
  const rows = [
    ["Cube", formula("V = s<sup>3</sup>"), "s = side length"],
    ["Rectangular prism", formula("V = lwh"), "l = length, w = width, h = height"],
    ["Cylinder", formula("V = &pi;r<sup>2</sup>h"), "r = radius, h = height"],
    ["Cone", formula("V = 1/3&pi;r<sup>2</sup>h"), "r = radius, h = height"],
    ["Sphere", formula("V = 4/3&pi;r<sup>3</sup>"), "r = radius"],
    ["Pyramid", formula("V = 1/3Bh"), "B = base area, h = height"]
  ];
  const body = aggregateBody(page, "Volume formulas table", table(rows), examples([
    { title: "Rectangular prism volume", steps: ["Given l = 8 cm, w = 4 cm, h = 3 cm.", `Use ${formula("V = lwh")}.`, `V = 8 &times; 4 &times; 3 = 96 cm<sup>3</sup>.`] },
    { title: "Cylinder volume", steps: ["Given r = 2 m and h = 9 m.", `Use ${formula("V = &pi;r<sup>2</sup>h")}.`, `V = 36&pi; &asymp; 113.10 m<sup>3</sup>.`] },
    { title: "Sphere volume", steps: ["Given r = 5 in.", `Use ${formula("V = 4/3&pi;r<sup>3</sup>")}.`, `V = 500/3&pi; &asymp; 523.60 in<sup>3</sup>.`] }
  ]));
  return { ...page, body };
}

function surfaceAreaPage() {
  const page = {
    slug: "surface-area-formulas",
    h1: "Surface Area Formulas",
    title: "Surface Area Formulas for 3D Shapes",
    description: "Learn surface area formulas for cube, rectangular prism, cylinder, cone, and sphere with examples.",
    intro: "Surface area is the total outside area of a 3D solid. It is measured in square units.",
    directAnswerTitle: "What is a surface area formula?",
    directAnswer: `Surface area formulas calculate the total outside area of a 3D solid. Common examples include cube surface area ${formula("SA = 6s<sup>2</sup>")}, cylinder total surface area ${formula("TSA = 2&pi;r(r + h)")}, and sphere surface area ${formula("SA = 4&pi;r<sup>2</sup>")}. Use square units, and for prisms add the areas of all outside faces.`,
    faqs: [
      { q: "What does total surface area mean?", a: "Total surface area includes every outside face or curved surface of a 3D object." },
      { q: "What does lateral surface area mean?", a: "Lateral surface area usually excludes the base or bases and measures only the side surface." },
      { q: "Does surface area use square or cubic units?", a: "Surface area uses square units because it measures area, not volume." }
    ]
  };
  const rows = [
    ["Cube", formula("SA = 6s<sup>2</sup>"), "s = side length"],
    ["Rectangular prism", formula("SA = 2(lw + lh + wh)"), "l = length, w = width, h = height"],
    ["Cylinder total surface area", formula("TSA = 2&pi;r(r + h)"), "r = radius, h = height"],
    ["Cylinder lateral surface area", formula("LSA = 2&pi;rh"), "Curved side only"],
    ["Cone total surface area", formula("TSA = &pi;r(r + l)"), "l = slant height"],
    ["Cone lateral surface area", formula("LSA = &pi;rl"), "Curved side only"],
    ["Sphere", formula("SA = 4&pi;r<sup>2</sup>"), "r = radius"]
  ];
  const body = aggregateBody(page, "Surface area formulas table", table(rows), examples([
    { title: "Cube surface area", steps: ["Given s = 4 cm.", `Use ${formula("SA = 6s<sup>2</sup>")}.`, `SA = 6 &times; 16 = 96 cm<sup>2</sup>.`] },
    { title: "Cylinder total surface area", steps: ["Given r = 3 m and h = 5 m.", `Use ${formula("TSA = 2&pi;r(r + h)")}.`, `TSA = 2&pi; &times; 3(3 + 5) = 48&pi; &asymp; 150.80 m<sup>2</sup>.`] },
    { title: "Sphere surface area", steps: ["Given r = 7 in.", `Use ${formula("SA = 4&pi;r<sup>2</sup>")}.`, `SA = 196&pi; &asymp; 615.75 in<sup>2</sup>.`] }
  ]));
  return { ...page, body };
}

function aggregateBody(page, tableTitle, formulaTable, exampleHtml) {
  return `
    ${renderHero(page)}
    <section class="section" id="quick-table">
      <div class="container prose-grid">
        <article class="prose-main">
          ${directAnswerBlock(page)}
          <section class="section-block">
            <p class="section-kicker">Quick table</p>
            <h2>${tableTitle}</h2>
            ${formulaTable}
          </section>
          <section class="section-block">
            <p class="section-kicker">Formula cards</p>
            <h2>Quick formula cards</h2>
            ${formulaCardGrid([formulaCards.circle, formulaCards.triangle, formulaCards.cylinder, formulaCards.cone, formulaCards.sphere])}
          </section>
          <section class="section-block">
            <p class="section-kicker">Examples</p>
            <h2>Step-by-step examples</h2>
            ${exampleHtml}
          </section>
          <section class="section-block" id="calculator">
            <p class="section-kicker">Calculators</p>
            <h2>Related calculators</h2>
            ${linkTiles(calculatorLinks)}
          </section>
          <section class="section-block">
            <p class="section-kicker">FAQ</p>
            <h2>${page.h1} FAQ</h2>
            ${faqs(page.faqs)}
          </section>
        </article>
        <aside class="aside">
          <h2>Related formulas</h2>
          <a href="#direct-answer">Direct answer</a>
          <a href="/circle-formulas/">Circle formulas</a>
          <a href="/triangle-formulas/">Triangle formulas</a>
          <a href="/cylinder-formulas/">Cylinder formulas</a>
          <a href="/sphere-formulas/">Sphere formulas</a>
        </aside>
      </div>
    </section>
  `;
}

function shapePages() {
  const shapes = [
    {
      slug: "circle-formulas",
      h1: "Circle Formulas",
      title: "Circle Formulas with Examples and Calculator",
      description: "Learn circle formulas for area, circumference, diameter, and radius with a formula card, labeled diagram, calculator, examples, and practice problems.",
      intro: "Circle formulas help you find area, circumference, diameter, and radius from one known measurement.",
      directAnswerTitle: "What are the main circle formulas?",
      directAnswer: `The main circle formulas are area ${formula("A = &pi;r<sup>2</sup>")}, circumference ${formula("C = 2&pi;r")} or ${formula("C = &pi;d")}, diameter ${formula("d = 2r")}, and radius ${formula("r = d / 2")}. Use radius for area; if diameter or circumference is given, convert to radius first.`,
      diagram: "circle",
      definition: "A circle is a 2D shape made of all points that are the same distance from a center point.",
      rows: [
        ["Area of a circle", formula("A = &pi;r<sup>2</sup>"), "r = radius"],
        ["Circumference from radius", formula("C = 2&pi;r"), "r = radius"],
        ["Circumference from diameter", formula("C = &pi;d"), "d = diameter"],
        ["Diameter", formula("d = 2r"), "r = radius"],
        ["Radius from diameter", formula("r = d / 2"), "d = diameter"]
      ],
      explanation: "The radius is the key circle measurement. If you know diameter or circumference, convert it to radius first, then use the area formula.",
      calculator: "circle",
      examples: [
        { title: "Given radius, find area", steps: ["Given r = 5 cm.", `Use ${formula("A = &pi;r<sup>2</sup>")}.`, `A = &pi; &times; 5<sup>2</sup> = 25&pi; &asymp; 78.54 cm<sup>2</sup>.`] },
        { title: "Given diameter, find circumference", steps: ["Given d = 12 m.", `Use ${formula("C = &pi;d")}.`, "C = 12&pi; &asymp; 37.70 m."] },
        { title: "Given circumference, find radius", steps: ["Given C = 31.4 in.", `Use ${formula("r = C / 2&pi;")}.`, "r = 31.4 / 6.283... &asymp; 5 in."] }
      ],
      mistakes: ["Using diameter in the area formula without dividing by 2 first.", "Writing circumference in square units. Circumference uses linear units.", "Rounding pi too early when the problem asks for an exact answer."],
      related: [["Area Formulas", "/area-formulas/", "Compare circle area with other area formulas."], ["Perimeter Formulas", "/perimeter-formulas/", "Circumference is circle perimeter."], ["Circle Calculator", "/circle-calculator/", "Calculate circle values with steps."]],
      faqs: [
        { q: "What is the formula for area of a circle?", a: `The area formula is ${formula("A = &pi;r<sup>2</sup>")}, where r is the radius.` },
        { q: "What is the circumference formula?", a: `Circumference can be found with ${formula("C = 2&pi;r")} or ${formula("C = &pi;d")}.` },
        { q: "How do you find radius from diameter?", a: `Divide the diameter by 2: ${formula("r = d / 2")}.` }
      ]
    },
    {
      slug: "triangle-formulas",
      h1: "Triangle Formulas",
      title: "Triangle Formulas with Examples and Calculator",
      description: "Learn triangle formulas for area, perimeter, right triangles, equilateral triangles, and Heron's formula with calculator, examples, and practice problems.",
      intro: "Triangle formulas cover area, perimeter, right triangles, equilateral triangles, and side-length problems.",
      directAnswerTitle: "What are the main triangle formulas?",
      directAnswer: `The main triangle formulas are area ${formula("A = 1/2bh")}, perimeter ${formula("P = a + b + c")}, and the right-triangle formula ${formula("a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup>")}. Use base and perpendicular height for area, side lengths for perimeter, and the Pythagorean theorem only for right triangles.`,
      diagram: "triangle",
      definition: "A triangle is a 2D polygon with three sides, three vertices, and interior angles that add up to 180 degrees.",
      rows: [
        ["Area from base and height", formula("A = 1/2 &times; b &times; h"), "b = base, h = height"],
        ["Perimeter", formula("P = a + b + c"), "a, b, c = side lengths"],
        ["Right triangle", formula("a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup>"), "c = hypotenuse"],
        ["Equilateral triangle area", formula("A = (&radic;3 / 4)s<sup>2</sup>"), "s = side length"],
        ["Heron's formula", formula("A = &radic;(s(s-a)(s-b)(s-c))"), "s = semiperimeter"]
      ],
      explanation: "Use base and height when the height is known. Use side lengths for perimeter. Use the Pythagorean theorem only for right triangles.",
      calculator: "triangle",
      examples: [
        { title: "Find triangle area", steps: ["Given b = 10 cm and h = 6 cm.", `Use ${formula("A = 1/2bh")}.`, `A = 1/2 &times; 10 &times; 6 = 30 cm<sup>2</sup>.`] },
        { title: "Find perimeter", steps: ["Given sides 4, 5, and 7 m.", `Use ${formula("P = a + b + c")}.`, "P = 4 + 5 + 7 = 16 m."] },
        { title: "Right triangle hypotenuse", steps: ["Given legs 3 and 4.", `Use ${formula("a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup>")}.`, "c = &radic;(9 + 16) = 5."] }
      ],
      mistakes: ["Using a slanted side as height. Height must be perpendicular to the base.", "Using the Pythagorean theorem on a triangle that is not right.", "Forgetting to check the triangle inequality before using three side lengths."],
      related: [["Area Formulas", "/area-formulas/", "Review triangle area with other shapes."], ["Perimeter Formulas", "/perimeter-formulas/", "Compare perimeter formulas."], ["Triangle Calculator", "/triangle-calculator/", "Calculate triangle values with steps."]],
      faqs: [
        { q: "What is the basic triangle area formula?", a: `The basic formula is ${formula("A = 1/2 &times; b &times; h")}.` },
        { q: "What is the perimeter of a triangle?", a: `Add the three side lengths: ${formula("P = a + b + c")}.` },
        { q: "When do I use the Pythagorean theorem?", a: "Use it only for right triangles, where c is the hypotenuse opposite the right angle." }
      ]
    },
    {
      slug: "rectangle-formulas",
      h1: "Rectangle Formulas",
      title: "Rectangle Formulas with Examples and Calculator",
      description: "Learn rectangle formulas for area, perimeter, and diagonal with a formula card, labeled diagram, calculator, examples, and practice problems.",
      intro: "Rectangle formulas use length and width to find area, perimeter, and diagonal.",
      directAnswerTitle: "What are the main rectangle formulas?",
      directAnswer: `The main rectangle formulas are area ${formula("A = lw")}, perimeter ${formula("P = 2(l + w)")}, and diagonal ${formula("d = &radic;(l<sup>2</sup> + w<sup>2</sup>)")}. Use length and width for area and perimeter; use the Pythagorean theorem to calculate the diagonal across the rectangle.`,
      diagram: "rectangle",
      definition: "A rectangle is a 2D quadrilateral with four right angles and opposite sides equal.",
      rows: [
        ["Area", formula("A = lw"), "l = length, w = width"],
        ["Perimeter", formula("P = 2(l + w)"), "l = length, w = width"],
        ["Diagonal", formula("d = &radic;(l<sup>2</sup> + w<sup>2</sup>)"), "Pythagorean theorem"]
      ],
      explanation: "Length and width are perpendicular sides. The diagonal is found by treating the rectangle as two right triangles.",
      calculator: "rectangle",
      examples: [
        { title: "Find area", steps: ["Given l = 8 cm and w = 3 cm.", `Use ${formula("A = lw")}.`, `A = 8 &times; 3 = 24 cm<sup>2</sup>.`] },
        { title: "Find perimeter", steps: ["Given l = 8 cm and w = 3 cm.", `Use ${formula("P = 2(l + w)")}.`, "P = 2(8 + 3) = 22 cm."] },
        { title: "Find diagonal", steps: ["Given l = 8 and w = 3.", `Use ${formula("d = &radic;(l<sup>2</sup> + w<sup>2</sup>)")}.`, "d = &radic;73 &asymp; 8.54."] }
      ],
      mistakes: ["Adding length and width without doubling for perimeter.", "Writing perimeter in square units.", "Confusing length and width does not change area, but the units still matter."],
      related: [["Square Formulas", "/square-formulas/", "A square is a special rectangle."], ["Area Formulas", "/area-formulas/", "Review common area formulas."], ["Geometry Calculator", "/geometry-calculator/", "Use all geometry calculators."]],
      faqs: [
        { q: "What is the rectangle area formula?", a: `The rectangle area formula is ${formula("A = lw")}.` },
        { q: "What is the rectangle perimeter formula?", a: `The perimeter formula is ${formula("P = 2(l + w)")}.` },
        { q: "How do you find the diagonal of a rectangle?", a: `Use ${formula("d = &radic;(l<sup>2</sup> + w<sup>2</sup>)")}.` }
      ]
    },
    {
      slug: "square-formulas",
      h1: "Square Formulas",
      title: "Square Formulas with Examples and Calculator",
      description: "Learn square formulas for area, perimeter, and diagonal with a formula card, labeled diagram, calculator, examples, and practice problems.",
      intro: "Square formulas use one side length because all four sides are equal.",
      directAnswerTitle: "What are the main square formulas?",
      directAnswer: `The main square formulas are area ${formula("A = s<sup>2</sup>")}, perimeter ${formula("P = 4s")}, and diagonal ${formula("d = s&radic;2")}. A square has four equal sides, so one side length is enough to calculate its area, perimeter, and diagonal. Use square units for area and linear units for perimeter and diagonal.`,
      diagram: "square",
      definition: "A square is a 2D shape with four equal sides and four right angles.",
      rows: [
        ["Area", formula("A = s<sup>2</sup>"), "s = side length"],
        ["Perimeter", formula("P = 4s"), "s = side length"],
        ["Diagonal", formula("d = s&radic;2"), "s = side length"]
      ],
      explanation: "A square is a rectangle where length and width are the same, so all formulas can be written using one side length.",
      calculator: "square",
      examples: [
        { title: "Find area", steps: ["Given s = 9 cm.", `Use ${formula("A = s<sup>2</sup>")}.`, `A = 9<sup>2</sup> = 81 cm<sup>2</sup>.`] },
        { title: "Find perimeter", steps: ["Given s = 9 cm.", `Use ${formula("P = 4s")}.`, "P = 4 &times; 9 = 36 cm."] },
        { title: "Find diagonal", steps: ["Given s = 9 cm.", `Use ${formula("d = s&radic;2")}.`, "d = 9&radic;2 &asymp; 12.73 cm."] }
      ],
      mistakes: ["Multiplying by 4 for area instead of squaring the side.", "Using square units for perimeter.", "Forgetting that the diagonal is longer than a side."],
      related: [["Rectangle Formulas", "/rectangle-formulas/", "Compare rectangle and square formulas."], ["Area Formulas", "/area-formulas/", "Review area formulas."], ["Geometry Calculator", "/geometry-calculator/", "Use all geometry calculators."]],
      faqs: [
        { q: "What is the square area formula?", a: `The area formula is ${formula("A = s<sup>2</sup>")}.` },
        { q: "What is the square perimeter formula?", a: `The perimeter formula is ${formula("P = 4s")}.` },
        { q: "What is the diagonal of a square?", a: `The diagonal is ${formula("d = s&radic;2")}.` }
      ]
    },
    {
      slug: "cylinder-formulas",
      h1: "Cylinder Formulas",
      title: "Cylinder Formulas: Volume, Surface Area & Calculator",
      description: "Learn cylinder formulas for volume, lateral surface area, total surface area, and base area with a calculator, examples, and practice problems.",
      intro: "Cylinder formulas use radius and height to calculate volume, base area, lateral area, and total surface area.",
      directAnswerTitle: "What are the main cylinder formulas?",
      directAnswer: `The main cylinder formulas are volume ${formula("V = &pi;r<sup>2</sup>h")}, lateral surface area ${formula("LSA = 2&pi;rh")}, total surface area ${formula("TSA = 2&pi;r(r + h)")}, and base area ${formula("B = &pi;r<sup>2</sup>")}. Use radius and height, not diameter, in these formulas.`,
      diagram: "cylinder",
      definition: "A cylinder is a 3D solid with two congruent circular bases connected by a curved surface.",
      rows: [
        ["Base area", formula("B = &pi;r<sup>2</sup>"), "r = radius"],
        ["Volume", formula("V = &pi;r<sup>2</sup>h"), "h = height"],
        ["Lateral surface area", formula("LSA = 2&pi;rh"), "Curved side only"],
        ["Total surface area", formula("TSA = 2&pi;r(r + h)"), "Includes both bases"]
      ],
      explanation: "The cylinder volume formula is base area times height. Surface area includes the curved side plus two circular bases.",
      calculator: "cylinder",
      examples: [
        { title: "Find volume", steps: ["Given r = 3 cm and h = 10 cm.", `Use ${formula("V = &pi;r<sup>2</sup>h")}.`, `V = 90&pi; &asymp; 282.74 cm<sup>3</sup>.`] },
        { title: "Find lateral surface area", steps: ["Given r = 3 cm and h = 10 cm.", `Use ${formula("LSA = 2&pi;rh")}.`, `LSA = 60&pi; &asymp; 188.50 cm<sup>2</sup>.`] },
        { title: "Find total surface area", steps: ["Given r = 3 cm and h = 10 cm.", `Use ${formula("TSA = 2&pi;r(r + h)")}.`, `TSA = 78&pi; &asymp; 245.04 cm<sup>2</sup>.`] }
      ],
      mistakes: ["Using diameter as radius.", "Forgetting the two circular bases in total surface area.", "Writing volume in square units instead of cubic units."],
      related: [["Volume Formulas", "/volume-formulas/", "Compare 3D volume formulas."], ["Surface Area Formulas", "/surface-area-formulas/", "Review surface area formulas."], ["Cylinder Calculator", "/cylinder-calculator/", "Calculate cylinder values with steps."]],
      faqs: [
        { q: "What is the cylinder volume formula?", a: `The formula is ${formula("V = &pi;r<sup>2</sup>h")}.` },
        { q: "What is cylinder lateral surface area?", a: `Lateral surface area is the curved side area: ${formula("LSA = 2&pi;rh")}.` },
        { q: "What is total surface area of a cylinder?", a: `Total surface area is ${formula("TSA = 2&pi;r(r + h)")}.` }
      ]
    },
    {
      slug: "cone-formulas",
      h1: "Cone Formulas",
      title: "Cone Formulas: Volume, Surface Area, Slant Height & Calculator",
      description: "Learn cone formulas for volume, lateral surface area, total surface area, slant height, and base area with a calculator, examples, and practice problems.",
      intro: "Cone formulas use radius, height, and slant height to find volume and surface area.",
      directAnswerTitle: "What are the main cone formulas?",
      directAnswer: `The main cone formulas are volume ${formula("V = 1/3&pi;r<sup>2</sup>h")}, lateral surface area ${formula("LSA = &pi;rl")}, total surface area ${formula("TSA = &pi;r(r + l)")}, and slant height ${formula("l = &radic;(r<sup>2</sup> + h<sup>2</sup>)")}. Surface area uses slant height, not vertical height.`,
      diagram: "cone",
      definition: "A cone is a 3D solid with one circular base and one vertex connected by a curved side.",
      rows: [
        ["Base area", formula("B = &pi;r<sup>2</sup>"), "r = radius"],
        ["Slant height", formula("l = &radic;(r<sup>2</sup> + h<sup>2</sup>)"), "Right cone only"],
        ["Volume", formula("V = 1/3&pi;r<sup>2</sup>h"), "h = vertical height"],
        ["Lateral surface area", formula("LSA = &pi;rl"), "l = slant height"],
        ["Total surface area", formula("TSA = &pi;r(r + l)"), "Includes base"]
      ],
      explanation: "A cone has one third the volume of a cylinder with the same base and height. Surface area needs slant height, not vertical height.",
      calculator: "cone",
      examples: [
        { title: "Find slant height", steps: ["Given r = 4 cm and h = 9 cm.", `Use ${formula("l = &radic;(r<sup>2</sup> + h<sup>2</sup>)")}.`, "l = &radic;97 &asymp; 9.85 cm."] },
        { title: "Find volume", steps: ["Given r = 4 cm and h = 9 cm.", `Use ${formula("V = 1/3&pi;r<sup>2</sup>h")}.`, `V = 48&pi; &asymp; 150.80 cm<sup>3</sup>.`] },
        { title: "Find total surface area", steps: ["Given r = 4 cm and l &asymp; 9.85 cm.", `Use ${formula("TSA = &pi;r(r + l)")}.`, `TSA &asymp; &pi; &times; 4(4 + 9.85) &asymp; 174.05 cm<sup>2</sup>.`] }
      ],
      mistakes: ["Using height instead of slant height in surface area.", "Forgetting the one third in volume.", "Using diameter as radius."],
      related: [["Cylinder Formulas", "/cylinder-formulas/", "Compare cone and cylinder formulas."], ["Volume Formulas", "/volume-formulas/", "Review volume formulas."], ["Surface Area Formulas", "/surface-area-formulas/", "Review surface area formulas."]],
      faqs: [
        { q: "What is the cone volume formula?", a: `The formula is ${formula("V = 1/3&pi;r<sup>2</sup>h")}.` },
        { q: "What is slant height?", a: "Slant height is the distance from the cone vertex to a point on the edge of the circular base." },
        { q: "What is the total surface area of a cone?", a: `The formula is ${formula("TSA = &pi;r(r + l)")}.` }
      ]
    },
    {
      slug: "sphere-formulas",
      h1: "Sphere Formulas",
      title: "Sphere Formulas: Volume, Surface Area & Calculator",
      description: "Learn sphere formulas for volume, surface area, radius, and diameter with a formula card, calculator, examples, and practice problems.",
      intro: "Sphere formulas use radius to find volume and surface area.",
      directAnswerTitle: "What are the main sphere formulas?",
      directAnswer: `The main sphere formulas are volume ${formula("V = 4/3&pi;r<sup>3</sup>")}, surface area ${formula("SA = 4&pi;r<sup>2</sup>")}, diameter ${formula("d = 2r")}, and radius ${formula("r = d / 2")}. If diameter is given, divide by 2 before using the volume or surface area formula.`,
      diagram: "sphere",
      definition: "A sphere is a perfectly round 3D solid where every point on the surface is the same distance from the center.",
      rows: [
        ["Volume", formula("V = 4/3&pi;r<sup>3</sup>"), "r = radius"],
        ["Surface area", formula("SA = 4&pi;r<sup>2</sup>"), "r = radius"],
        ["Diameter", formula("d = 2r"), "r = radius"],
        ["Radius", formula("r = d / 2"), "d = diameter"]
      ],
      explanation: "Use radius for both sphere volume and surface area. If you are given diameter, divide it by 2 first.",
      calculator: "sphere",
      examples: [
        { title: "Find volume", steps: ["Given r = 6 cm.", `Use ${formula("V = 4/3&pi;r<sup>3</sup>")}.`, `V = 288&pi; &asymp; 904.78 cm<sup>3</sup>.`] },
        { title: "Find surface area", steps: ["Given r = 6 cm.", `Use ${formula("SA = 4&pi;r<sup>2</sup>")}.`, `SA = 144&pi; &asymp; 452.39 cm<sup>2</sup>.`] },
        { title: "Convert diameter to radius", steps: ["Given d = 10 in.", `Use ${formula("r = d / 2")}.`, "r = 10 / 2 = 5 in."] }
      ],
      mistakes: ["Using diameter as radius in the volume formula.", "Writing surface area in cubic units.", "Forgetting that volume uses r cubed, while surface area uses r squared."],
      related: [["Volume Formulas", "/volume-formulas/", "Compare sphere volume with other solids."], ["Surface Area Formulas", "/surface-area-formulas/", "Review surface area formulas."], ["Sphere Calculator", "/sphere-calculator/", "Calculate sphere values with steps."]],
      faqs: [
        { q: "What is the sphere volume formula?", a: `The formula is ${formula("V = 4/3&pi;r<sup>3</sup>")}.` },
        { q: "What is the sphere surface area formula?", a: `The formula is ${formula("SA = 4&pi;r<sup>2</sup>")}.` },
        { q: "How do you find radius from diameter?", a: `Use ${formula("r = d / 2")}.` }
      ]
    },
    {
      slug: "rectangular-prism-formulas",
      h1: "Rectangular Prism Formulas",
      title: "Rectangular Prism Formulas with Examples and Calculator",
      description: "Learn rectangular prism formulas for volume and surface area with a labeled diagram, calculator, examples, and practice problems.",
      intro: "Rectangular prism formulas use length, width, and height to find volume and surface area.",
      directAnswerTitle: "What are the main rectangular prism formulas?",
      directAnswer: `The main rectangular prism formulas are volume ${formula("V = lwh")}, surface area ${formula("SA = 2(lw + lh + wh)")}, and base area ${formula("B = lw")}. Use length, width, and height in the same unit before multiplying or adding face areas.`,
      diagram: "prism",
      definition: "A rectangular prism is a 3D solid with six rectangular faces.",
      rows: [
        ["Volume", formula("V = lwh"), "l = length, w = width, h = height"],
        ["Surface area", formula("SA = 2(lw + lh + wh)"), "Sum of all six rectangular faces"],
        ["Base area", formula("B = lw"), "Area of the rectangular base"]
      ],
      explanation: "Volume is base area times height. Surface area adds the areas of the three unique face pairs and doubles the sum.",
      calculator: "rectangular-prism",
      examples: [
        { title: "Find volume", steps: ["Given l = 8 cm, w = 4 cm, h = 3 cm.", `Use ${formula("V = lwh")}.`, `V = 8 &times; 4 &times; 3 = 96 cm<sup>3</sup>.`] },
        { title: "Find surface area", steps: ["Given l = 8, w = 4, h = 3.", `Use ${formula("SA = 2(lw + lh + wh)")}.`, `SA = 2(32 + 24 + 12) = 136 cm<sup>2</sup>.`] },
        { title: "Find base area", steps: ["Given l = 8 cm and w = 4 cm.", `Use ${formula("B = lw")}.`, `B = 8 &times; 4 = 32 cm<sup>2</sup>.`] }
      ],
      mistakes: ["Using only one face area for surface area.", "Writing volume in square units.", "Mixing different units before multiplying dimensions."],
      related: [["Volume Formulas", "/volume-formulas/", "Review volume formulas."], ["Surface Area Formulas", "/surface-area-formulas/", "Review surface area formulas."], ["Rectangle Formulas", "/rectangle-formulas/", "Review rectangle area first."]],
      faqs: [
        { q: "What is the rectangular prism volume formula?", a: `The formula is ${formula("V = lwh")}.` },
        { q: "What is the surface area formula?", a: `The formula is ${formula("SA = 2(lw + lh + wh)")}.` },
        { q: "Is a cube a rectangular prism?", a: "Yes. A cube is a rectangular prism with length, width, and height all equal." }
      ]
    }
  ];

  return shapes.map((shape) => {
    const page = { ...shape, card: formulaCards[shape.calculator], hasCalculator: true };
    return { ...page, body: shapeBody(page) };
  });
}

function shapeBody(page) {
  return `
    ${renderHero(page, shapeHeroVisual(page))}
    <section class="section" id="quick-table">
      <div class="container prose-grid">
        <article class="prose-main">
          ${directAnswerBlock(page)}
          <section class="section-block">
            <p class="section-kicker">Short answer</p>
            <h2>${page.h1.replace(" Formulas", "")} formulas at a glance</h2>
            <p>${page.card.formulas.slice(0, 3).map((item) => `${item.label}: ${formula(item.html)}`).join(" ")}</p>
          </section>
          <section class="section-block">
            <p class="section-kicker">Definition</p>
            <h2>What is a ${page.h1.replace(" Formulas", "").toLowerCase()}?</h2>
            <p>${page.definition}</p>
          </section>
          <section class="section-block">
            <p class="section-kicker">Diagram</p>
            <h2>${page.h1.replace(" Formulas", "")} diagram</h2>
            ${diagram(page.diagram)}
          </section>
          <section class="section-block">
            <p class="section-kicker">Quick formula table</p>
            <h2>${page.h1} quick table</h2>
            ${table(page.rows, ["Formula", "Equation", "Variables"])}
          </section>
          <section class="section-block">
            <p class="section-kicker">Formula explanation</p>
            <h2>How to use these formulas</h2>
            <p>${page.explanation}</p>
          </section>
          ${calculatorWidget(page.calculator, `${page.h1.replace(" Formulas", "")} Calculator`, `Enter measurements to get the result, unit, formula, and calculation steps.`)}
          <section class="section-block">
            <p class="section-kicker">Examples</p>
            <h2>Step-by-step examples</h2>
            ${examples([...page.examples, ...extraExamples(page.calculator)])}
          </section>
          <section class="section-block">
            <p class="section-kicker">Reverse calculations</p>
            <h2>Solve backwards from known values</h2>
            ${reverseList(reverseCalculations(page.calculator))}
          </section>
          <section class="section-block">
            <p class="section-kicker">Common mistakes</p>
            <h2>Common mistakes</h2>
            ${mistakes(page.mistakes)}
          </section>
          <section class="section-block">
            <p class="section-kicker">Practice</p>
            <h2>Practice problems with answers</h2>
            ${practiceProblems(practiceFor(page.calculator))}
          </section>
          <section class="section-block">
            <p class="section-kicker">Related formulas</p>
            <h2>Related formulas</h2>
            ${linkTiles(page.related)}
          </section>
          <section class="section-block">
            <p class="section-kicker">FAQ</p>
            <h2>${page.h1} FAQ</h2>
            ${faqs(page.faqs)}
          </section>
        </article>
        <aside class="aside">
          <h2>On this page</h2>
          <a href="#direct-answer">Direct answer</a>
          <a href="#quick-table">Formula table</a>
          <a href="#calculator">Calculator</a>
          <a href="/geometry-solver/">Geometry solver</a>
          <a href="/geometry-calculator/">All calculators</a>
          <a href="/">Geometry formulas sheet</a>
        </aside>
      </div>
    </section>
  `;
}

function extraExamples(type) {
  const examplesByType = {
    circle: [
      { title: "Given area, find radius", steps: ["Given A = 100&pi; cm<sup>2</sup>.", `Use ${formula("r = &radic;(A / &pi;)")}.`, "r = &radic;(100&pi; / &pi;) = 10 cm."] },
      { title: "Real-world circle problem", steps: ["A round table has diameter 4 ft.", `Use ${formula("A = &pi;(d/2)<sup>2</sup>")}.`, `A = &pi; &times; 2<sup>2</sup> = 4&pi; &asymp; 12.57 ft<sup>2</sup>.`] }
    ],
    triangle: [
      { title: "Find height from area", steps: ["Given A = 48 cm<sup>2</sup> and b = 12 cm.", `Use ${formula("h = 2A / b")}.`, "h = 2 &times; 48 / 12 = 8 cm."] },
      { title: "Equilateral triangle area", steps: ["Given s = 6 m.", `Use ${formula("A = (&radic;3 / 4)s<sup>2</sup>")}.`, `A = 9&radic;3 &asymp; 15.59 m<sup>2</sup>.`] }
    ],
    rectangle: [
      { title: "Find width from area", steps: ["Given A = 45 in<sup>2</sup> and l = 9 in.", `Use ${formula("w = A / l")}.`, "w = 45 / 9 = 5 in."] },
      { title: "Real-world rectangle problem", steps: ["A garden is 12 ft by 7 ft.", `Use ${formula("P = 2(l + w)")}.`, "P = 2(12 + 7) = 38 ft of edging."] }
    ],
    square: [
      { title: "Find side from area", steps: ["Given A = 64 cm<sup>2</sup>.", `Use ${formula("s = &radic;A")}.`, "s = &radic;64 = 8 cm."] },
      { title: "Find side from perimeter", steps: ["Given P = 52 m.", `Use ${formula("s = P / 4")}.`, "s = 52 / 4 = 13 m."] }
    ],
    cylinder: [
      { title: "Find height from volume", steps: ["Given V = 144&pi; cm<sup>3</sup> and r = 6 cm.", `Use ${formula("h = V / (&pi;r<sup>2</sup>)")}.`, "h = 144&pi; / 36&pi; = 4 cm."] },
      { title: "Real-world cylinder problem", steps: ["A can has r = 4 cm and h = 12 cm.", `Use ${formula("V = &pi;r<sup>2</sup>h")}.`, `V = 192&pi; &asymp; 603.19 cm<sup>3</sup>.`] }
    ],
    cone: [
      { title: "Find height from volume", steps: ["Given V = 48&pi; cm<sup>3</sup> and r = 4 cm.", `Use ${formula("h = 3V / (&pi;r<sup>2</sup>)")}.`, "h = 3(48&pi;) / 16&pi; = 9 cm."] },
      { title: "Find lateral surface area", steps: ["Given r = 5 cm and l = 13 cm.", `Use ${formula("LSA = &pi;rl")}.`, `LSA = 65&pi; &asymp; 204.20 cm<sup>2</sup>.`] }
    ],
    sphere: [
      { title: "Find radius from volume", steps: ["Given V = 36&pi; in<sup>3</sup>.", `Use ${formula("r = &#8731;(3V / 4&pi;)")}.`, "r = &#8731;(27) = 3 in."] },
      { title: "Find radius from surface area", steps: ["Given SA = 100&pi; cm<sup>2</sup>.", `Use ${formula("r = &radic;(SA / 4&pi;)")}.`, "r = &radic;(25) = 5 cm."] }
    ],
    "rectangular-prism": [
      { title: "Find height from volume", steps: ["Given V = 120 cm<sup>3</sup>, l = 10 cm, w = 4 cm.", `Use ${formula("h = V / lw")}.`, "h = 120 / 40 = 3 cm."] },
      { title: "Real-world box problem", steps: ["A box is 5 in by 4 in by 9 in.", `Use ${formula("SA = 2(lw + lh + wh)")}.`, `SA = 2(20 + 45 + 36) = 202 in<sup>2</sup>.`] }
    ]
  };

  return examplesByType[type] || [];
}

function reverseCalculations(type) {
  const reverseByType = {
    circle: [
      { task: "Find radius from area", formula: "r = &radic;(A / &pi;)", use: "Use when the area is known." },
      { task: "Find radius from circumference", formula: "r = C / 2&pi;", use: "Use when the circumference is known." },
      { task: "Find diameter from circumference", formula: "d = C / &pi;", use: "Use when the circumference is known." },
      { task: "Find area from diameter", formula: "A = &pi;(d / 2)<sup>2</sup>", use: "Use when the diameter is known." }
    ],
    triangle: [
      { task: "Find height from area", formula: "h = 2A / b", use: "Use when area and base are known." },
      { task: "Find base from area", formula: "b = 2A / h", use: "Use when area and height are known." },
      { task: "Find hypotenuse", formula: "c = &radic;(a<sup>2</sup> + b<sup>2</sup>)", use: "Use for right triangles only." }
    ],
    rectangle: [
      { task: "Find width from area", formula: "w = A / l", use: "Use when area and length are known." },
      { task: "Find length from area", formula: "l = A / w", use: "Use when area and width are known." },
      { task: "Find width from perimeter", formula: "w = P / 2 - l", use: "Use when perimeter and length are known." }
    ],
    square: [
      { task: "Find side from area", formula: "s = &radic;A", use: "Use when area is known." },
      { task: "Find side from perimeter", formula: "s = P / 4", use: "Use when perimeter is known." },
      { task: "Find side from diagonal", formula: "s = d / &radic;2", use: "Use when diagonal is known." }
    ],
    cylinder: [
      { task: "Find height from volume", formula: "h = V / (&pi;r<sup>2</sup>)", use: "Use when volume and radius are known." },
      { task: "Find radius from volume", formula: "r = &radic;(V / &pi;h)", use: "Use when volume and height are known." },
      { task: "Find height from lateral area", formula: "h = LSA / 2&pi;r", use: "Use when lateral surface area and radius are known." }
    ],
    cone: [
      { task: "Find height from volume", formula: "h = 3V / (&pi;r<sup>2</sup>)", use: "Use when volume and radius are known." },
      { task: "Find radius from volume", formula: "r = &radic;(3V / &pi;h)", use: "Use when volume and height are known." },
      { task: "Find height from slant height", formula: "h = &radic;(l<sup>2</sup> - r<sup>2</sup>)", use: "Use for right cones." }
    ],
    sphere: [
      { task: "Find radius from volume", formula: "r = &#8731;(3V / 4&pi;)", use: "Use when volume is known." },
      { task: "Find radius from surface area", formula: "r = &radic;(SA / 4&pi;)", use: "Use when surface area is known." },
      { task: "Find diameter from volume", formula: "d = 2&#8731;(3V / 4&pi;)", use: "Use when volume is known." }
    ],
    "rectangular-prism": [
      { task: "Find height from volume", formula: "h = V / lw", use: "Use when volume, length, and width are known." },
      { task: "Find width from volume", formula: "w = V / lh", use: "Use when volume, length, and height are known." },
      { task: "Find length from volume", formula: "l = V / wh", use: "Use when volume, width, and height are known." }
    ]
  };

  return reverseByType[type] || reverseByType.circle;
}

function practiceFor(type) {
  const practiceByType = {
    circle: [
      { q: "A circle has radius 7 cm. Find its area.", a: `A = &pi; &times; 7<sup>2</sup> = 49&pi; &asymp; 153.94 cm<sup>2</sup>.` },
      { q: "A circle has diameter 18 m. Find its circumference.", a: "C = &pi;d = 18&pi; &asymp; 56.55 m." },
      { q: "A circle has circumference 20&pi; in. Find its radius.", a: "r = C / 2&pi; = 20&pi; / 2&pi; = 10 in." },
      { q: "A circle has area 64&pi; ft<sup>2</sup>. Find its diameter.", a: "r = &radic;(64&pi;/&pi;) = 8 ft, so d = 16 ft." },
      { q: "A round rug has radius 3 ft. How much floor area does it cover?", a: `A = 9&pi; &asymp; 28.27 ft<sup>2</sup>.` }
    ],
    triangle: [
      { q: "Find the area when b = 14 cm and h = 5 cm.", a: `A = 1/2 &times; 14 &times; 5 = 35 cm<sup>2</sup>.` },
      { q: "Find the perimeter of sides 6 m, 8 m, and 9 m.", a: "P = 6 + 8 + 9 = 23 m." },
      { q: "A right triangle has legs 5 and 12. Find the hypotenuse.", a: "c = &radic;(25 + 144) = 13." },
      { q: "A triangle has A = 45 in<sup>2</sup> and b = 9 in. Find h.", a: "h = 2A / b = 90 / 9 = 10 in." },
      { q: "An equilateral triangle has side 8 cm. Find its area.", a: `A = (&radic;3 / 4) &times; 64 = 16&radic;3 &asymp; 27.71 cm<sup>2</sup>.` }
    ],
    rectangle: [
      { q: "Find area when l = 11 cm and w = 4 cm.", a: `A = 44 cm<sup>2</sup>.` },
      { q: "Find perimeter when l = 11 cm and w = 4 cm.", a: "P = 2(11 + 4) = 30 cm." },
      { q: "Find width when A = 72 ft<sup>2</sup> and l = 9 ft.", a: "w = 72 / 9 = 8 ft." },
      { q: "Find diagonal when l = 6 and w = 8.", a: "d = &radic;(36 + 64) = 10." },
      { q: "A poster is 18 in by 24 in. Find its area.", a: `A = 432 in<sup>2</sup>.` }
    ],
    square: [
      { q: "Find area when s = 12 cm.", a: `A = 144 cm<sup>2</sup>.` },
      { q: "Find perimeter when s = 12 cm.", a: "P = 48 cm." },
      { q: "Find side when A = 81 m<sup>2</sup>.", a: "s = &radic;81 = 9 m." },
      { q: "Find diagonal when s = 10 in.", a: "d = 10&radic;2 &asymp; 14.14 in." },
      { q: "Find side when perimeter is 100 ft.", a: "s = 100 / 4 = 25 ft." }
    ],
    cylinder: [
      { q: "Find volume when r = 5 cm and h = 8 cm.", a: `V = 200&pi; &asymp; 628.32 cm<sup>3</sup>.` },
      { q: "Find total surface area when r = 5 cm and h = 8 cm.", a: `TSA = 2&pi; &times; 5(5 + 8) = 130&pi; &asymp; 408.41 cm<sup>2</sup>.` },
      { q: "Find height when V = 75&pi; m<sup>3</sup> and r = 5 m.", a: "h = 75&pi; / 25&pi; = 3 m." },
      { q: "Find base area when r = 6 in.", a: `B = 36&pi; &asymp; 113.10 in<sup>2</sup>.` },
      { q: "Find lateral surface area when r = 2 ft and h = 9 ft.", a: `LSA = 36&pi; &asymp; 113.10 ft<sup>2</sup>.` }
    ],
    cone: [
      { q: "Find volume when r = 3 cm and h = 12 cm.", a: `V = 36&pi; &asymp; 113.10 cm<sup>3</sup>.` },
      { q: "Find slant height when r = 5 and h = 12.", a: "l = &radic;(25 + 144) = 13." },
      { q: "Find lateral area when r = 5 cm and l = 13 cm.", a: `LSA = 65&pi; &asymp; 204.20 cm<sup>2</sup>.` },
      { q: "Find height when V = 100&pi; in<sup>3</sup> and r = 5 in.", a: "h = 3V / &pi;r^2 = 300&pi; / 25&pi; = 12 in." },
      { q: "Find total surface area when r = 3 and l = 5.", a: `TSA = &pi; &times; 3(3 + 5) = 24&pi; &asymp; 75.40.` }
    ],
    sphere: [
      { q: "Find volume when r = 3 cm.", a: `V = 36&pi; &asymp; 113.10 cm<sup>3</sup>.` },
      { q: "Find surface area when r = 3 cm.", a: `SA = 36&pi; &asymp; 113.10 cm<sup>2</sup>.` },
      { q: "Find radius when diameter is 14 m.", a: "r = 7 m." },
      { q: "Find radius when volume is 288&pi; in<sup>3</sup>.", a: "r = &#8731;(3V / 4&pi;) = &#8731;216 = 6 in." },
      { q: "Find diameter when surface area is 196&pi; ft<sup>2</sup>.", a: "r = &radic;(196&pi; / 4&pi;) = 7 ft, so d = 14 ft." }
    ],
    "rectangular-prism": [
      { q: "Find volume when l = 6, w = 5, h = 4.", a: `V = 120 cubic units.` },
      { q: "Find surface area when l = 6, w = 5, h = 4.", a: `SA = 2(30 + 24 + 20) = 148 square units.` },
      { q: "Find height when V = 180 cm<sup>3</sup>, l = 9 cm, w = 5 cm.", a: "h = 180 / 45 = 4 cm." },
      { q: "Find base area when l = 12 in and w = 7 in.", a: `B = 84 in<sup>2</sup>.` },
      { q: "A box is 10 ft by 3 ft by 2 ft. Find volume.", a: `V = 60 ft<sup>3</sup>.` }
    ]
  };

  return practiceByType[type] || practiceByType.circle;
}

function calculatorPages() {
  const pageData = [
    {
      slug: "geometry-calculator",
      h1: "Geometry Calculator",
      title: "Geometry Calculator with Steps for 2D and 3D Shapes",
      description: "Use geometry calculators with steps for circle, triangle, rectangle, square, cylinder, cone, and sphere formulas.",
      intro: "Use these geometry calculators with steps to check results, units, formulas, and reverse calculations for common shapes.",
      directAnswerTitle: "What does the geometry calculator solve?",
      directAnswer: "The geometry calculator solves common 2D and 3D shape problems with formulas and steps. It includes circle, triangle, rectangle, square, cylinder, cone, and sphere calculators, and each result shows the answer, unit, formula used, and step-by-step substitution. Use it to check homework, reverse calculations, unit-labeled answers, and shareable result URLs quickly.",
      widgets: [
        ["circle", "Circle Calculator"],
        ["triangle", "Triangle Calculator"],
        ["rectangle", "Rectangle Calculator"],
        ["square", "Square Calculator"],
        ["cylinder", "Cylinder Calculator"],
        ["cone", "Cone Calculator"],
        ["sphere", "Sphere Calculator"]
      ],
      faqs: [
        { q: "What does the geometry calculator show?", a: "Each calculator shows the result, unit, formula used, and step-by-step calculation." },
        { q: "Can I use different units?", a: "Yes. Enter the unit label you want, but keep all measurements in the same unit." },
        { q: "Does the calculator replace learning formulas?", a: "No. It is designed to support the formula pages by showing how the formulas are applied." }
      ]
    },
    {
      slug: "circle-calculator",
      h1: "Circle Calculator",
      title: "Circle Calculator with Steps: Area, Radius & Diameter",
      description: "Calculate circle area, circumference, radius, and diameter from radius, diameter, circumference, or area with formulas and steps.",
      intro: "Enter radius, diameter, circumference, or area to calculate the main circle measurements with step-by-step work.",
      directAnswerTitle: "What does the circle calculator solve?",
      directAnswer: `The circle calculator solves radius, diameter, circumference, and area from one known circle measurement. It uses formulas such as ${formula("A = &pi;r<sup>2</sup>")}, ${formula("C = 2&pi;r")}, ${formula("C = &pi;d")}, and ${formula("d = 2r")}, then shows the substituted values and steps. Use it when only one circle measurement is known.`,
      widgets: [["circle", "Circle Calculator"]],
      faqs: [
        { q: "Can the circle calculator use diameter?", a: "Yes. Select diameter as the known measurement and enter the value." },
        { q: "What formula does it use for area?", a: `It uses ${formula("A = &pi;r<sup>2</sup>")}.` },
        { q: "What formula does it use for circumference?", a: `It uses ${formula("C = 2&pi;r")} and ${formula("C = &pi;d")}.` }
      ]
    },
    {
      slug: "triangle-calculator",
      h1: "Triangle Calculator",
      title: "Triangle Calculator with Steps: Area, Perimeter & Height",
      description: "Calculate triangle area, perimeter, base, height, and right-triangle hypotenuse with formulas, units, and steps.",
      intro: "Enter base and height for area, side lengths for perimeter, area plus base to find height, or two right-triangle legs for the hypotenuse.",
      directAnswerTitle: "What does the triangle calculator solve?",
      directAnswer: `The triangle calculator solves area, perimeter, missing base or height, and right-triangle hypotenuse. It uses formulas such as ${formula("A = 1/2bh")}, ${formula("P = a + b + c")}, and ${formula("a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup>")} with step-by-step work. It keeps area units and side-length units separate.`,
      widgets: [["triangle", "Triangle Calculator"]],
      faqs: [
        { q: "What inputs do I need for triangle area?", a: "You need the base and the perpendicular height." },
        { q: "What inputs do I need for triangle perimeter?", a: "You need all three side lengths." },
        { q: "Can it check a right triangle?", a: "Yes. Enter side a and side b to calculate the hypotenuse using the Pythagorean theorem." }
      ]
    },
    {
      slug: "cylinder-calculator",
      h1: "Cylinder Calculator",
      title: "Cylinder Calculator with Steps: Volume, Surface Area & Height",
      description: "Calculate cylinder volume, surface area, height, and radius with formulas, units, and step-by-step work.",
      intro: "Enter radius and height for volume and surface area, or use volume with one dimension to solve backwards.",
      directAnswerTitle: "What does the cylinder calculator solve?",
      directAnswer: `The cylinder calculator solves volume, base area, lateral surface area, total surface area, radius, and height. It uses formulas including ${formula("V = &pi;r<sup>2</sup>h")}, ${formula("LSA = 2&pi;rh")}, ${formula("TSA = 2&pi;r(r + h)")}, and reverse formulas for height or radius.`,
      widgets: [["cylinder", "Cylinder Calculator"]],
      faqs: [
        { q: "What inputs does the cylinder calculator need?", a: "It needs radius and height." },
        { q: "Does it calculate total surface area?", a: `Yes. It uses ${formula("TSA = 2&pi;r(r + h)")}.` },
        { q: "Does it calculate lateral surface area?", a: `Yes. It uses ${formula("LSA = 2&pi;rh")}.` }
      ]
    },
    {
      slug: "sphere-calculator",
      h1: "Sphere Calculator",
      title: "Sphere Calculator with Steps: Volume, Surface Area & Radius",
      description: "Calculate sphere volume, surface area, radius, and diameter from radius, diameter, volume, or surface area with steps.",
      intro: "Enter radius, diameter, volume, or surface area to calculate sphere measurements with step-by-step work.",
      directAnswerTitle: "What does the sphere calculator solve?",
      directAnswer: `The sphere calculator solves volume, surface area, radius, and diameter from radius, diameter, volume, or surface area. It uses formulas such as ${formula("V = 4/3&pi;r<sup>3</sup>")}, ${formula("SA = 4&pi;r<sup>2</sup>")}, ${formula("d = 2r")}, and reverse radius formulas. It also shows reverse steps for volume or surface area inputs.`,
      widgets: [["sphere", "Sphere Calculator"]],
      faqs: [
        { q: "Can the sphere calculator use diameter?", a: "Yes. Select diameter and the calculator converts it to radius first." },
        { q: "What formula does it use for volume?", a: `It uses ${formula("V = 4/3&pi;r<sup>3</sup>")}.` },
        { q: "What formula does it use for surface area?", a: `It uses ${formula("SA = 4&pi;r<sup>2</sup>")}.` }
      ]
    }
  ];

  return pageData.map((page) => {
    const body = `
      ${renderHero({ ...page, kicker: "Geometry Calculators" })}
      <section class="section" id="quick-table">
        <div class="container prose-grid">
          <article class="prose-main">
            ${directAnswerBlock(page)}
            <section class="section-block">
              <p class="section-kicker">Quick formula table</p>
              <h2>Calculator formulas</h2>
              ${table(calculatorFormulaRows(page.widgets), ["Calculator", "Formula", "What it finds"])}
            </section>
            ${page.widgets.map(([type, title], index) => calculatorWidget(type, title, "Results include the answer, unit, formula, and calculation steps.", index === 0 ? "calculator" : `${type}-calculator`)).join("")}
            <section class="section-block">
              <p class="section-kicker">Formula reference</p>
              <h2>Related formula pages</h2>
              ${linkTiles(shapeLinks)}
            </section>
            <section class="section-block">
              <p class="section-kicker">FAQ</p>
              <h2>${page.h1} FAQ</h2>
              ${faqs(page.faqs)}
            </section>
          </article>
          <aside class="aside">
            <h2>Calculators</h2>
            <a href="#direct-answer">Direct answer</a>
            ${calculatorLinks.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}
          </aside>
        </div>
      </section>
    `;
    return { ...page, body, hasCalculator: true };
  });
}

function solverPage() {
  const page = {
    slug: "geometry-solver",
    h1: "Geometry Solver",
    title: "Geometry Solver with Steps for Shapes and Formulas",
    description: "Choose a shape, enter known values, and solve for area, perimeter, volume, surface area, radius, or height with steps.",
    intro: "Choose a shape, enter the values you know, and get the formula, result, and step-by-step solution.",
    directAnswerTitle: "What does the geometry solver do?",
    directAnswer: "The geometry solver finds common unknown measurements from known values for circles, triangles, rectangles, cylinders, cones, and spheres. It can solve forward calculations and reverse calculations, such as radius from area, height from volume, or radius from sphere volume, with formulas and steps. Use it when you know the shape but need help choosing the rearranged formula.",
    hasCalculator: true,
    faqs: [
      { q: "What can the geometry solver calculate?", a: "It can solve common circle, triangle, rectangle, cylinder, cone, and sphere measurements from known values." },
      { q: "Does the solver show steps?", a: "Yes. Results include formulas, substituted values, and calculation steps." },
      { q: "Can it solve backwards?", a: "Yes. It can find values such as radius from area, height from cylinder volume, and radius from sphere volume." }
    ]
  };

  const body = `
    ${renderHero({ ...page, kicker: "Geometry Solver Lite" })}
    <section class="section" id="quick-table">
        <div class="container prose-grid">
          <article class="prose-main">
          ${directAnswerBlock(page)}
          ${calculatorWidget("solver", "Geometry Solver Lite", "Select a shape and target, then enter any known measurements. The solver uses deterministic formulas, not AI guesses.")}
          <section class="section-block">
            <p class="section-kicker">Supported reverse calculations</p>
            <h2>What this solver can solve backwards</h2>
            ${table([
              ["Circle", formula("r = &radic;(A / &pi;)"), "Find radius from area"],
              ["Circle", formula("r = C / 2&pi;"), "Find radius from circumference"],
              ["Triangle", formula("h = 2A / b"), "Find height from area and base"],
              ["Cylinder", formula("h = V / (&pi;r<sup>2</sup>)"), "Find height from volume and radius"],
              ["Cone", formula("h = 3V / (&pi;r<sup>2</sup>)"), "Find height from volume and radius"],
              ["Sphere", formula("r = &#8731;(3V / 4&pi;)"), "Find radius from volume"]
            ], ["Shape", "Reverse formula", "Task"])}
          </section>
          <section class="section-block">
            <p class="section-kicker">Formula cards</p>
            <h2>Copy or save the formulas you used</h2>
            ${formulaCardGrid([formulaCards.circle, formulaCards.triangle, formulaCards.cylinder, formulaCards.cone, formulaCards.sphere])}
          </section>
          <section class="section-block">
            <p class="section-kicker">FAQ</p>
            <h2>Geometry Solver FAQ</h2>
            ${faqs(page.faqs)}
          </section>
        </article>
        <aside class="aside">
          <h2>Related tools</h2>
          <a href="#direct-answer">Direct answer</a>
          ${calculatorLinks.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}
        </aside>
      </div>
    </section>
  `;

  return { ...page, body };
}

function calculatorFormulaRows(widgets) {
  const rowsByType = {
    circle: [
      ["Circle", formula("A = &pi;r<sup>2</sup>"), "Area"],
      ["Circle", formula("C = 2&pi;r = &pi;d"), "Circumference"],
      ["Circle", formula("d = 2r"), "Diameter"]
    ],
    triangle: [
      ["Triangle", formula("A = 1/2 &times; b &times; h"), "Area"],
      ["Triangle", formula("P = a + b + c"), "Perimeter"],
      ["Triangle", formula("a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup>"), "Right triangle hypotenuse"]
    ],
    rectangle: [
      ["Rectangle", formula("A = lw"), "Area"],
      ["Rectangle", formula("P = 2(l + w)"), "Perimeter"],
      ["Rectangle", formula("d = &radic;(l<sup>2</sup> + w<sup>2</sup>)"), "Diagonal"]
    ],
    square: [
      ["Square", formula("A = s<sup>2</sup>"), "Area"],
      ["Square", formula("P = 4s"), "Perimeter"],
      ["Square", formula("d = s&radic;2"), "Diagonal"]
    ],
    cylinder: [
      ["Cylinder", formula("V = &pi;r<sup>2</sup>h"), "Volume"],
      ["Cylinder", formula("LSA = 2&pi;rh"), "Lateral surface area"],
      ["Cylinder", formula("TSA = 2&pi;r(r + h)"), "Total surface area"]
    ],
    cone: [
      ["Cone", formula("V = 1/3&pi;r<sup>2</sup>h"), "Volume"],
      ["Cone", formula("l = &radic;(r<sup>2</sup> + h<sup>2</sup>)"), "Slant height"],
      ["Cone", formula("TSA = &pi;r(r + l)"), "Total surface area"]
    ],
    sphere: [
      ["Sphere", formula("V = 4/3&pi;r<sup>3</sup>"), "Volume"],
      ["Sphere", formula("SA = 4&pi;r<sup>2</sup>"), "Surface area"],
      ["Sphere", formula("d = 2r"), "Diameter"]
    ]
  };

  return widgets.flatMap(([type]) => rowsByType[type] || []);
}

async function writePage(page) {
  if (page.slug === "geometry-formulas") {
    await writeFile(path.join(root, "index.html"), pageShell(page, page.body));
    return;
  }
  const dir = path.join(root, page.slug);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "index.html"), pageShell(page, page.body));
}

async function writeGeometryRedirect() {
  const dir = path.join(root, "geometry-formulas");
  await mkdir(dir, { recursive: true });
  const title = "Geometry Formulas";
  const description = "Geometry Formulas is now served from the homepage with formula tables, visual calculators, step-by-step examples, and practice problems.";
  const html = `<!doctype html>
<html lang="en">
<head>
  ${googleTag()}
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="0; url=/">
  <meta name="robots" content="noindex, follow">
  <meta name="description" content="${description}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${brandName}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${absoluteUrl("geometry-formulas")}">
  <meta property="og:image" content="${socialImageUrl}">
  <meta property="og:image:type" content="${socialImage.type}">
  <meta property="og:image:width" content="${socialImage.width}">
  <meta property="og:image:height" content="${socialImage.height}">
  <meta property="og:image:alt" content="${escapeHtml(socialImage.alt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${socialImageUrl}">
  <meta name="twitter:image:alt" content="${escapeHtml(socialImage.alt)}">
  <link rel="canonical" href="${absoluteUrl("geometry-formulas")}">
  <title>${title}</title>
</head>
<body>
  <p><a href="/">Go to Geometry Formulas</a></p>
</body>
</html>`;
  await writeFile(path.join(dir, "index.html"), html);
}

async function writeText(relativePath, content) {
  await writeFile(path.join(root, relativePath), content);
}

async function writeAssets() {
  await mkdir(path.join(root, "assets", "css"), { recursive: true });
  await mkdir(path.join(root, "assets", "js"), { recursive: true });
  const katexSource = path.join(root, "node_modules", "katex", "dist");
  const katexTarget = path.join(root, "assets", "vendor", "katex");
  await mkdir(katexTarget, { recursive: true });
  await copyFile(path.join(katexSource, "katex.min.css"), path.join(katexTarget, "katex.min.css"));
  await copyFile(path.join(katexSource, "katex.min.js"), path.join(katexTarget, "katex.min.js"));
  await cp(path.join(katexSource, "fonts"), path.join(katexTarget, "fonts"), { recursive: true });
}

function redirectsText() {
  const canonical = new URL(siteUrl);
  const apexTarget = `${canonical.protocol}//${canonical.host}`;
  const redirects = [
    [`http://${canonical.host}/*`, `${apexTarget}/:splat`, 301],
    [`https://www.${canonical.host}/*`, `${apexTarget}/:splat`, 301],
    [`http://www.${canonical.host}/*`, `${apexTarget}/:splat`, 301],
    ["https://geometryformulas.pages.dev/*", `${apexTarget}/:splat`, 301],
    ["https://geometry-formulas.pages.dev/*", `${apexTarget}/:splat`, 301],
    ["/geometry-formulas", "/", 301],
    ["/geometry-formulas/", "/", 301],
    ["/geometry-formulas/index.html", "/", 301],
    ["/index.html", "/", 301]
  ];

  pages
    .filter((page) => page.slug !== "geometry-formulas")
    .forEach((page) => {
      redirects.push([`/${page.slug}`, `/${page.slug}/`, 301]);
      redirects.push([`/${page.slug}/index.html`, `/${page.slug}/`, 301]);
    });

  return `${redirects.map((row) => row.join(" ")).join("\n")}\n`;
}

function headersText() {
  return `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/sitemap.xml
  Content-Type: application/xml; charset=utf-8
  Cache-Control: public, max-age=3600

/robots.txt
  Content-Type: text/plain; charset=utf-8
  Cache-Control: public, max-age=3600

/*.html
  Cache-Control: public, max-age=0, must-revalidate
`;
}

function sitemapXml() {
  const urls = pages.map((page) => `
  <url>
    <loc>${absoluteUrl(page.slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${page.slug === "geometry-formulas" ? "1.0" : "0.8"}</priority>
  </url>`).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>
`;
}
