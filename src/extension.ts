import {extensionConfig} from './config';
import definitions from './block-definitions.json';
import {
  body,
  button,
  concat,
  div,
  element,
  form,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  head,
  getLastRenderValidationErrorText,
  getLastRenderValidationErrors,
  html,
  image,
  input,
  label,
  li,
  link,
  ol,
  option,
  p,
  render,
  renderWithValidation,
  select,
  span,
  style,
  table,
  td,
  textarea,
  text,
  th,
  title,
  tr,
  ul,
  formatValidationResult,
  isValid,
  validate,
  withAttribute,
  type HtmlFragment
} from './html';

type BlockTypeName = 'REPORTER' | 'BOOLEAN';
type ArgumentTypeName = 'STRING';

interface DefinitionArgument {
  type: ArgumentTypeName;
  defaultValue: string;
}

interface BlockDefinition {
  opcode: string;
  blockType: BlockTypeName;
  text: string;
  description: string;
  arguments: Record<string, DefinitionArgument>;
}

const SERIALIZED_PREFIX = 'turbowarp-html:v1:';
const blockDefinitions = definitions.blocks as readonly BlockDefinition[];

export class HtmlExtension implements TurboWarpExtension {
  public getInfo(): Record<string, unknown> {
    return {
      id: extensionConfig.id,
      name: Scratch.translate(definitions.extensionName),
      docsURI: extensionConfig.docsURI,
      blockIconURI: extensionConfig.blockIconURI,
      blocks: blockDefinitions.map((block) => this.toScratchBlock(block))
    };
  }

  public text(args: {TEXT: unknown}): string {
    return encode(text(Scratch.Cast.toString(args.TEXT)));
  }

  public element(args: {TAG: unknown; CONTENT: unknown}): string {
    return encode(element(Scratch.Cast.toString(args.TAG), decodeOrText(args.CONTENT)));
  }

  public withAttribute(args: {ELEMENT: unknown; NAME: unknown; VALUE: unknown}): string {
    return encode(
      withAttribute(
        decodeRequired(args.ELEMENT),
        Scratch.Cast.toString(args.NAME),
        Scratch.Cast.toString(args.VALUE)
      )
    );
  }

  public concat(args: {LEFT: unknown; RIGHT: unknown}): string {
    return encode(concat(decodeOrText(args.LEFT), decodeOrText(args.RIGHT)));
  }

  public render(args: {FRAGMENT: unknown}): string {
    return render(decodeOrText(args.FRAGMENT));
  }

  public renderWithValidation(args: {FRAGMENT: unknown}): string {
    return renderWithValidation(decodeOrText(args.FRAGMENT));
  }

  public lastValidationErrors(): string {
    return getLastRenderValidationErrorText();
  }

  public lastRenderHasValidationErrors(): boolean {
    return getLastRenderValidationErrors().length > 0;
  }

  public validateHtml(args: {FRAGMENT: unknown}): string {
    return formatValidationResult(validate(decodeOrText(args.FRAGMENT)));
  }

  public isValidHtml(args: {FRAGMENT: unknown}): boolean {
    return isValid(decodeOrText(args.FRAGMENT));
  }

  public link(args: {CONTENT: unknown; URL: unknown}): string {
    return encode(link(decodeOrText(args.CONTENT), Scratch.Cast.toString(args.URL)));
  }

  public image(args: {SRC: unknown; ALT: unknown}): string {
    return encode(image(Scratch.Cast.toString(args.SRC), Scratch.Cast.toString(args.ALT)));
  }

  public html(args: {CONTENT: unknown}): string {
    return encode(html(decodeOrText(args.CONTENT)));
  }

  public head(args: {CONTENT: unknown}): string {
    return encode(head(decodeOrText(args.CONTENT)));
  }

  public body(args: {CONTENT: unknown}): string {
    return encode(body(decodeOrText(args.CONTENT)));
  }

  public title(args: {CONTENT: unknown}): string {
    return encode(title(decodeOrText(args.CONTENT)));
  }

  public style(args: {CSS: unknown}): string {
    return encode(style(Scratch.Cast.toString(args.CSS)));
  }

  public h1(args: {CONTENT: unknown}): string {
    return encode(h1(decodeOrText(args.CONTENT)));
  }

  public h2(args: {CONTENT: unknown}): string {
    return encode(h2(decodeOrText(args.CONTENT)));
  }

  public h3(args: {CONTENT: unknown}): string {
    return encode(h3(decodeOrText(args.CONTENT)));
  }

  public h4(args: {CONTENT: unknown}): string {
    return encode(h4(decodeOrText(args.CONTENT)));
  }

  public h5(args: {CONTENT: unknown}): string {
    return encode(h5(decodeOrText(args.CONTENT)));
  }

  public h6(args: {CONTENT: unknown}): string {
    return encode(h6(decodeOrText(args.CONTENT)));
  }

  public p(args: {CONTENT: unknown}): string {
    return encode(p(decodeOrText(args.CONTENT)));
  }

  public div(args: {CONTENT: unknown}): string {
    return encode(div(decodeOrText(args.CONTENT)));
  }

  public span(args: {CONTENT: unknown}): string {
    return encode(span(decodeOrText(args.CONTENT)));
  }

  public ul(args: {CONTENT: unknown}): string {
    return encode(ul(decodeOrText(args.CONTENT)));
  }

  public ol(args: {CONTENT: unknown}): string {
    return encode(ol(decodeOrText(args.CONTENT)));
  }

  public li(args: {CONTENT: unknown}): string {
    return encode(li(decodeOrText(args.CONTENT)));
  }

  public table(args: {CONTENT: unknown}): string {
    return encode(table(decodeOrText(args.CONTENT)));
  }

  public tr(args: {CONTENT: unknown}): string {
    return encode(tr(decodeOrText(args.CONTENT)));
  }

  public th(args: {CONTENT: unknown}): string {
    return encode(th(decodeOrText(args.CONTENT)));
  }

  public td(args: {CONTENT: unknown}): string {
    return encode(td(decodeOrText(args.CONTENT)));
  }

  public form(args: {CONTENT: unknown}): string {
    return encode(form(decodeOrText(args.CONTENT)));
  }

  public label(args: {CONTENT: unknown}): string {
    return encode(label(decodeOrText(args.CONTENT)));
  }

  public input(): string {
    return encode(input());
  }

  public textarea(args: {CONTENT: unknown}): string {
    return encode(textarea(decodeOrText(args.CONTENT)));
  }

  public select(args: {CONTENT: unknown}): string {
    return encode(select(decodeOrText(args.CONTENT)));
  }

  public option(args: {CONTENT: unknown}): string {
    return encode(option(decodeOrText(args.CONTENT)));
  }

  public button(args: {CONTENT: unknown}): string {
    return encode(button(decodeOrText(args.CONTENT)));
  }

  private toScratchBlock(block: BlockDefinition): Record<string, unknown> {
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

function encode(fragment: HtmlFragment): string {
  return `${SERIALIZED_PREFIX}${JSON.stringify(fragment)}`;
}

function decodeOrText(value: unknown): HtmlFragment {
  const raw = Scratch.Cast.toString(value);
  if (!raw.startsWith(SERIALIZED_PREFIX)) return text(raw);
  return parseFragment(raw.slice(SERIALIZED_PREFIX.length));
}

function decodeRequired(value: unknown): HtmlFragment {
  const raw = Scratch.Cast.toString(value);
  if (!raw.startsWith(SERIALIZED_PREFIX)) {
    throw new TypeError('Expected an HTML element value from this extension.');
  }
  return parseFragment(raw.slice(SERIALIZED_PREFIX.length));
}

function parseFragment(json: string): HtmlFragment {
  const parsed = JSON.parse(json) as HtmlFragment;
  if (!isFragment(parsed)) throw new TypeError('Invalid serialized HTML fragment.');
  return parsed;
}

function isFragment(value: unknown): value is HtmlFragment {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  if (record.kind === 'empty') return true;
  if (record.kind === 'text') return typeof record.value === 'string';
  if (record.kind === 'sequence') return Array.isArray(record.children) && record.children.every(isFragment);
  if (record.kind === 'element') {
    return (
      typeof record.tagName === 'string' &&
      typeof record.attributes === 'object' &&
      record.attributes !== null &&
      !Array.isArray(record.attributes) &&
      Object.values(record.attributes).every((entry) => typeof entry === 'string') &&
      Array.isArray(record.children) &&
      record.children.every(isFragment)
    );
  }
  return false;
}
