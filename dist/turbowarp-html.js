// Name: TurboWarp HTML
// ID: kubohiroyahtml
// Description: Build escaped HTML fragments with immutable reporter blocks.
// By: Hiroya Kubo
// License: MPL-2.0

(function (Scratch) {
  'use strict';

  const extensionConfig = {
    id: "kubohiroyahtml",
    docsURI: "https://kubohiroya.github.io/turbowarp-html/",
    blockIconURI: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHJlY3QgeD0iNiIgeT0iOCIgd2lkdGg9IjM2IiBoZWlnaHQ9IjMyIiByeD0iNCIgZmlsbD0iIzExODI4NSIvPjxwYXRoIGQ9Ik0xOCAxOEwxMiAyNGw2IDZNMzAgMThsNiA2LTYgNk0yNiAxNmwtNCAxNiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg=="
  };
  const extensionName = "TurboWarp HTML";
  const blocks = [{ "opcode": "text", "blockType": "REPORTER", "text": "text [TEXT]", "description": "Creates an escaped HTML text fragment.", "arguments": { "TEXT": { "type": "STRING", "defaultValue": "Hello <world>" } } }, { "opcode": "element", "blockType": "REPORTER", "text": "element [TAG] content [CONTENT]", "description": "Creates a valid HTML element with escaped structured content.", "arguments": { "TAG": { "type": "STRING", "defaultValue": "section" }, "CONTENT": { "type": "STRING", "defaultValue": "" } } }, { "opcode": "withAttribute", "blockType": "REPORTER", "text": "[ELEMENT] with attribute [NAME] = [VALUE]", "description": "Returns a new element with a safe escaped attribute value.", "arguments": { "ELEMENT": { "type": "STRING", "defaultValue": "" }, "NAME": { "type": "STRING", "defaultValue": "class" }, "VALUE": { "type": "STRING", "defaultValue": "card" } } }, { "opcode": "concat", "blockType": "REPORTER", "text": "[LEFT] followed by [RIGHT]", "description": "Creates a fragment sequence from two HTML fragments.", "arguments": { "LEFT": { "type": "STRING", "defaultValue": "" }, "RIGHT": { "type": "STRING", "defaultValue": "" } } }, { "opcode": "render", "blockType": "REPORTER", "text": "render HTML [FRAGMENT]", "description": "Renders an HTML fragment to final HTML text without updating stored validation errors.", "arguments": { "FRAGMENT": { "type": "STRING", "defaultValue": "" } } }, { "opcode": "renderWithValidation", "blockType": "REPORTER", "text": "render HTML with validation [FRAGMENT]", "description": "Validates an HTML fragment, stores any validation errors, and renders final HTML text.", "arguments": { "FRAGMENT": { "type": "STRING", "defaultValue": "" } } }, { "opcode": "lastValidationErrors", "blockType": "REPORTER", "text": "last HTML validation errors", "description": "Returns validation errors stored by the most recent render HTML block.", "arguments": {} }, { "opcode": "lastRenderHasValidationErrors", "blockType": "BOOLEAN", "text": "last rendered HTML has validation errors?", "description": "Reports whether the most recent render HTML block stored validation errors.", "arguments": {} }, { "opcode": "validateHtml", "blockType": "REPORTER", "text": "validate HTML [FRAGMENT]", "description": "Returns simple validation diagnostics for an HTML fragment.", "arguments": { "FRAGMENT": { "type": "STRING", "defaultValue": "" } } }, { "opcode": "isValidHtml", "blockType": "BOOLEAN", "text": "HTML [FRAGMENT] is valid?", "description": "Reports whether simple validation found no HTML errors.", "arguments": { "FRAGMENT": { "type": "STRING", "defaultValue": "" } } }, { "opcode": "link", "blockType": "REPORTER", "text": "link [CONTENT] URL [URL]", "description": "Creates an anchor with a conservatively validated URL.", "arguments": { "CONTENT": { "type": "STRING", "defaultValue": "TurboWarp" }, "URL": { "type": "STRING", "defaultValue": "https://turbowarp.org/" } } }, { "opcode": "externalLink", "blockType": "REPORTER", "text": "external link [CONTENT] URL [URL]", "description": "Creates an anchor that opens in a new tab with safe rel attributes.", "arguments": { "CONTENT": { "type": "STRING", "defaultValue": "TurboWarp" }, "URL": { "type": "STRING", "defaultValue": "https://turbowarp.org/" } } }, { "opcode": "image", "blockType": "REPORTER", "text": "image URL [SRC] alt [ALT]", "description": "Creates a void image element with safe src and escaped alt text.", "arguments": { "SRC": { "type": "STRING", "defaultValue": "/status.png" }, "ALT": { "type": "STRING", "defaultValue": "status" } } }, { "opcode": "turbowarpProjectFrame", "blockType": "REPORTER", "text": "TurboWarp project [PROJECT_ID] iframe title [TITLE] width [WIDTH] height [HEIGHT]", "description": "Creates a safe iframe for playing a TurboWarp project.", "arguments": { "PROJECT_ID": { "type": "STRING", "defaultValue": "414716080" }, "TITLE": { "type": "STRING", "defaultValue": "TurboWarp project" }, "WIDTH": { "type": "STRING", "defaultValue": "482" }, "HEIGHT": { "type": "STRING", "defaultValue": "412" } } }, { "opcode": "scratchProjectFrame", "blockType": "REPORTER", "text": "Scratch project [PROJECT_ID] iframe title [TITLE] width [WIDTH] height [HEIGHT]", "description": "Creates a safe iframe for playing a Scratch project.", "arguments": { "PROJECT_ID": { "type": "STRING", "defaultValue": "104" }, "TITLE": { "type": "STRING", "defaultValue": "Scratch project" }, "WIDTH": { "type": "STRING", "defaultValue": "485" }, "HEIGHT": { "type": "STRING", "defaultValue": "402" } } }, { "opcode": "packagedProjectFrame", "blockType": "REPORTER", "text": "packaged TurboWarp project iframe URL [SRC] title [TITLE] width [WIDTH] height [HEIGHT]", "description": "Creates a safe iframe for playing a same-site TurboWarp Packager HTML file.", "arguments": { "SRC": { "type": "STRING", "defaultValue": "./project.html" }, "TITLE": { "type": "STRING", "defaultValue": "Packaged TurboWarp project" }, "WIDTH": { "type": "STRING", "defaultValue": "480" }, "HEIGHT": { "type": "STRING", "defaultValue": "360" } } }, { "opcode": "html", "blockType": "REPORTER", "text": "html [CONTENT]", "description": "Creates an html element.", "arguments": { "CONTENT": { "type": "STRING", "defaultValue": "" } } }, { "opcode": "head", "blockType": "REPORTER", "text": "head [CONTENT]", "description": "Creates a head element.", "arguments": { "CONTENT": { "type": "STRING", "defaultValue": "" } } }, { "opcode": "body", "blockType": "REPORTER", "text": "body [CONTENT]", "description": "Creates a body element.", "arguments": { "CONTENT": { "type": "STRING", "defaultValue": "" } } }, { "opcode": "title", "blockType": "REPORTER", "text": "title [CONTENT]", "description": "Creates a title element.", "arguments": { "CONTENT": { "type": "STRING", "defaultValue": "Status" } } }, { "opcode": "style", "blockType": "REPORTER", "text": "style [CSS]", "description": "Creates a style element for educational CSS.", "arguments": { "CSS": { "type": "STRING", "defaultValue": ".card { color: red; }" } } }, { "opcode": "h1", "blockType": "REPORTER", "text": "h1 [CONTENT]", "description": "Creates an h1 element.", "arguments": { "CONTENT": { "type": "STRING", "defaultValue": "Server status" } } }, { "opcode": "h2", "blockType": "REPORTER", "text": "h2 [CONTENT]", "description": "Creates an h2 element.", "arguments": { "CONTENT": { "type": "STRING", "defaultValue": "Heading" } } }, { "opcode": "h3", "blockType": "REPORTER", "text": "h3 [CONTENT]", "description": "Creates an h3 element.", "arguments": { "CONTENT": { "type": "STRING", "defaultValue": "Heading" } } }, { "opcode": "h4", "blockType": "REPORTER", "text": "h4 [CONTENT]", "description": "Creates an h4 element.", "arguments": { "CONTENT": { "type": "STRING", "defaultValue": "Heading" } } }, { "opcode": "h5", "blockType": "REPORTER", "text": "h5 [CONTENT]", "description": "Creates an h5 element.", "arguments": { "CONTENT": { "type": "STRING", "defaultValue": "Heading" } } }, { "opcode": "h6", "blockType": "REPORTER", "text": "h6 [CONTENT]", "description": "Creates an h6 element.", "arguments": { "CONTENT": { "type": "STRING", "defaultValue": "Heading" } } }, { "opcode": "p", "blockType": "REPORTER", "text": "p [CONTENT]", "description": "Creates a paragraph element.", "arguments": { "CONTENT": { "type": "STRING", "defaultValue": "Ready" } } }, { "opcode": "div", "blockType": "REPORTER", "text": "div [CONTENT]", "description": "Creates a div element.", "arguments": { "CONTENT": { "type": "STRING", "defaultValue": "" } } }, { "opcode": "span", "blockType": "REPORTER", "text": "span [CONTENT]", "description": "Creates a span element.", "arguments": { "CONTENT": { "type": "STRING", "defaultValue": "" } } }, { "opcode": "ul", "blockType": "REPORTER", "text": "ul [CONTENT]", "description": "Creates an unordered list element.", "arguments": { "CONTENT": { "type": "STRING", "defaultValue": "" } } }, { "opcode": "ol", "blockType": "REPORTER", "text": "ol [CONTENT]", "description": "Creates an ordered list element.", "arguments": { "CONTENT": { "type": "STRING", "defaultValue": "" } } }, { "opcode": "li", "blockType": "REPORTER", "text": "li [CONTENT]", "description": "Creates a list item element.", "arguments": { "CONTENT": { "type": "STRING", "defaultValue": "item" } } }, { "opcode": "table", "blockType": "REPORTER", "text": "table [CONTENT]", "description": "Creates a table element.", "arguments": { "CONTENT": { "type": "STRING", "defaultValue": "" } } }, { "opcode": "tr", "blockType": "REPORTER", "text": "tr [CONTENT]", "description": "Creates a table row element.", "arguments": { "CONTENT": { "type": "STRING", "defaultValue": "" } } }, { "opcode": "th", "blockType": "REPORTER", "text": "th [CONTENT]", "description": "Creates a table header cell element.", "arguments": { "CONTENT": { "type": "STRING", "defaultValue": "Name" } } }, { "opcode": "td", "blockType": "REPORTER", "text": "td [CONTENT]", "description": "Creates a table data cell element.", "arguments": { "CONTENT": { "type": "STRING", "defaultValue": "Value" } } }, { "opcode": "form", "blockType": "REPORTER", "text": "form [CONTENT]", "description": "Creates a form element.", "arguments": { "CONTENT": { "type": "STRING", "defaultValue": "" } } }, { "opcode": "label", "blockType": "REPORTER", "text": "label [CONTENT]", "description": "Creates a label element.", "arguments": { "CONTENT": { "type": "STRING", "defaultValue": "Name" } } }, { "opcode": "input", "blockType": "REPORTER", "text": "input", "description": "Creates a void input element.", "arguments": {} }, { "opcode": "textarea", "blockType": "REPORTER", "text": "textarea [CONTENT]", "description": "Creates a textarea element.", "arguments": { "CONTENT": { "type": "STRING", "defaultValue": "" } } }, { "opcode": "select", "blockType": "REPORTER", "text": "select [CONTENT]", "description": "Creates a select element.", "arguments": { "CONTENT": { "type": "STRING", "defaultValue": "" } } }, { "opcode": "option", "blockType": "REPORTER", "text": "option [CONTENT]", "description": "Creates an option element.", "arguments": { "CONTENT": { "type": "STRING", "defaultValue": "Choice" } } }, { "opcode": "button", "blockType": "REPORTER", "text": "button [CONTENT]", "description": "Creates a button element.", "arguments": { "CONTENT": { "type": "STRING", "defaultValue": "Submit" } } }];
  const definitions = {
    extensionName,
    blocks
  };
  const empty = { kind: "empty" };
  let lastRenderValidationResult = { issues: [] };
  const VALID_NAME = /^[a-zA-Z][a-zA-Z0-9:-]*$/u;
  const VOID_ELEMENTS = /* @__PURE__ */ new Set([
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "source",
    "track",
    "wbr"
  ]);
  const FORBIDDEN_TAGS = /* @__PURE__ */ new Set(["script", "iframe", "object", "embed"]);
  const URL_ATTRIBUTES = /* @__PURE__ */ new Set(["href", "src"]);
  const SAFE_URL_PATTERN = /^(?:https?:|mailto:|tel:|\/|\.\/|\.\.\/|#|\?|$)/iu;
  const URL_SCHEME_PATTERN = /^[a-z][a-z0-9+.-]*:/iu;
  const PROJECT_ID_PATTERN = /^\d+$/u;
  const FRAME_DIMENSION_PATTERN = /^[1-9]\d{0,4}$/u;
  const TABLE_SECTION_ELEMENTS = /* @__PURE__ */ new Set(["tbody", "thead", "tfoot"]);
  function text(value) {
    return { kind: "text", value };
  }
  function element(tagName, children = empty) {
    const normalizedTagName = normalizeTagName(tagName);
    return {
      kind: "element",
      tagName: normalizedTagName,
      attributes: {},
      children: normalizeChildren(children)
    };
  }
  function withAttribute(fragment, name, value) {
    if (fragment.kind !== "element") {
      throw new TypeError("Attributes can only be applied to HTML elements.");
    }
    const normalizedName = normalizeAttributeName(name);
    if (URL_ATTRIBUTES.has(normalizedName)) validateSafeUrl(value);
    return {
      ...fragment,
      attributes: {
        ...fragment.attributes,
        [normalizedName]: value
      }
    };
  }
  function concat(left, right) {
    const children = [...flattenSequence(left), ...flattenSequence(right)].filter(
      (child) => child.kind !== "empty"
    );
    if (children.length === 0) return empty;
    if (children.length === 1) return children[0] ?? empty;
    return { kind: "sequence", children };
  }
  function render(fragment) {
    return renderFragment(fragment);
  }
  function renderWithValidation(fragment) {
    lastRenderValidationResult = validate(fragment);
    return renderFragment(fragment);
  }
  function getLastRenderValidationErrors() {
    return lastRenderValidationResult.issues.filter((issue) => issue.severity === "error");
  }
  function formatValidationErrors(issues) {
    if (issues.length === 0) return "";
    return issues.map((issue) => `${issue.path}: ${issue.message}`).join("\n");
  }
  function getLastRenderValidationErrorText() {
    return formatValidationErrors(getLastRenderValidationErrors());
  }
  function renderFragment(fragment) {
    switch (fragment.kind) {
      case "empty":
        return "";
      case "text":
        return escapeText(fragment.value);
      case "sequence":
        return fragment.children.map(renderFragment).join("");
      case "element":
        return renderElement(fragment);
    }
  }
  function validate(fragment) {
    const issues = [];
    const roots = topLevelFragments(fragment);
    if (roots.length === 0) {
      issues.push({
        severity: "warning",
        path: "$",
        message: "HTML fragment is empty."
      });
    } else if (roots.length > 1) {
      issues.push({
        severity: "warning",
        path: "$",
        message: "Top-level sequence has multiple roots; wrap a complete document in one html element."
      });
    }
    for (const [index, child] of roots.entries()) {
      validateFragment(child, [`$[${index}]`], [], issues);
    }
    const singleRoot = roots.length === 1 ? roots[0] : void 0;
    if (singleRoot?.kind === "element" && singleRoot.tagName === "html") {
      validateDocumentElement(singleRoot, issues);
    }
    return {
      valid: issues.every((issue) => issue.severity !== "error"),
      issues
    };
  }
  function isValid(fragment) {
    return validate(fragment).valid;
  }
  function formatValidationResult(result) {
    if (result.issues.length === 0) return "valid";
    return result.issues.map((issue) => `${issue.severity}: ${issue.path}: ${issue.message}`).join("\n");
  }
  function link(content, url) {
    return withAttribute(element("a", normalizeContent(content)), "href", url);
  }
  function externalLink(content, url) {
    return withAttribute(withAttribute(link(content, url), "target", "_blank"), "rel", "noopener noreferrer");
  }
  function image(src, alt) {
    return withAttribute(withAttribute(element("img"), "src", src), "alt", alt);
  }
  function turbowarpProjectFrame(projectId, titleText = "TurboWarp project", width = "482", height = "412") {
    const normalizedProjectId = normalizeProjectId(projectId);
    return projectFrame(
      `https://turbowarp.org/${normalizedProjectId}/embed`,
      titleText,
      width,
      height
    );
  }
  function scratchProjectFrame(projectId, titleText = "Scratch project", width = "485", height = "402") {
    const normalizedProjectId = normalizeProjectId(projectId);
    return projectFrame(
      `https://scratch.mit.edu/projects/${normalizedProjectId}/embed`,
      titleText,
      width,
      height
    );
  }
  function packagedProjectFrame(src, titleText = "Packaged TurboWarp project", width = "480", height = "360") {
    validatePackagedProjectSrc(src);
    return projectFrame(src.trim(), titleText, width, height);
  }
  function style(css) {
    return element("style", text(css));
  }
  function createElementFactory(tagName) {
    return (content = empty) => element(tagName, normalizeContent(content));
  }
  const html = createElementFactory("html");
  const head = createElementFactory("head");
  const body = createElementFactory("body");
  const title = createElementFactory("title");
  const h1 = createElementFactory("h1");
  const h2 = createElementFactory("h2");
  const h3 = createElementFactory("h3");
  const h4 = createElementFactory("h4");
  const h5 = createElementFactory("h5");
  const h6 = createElementFactory("h6");
  const p = createElementFactory("p");
  const div = createElementFactory("div");
  const span = createElementFactory("span");
  const ul = createElementFactory("ul");
  const ol = createElementFactory("ol");
  const li = createElementFactory("li");
  const table = createElementFactory("table");
  const tr = createElementFactory("tr");
  const th = createElementFactory("th");
  const td = createElementFactory("td");
  const form = createElementFactory("form");
  const label = createElementFactory("label");
  const input = createElementFactory("input");
  const textarea = createElementFactory("textarea");
  const select = createElementFactory("select");
  const option = createElementFactory("option");
  const button = createElementFactory("button");
  function isVoidElement(tagName) {
    return VOID_ELEMENTS.has(tagName.toLowerCase());
  }
  function normalizeContent(content) {
    return typeof content === "string" ? text(content) : content;
  }
  function normalizeChildren(children) {
    const list = Array.isArray(children) ? children : [children];
    return list.filter((child) => child.kind !== "empty");
  }
  function topLevelFragments(fragment) {
    return flattenSequence(fragment).filter((child) => child.kind !== "empty");
  }
  function validateFragment(fragment, path, ancestors, issues) {
    if (fragment.kind === "sequence") {
      fragment.children.forEach(
        (child, index) => validateFragment(child, [...path, `children[${index}]`], ancestors, issues)
      );
      return;
    }
    if (fragment.kind !== "element") return;
    const currentPath = path.join(".");
    const parent = ancestors[ancestors.length - 1];
    if (isVoidElement(fragment.tagName) && fragment.children.length > 0) {
      issues.push({
        severity: "error",
        path: currentPath,
        message: `Void element ${fragment.tagName} must not have children.`
      });
    }
    validateElementPlacement(fragment, parent, ancestors, currentPath, issues);
    validateRequiredAttributes(fragment, currentPath, issues);
    fragment.children.forEach(
      (child, index) => validateFragment(child, [...path, `children[${index}]`], [...ancestors, fragment], issues)
    );
  }
  function validateElementPlacement(fragment, parent, ancestors, path, issues) {
    if (fragment.tagName === "head" && parent?.tagName !== "html") {
      issues.push({
        severity: "warning",
        path,
        message: "head should be a direct child of html."
      });
    }
    if (fragment.tagName === "body" && parent?.tagName !== "html") {
      issues.push({
        severity: "warning",
        path,
        message: "body should be a direct child of html."
      });
    }
    if (fragment.tagName === "title" && parent?.tagName !== "head") {
      issues.push({
        severity: "warning",
        path,
        message: "title should be inside head."
      });
    }
    if (fragment.tagName === "style" && parent?.tagName !== "head") {
      issues.push({
        severity: "warning",
        path,
        message: "style should be inside head."
      });
    }
    if (fragment.tagName === "li" && parent?.tagName !== "ul" && parent?.tagName !== "ol") {
      issues.push({
        severity: "error",
        path,
        message: "li must be a child of ul or ol."
      });
    }
    if (fragment.tagName === "tr" && parent?.tagName !== "table" && !TABLE_SECTION_ELEMENTS.has(parent?.tagName ?? "")) {
      issues.push({
        severity: "error",
        path,
        message: "tr must be a child of table, thead, tbody, or tfoot."
      });
    }
    if ((fragment.tagName === "th" || fragment.tagName === "td") && parent?.tagName !== "tr") {
      issues.push({
        severity: "error",
        path,
        message: `${fragment.tagName} must be a child of tr.`
      });
    }
    if (fragment.tagName === "option" && parent?.tagName !== "select") {
      issues.push({
        severity: "error",
        path,
        message: "option must be a child of select."
      });
    }
    if (fragment.tagName === "form" && ancestors.some((ancestor) => ancestor.tagName === "form")) {
      issues.push({
        severity: "error",
        path,
        message: "form elements must not be nested."
      });
    }
  }
  function validateRequiredAttributes(fragment, path, issues) {
    if (fragment.tagName === "img" && !hasAttribute(fragment, "src")) {
      issues.push({ severity: "error", path, message: "img requires a src attribute." });
    }
    if (fragment.tagName === "img" && !hasAttribute(fragment, "alt")) {
      issues.push({ severity: "warning", path, message: "img should have an alt attribute." });
    }
    if (fragment.tagName === "a" && !hasAttribute(fragment, "href")) {
      issues.push({ severity: "warning", path, message: "a should have an href attribute." });
    }
    if (fragment.tagName === "iframe" && !hasAttribute(fragment, "src")) {
      issues.push({ severity: "error", path, message: "iframe requires a src attribute." });
    }
    if (fragment.tagName === "iframe" && !hasAttribute(fragment, "title")) {
      issues.push({ severity: "warning", path, message: "iframe should have a title attribute." });
    }
    if (fragment.tagName === "input" && !hasAttribute(fragment, "type")) {
      issues.push({ severity: "warning", path, message: "input should have a type attribute." });
    }
  }
  function validateDocumentElement(fragment, issues) {
    const elementChildren = fragment.children.filter((child) => child.kind === "element");
    const headIndex = elementChildren.findIndex((child) => child.tagName === "head");
    const bodyIndex = elementChildren.findIndex((child) => child.tagName === "body");
    if (bodyIndex === -1) {
      issues.push({ severity: "warning", path: "$[0]", message: "html should contain a body element." });
    }
    if (headIndex !== -1 && bodyIndex !== -1 && headIndex > bodyIndex) {
      issues.push({ severity: "warning", path: "$[0]", message: "head should appear before body." });
    }
    if (elementChildren.filter((child) => child.tagName === "head").length > 1) {
      issues.push({ severity: "warning", path: "$[0]", message: "html should not contain multiple head elements." });
    }
    if (elementChildren.filter((child) => child.tagName === "body").length > 1) {
      issues.push({ severity: "warning", path: "$[0]", message: "html should not contain multiple body elements." });
    }
  }
  function hasAttribute(fragment, name) {
    return Object.prototype.hasOwnProperty.call(fragment.attributes, name);
  }
  function flattenSequence(fragment) {
    if (fragment.kind === "sequence") return fragment.children.flatMap(flattenSequence);
    return [fragment];
  }
  function renderElement(fragment) {
    const attributes = Object.entries(fragment.attributes).sort(([left], [right]) => left.localeCompare(right)).map(([name, value]) => ` ${name}="${escapeAttribute(value)}"`).join("");
    if (isVoidElement(fragment.tagName)) return `<${fragment.tagName}${attributes}>`;
    if (fragment.tagName === "style") {
      return `<style${attributes}>${renderStyleContent(fragment)}</style>`;
    }
    return `<${fragment.tagName}${attributes}>${fragment.children.map(renderFragment).join("")}</${fragment.tagName}>`;
  }
  function renderStyleContent(fragment) {
    return fragment.children.map(renderCssFragment).join("");
  }
  function renderCssFragment(fragment) {
    switch (fragment.kind) {
      case "empty":
        return "";
      case "text":
        return escapeStyleText(fragment.value);
      case "sequence":
        return fragment.children.map(renderCssFragment).join("");
      case "element":
        return escapeStyleText(renderElement(fragment));
    }
  }
  function escapeStyleText(value) {
    return value.replace(/<\/style/giu, "<\\/style");
  }
  function normalizeTagName(tagName) {
    const normalized = tagName.trim().toLowerCase();
    if (!VALID_NAME.test(normalized) || FORBIDDEN_TAGS.has(normalized)) {
      throw new TypeError(`Unsafe or invalid HTML tag name: ${tagName}`);
    }
    return normalized;
  }
  function normalizeAttributeName(name) {
    const normalized = name.trim().toLowerCase();
    if (!VALID_NAME.test(normalized) || normalized.startsWith("on")) {
      throw new TypeError(`Unsafe or invalid HTML attribute name: ${name}`);
    }
    return normalized;
  }
  function validateSafeUrl(value) {
    const trimmed = value.trim();
    if (!SAFE_URL_PATTERN.test(trimmed)) {
      throw new TypeError(`Unsafe URL value: ${value}`);
    }
  }
  function normalizeProjectId(value) {
    const normalized = value.trim();
    if (!PROJECT_ID_PATTERN.test(normalized)) {
      throw new TypeError(`Invalid Scratch project ID: ${value}`);
    }
    return normalized;
  }
  function validatePackagedProjectSrc(value) {
    const trimmed = value.trim();
    if (trimmed.length === 0 || URL_SCHEME_PATTERN.test(trimmed) || trimmed.startsWith("//") || hasControlCharacter(trimmed)) {
      throw new TypeError(`Unsafe packaged project URL: ${value}`);
    }
  }
  function hasControlCharacter(value) {
    return [...value].some((character) => {
      const code = character.charCodeAt(0);
      return code <= 31 || code === 127;
    });
  }
  function normalizeFrameDimension(value, name) {
    const normalized = value.trim();
    if (!FRAME_DIMENSION_PATTERN.test(normalized)) {
      throw new TypeError(`Invalid iframe ${name}: ${value}`);
    }
    return normalized;
  }
  function projectFrame(src, titleText, width, height) {
    return {
      kind: "element",
      tagName: "iframe",
      attributes: {
        allowfullscreen: "",
        allowtransparency: "true",
        frameborder: "0",
        height: normalizeFrameDimension(height, "height"),
        loading: "lazy",
        scrolling: "no",
        src,
        style: "color-scheme: auto",
        title: titleText,
        width: normalizeFrameDimension(width, "width")
      },
      children: []
    };
  }
  function escapeText(value) {
    return value.replace(/&/gu, "&amp;").replace(/</gu, "&lt;").replace(/>/gu, "&gt;");
  }
  function escapeAttribute(value) {
    return escapeText(value).replace(/"/gu, "&quot;");
  }
  const SERIALIZED_PREFIX = "turbowarp-html:v1:";
  const blockDefinitions = definitions.blocks;
  class HtmlExtension {
    getInfo() {
      return {
        id: extensionConfig.id,
        name: Scratch.translate(definitions.extensionName),
        docsURI: extensionConfig.docsURI,
        blockIconURI: extensionConfig.blockIconURI,
        blocks: blockDefinitions.map((block) => this.toScratchBlock(block))
      };
    }
    text(args) {
      return encode(text(Scratch.Cast.toString(args.TEXT)));
    }
    element(args) {
      return encode(element(Scratch.Cast.toString(args.TAG), decodeOrText(args.CONTENT)));
    }
    withAttribute(args) {
      return encode(
        withAttribute(
          decodeRequired(args.ELEMENT),
          Scratch.Cast.toString(args.NAME),
          Scratch.Cast.toString(args.VALUE)
        )
      );
    }
    concat(args) {
      return encode(concat(decodeOrText(args.LEFT), decodeOrText(args.RIGHT)));
    }
    render(args) {
      return render(decodeOrText(args.FRAGMENT));
    }
    renderWithValidation(args) {
      return renderWithValidation(decodeOrText(args.FRAGMENT));
    }
    lastValidationErrors() {
      return getLastRenderValidationErrorText();
    }
    lastRenderHasValidationErrors() {
      return getLastRenderValidationErrors().length > 0;
    }
    validateHtml(args) {
      return formatValidationResult(validate(decodeOrText(args.FRAGMENT)));
    }
    isValidHtml(args) {
      return isValid(decodeOrText(args.FRAGMENT));
    }
    link(args) {
      return encode(link(decodeOrText(args.CONTENT), Scratch.Cast.toString(args.URL)));
    }
    externalLink(args) {
      return encode(externalLink(decodeOrText(args.CONTENT), Scratch.Cast.toString(args.URL)));
    }
    image(args) {
      return encode(image(Scratch.Cast.toString(args.SRC), Scratch.Cast.toString(args.ALT)));
    }
    turbowarpProjectFrame(args) {
      return encode(
        turbowarpProjectFrame(
          Scratch.Cast.toString(args.PROJECT_ID),
          Scratch.Cast.toString(args.TITLE),
          Scratch.Cast.toString(args.WIDTH),
          Scratch.Cast.toString(args.HEIGHT)
        )
      );
    }
    scratchProjectFrame(args) {
      return encode(
        scratchProjectFrame(
          Scratch.Cast.toString(args.PROJECT_ID),
          Scratch.Cast.toString(args.TITLE),
          Scratch.Cast.toString(args.WIDTH),
          Scratch.Cast.toString(args.HEIGHT)
        )
      );
    }
    packagedProjectFrame(args) {
      return encode(
        packagedProjectFrame(
          Scratch.Cast.toString(args.SRC),
          Scratch.Cast.toString(args.TITLE),
          Scratch.Cast.toString(args.WIDTH),
          Scratch.Cast.toString(args.HEIGHT)
        )
      );
    }
    html(args) {
      return encode(html(decodeOrText(args.CONTENT)));
    }
    head(args) {
      return encode(head(decodeOrText(args.CONTENT)));
    }
    body(args) {
      return encode(body(decodeOrText(args.CONTENT)));
    }
    title(args) {
      return encode(title(decodeOrText(args.CONTENT)));
    }
    style(args) {
      return encode(style(Scratch.Cast.toString(args.CSS)));
    }
    h1(args) {
      return encode(h1(decodeOrText(args.CONTENT)));
    }
    h2(args) {
      return encode(h2(decodeOrText(args.CONTENT)));
    }
    h3(args) {
      return encode(h3(decodeOrText(args.CONTENT)));
    }
    h4(args) {
      return encode(h4(decodeOrText(args.CONTENT)));
    }
    h5(args) {
      return encode(h5(decodeOrText(args.CONTENT)));
    }
    h6(args) {
      return encode(h6(decodeOrText(args.CONTENT)));
    }
    p(args) {
      return encode(p(decodeOrText(args.CONTENT)));
    }
    div(args) {
      return encode(div(decodeOrText(args.CONTENT)));
    }
    span(args) {
      return encode(span(decodeOrText(args.CONTENT)));
    }
    ul(args) {
      return encode(ul(decodeOrText(args.CONTENT)));
    }
    ol(args) {
      return encode(ol(decodeOrText(args.CONTENT)));
    }
    li(args) {
      return encode(li(decodeOrText(args.CONTENT)));
    }
    table(args) {
      return encode(table(decodeOrText(args.CONTENT)));
    }
    tr(args) {
      return encode(tr(decodeOrText(args.CONTENT)));
    }
    th(args) {
      return encode(th(decodeOrText(args.CONTENT)));
    }
    td(args) {
      return encode(td(decodeOrText(args.CONTENT)));
    }
    form(args) {
      return encode(form(decodeOrText(args.CONTENT)));
    }
    label(args) {
      return encode(label(decodeOrText(args.CONTENT)));
    }
    input() {
      return encode(input());
    }
    textarea(args) {
      return encode(textarea(decodeOrText(args.CONTENT)));
    }
    select(args) {
      return encode(select(decodeOrText(args.CONTENT)));
    }
    option(args) {
      return encode(option(decodeOrText(args.CONTENT)));
    }
    button(args) {
      return encode(button(decodeOrText(args.CONTENT)));
    }
    toScratchBlock(block) {
      return {
        opcode: block.opcode,
        blockType: Scratch.BlockType[block.blockType],
        text: Scratch.translate(block.text),
        arguments: Object.fromEntries(
          Object.entries(block.arguments).map(([name, argument]) => [
            name,
            {
              type: Scratch.ArgumentType[argument.type],
              defaultValue: argument.defaultValue
            }
          ])
        )
      };
    }
  }
  function encode(fragment) {
    return `${SERIALIZED_PREFIX}${JSON.stringify(fragment)}`;
  }
  function decodeOrText(value) {
    const raw = Scratch.Cast.toString(value);
    if (!raw.startsWith(SERIALIZED_PREFIX)) return text(raw);
    return parseFragment(raw.slice(SERIALIZED_PREFIX.length));
  }
  function decodeRequired(value) {
    const raw = Scratch.Cast.toString(value);
    if (!raw.startsWith(SERIALIZED_PREFIX)) {
      throw new TypeError("Expected an HTML element value from this extension.");
    }
    return parseFragment(raw.slice(SERIALIZED_PREFIX.length));
  }
  function parseFragment(json) {
    const parsed = JSON.parse(json);
    if (!isFragment(parsed)) throw new TypeError("Invalid serialized HTML fragment.");
    return parsed;
  }
  function isFragment(value) {
    if (typeof value !== "object" || value === null) return false;
    const record = value;
    if (record.kind === "empty") return true;
    if (record.kind === "text") return typeof record.value === "string";
    if (record.kind === "sequence") return Array.isArray(record.children) && record.children.every(isFragment);
    if (record.kind === "element") {
      return typeof record.tagName === "string" && typeof record.attributes === "object" && record.attributes !== null && !Array.isArray(record.attributes) && Object.values(record.attributes).every((entry) => typeof entry === "string") && Array.isArray(record.children) && record.children.every(isFragment);
    }
    return false;
  }
  Scratch.extensions.register(new HtmlExtension());

})(Scratch);
