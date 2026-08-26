export type HtmlFragment = HtmlText | HtmlElement | HtmlSequence | HtmlEmpty;

export interface HtmlText {
  readonly kind: 'text';
  readonly value: string;
}

export interface HtmlElement {
  readonly kind: 'element';
  readonly tagName: string;
  readonly attributes: Readonly<Record<string, string>>;
  readonly children: readonly HtmlFragment[];
}

export interface HtmlSequence {
  readonly kind: 'sequence';
  readonly children: readonly HtmlFragment[];
}

export interface HtmlEmpty {
  readonly kind: 'empty';
}

export type HtmlValidationSeverity = 'error' | 'warning';

export interface HtmlValidationIssue {
  readonly severity: HtmlValidationSeverity;
  readonly path: string;
  readonly message: string;
}

export interface HtmlValidationResult {
  readonly valid: boolean;
  readonly issues: readonly HtmlValidationIssue[];
}

export const empty: HtmlEmpty = {kind: 'empty'};

let lastRenderValidationResult: HtmlValidationResult = {valid: true, issues: []};

const VALID_NAME = /^[a-zA-Z][a-zA-Z0-9:-]*$/u;
const VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'source',
  'track',
  'wbr'
]);
const FORBIDDEN_TAGS = new Set(['script', 'iframe', 'object', 'embed']);
const URL_ATTRIBUTES = new Set(['href', 'src']);
const SAFE_URL_PATTERN = /^(?:https?:|mailto:|tel:|\/|\.\/|\.\.\/|#|\?|$)/iu;
const TABLE_SECTION_ELEMENTS = new Set(['tbody', 'thead', 'tfoot']);

export function text(value: string): HtmlText {
  return {kind: 'text', value};
}

export function element(
  tagName: string,
  children: HtmlFragment | readonly HtmlFragment[] = empty
): HtmlElement {
  const normalizedTagName = normalizeTagName(tagName);
  return {
    kind: 'element',
    tagName: normalizedTagName,
    attributes: {},
    children: normalizeChildren(children)
  };
}

export function withAttribute(fragment: HtmlFragment, name: string, value: string): HtmlElement {
  if (fragment.kind !== 'element') {
    throw new TypeError('Attributes can only be applied to HTML elements.');
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

export function concat(left: HtmlFragment, right: HtmlFragment): HtmlFragment {
  const children = [...flattenSequence(left), ...flattenSequence(right)].filter(
    (child) => child.kind !== 'empty'
  );
  if (children.length === 0) return empty;
  if (children.length === 1) return children[0] ?? empty;
  return {kind: 'sequence', children};
}

export function render(fragment: HtmlFragment): string {
  return renderFragment(fragment);
}

export function renderWithValidation(fragment: HtmlFragment): string {
  lastRenderValidationResult = validate(fragment);
  return renderFragment(fragment);
}

export function getLastRenderValidationResult(): HtmlValidationResult {
  return lastRenderValidationResult;
}

export function getLastRenderValidationErrors(): readonly HtmlValidationIssue[] {
  return lastRenderValidationResult.issues.filter((issue) => issue.severity === 'error');
}

export function formatValidationErrors(issues: readonly HtmlValidationIssue[]): string {
  if (issues.length === 0) return '';
  return issues.map((issue) => `${issue.path}: ${issue.message}`).join('\n');
}

export function getLastRenderValidationErrorText(): string {
  return formatValidationErrors(getLastRenderValidationErrors());
}

function renderFragment(fragment: HtmlFragment): string {
  switch (fragment.kind) {
    case 'empty':
      return '';
    case 'text':
      return escapeText(fragment.value);
    case 'sequence':
      return fragment.children.map(renderFragment).join('');
    case 'element':
      return renderElement(fragment);
  }
}

export function validate(fragment: HtmlFragment): HtmlValidationResult {
  const issues: HtmlValidationIssue[] = [];
  const roots = topLevelFragments(fragment);
  if (roots.length === 0) {
    issues.push({
      severity: 'warning',
      path: '$',
      message: 'HTML fragment is empty.'
    });
  } else if (roots.length > 1) {
    issues.push({
      severity: 'warning',
      path: '$',
      message: 'Top-level sequence has multiple roots; wrap a complete document in one html element.'
    });
  }

  for (const [index, child] of roots.entries()) {
    validateFragment(child, [`$[${index}]`], [], issues);
  }

  const singleRoot = roots.length === 1 ? roots[0] : undefined;
  if (singleRoot?.kind === 'element' && singleRoot.tagName === 'html') {
    validateDocumentElement(singleRoot, issues);
  }

  return {
    valid: issues.every((issue) => issue.severity !== 'error'),
    issues
  };
}

export function isValid(fragment: HtmlFragment): boolean {
  return validate(fragment).valid;
}

export function formatValidationResult(result: HtmlValidationResult): string {
  if (result.issues.length === 0) return 'valid';
  return result.issues
    .map((issue) => `${issue.severity}: ${issue.path}: ${issue.message}`)
    .join('\n');
}

export function link(content: HtmlFragment | string, url: string): HtmlElement {
  return withAttribute(element('a', normalizeContent(content)), 'href', url);
}

export function image(src: string, alt: string): HtmlElement {
  return withAttribute(withAttribute(element('img'), 'src', src), 'alt', alt);
}

export function style(css: string): HtmlElement {
  return element('style', text(css));
}

export function createElementFactory(tagName: string): (content?: HtmlFragment | string) => HtmlElement {
  return (content: HtmlFragment | string = empty) => element(tagName, normalizeContent(content));
}

export const html = createElementFactory('html');
export const head = createElementFactory('head');
export const body = createElementFactory('body');
export const title = createElementFactory('title');
export const styleElement = style;
export const h1 = createElementFactory('h1');
export const h2 = createElementFactory('h2');
export const h3 = createElementFactory('h3');
export const h4 = createElementFactory('h4');
export const h5 = createElementFactory('h5');
export const h6 = createElementFactory('h6');
export const p = createElementFactory('p');
export const div = createElementFactory('div');
export const span = createElementFactory('span');
export const ul = createElementFactory('ul');
export const ol = createElementFactory('ol');
export const li = createElementFactory('li');
export const table = createElementFactory('table');
export const tr = createElementFactory('tr');
export const th = createElementFactory('th');
export const td = createElementFactory('td');
export const form = createElementFactory('form');
export const label = createElementFactory('label');
export const input = createElementFactory('input');
export const textarea = createElementFactory('textarea');
export const select = createElementFactory('select');
export const option = createElementFactory('option');
export const button = createElementFactory('button');

export function isVoidElement(tagName: string): boolean {
  return VOID_ELEMENTS.has(tagName.toLowerCase());
}

export function normalizeContent(content: HtmlFragment | string): HtmlFragment {
  return typeof content === 'string' ? text(content) : content;
}

function normalizeChildren(children: HtmlFragment | readonly HtmlFragment[]): readonly HtmlFragment[] {
  const list = Array.isArray(children) ? children : [children];
  return list.filter((child) => child.kind !== 'empty');
}

function topLevelFragments(fragment: HtmlFragment): readonly HtmlFragment[] {
  return flattenSequence(fragment).filter((child) => child.kind !== 'empty');
}

function validateFragment(
  fragment: HtmlFragment,
  path: readonly string[],
  ancestors: readonly HtmlElement[],
  issues: HtmlValidationIssue[]
): void {
  if (fragment.kind === 'sequence') {
    fragment.children.forEach((child, index) =>
      validateFragment(child, [...path, `children[${index}]`], ancestors, issues)
    );
    return;
  }
  if (fragment.kind !== 'element') return;

  const currentPath = path.join('.');
  const parent = ancestors[ancestors.length - 1];
  if (isVoidElement(fragment.tagName) && fragment.children.length > 0) {
    issues.push({
      severity: 'error',
      path: currentPath,
      message: `Void element ${fragment.tagName} must not have children.`
    });
  }
  validateElementPlacement(fragment, parent, ancestors, currentPath, issues);
  validateRequiredAttributes(fragment, currentPath, issues);

  fragment.children.forEach((child, index) =>
    validateFragment(child, [...path, `children[${index}]`], [...ancestors, fragment], issues)
  );
}

function validateElementPlacement(
  fragment: HtmlElement,
  parent: HtmlElement | undefined,
  ancestors: readonly HtmlElement[],
  path: string,
  issues: HtmlValidationIssue[]
): void {
  if (fragment.tagName === 'head' && parent?.tagName !== 'html') {
    issues.push({
      severity: 'warning',
      path,
      message: 'head should be a direct child of html.'
    });
  }
  if (fragment.tagName === 'body' && parent?.tagName !== 'html') {
    issues.push({
      severity: 'warning',
      path,
      message: 'body should be a direct child of html.'
    });
  }
  if (fragment.tagName === 'title' && parent?.tagName !== 'head') {
    issues.push({
      severity: 'warning',
      path,
      message: 'title should be inside head.'
    });
  }
  if (fragment.tagName === 'style' && parent?.tagName !== 'head') {
    issues.push({
      severity: 'warning',
      path,
      message: 'style should be inside head.'
    });
  }
  if (fragment.tagName === 'li' && parent?.tagName !== 'ul' && parent?.tagName !== 'ol') {
    issues.push({
      severity: 'error',
      path,
      message: 'li must be a child of ul or ol.'
    });
  }
  if (fragment.tagName === 'tr' && parent?.tagName !== 'table' && !TABLE_SECTION_ELEMENTS.has(parent?.tagName ?? '')) {
    issues.push({
      severity: 'error',
      path,
      message: 'tr must be a child of table, thead, tbody, or tfoot.'
    });
  }
  if ((fragment.tagName === 'th' || fragment.tagName === 'td') && parent?.tagName !== 'tr') {
    issues.push({
      severity: 'error',
      path,
      message: `${fragment.tagName} must be a child of tr.`
    });
  }
  if (fragment.tagName === 'option' && parent?.tagName !== 'select') {
    issues.push({
      severity: 'error',
      path,
      message: 'option must be a child of select.'
    });
  }
  if (fragment.tagName === 'form' && ancestors.some((ancestor) => ancestor.tagName === 'form')) {
    issues.push({
      severity: 'error',
      path,
      message: 'form elements must not be nested.'
    });
  }
}

function validateRequiredAttributes(
  fragment: HtmlElement,
  path: string,
  issues: HtmlValidationIssue[]
): void {
  if (fragment.tagName === 'img' && !hasAttribute(fragment, 'src')) {
    issues.push({severity: 'error', path, message: 'img requires a src attribute.'});
  }
  if (fragment.tagName === 'img' && !hasAttribute(fragment, 'alt')) {
    issues.push({severity: 'warning', path, message: 'img should have an alt attribute.'});
  }
  if (fragment.tagName === 'a' && !hasAttribute(fragment, 'href')) {
    issues.push({severity: 'warning', path, message: 'a should have an href attribute.'});
  }
  if (fragment.tagName === 'input' && !hasAttribute(fragment, 'type')) {
    issues.push({severity: 'warning', path, message: 'input should have a type attribute.'});
  }
}

function validateDocumentElement(fragment: HtmlElement, issues: HtmlValidationIssue[]): void {
  const elementChildren = fragment.children.filter((child): child is HtmlElement => child.kind === 'element');
  const headIndex = elementChildren.findIndex((child) => child.tagName === 'head');
  const bodyIndex = elementChildren.findIndex((child) => child.tagName === 'body');
  if (bodyIndex === -1) {
    issues.push({severity: 'warning', path: '$[0]', message: 'html should contain a body element.'});
  }
  if (headIndex !== -1 && bodyIndex !== -1 && headIndex > bodyIndex) {
    issues.push({severity: 'warning', path: '$[0]', message: 'head should appear before body.'});
  }
  if (elementChildren.filter((child) => child.tagName === 'head').length > 1) {
    issues.push({severity: 'warning', path: '$[0]', message: 'html should not contain multiple head elements.'});
  }
  if (elementChildren.filter((child) => child.tagName === 'body').length > 1) {
    issues.push({severity: 'warning', path: '$[0]', message: 'html should not contain multiple body elements.'});
  }
}

function hasAttribute(fragment: HtmlElement, name: string): boolean {
  return Object.prototype.hasOwnProperty.call(fragment.attributes, name);
}

function flattenSequence(fragment: HtmlFragment): readonly HtmlFragment[] {
  if (fragment.kind === 'sequence') return fragment.children.flatMap(flattenSequence);
  return [fragment];
}

function renderElement(fragment: HtmlElement): string {
  const attributes = Object.entries(fragment.attributes)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([name, value]) => ` ${name}="${escapeAttribute(value)}"`)
    .join('');
  if (isVoidElement(fragment.tagName)) return `<${fragment.tagName}${attributes}>`;
  if (fragment.tagName === 'style') {
    return `<style${attributes}>${renderStyleContent(fragment)}</style>`;
  }
  return `<${fragment.tagName}${attributes}>${fragment.children.map(renderFragment).join('')}</${
    fragment.tagName
  }>`;
}

function renderStyleContent(fragment: HtmlElement): string {
  return fragment.children.map(renderCssFragment).join('');
}

function renderCssFragment(fragment: HtmlFragment): string {
  switch (fragment.kind) {
    case 'empty':
      return '';
    case 'text':
      return escapeStyleText(fragment.value);
    case 'sequence':
      return fragment.children.map(renderCssFragment).join('');
    case 'element':
      return escapeStyleText(renderElement(fragment));
  }
}

function escapeStyleText(value: string): string {
  return value.replace(/<\/style/giu, '<\\/style');
}

function normalizeTagName(tagName: string): string {
  const normalized = tagName.trim().toLowerCase();
  if (!VALID_NAME.test(normalized) || FORBIDDEN_TAGS.has(normalized)) {
    throw new TypeError(`Unsafe or invalid HTML tag name: ${tagName}`);
  }
  return normalized;
}

function normalizeAttributeName(name: string): string {
  const normalized = name.trim().toLowerCase();
  if (!VALID_NAME.test(normalized) || normalized.startsWith('on')) {
    throw new TypeError(`Unsafe or invalid HTML attribute name: ${name}`);
  }
  return normalized;
}

function validateSafeUrl(value: string): void {
  const trimmed = value.trim();
  if (!SAFE_URL_PATTERN.test(trimmed)) {
    throw new TypeError(`Unsafe URL value: ${value}`);
  }
}

function escapeText(value: string): string {
  return value.replace(/&/gu, '&amp;').replace(/</gu, '&lt;').replace(/>/gu, '&gt;');
}

function escapeAttribute(value: string): string {
  return escapeText(value).replace(/"/gu, '&quot;');
}
