import {
  append,
  div,
  element,
  h1,
  h2,
  h3,
  image,
  link,
  p,
  renderHtml,
  span,
  text,
  withAttribute,
  type HtmlElement,
  type HtmlNode,
} from './core.js';

const PREFIX = 'html:';

class NodeRegistry {
  private nextId = 1;
  private readonly values = new Map<string, HtmlNode>();

  put(value: HtmlNode): string {
    const id = `${PREFIX}${this.nextId++}`;
    this.values.set(id, value);
    return id;
  }

  get(value: unknown): HtmlNode {
    const key = String(value ?? '');
    return this.values.get(key) ?? text(key);
  }

  getElement(value: unknown): HtmlElement {
    const node = this.get(value);
    if (node.kind !== 'element') throw new TypeError('This block expects an HTML element.');
    return node;
  }
}

class HtmlExtension {
  private readonly registry = new NodeRegistry();

  getInfo() {
    const contentArg = {type: Scratch.ArgumentType.STRING, defaultValue: 'hello'};
    return {
      id: 'kubohiroyahtml',
      name: 'HTML Builder',
      docsURI: 'https://kubohiroya.github.io/turbowarp-html/',
      blockIconURI: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzU1NSIvPjx0ZXh0IHg9IjEyIiB5PSIxNiIgZm9udC1zaXplPSIxMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPjwvPjwvdGV4dD48L3N2Zz4=',
      blocks: [
        {opcode: 'text', blockType: Scratch.BlockType.REPORTER, text: 'text [TEXT]', arguments: {TEXT: contentArg}},
        {opcode: 'element', blockType: Scratch.BlockType.REPORTER, text: 'element [TAG] content [CONTENT]', arguments: {TAG: {type: Scratch.ArgumentType.STRING, defaultValue: 'section'}, CONTENT: contentArg}},
        {opcode: 'div', blockType: Scratch.BlockType.REPORTER, text: 'div [CONTENT]', arguments: {CONTENT: contentArg}},
        {opcode: 'span', blockType: Scratch.BlockType.REPORTER, text: 'span [CONTENT]', arguments: {CONTENT: contentArg}},
        {opcode: 'p', blockType: Scratch.BlockType.REPORTER, text: 'p [CONTENT]', arguments: {CONTENT: contentArg}},
        {opcode: 'h1', blockType: Scratch.BlockType.REPORTER, text: 'h1 [CONTENT]', arguments: {CONTENT: contentArg}},
        {opcode: 'h2', blockType: Scratch.BlockType.REPORTER, text: 'h2 [CONTENT]', arguments: {CONTENT: contentArg}},
        {opcode: 'h3', blockType: Scratch.BlockType.REPORTER, text: 'h3 [CONTENT]', arguments: {CONTENT: contentArg}},
        {opcode: 'link', blockType: Scratch.BlockType.REPORTER, text: 'link [CONTENT] URL [URL]', arguments: {CONTENT: contentArg, URL: {type: Scratch.ArgumentType.STRING, defaultValue: 'https://example.com/'}}},
        {opcode: 'image', blockType: Scratch.BlockType.REPORTER, text: 'image URL [URL] alt [ALT]', arguments: {URL: {type: Scratch.ArgumentType.STRING, defaultValue: '/image.png'}, ALT: {type: Scratch.ArgumentType.STRING, defaultValue: 'image'}}},
        {opcode: 'attribute', blockType: Scratch.BlockType.REPORTER, text: '[ELEMENT] with attribute [NAME] = [VALUE]', arguments: {ELEMENT: contentArg, NAME: {type: Scratch.ArgumentType.STRING, defaultValue: 'class'}, VALUE: {type: Scratch.ArgumentType.STRING, defaultValue: 'card'}}},
        {opcode: 'append', blockType: Scratch.BlockType.REPORTER, text: '[A] followed by [B]', arguments: {A: contentArg, B: contentArg}},
        {opcode: 'render', blockType: Scratch.BlockType.REPORTER, text: 'render HTML [CONTENT]', arguments: {CONTENT: contentArg}},
      ],
    };
  }

  text(args: {TEXT: unknown}) { return this.registry.put(text(args.TEXT)); }
  element(args: {TAG: unknown; CONTENT: unknown}) { return this.registry.put(element(args.TAG, this.registry.get(args.CONTENT))); }
  div(args: {CONTENT: unknown}) { return this.registry.put(div(this.registry.get(args.CONTENT))); }
  span(args: {CONTENT: unknown}) { return this.registry.put(span(this.registry.get(args.CONTENT))); }
  p(args: {CONTENT: unknown}) { return this.registry.put(p(this.registry.get(args.CONTENT))); }
  h1(args: {CONTENT: unknown}) { return this.registry.put(h1(this.registry.get(args.CONTENT))); }
  h2(args: {CONTENT: unknown}) { return this.registry.put(h2(this.registry.get(args.CONTENT))); }
  h3(args: {CONTENT: unknown}) { return this.registry.put(h3(this.registry.get(args.CONTENT))); }
  link(args: {CONTENT: unknown; URL: unknown}) { return this.registry.put(link(this.registry.get(args.CONTENT), args.URL)); }
  image(args: {URL: unknown; ALT: unknown}) { return this.registry.put(image(args.URL, args.ALT)); }
  attribute(args: {ELEMENT: unknown; NAME: unknown; VALUE: unknown}) { return this.registry.put(withAttribute(this.registry.getElement(args.ELEMENT), args.NAME, args.VALUE)); }
  append(args: {A: unknown; B: unknown}) { return this.registry.put(append(this.registry.get(args.A), this.registry.get(args.B))); }
  render(args: {CONTENT: unknown}) { return renderHtml(this.registry.get(args.CONTENT)); }
}

if (!Scratch.extensions.unsandboxed) throw new Error('HTML Builder must run unsandboxed.');
Scratch.extensions.register(new HtmlExtension());
