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

export const empty: HtmlEmpty = {kind: 'empty'};

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
const FORBIDDEN_TAGS = new Set(['script', 'style', 'iframe', 'object', 'embed']);
const URL_ATTRIBUTES = new Set(['href', 'src']);
const SAFE_URL_PATTERN = /^(?:https?:|mailto:|tel:|\/|\.\/|\.\.\/|#|\?|$)/iu;

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
  switch (fragment.kind) {
    case 'empty':
      return '';
    case 'text':
      return escapeText(fragment.value);
    case 'sequence':
      return fragment.children.map(render).join('');
    case 'element':
      return renderElement(fragment);
  }
}

export function link(content: HtmlFragment | string, url: string): HtmlElement {
  return withAttribute(element('a', normalizeContent(content)), 'href', url);
}

export function image(src: string, alt: string): HtmlElement {
  return withAttribute(withAttribute(element('img'), 'src', src), 'alt', alt);
}

export function createElementFactory(tagName: string): (content?: HtmlFragment | string) => HtmlElement {
  return (content: HtmlFragment | string = empty) => element(tagName, normalizeContent(content));
}

export const html = createElementFactory('html');
export const head = createElementFactory('head');
export const body = createElementFactory('body');
export const title = createElementFactory('title');
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
  return `<${fragment.tagName}${attributes}>${fragment.children.map(render).join('')}</${
    fragment.tagName
  }>`;
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
