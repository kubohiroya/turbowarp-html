import {describe, expect, it} from 'vitest';
import {
  body,
  concat,
  div,
  element,
  h1,
  html,
  image,
  li,
  link,
  p,
  render,
  text,
  ul,
  withAttribute
} from '../src/html.js';

describe('HTML builder API', () => {
  it('escapes plain text and preserves Unicode', () => {
    expect(render(text('5 < 7 & 雨 > "sun"'))).toBe('5 &lt; 7 &amp; 雨 &gt; "sun"');
  });

  it('builds nested complete documents structurally', () => {
    const document = html(body(concat(h1('Server status'), p('ready'))));
    expect(render(document)).toBe('<html><body><h1>Server status</h1><p>ready</p></body></html>');
  });

  it('composes sibling fragments repeatedly', () => {
    const items = concat(concat(li('one'), li('two')), li('three'));
    expect(render(ul(items))).toBe('<ul><li>one</li><li>two</li><li>three</li></ul>');
  });

  it('adds attributes immutably and escapes attribute values', () => {
    const base = div('safe');
    const next = withAttribute(base, 'class', 'a "quoted" & checked');
    expect(render(base)).toBe('<div>safe</div>');
    expect(render(next)).toBe('<div class="a &quot;quoted&quot; &amp; checked">safe</div>');
  });

  it('renders void elements without closing tags', () => {
    expect(render(image('/status.png', 'Status <ok>'))).toBe(
      '<img alt="Status &lt;ok&gt;" src="/status.png">'
    );
  });

  it('supports generic valid elements', () => {
    expect(render(element('article', p('news')))).toBe('<article><p>news</p></article>');
  });

  it('rejects dangerous names and URL schemes', () => {
    expect(() => element('script', text('alert(1)'))).toThrow('Unsafe or invalid HTML tag name');
    expect(() => withAttribute(div('x'), 'onclick', 'alert(1)')).toThrow(
      'Unsafe or invalid HTML attribute name'
    );
    expect(() => link('bad', 'javascript:alert(1)')).toThrow('Unsafe URL value');
  });
});
