import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {HtmlExtension} from '../src/extension.js';

beforeEach(() => {
  vi.stubGlobal('Scratch', {
    BlockType: {REPORTER: 'reporter', BOOLEAN: 'boolean'},
    ArgumentType: {STRING: 'string'},
    Cast: {
      toString: (value: unknown) => String(value),
      toNumber: (value: unknown) => Number(value),
      toBoolean: (value: unknown) => Boolean(value)
    },
    translate: (
      message: string | {default: string},
      placeholders: Record<string, string | number> = {}
    ) => {
      const value = typeof message === 'string' ? message : message.default;
      return Object.entries(placeholders).reduce(
        (result, [name, replacement]) => result.replace(`{${name}}`, String(replacement)),
        value
      );
    }
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('HtmlExtension', () => {
  it('publishes block metadata', () => {
    const info = new HtmlExtension().getInfo() as {name: string; blocks: Array<{opcode: string}>};
    expect(info.name).toBe('TurboWarp HTML');
    expect(info.blocks.map((block) => block.opcode)).toContain('render');
    expect(info.blocks.map((block) => block.opcode)).toContain('renderWithValidation');
    expect(info.blocks.map((block) => block.opcode)).toContain('validateHtml');
    expect(info.blocks.map((block) => block.opcode)).toContain('isValidHtml');
    expect(info.blocks.map((block) => block.opcode)).toContain('textarea');
    expect(info.blocks.map((block) => block.opcode)).toContain('select');
    expect(info.blocks.map((block) => block.opcode)).toContain('option');
    expect(info.blocks.map((block) => block.opcode)).toContain('style');
    expect(info.blocks.map((block) => block.opcode)).not.toContain('rawHtml');
  });

  it('builds and renders escaped content through reporter values', () => {
    const extension = new HtmlExtension();
    const heading = extension.h1({CONTENT: extension.text({TEXT: '<Ready>'})});
    const paragraph = extension.p({CONTENT: '5 & running'});
    const body = extension.body({CONTENT: extension.concat({LEFT: heading, RIGHT: paragraph})});
    expect(extension.render({FRAGMENT: extension.html({CONTENT: body})})).toBe(
      '<html><body><h1>&lt;Ready&gt;</h1><p>5 &amp; running</p></body></html>'
    );
  });

  it('supports immutable attribute chaining through reporter values', () => {
    const extension = new HtmlExtension();
    const card = extension.withAttribute({
      ELEMENT: extension.div({CONTENT: 'ok'}),
      NAME: 'class',
      VALUE: 'card'
    });
    expect(extension.render({FRAGMENT: card})).toBe('<div class="card">ok</div>');
  });

  it('builds form controls through reporter values', () => {
    const extension = new HtmlExtension();
    const choice = extension.option({CONTENT: 'Camera'});
    const select = extension.withAttribute({
      ELEMENT: extension.select({CONTENT: choice}),
      NAME: 'name',
      VALUE: 'source'
    });
    const notes = extension.textarea({CONTENT: 'Notes <escaped>'});

    expect(extension.render({FRAGMENT: extension.concat({LEFT: select, RIGHT: notes})})).toBe(
      '<select name="source"><option>Camera</option></select><textarea>Notes &lt;escaped&gt;</textarea>'
    );
  });

  it('builds educational CSS style blocks through reporter values', () => {
    const extension = new HtmlExtension();
    const style = extension.style({CSS: '.card { color: red; }'});
    const head = extension.head({CONTENT: style});

    expect(extension.render({FRAGMENT: head})).toBe('<head><style>.card { color: red; }</style></head>');
    expect(extension.render({FRAGMENT: extension.style({CSS: '</style><p>bad</p>'})})).toBe(
      '<style><\\/style><p>bad</p></style>'
    );
  });

  it('validates reporter-built fragments', () => {
    const extension = new HtmlExtension();
    const orphan = extension.li({CONTENT: 'orphan'});
    expect(extension.isValidHtml({FRAGMENT: orphan})).toBe(false);
    expect(extension.validateHtml({FRAGMENT: orphan})).toContain(
      'error: $[0]: li must be a child of ul or ol.'
    );
  });

  it('stores validation errors only from the validation render HTML call', () => {
    const extension = new HtmlExtension();
    expect(extension.lastRenderHasValidationErrors()).toBe(false);
    expect(extension.lastValidationErrors()).toBe('');

    extension.renderWithValidation({FRAGMENT: extension.input()});
    expect(extension.lastRenderHasValidationErrors()).toBe(false);
    expect(extension.lastValidationErrors()).toBe('');

    extension.render({FRAGMENT: extension.li({CONTENT: 'orphan'})});
    expect(extension.lastRenderHasValidationErrors()).toBe(false);
    expect(extension.lastValidationErrors()).toBe('');

    extension.renderWithValidation({FRAGMENT: extension.li({CONTENT: 'orphan'})});
    expect(extension.lastRenderHasValidationErrors()).toBe(true);
    expect(extension.lastValidationErrors()).toBe('$[0]: li must be a child of ul or ol.');
  });
});
