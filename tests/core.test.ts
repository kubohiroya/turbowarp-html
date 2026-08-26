import {describe, expect, it} from 'vitest';
import {append, div, h1, image, link, p, renderHtml, text, withAttribute} from '../src/core.js';

describe('HTML builder', () => {
  it('builds nested HTML', () => {
    const content = append(h1(text('Status')), p(text('Running')));
    expect(renderHtml(div(content))).toBe('<div><h1>Status</h1><p>Running</p></div>');
  });

  it('escapes text and attributes', () => {
    const node = withAttribute(div(text('<script>alert(1)</script>')), 'title', 'a"b');
    expect(renderHtml(node)).toBe('<div title="a&quot;b">&lt;script&gt;alert(1)&lt;/script&gt;</div>');
  });

  it('renders void elements correctly', () => {
    expect(renderHtml(image('/photo.png', 'Photo'))).toBe('<img src="/photo.png" alt="Photo">');
  });

  it('rejects event handlers', () => {
    expect(() => withAttribute(div(), 'onclick', 'alert(1)')).toThrow(/Event-handler/);
  });

  it('rejects unsafe URL schemes', () => {
    expect(() => link(text('x'), 'javascript:alert(1)')).toThrow(/Unsafe URL/);
  });

  it('supports safe absolute and relative URLs', () => {
    expect(renderHtml(link(text('x'), 'https://example.com/a?b=1&c=2'))).toBe('<a href="https://example.com/a?b=1&amp;c=2">x</a>');
    expect(renderHtml(link(text('x'), '/status'))).toBe('<a href="/status">x</a>');
  });
});
