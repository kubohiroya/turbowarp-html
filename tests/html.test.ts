import {describe, expect, it} from 'vitest';
import {
  body,
  concat,
  div,
  element,
  empty,
  externalLink,
  formatValidationResult,
  getLastRenderValidationErrorText,
  getLastRenderValidationErrors,
  getLastRenderValidationResult,
  h1,
  head,
  html,
  image,
  input,
  isValid,
  li,
  link,
  option,
  p,
  packagedProjectFrame,
  render,
  renderWithValidation,
  scratchProjectFrame,
  select,
  style,
  table,
  td,
  textarea,
  text,
  tr,
  turbowarpProjectFrame,
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

  it('renders empty fragments explicitly at the output boundary', () => {
    expect(render(empty)).toBe('');
    expect(render(concat(empty, empty))).toBe('');
    expect(formatValidationResult(validate(empty))).toContain('warning: $: HTML fragment is empty.');
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

  it('builds external links with new-tab safety attributes', () => {
    expect(render(externalLink('TurboWarp', 'https://turbowarp.org/'))).toBe(
      '<a href="https://turbowarp.org/" rel="noopener noreferrer" target="_blank">TurboWarp</a>'
    );
  });

  it('builds dedicated project iframes without allowing generic iframe elements', () => {
    expect(render(turbowarpProjectFrame('414716080', 'Example', '482', '412'))).toBe(
      '<iframe allowfullscreen="" allowtransparency="true" frameborder="0" height="412" loading="lazy" scrolling="no" src="https://turbowarp.org/414716080/embed" style="color-scheme: auto" title="Example" width="482"></iframe>'
    );
    expect(render(scratchProjectFrame('104', 'Scratch Example', '485', '402'))).toBe(
      '<iframe allowfullscreen="" allowtransparency="true" frameborder="0" height="402" loading="lazy" scrolling="no" src="https://scratch.mit.edu/projects/104/embed" style="color-scheme: auto" title="Scratch Example" width="485"></iframe>'
    );
    expect(render(packagedProjectFrame('./project.html', 'Packaged Example', '480', '360'))).toBe(
      '<iframe allowfullscreen="" allowtransparency="true" frameborder="0" height="360" loading="lazy" scrolling="no" src="./project.html" style="color-scheme: auto" title="Packaged Example" width="480"></iframe>'
    );
  });

  it('supports generic valid elements', () => {
    expect(render(element('article', p('news')))).toBe('<article><p>news</p></article>');
  });

  it('rejects dangerous names and URL schemes', () => {
    expect(() => element('script', text('alert(1)'))).toThrow('Unsafe or invalid HTML tag name');
    expect(() => element('iframe', text('blocked'))).toThrow('Unsafe or invalid HTML tag name');
    expect(() => withAttribute(div('x'), 'onclick', 'alert(1)')).toThrow(
      'Unsafe or invalid HTML attribute name'
    );
    expect(() => link('bad', 'javascript:alert(1)')).toThrow('Unsafe URL value');
    expect(() => turbowarpProjectFrame('abc')).toThrow('Invalid Scratch project ID');
    expect(() => packagedProjectFrame('https://example.com/project.html')).toThrow(
      'Unsafe packaged project URL'
    );
  });

  it('validates common successful structures', () => {
    const document = html(body(concat(h1('Server status'), p('ready'))));
    expect(validate(document)).toEqual({valid: true, issues: []});
    expect(isValid(table(tr(td('ok'))))).toBe(true);
  });

  it('renders educational style elements without allowing style-tag breakout', () => {
    expect(render(style('.card { color: red; }'))).toBe('<style>.card { color: red; }</style>');
    expect(render(style('</style><script>alert(1)</script>'))).toBe(
      '<style><\\/style><script>alert(1)</script></style>'
    );
  });

  it('warns when style is outside head and accepts style inside head', () => {
    expect(formatValidationResult(validate(style('.card{}')))).toContain(
      'warning: $[0]: style should be inside head.'
    );
    expect(validate(html(head(style('.card{}'))))).toEqual({
      valid: true,
      issues: [
        {
          severity: 'warning',
          path: '$[0]',
          message: 'html should contain a body element.'
        }
      ]
    });
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
