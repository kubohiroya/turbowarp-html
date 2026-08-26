import {describe, expect, it} from 'vitest';
import {
  body,
  concat,
  div,
  element,
  formatValidationResult,
  getLastRenderValidationErrorText,
  getLastRenderValidationErrors,
  getLastRenderValidationResult,
  h1,
  html,
  image,
  input,
  isValid,
  li,
  link,
  p,
  option,
  render,
  renderWithValidation,
  select,
  table,
  td,
  textarea,
  text,
  tr,
  ul,
  validate,
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

  it('validates common successful structures', () => {
    const document = html(body(concat(h1('Server status'), p('ready'))));
    expect(validate(document)).toEqual({valid: true, issues: []});
    expect(isValid(table(tr(td('ok'))))).toBe(true);
  });

  it('reports validation errors for structural mistakes', () => {
    const result = validate(concat(li('orphan'), element('img', text('ignored'))));
    expect(result.valid).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          severity: 'error',
          message: 'li must be a child of ul or ol.'
        }),
        expect.objectContaining({
          severity: 'error',
          message: 'Void element img must not have children.'
        }),
        expect.objectContaining({
          severity: 'error',
          message: 'img requires a src attribute.'
        })
      ])
    );
  });

  it('keeps warning-only validation results valid', () => {
    const result = validate(input());
    expect(result.valid).toBe(true);
    expect(formatValidationResult(result)).toContain('warning: $[0]: input should have a type attribute.');
  });

  it('builds form controls and validates option placement', () => {
    const control = select(option('One'));
    expect(render(control)).toBe('<select><option>One</option></select>');
    expect(render(textarea('Notes <safe>'))).toBe('<textarea>Notes &lt;safe&gt;</textarea>');
    expect(validate(control)).toEqual({valid: true, issues: []});
    expect(formatValidationResult(validate(option('orphan')))).toContain(
      'error: $[0]: option must be a child of select.'
    );
  });

  it('stores validation errors only for validated renders', () => {
    renderWithValidation(input());
    expect(getLastRenderValidationResult().valid).toBe(true);
    expect(getLastRenderValidationErrors()).toEqual([]);
    expect(getLastRenderValidationErrorText()).toBe('');

    render(li('orphan'));
    expect(getLastRenderValidationResult().valid).toBe(true);
    expect(getLastRenderValidationErrors()).toEqual([]);
    expect(getLastRenderValidationErrorText()).toBe('');

    renderWithValidation(li('orphan'));
    expect(getLastRenderValidationResult().valid).toBe(false);
    expect(getLastRenderValidationErrors()).toEqual([
      expect.objectContaining({
        severity: 'error',
        path: '$[0]',
        message: 'li must be a child of ul or ol.'
      })
    ]);
    expect(getLastRenderValidationErrorText()).toBe('$[0]: li must be a child of ul or ol.');
  });
});
