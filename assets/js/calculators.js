(function () {
  const PI = Math.PI;

  const searchIndex = [
    { title: "Geometry Solver", url: "/geometry-solver/", terms: "solver find radius from area find height from volume reverse formula with steps" },
    { title: "Circle Calculator", url: "/circle-calculator/", terms: "circle calculator circle area calculator circumference radius diameter find radius from area find radius from circumference with steps" },
    { title: "Triangle Calculator", url: "/triangle-calculator/", terms: "triangle calculator triangle area height base perimeter pythagorean with steps" },
    { title: "Cylinder Calculator", url: "/cylinder-calculator/", terms: "cylinder calculator cylinder volume surface area find height from volume radius with steps" },
    { title: "Sphere Calculator", url: "/sphere-calculator/", terms: "sphere calculator volume surface area radius diameter find radius from volume with steps" },
    { title: "Circle Formulas", url: "/circle-formulas/", terms: "circle formulas area circumference diameter radius formula card examples practice" },
    { title: "Triangle Formulas", url: "/triangle-formulas/", terms: "triangle formulas area perimeter pythagorean heron examples practice height base" },
    { title: "Rectangle Formulas", url: "/rectangle-formulas/", terms: "rectangle formulas area perimeter diagonal width length" },
    { title: "Square Formulas", url: "/square-formulas/", terms: "square formulas area perimeter diagonal side" },
    { title: "Cylinder Formulas", url: "/cylinder-formulas/", terms: "cylinder formulas volume lateral surface area total surface area base area" },
    { title: "Cone Formulas", url: "/cone-formulas/", terms: "cone formulas volume surface area slant height radius height" },
    { title: "Sphere Formulas", url: "/sphere-formulas/", terms: "sphere formulas volume surface area radius diameter" },
    { title: "Rectangular Prism Formulas", url: "/rectangular-prism-formulas/", terms: "rectangular prism formulas volume surface area box length width height" },
    { title: "Geometry Formulas Sheet", url: "/", terms: "geometry formulas geometry formulas sheet formula table" },
    { title: "Area Formulas", url: "/area-formulas/", terms: "area formulas circle area triangle area rectangle area square area" },
    { title: "Volume Formulas", url: "/volume-formulas/", terms: "volume formulas cylinder volume cone volume sphere volume prism volume" },
    { title: "Surface Area Formulas", url: "/surface-area-formulas/", terms: "surface area formulas cylinder sphere cone rectangular prism" }
  ];

  function track(name, params) {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params || {});
    }
  }

  function value(form, name) {
    const field = form.elements[name];
    if (!field) return NaN;
    const parsed = Number.parseFloat(field.value);
    return Number.isFinite(parsed) ? parsed : NaN;
  }

  function textValue(form, name, fallback) {
    const field = form.elements[name];
    const raw = field && field.value ? field.value.trim() : "";
    return raw || fallback;
  }

  function escapeHtml(input) {
    return String(input)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function stripHtml(input) {
    const node = document.createElement("div");
    node.innerHTML = input;
    return node.textContent || node.innerText || "";
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
      .replace(/\b4\/3\b/g, "\\frac{4}{3}")
      .replace(/([0-9][0-9,]*(?:\.[0-9]+)?)\s*(cm|m|in|ft)(\^\{[23]\})?\b/g, "$1\\,\\text{$2}$3");

    return tex;
  }

  function renderMath(tex) {
    try {
      if (window.katex) {
        return window.katex.renderToString(tex, {
          throwOnError: false,
          strict: "ignore",
          output: "html"
        });
      }
    } catch (error) {
      console.warn("Could not render formula with KaTeX", error);
    }
    return escapeHtml(tex);
  }

  function validNumber(number) {
    return Number.isFinite(number) && number > 0;
  }

  function format(number) {
    if (!Number.isFinite(number)) return "";
    const rounded = Math.round((number + Number.EPSILON) * 10000) / 10000;
    return rounded.toLocaleString("en-US", { maximumFractionDigits: 4 });
  }

  function unitPower(unit, power) {
    return `${escapeHtml(unit)}<sup>${power}</sup>`;
  }

  function renderRows(rows) {
    return `<table class="result-table"><tbody>${rows
      .map(([label, result, unit]) => `<tr><td>${label}</td><td>${format(result)} ${unit}</td></tr>`)
      .join("")}</tbody></table>`;
  }

  function renderFormula(formulas) {
    const list = Array.isArray(formulas) ? formulas : [formulas];
    return list.map((formula) => {
      const tex = htmlFormulaToTex(formula);
      return `<span class="formula" data-tex="${escapeHtml(tex)}">${renderMath(tex)}</span>`;
    }).join(" ");
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
    const labelMatch = body.match(/^([A-Za-z -]+):\s*(.+)$/);

    if (labelMatch && startsWithFormula(labelMatch[2])) {
      return `${escapeHtml(labelMatch[1])}: ${renderFormula(labelMatch[2])}${period}`;
    }

    if (body.includes(", so ")) {
      const [before, after] = body.split(", so ");
      if (startsWithFormula(before) && startsWithFormula(after)) {
        return `${renderFormula(before)}, so ${renderFormula(after)}${period}`;
      }
    }

    if (startsWithFormula(body)) {
      return `${renderFormula(body)}${period}`;
    }

    return input;
  }

  function resultText(result) {
    const rows = result.rows.map(([label, number, unit]) => `${label}: ${format(number)} ${stripHtml(unit)}`);
    const formulas = (Array.isArray(result.formulas) ? result.formulas : [result.formulas]).map(stripHtml);
    const steps = result.steps.map(stripHtml);
    return [`Result`, ...rows, `Formula used: ${formulas.join("; ")}`, `Steps:`, ...steps].join("\n");
  }

  function renderResult(form, result) {
    const target = form.querySelector(".calculator-result");
    if (!target) return;

    if (result.error) {
      target.innerHTML = `<div class="result-box error"><h3>Check the inputs</h3><p>${result.error}</p></div>`;
      return;
    }

    target.dataset.resultText = resultText(result);
    target.innerHTML = `
      <div class="result-box">
        <h3>Result</h3>
        ${renderRows(result.rows)}
        <p><strong>Formula used:</strong> ${renderFormula(result.formulas)}</p>
        <p><strong>Step-by-step solution:</strong></p>
        <ol class="steps">${result.steps.map((step) => `<li>${renderFormulaSentence(step)}</li>`).join("")}</ol>
        <div class="result-actions">
          <button type="button" class="tool-button js-share-result">Share Result URL</button>
        </div>
      </div>
    `;
  }

  function circleFromKnown(known, raw, unit) {
    if (!validNumber(raw)) return { error: "Enter a positive value for the circle measurement." };

    let radius;
    let firstStep;
    if (known === "diameter") {
      radius = raw / 2;
      firstStep = `Convert diameter to radius: r = d / 2 = ${format(raw)} / 2 = ${format(radius)} ${escapeHtml(unit)}.`;
    } else if (known === "circumference") {
      radius = raw / (2 * PI);
      firstStep = `Convert circumference to radius: r = C / (2&pi;) = ${format(raw)} / (2&pi;) = ${format(radius)} ${escapeHtml(unit)}.`;
    } else if (known === "area") {
      radius = Math.sqrt(raw / PI);
      firstStep = `Convert area to radius: r = &radic;(A / &pi;) = &radic;(${format(raw)} / &pi;) = ${format(radius)} ${escapeHtml(unit)}.`;
    } else {
      radius = raw;
      firstStep = `Use the given radius: r = ${format(radius)} ${escapeHtml(unit)}.`;
    }

    const diameter = 2 * radius;
    const circumference = 2 * PI * radius;
    const area = PI * radius * radius;
    return {
      rows: [
        ["Radius", radius, escapeHtml(unit)],
        ["Diameter", diameter, escapeHtml(unit)],
        ["Circumference", circumference, escapeHtml(unit)],
        ["Area", area, unitPower(unit, 2)]
      ],
      formulas: ["A = &pi;r<sup>2</sup>", "C = 2&pi;r", "d = 2r", "r = &radic;(A / &pi;)"],
      steps: [
        firstStep,
        `Find area: A = &pi; &times; ${format(radius)}<sup>2</sup> = ${format(area)} ${unitPower(unit, 2)}.`,
        `Find circumference: C = 2&pi; &times; ${format(radius)} = ${format(circumference)} ${escapeHtml(unit)}.`
      ]
    };
  }

  function triangleFromValues(values, unit) {
    const { base, height, area, sideA, sideB, sideC } = values;
    const rows = [];
    const formulas = [];
    const steps = [];

    if (validNumber(base) && validNumber(height)) {
      const triangleArea = 0.5 * base * height;
      rows.push(["Area", triangleArea, unitPower(unit, 2)]);
      formulas.push("A = 1/2 &times; b &times; h");
      steps.push(`Area: A = 1/2 &times; ${format(base)} &times; ${format(height)} = ${format(triangleArea)} ${unitPower(unit, 2)}.`);
    }

    if (validNumber(area) && validNumber(base)) {
      const foundHeight = (2 * area) / base;
      rows.push(["Height from area and base", foundHeight, escapeHtml(unit)]);
      formulas.push("h = 2A / b");
      steps.push(`Height: h = 2 &times; ${format(area)} / ${format(base)} = ${format(foundHeight)} ${escapeHtml(unit)}.`);
    }

    if (validNumber(area) && validNumber(height)) {
      const foundBase = (2 * area) / height;
      rows.push(["Base from area and height", foundBase, escapeHtml(unit)]);
      formulas.push("b = 2A / h");
      steps.push(`Base: b = 2 &times; ${format(area)} / ${format(height)} = ${format(foundBase)} ${escapeHtml(unit)}.`);
    }

    if (validNumber(sideA) && validNumber(sideB) && validNumber(sideC)) {
      const sorted = [sideA, sideB, sideC].sort((a, b) => a - b);
      if (sorted[0] + sorted[1] <= sorted[2]) {
        return { error: "The three side lengths do not form a triangle. The two shorter sides must add up to more than the longest side." };
      }
      const perimeter = sideA + sideB + sideC;
      rows.push(["Perimeter", perimeter, escapeHtml(unit)]);
      formulas.push("P = a + b + c");
      steps.push(`Perimeter: P = ${format(sideA)} + ${format(sideB)} + ${format(sideC)} = ${format(perimeter)} ${escapeHtml(unit)}.`);
    }

    if (validNumber(sideA) && validNumber(sideB)) {
      const hypotenuse = Math.sqrt(sideA * sideA + sideB * sideB);
      rows.push(["Right-triangle hypotenuse from a and b", hypotenuse, escapeHtml(unit)]);
      formulas.push("a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup>");
      steps.push(`Right triangle: c = &radic;(${format(sideA)}<sup>2</sup> + ${format(sideB)}<sup>2</sup>) = ${format(hypotenuse)} ${escapeHtml(unit)}.`);
    }

    if (!rows.length) {
      return { error: "Enter base and height for area, area plus base or height for reverse solving, or side lengths for perimeter and right-triangle calculations." };
    }

    return { rows, formulas, steps };
  }

  function rectangleFromDimensions(length, width, unit) {
    if (!validNumber(length) || !validNumber(width)) return { error: "Enter positive length and width values." };
    const area = length * width;
    const perimeter = 2 * (length + width);
    const diagonal = Math.sqrt(length * length + width * width);
    return {
      rows: [
        ["Area", area, unitPower(unit, 2)],
        ["Perimeter", perimeter, escapeHtml(unit)],
        ["Diagonal", diagonal, escapeHtml(unit)]
      ],
      formulas: ["A = lw", "P = 2(l + w)", "d = &radic;(l<sup>2</sup> + w<sup>2</sup>)"],
      steps: [
        `Area: A = ${format(length)} &times; ${format(width)} = ${format(area)} ${unitPower(unit, 2)}.`,
        `Perimeter: P = 2(${format(length)} + ${format(width)}) = ${format(perimeter)} ${escapeHtml(unit)}.`,
        `Diagonal: d = &radic;(${format(length)}<sup>2</sup> + ${format(width)}<sup>2</sup>) = ${format(diagonal)} ${escapeHtml(unit)}.`
      ]
    };
  }

  function squareFromSide(side, unit) {
    if (!validNumber(side)) return { error: "Enter a positive side length." };
    const area = side * side;
    const perimeter = 4 * side;
    const diagonal = side * Math.sqrt(2);
    return {
      rows: [
        ["Area", area, unitPower(unit, 2)],
        ["Perimeter", perimeter, escapeHtml(unit)],
        ["Diagonal", diagonal, escapeHtml(unit)]
      ],
      formulas: ["A = s<sup>2</sup>", "P = 4s", "d = s&radic;2"],
      steps: [
        `Area: A = ${format(side)}<sup>2</sup> = ${format(area)} ${unitPower(unit, 2)}.`,
        `Perimeter: P = 4 &times; ${format(side)} = ${format(perimeter)} ${escapeHtml(unit)}.`,
        `Diagonal: d = ${format(side)}&radic;2 = ${format(diagonal)} ${escapeHtml(unit)}.`
      ]
    };
  }

  function cylinderFromValues(values, unit) {
    let { radius, height, volume, solve } = values;
    let firstStep = "";

    if (solve === "height-from-volume") {
      if (!validNumber(radius) || !validNumber(volume)) return { error: "Enter radius and volume to find cylinder height." };
      height = volume / (PI * radius * radius);
      firstStep = `Find height: h = V / (&pi;r<sup>2</sup>) = ${format(volume)} / (&pi; &times; ${format(radius)}<sup>2</sup>) = ${format(height)} ${escapeHtml(unit)}.`;
    } else if (solve === "radius-from-volume") {
      if (!validNumber(height) || !validNumber(volume)) return { error: "Enter height and volume to find cylinder radius." };
      radius = Math.sqrt(volume / (PI * height));
      firstStep = `Find radius: r = &radic;(V / &pi;h) = &radic;(${format(volume)} / (&pi; &times; ${format(height)})) = ${format(radius)} ${escapeHtml(unit)}.`;
    } else if (!validNumber(radius) || !validNumber(height)) {
      return { error: "Enter positive radius and height values." };
    }

    const baseArea = PI * radius * radius;
    const cylinderVolume = baseArea * height;
    const lateral = 2 * PI * radius * height;
    const surface = 2 * PI * radius * (radius + height);
    return {
      rows: [
        ["Radius", radius, escapeHtml(unit)],
        ["Height", height, escapeHtml(unit)],
        ["Base area", baseArea, unitPower(unit, 2)],
        ["Volume", cylinderVolume, unitPower(unit, 3)],
        ["Lateral surface area", lateral, unitPower(unit, 2)],
        ["Total surface area", surface, unitPower(unit, 2)]
      ],
      formulas: ["V = &pi;r<sup>2</sup>h", "LSA = 2&pi;rh", "TSA = 2&pi;r(r + h)", "h = V / (&pi;r<sup>2</sup>)"],
      steps: [
        firstStep || `Use radius r = ${format(radius)} ${escapeHtml(unit)} and height h = ${format(height)} ${escapeHtml(unit)}.`,
        `Base area: &pi; &times; ${format(radius)}<sup>2</sup> = ${format(baseArea)} ${unitPower(unit, 2)}.`,
        `Volume: ${format(baseArea)} &times; ${format(height)} = ${format(cylinderVolume)} ${unitPower(unit, 3)}.`,
        `Total surface area: 2&pi; &times; ${format(radius)}(${format(radius)} + ${format(height)}) = ${format(surface)} ${unitPower(unit, 2)}.`
      ]
    };
  }

  function coneFromValues(values, unit) {
    let { radius, height, volume, solve } = values;
    let firstStep = "";

    if (solve === "height-from-volume") {
      if (!validNumber(radius) || !validNumber(volume)) return { error: "Enter radius and volume to find cone height." };
      height = (3 * volume) / (PI * radius * radius);
      firstStep = `Find height: h = 3V / (&pi;r<sup>2</sup>) = 3 &times; ${format(volume)} / (&pi; &times; ${format(radius)}<sup>2</sup>) = ${format(height)} ${escapeHtml(unit)}.`;
    } else if (solve === "radius-from-volume") {
      if (!validNumber(height) || !validNumber(volume)) return { error: "Enter height and volume to find cone radius." };
      radius = Math.sqrt((3 * volume) / (PI * height));
      firstStep = `Find radius: r = &radic;(3V / &pi;h) = &radic;(3 &times; ${format(volume)} / (&pi; &times; ${format(height)})) = ${format(radius)} ${escapeHtml(unit)}.`;
    } else if (!validNumber(radius) || !validNumber(height)) {
      return { error: "Enter positive radius and height values." };
    }

    const slant = Math.sqrt(radius * radius + height * height);
    const baseArea = PI * radius * radius;
    const coneVolume = (baseArea * height) / 3;
    const lateral = PI * radius * slant;
    const surface = PI * radius * (radius + slant);
    return {
      rows: [
        ["Radius", radius, escapeHtml(unit)],
        ["Height", height, escapeHtml(unit)],
        ["Slant height", slant, escapeHtml(unit)],
        ["Base area", baseArea, unitPower(unit, 2)],
        ["Volume", coneVolume, unitPower(unit, 3)],
        ["Lateral surface area", lateral, unitPower(unit, 2)],
        ["Total surface area", surface, unitPower(unit, 2)]
      ],
      formulas: ["l = &radic;(r<sup>2</sup> + h<sup>2</sup>)", "V = 1/3&pi;r<sup>2</sup>h", "TSA = &pi;r(r + l)", "h = 3V / (&pi;r<sup>2</sup>)"],
      steps: [
        firstStep || `Use radius r = ${format(radius)} ${escapeHtml(unit)} and height h = ${format(height)} ${escapeHtml(unit)}.`,
        `Slant height: l = &radic;(${format(radius)}<sup>2</sup> + ${format(height)}<sup>2</sup>) = ${format(slant)} ${escapeHtml(unit)}.`,
        `Volume: V = 1/3 &times; &pi; &times; ${format(radius)}<sup>2</sup> &times; ${format(height)} = ${format(coneVolume)} ${unitPower(unit, 3)}.`,
        `Total surface area: TSA = &pi; &times; ${format(radius)}(${format(radius)} + ${format(slant)}) = ${format(surface)} ${unitPower(unit, 2)}.`
      ]
    };
  }

  function sphereFromKnown(known, raw, unit) {
    if (!validNumber(raw)) return { error: "Enter a positive radius, diameter, volume, or surface area." };
    let radius;
    let firstStep;
    if (known === "diameter") {
      radius = raw / 2;
      firstStep = `Convert diameter to radius: r = ${format(raw)} / 2 = ${format(radius)} ${escapeHtml(unit)}.`;
    } else if (known === "volume") {
      radius = Math.cbrt((3 * raw) / (4 * PI));
      firstStep = `Find radius from volume: r = &#8731;(3V / 4&pi;) = &#8731;(3 &times; ${format(raw)} / 4&pi;) = ${format(radius)} ${escapeHtml(unit)}.`;
    } else if (known === "surfaceArea") {
      radius = Math.sqrt(raw / (4 * PI));
      firstStep = `Find radius from surface area: r = &radic;(SA / 4&pi;) = &radic;(${format(raw)} / 4&pi;) = ${format(radius)} ${escapeHtml(unit)}.`;
    } else {
      radius = raw;
      firstStep = `Use the given radius: r = ${format(radius)} ${escapeHtml(unit)}.`;
    }

    const diameter = 2 * radius;
    const volume = (4 / 3) * PI * radius * radius * radius;
    const surface = 4 * PI * radius * radius;
    return {
      rows: [
        ["Radius", radius, escapeHtml(unit)],
        ["Diameter", diameter, escapeHtml(unit)],
        ["Volume", volume, unitPower(unit, 3)],
        ["Surface area", surface, unitPower(unit, 2)]
      ],
      formulas: ["V = 4/3&pi;r<sup>3</sup>", "SA = 4&pi;r<sup>2</sup>", "d = 2r", "r = &#8731;(3V / 4&pi;)"],
      steps: [
        firstStep,
        `Volume: V = 4/3 &times; &pi; &times; ${format(radius)}<sup>3</sup> = ${format(volume)} ${unitPower(unit, 3)}.`,
        `Surface area: SA = 4&pi; &times; ${format(radius)}<sup>2</sup> = ${format(surface)} ${unitPower(unit, 2)}.`
      ]
    };
  }

  function prismFromDimensions(length, width, height, unit) {
    if (!validNumber(length) || !validNumber(width) || !validNumber(height)) {
      return { error: "Enter positive length, width, and height values." };
    }
    const volume = length * width * height;
    const surface = 2 * (length * width + length * height + width * height);
    return {
      rows: [
        ["Volume", volume, unitPower(unit, 3)],
        ["Surface area", surface, unitPower(unit, 2)]
      ],
      formulas: ["V = lwh", "SA = 2(lw + lh + wh)"],
      steps: [
        `Volume: V = ${format(length)} &times; ${format(width)} &times; ${format(height)} = ${format(volume)} ${unitPower(unit, 3)}.`,
        `Surface area: SA = 2(${format(length * width)} + ${format(length * height)} + ${format(width * height)}) = ${format(surface)} ${unitPower(unit, 2)}.`
      ]
    };
  }

  function solver(form) {
    const shape = textValue(form, "shape", "circle");
    const target = textValue(form, "target", "auto");
    const unit = textValue(form, "unit", "cm");
    if (shape === "circle") {
      const known = validNumber(value(form, "radius")) ? "radius" : validNumber(value(form, "diameter")) ? "diameter" : validNumber(value(form, "circumference")) ? "circumference" : "area";
      const raw = known === "radius" ? value(form, "radius") : known === "diameter" ? value(form, "diameter") : known === "circumference" ? value(form, "circumference") : value(form, "area");
      return circleFromKnown(known, raw, unit);
    }
    if (shape === "triangle") {
      return triangleFromValues({
        base: value(form, "base"),
        height: value(form, "height"),
        area: value(form, "area"),
        sideA: value(form, "sideA"),
        sideB: value(form, "sideB"),
        sideC: value(form, "sideC")
      }, unit);
    }
    if (shape === "rectangle") {
      const length = value(form, "base");
      const width = value(form, "width");
      return rectangleFromDimensions(length, width, unit);
    }
    if (shape === "cylinder") {
      const solve = target === "height" ? "height-from-volume" : target === "radius" ? "radius-from-volume" : "all";
      return cylinderFromValues({ radius: value(form, "radius"), height: value(form, "height"), volume: value(form, "volume"), solve }, unit);
    }
    if (shape === "cone") {
      const solve = target === "height" ? "height-from-volume" : target === "radius" ? "radius-from-volume" : "all";
      return coneFromValues({ radius: value(form, "radius"), height: value(form, "height"), volume: value(form, "volume"), solve }, unit);
    }
    if (shape === "sphere") {
      const known = validNumber(value(form, "radius")) ? "radius" : validNumber(value(form, "diameter")) ? "diameter" : validNumber(value(form, "volume")) ? "volume" : "surfaceArea";
      const raw = known === "radius" ? value(form, "radius") : known === "diameter" ? value(form, "diameter") : known === "volume" ? value(form, "volume") : value(form, "area");
      return sphereFromKnown(known, raw, unit);
    }
    return { error: "Choose a supported shape and enter the known values." };
  }

  const calculators = {
    circle(form) {
      return circleFromKnown(textValue(form, "known", "radius"), value(form, "value"), textValue(form, "unit", "cm"));
    },

    triangle(form) {
      return triangleFromValues({
        base: value(form, "base"),
        height: value(form, "height"),
        area: value(form, "area"),
        sideA: value(form, "sideA"),
        sideB: value(form, "sideB"),
        sideC: value(form, "sideC")
      }, textValue(form, "unit", "cm"));
    },

    rectangle(form) {
      return rectangleFromDimensions(value(form, "length"), value(form, "width"), textValue(form, "unit", "cm"));
    },

    square(form) {
      return squareFromSide(value(form, "side"), textValue(form, "unit", "cm"));
    },

    cylinder(form) {
      return cylinderFromValues({
        radius: value(form, "radius"),
        height: value(form, "height"),
        volume: value(form, "volume"),
        solve: textValue(form, "solve", "all")
      }, textValue(form, "unit", "cm"));
    },

    cone(form) {
      return coneFromValues({
        radius: value(form, "radius"),
        height: value(form, "height"),
        volume: value(form, "volume"),
        solve: textValue(form, "solve", "all")
      }, textValue(form, "unit", "cm"));
    },

    sphere(form) {
      return sphereFromKnown(textValue(form, "known", "radius"), value(form, "value"), textValue(form, "unit", "cm"));
    },

    "rectangular-prism"(form) {
      return prismFromDimensions(value(form, "length"), value(form, "width"), value(form, "height"), textValue(form, "unit", "cm"));
    },

    solver
  };

  function updateShareUrl(form) {
    const params = new URLSearchParams();
    params.set("calc", form.dataset.calculator || "");
    Array.from(form.elements).forEach((field) => {
      if (!field.name || field.type === "submit" || field.type === "button") return;
      if (field.value) params.set(field.name, field.value);
    });
    const nextUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
    window.history.replaceState(null, "", nextUrl);
  }

  function hydrateFormsFromUrl() {
    const params = new URLSearchParams(window.location.search);
    if (!params.size) return;
    document.querySelectorAll(".js-calculator").forEach((form) => {
      const requestedCalc = params.get("calc");
      if (requestedCalc && requestedCalc !== form.dataset.calculator) return;
      let touched = false;
      Array.from(form.elements).forEach((field) => {
        if (!field.name || !params.has(field.name)) return;
        field.value = params.get(field.name);
        touched = true;
      });
      if (touched) {
        form.dispatchEvent(new Event("submit", { cancelable: true }));
      }
    });
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.left = "-9999px";
    document.body.append(area);
    area.focus();
    area.select();
    document.execCommand("copy");
    area.remove();
  }

  function setStatus(card, message) {
    const status = card.querySelector(".tool-status");
    if (status) status.textContent = message;
  }

  function saveCardAsImage(card) {
    const title = card.dataset.cardTitle || "Formula Card";
    const formulas = (card.dataset.formulaText || "").split("\n").filter(Boolean);
    const canvas = document.createElement("canvas");
    const width = 1200;
    const height = 630;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fffdfa";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#dff3ec";
    ctx.fillRect(0, 0, width, 86);
    ctx.fillStyle = "#137c5a";
    ctx.font = "700 34px Arial, sans-serif";
    ctx.fillText("Geometry Formulas", 56, 56);
    ctx.fillStyle = "#17211d";
    ctx.font = "800 58px Arial, sans-serif";
    ctx.fillText(title, 56, 165);
    ctx.font = "700 38px Consolas, monospace";
    formulas.forEach((line, index) => {
      ctx.fillText(line.replace(/pi/g, "π").replace(/sqrt/g, "√"), 76, 250 + index * 76);
    });
    ctx.fillStyle = "#5f6d65";
    ctx.font = "500 26px Arial, sans-serif";
    ctx.fillText(window.location.hostname || "geometry formulas", 56, 586);
    const link = document.createElement("a");
    link.download = card.dataset.imageName || "formula-card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    track("image_saved", { card: title });
  }

  function bindFormulaCards() {
    document.querySelectorAll(".js-formula-card").forEach((card) => {
      card.addEventListener("click", async (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        if (target.classList.contains("js-copy-formula")) {
          await copyText(card.dataset.formulaText || "");
          setStatus(card, "Formula copied.");
          track("formula_copied", { card: card.dataset.cardTitle });
        } else if (target.classList.contains("js-copy-latex")) {
          await copyText(card.dataset.latex || "");
          setStatus(card, "LaTeX copied.");
          track("latex_copied", { card: card.dataset.cardTitle });
        } else if (target.classList.contains("js-save-card")) {
          saveCardAsImage(card);
          setStatus(card, "Image saved.");
        } else if (target.classList.contains("js-print-page")) {
          window.print();
        }
      });
    });
  }

  function bindCalculators() {
    document.querySelectorAll(".js-calculator").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const type = form.dataset.calculator;
        const handler = calculators[type];
        if (!handler) return;
        const result = handler(form);
        renderResult(form, result);
        if (!result.error) {
          updateShareUrl(form);
          track("calculator_used", { calculator: type });
        }
      });

      form.addEventListener("click", async (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        if (target.classList.contains("js-copy-result")) {
          const output = form.querySelector(".calculator-result");
          const text = output?.dataset.resultText || output?.textContent || "";
          await copyText(text.trim());
          track("result_copied", { calculator: form.dataset.calculator });
        } else if (target.classList.contains("js-share-result")) {
          await copyText(window.location.href);
          target.textContent = "Link copied";
          track("result_shared", { calculator: form.dataset.calculator });
        }
      });
    });
  }

  function bindFormulaSearch() {
    document.querySelectorAll(".js-formula-search").forEach((form) => {
      const input = form.querySelector("input[type='search']");
      const results = form.querySelector(".search-results");
      if (!input || !results) return;

      function matches(query) {
        const q = query.trim().toLowerCase();
        if (!q) return [];
        return searchIndex
          .map((item) => {
            const haystack = `${item.title} ${item.terms}`.toLowerCase();
            const score = haystack.includes(q) ? 10 : q.split(/\s+/).filter((part) => haystack.includes(part)).length;
            return { ...item, score };
          })
          .filter((item) => item.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 6);
      }

      function render(query) {
        const items = matches(query);
        results.innerHTML = items.length
          ? items.map((item) => `<a href="${item.url}">${item.title}</a>`).join("")
          : query.trim()
            ? `<span>No exact match. Try "circle area" or "cylinder volume".</span>`
            : "";
      }

      input.addEventListener("input", () => render(input.value));
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const first = matches(input.value)[0];
        if (first) {
          track("formula_search", { query: input.value });
          window.location.href = first.url;
        }
      });
      document.addEventListener("click", (event) => {
        if (!form.contains(event.target)) results.innerHTML = "";
      });
    });
  }

  function bindPracticeTracking() {
    document.querySelectorAll(".practice-item").forEach((item) => {
      item.addEventListener("toggle", () => {
        if (item.open) track("practice_opened", { question: item.querySelector("summary")?.textContent || "" });
      });
    });
  }

  function bindRelatedLinkTracking() {
    document.querySelectorAll(".link-tile").forEach((link) => {
      link.addEventListener("click", () => track("related_link_clicked", { href: link.getAttribute("href") }));
    });
  }

  function init() {
    bindFormulaCards();
    bindCalculators();
    bindFormulaSearch();
    bindPracticeTracking();
    bindRelatedLinkTracking();
    hydrateFormsFromUrl();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
