export type HtmlNode = HtmlText | HtmlElement | HtmlFragment;
export type HtmlText = Readonly<{kind: 'text'; value: string}>;
export type HtmlElement = Readonly<{
  kind: 'element';
  tag: string;
  attributes: Readonly<Record<string, string>>;
  children: readonly HtmlNode[];
}>;
export type HtmlFragment = Readonly<{kind: 'fragment'; children: readonly HtmlNode[]}>;

const VOID_ELEMENTS = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
const BLOCKED_ELEMENTS = new Set(['script','iframe','object','embed']);

const freeze = <T>(value: T): Readonly<T> => Object.freeze(value);

export const text = (value: unknown): HtmlText => freeze({kind: 'text', value: String(value ?? '')});

export const fragment = (...children: readonly HtmlNode[]): HtmlFragment =>
  freeze({kind: 'fragment', children: freeze([...children])});

export function element(tag: unknown, content?: HtmlNode): HtmlElement {
  const normalized = normalizeTag(tag);
  const children = content ? (content.kind === 'fragment' ? [...content.children] : [content]) : [];
  if (VOID_ELEMENTS.has(normalized) && children.length > 0) {
    throw new TypeError(`<${normalized}> is a void element and cannot have children.`);
  }
  return freeze({kind: 'element', tag: normalized, attributes: freeze({}), children: freeze(children)});
}

export function append(a: HtmlNode, b: HtmlNode): HtmlFragment {
  return fragment(...flatten(a), ...flatten(b));
}

export function withAttribute(node: HtmlElement, name: unknown, value: unknown): HtmlElement {
  const attribute = normalizeAttributeName(name);
  if (/^on/i.test(attribute)) throw new TypeError('Event-handler attributes are not allowed.');
  const stringValue = String(value ?? '');
  if ((attribute === 'href' || attribute === 'src' || attribute === 'action' || attribute === 'formaction') && !isSafeUrl(stringValue)) {
    throw new TypeError(`Unsafe URL scheme in ${attribute}.`);
  }
  return freeze({
    ...node,
    attributes: freeze({...node.attributes, [attribute]: stringValue}),
    children: freeze([...node.children]),
  });
}

export const div = (content?: HtmlNode) => element('div', content);
export const span = (content?: HtmlNode) => element('span', content);
export const p = (content?: HtmlNode) => element('p', content);
export const h1 = (content?: HtmlNode) => element('h1', content);
export const h2 = (content?: HtmlNode) => element('h2', content);
export const h3 = (content?: HtmlNode) => element('h3', content);
export const body = (content?: HtmlNode) => element('body', content);
export const head = (content?: HtmlNode) => element('head', content);
export const html = (content?: HtmlNode) => element('html', content);
export const title = (content?: HtmlNode) => element('title', content);
export const ul = (content?: HtmlNode) => element('ul', content);
export const ol = (content?: HtmlNode) => element('ol', content);
export const li = (content?: HtmlNode) => element('li', content);
export const table = (content?: HtmlNode) => element('table', content);
export const tr = (content?: HtmlNode) => element('tr', content);
export const th = (content?: HtmlNode) => element('th', content);
export const td = (content?: HtmlNode) => element('td', content);
export const button = (content?: HtmlNode) => element('button', content);
export const label = (content?: HtmlNode) => element('label', content);
export const form = (content?: HtmlNode) => element('form', content);
export const input = () => element('input');

export function link(content: HtmlNode, url: unknown): HtmlElement {
  return withAttribute(element('a', content), 'href', url);
}

export function image(url: unknown, alt: unknown = ''): HtmlElement {
  return withAttribute(withAttribute(element('img'), 'src', url), 'alt', alt);
}

export function renderHtml(node: HtmlNode): string {
  switch (node.kind) {
    case 'text': return escapeText(node.value);
    case 'fragment': return node.children.map(renderHtml).join('');
    case 'element': {
      const attrs = Object.entries(node.attributes)
        .map(([name, value]) => ` ${name}="${escapeAttribute(value)}"`)
        .join('');
      if (VOID_ELEMENTS.has(node.tag)) return `<${node.tag}${attrs}>`;
      return `<${node.tag}${attrs}>${node.children.map(renderHtml).join('')}</${node.tag}>`;
    }
  }
}

function flatten(node: HtmlNode): HtmlNode[] {
  return node.kind === 'fragment' ? [...node.children] : [node];
}

function normalizeTag(tag: unknown): string {
  const value = String(tag ?? '').toLowerCase();
  if (!/^[a-z][a-z0-9-]*$/.test(value)) throw new TypeError('Invalid HTML tag name.');
  if (BLOCKED_ELEMENTS.has(value)) throw new TypeError(`<${value}> is not allowed by the safe HTML builder.`);
  return value;
}

function normalizeAttributeName(name: unknown): string {
  const value = String(name ?? '').toLowerCase();
  if (!/^[a-z_:][a-z0-9_:.-]*$/.test(value)) throw new TypeError('Invalid HTML attribute name.');
  return value;
}

function isSafeUrl(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed === '' || trimmed.startsWith('#') || trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('../')) return true;
  try {
    const url = new URL(trimmed, 'https://example.invalid/');
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol);
  } catch {
    return false;
  }
}

function escapeText(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttribute(value: string): string {
  return escapeText(value).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
