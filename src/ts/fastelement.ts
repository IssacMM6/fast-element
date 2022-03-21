// tsc --noEmitOnError --target es2015 ./fast_element.ts

export interface FastElement {
  target: HTMLElement | null;
  append: (node: Array<FastElement>) => this;
  set: (attr: string, value: string) => this;
  text: (value: string) => this;
  remove: (node: FastElement) => this;
  removeAll: () => this;
  class: (value: string) => this;
}

type FastEle = "fastelement";
type Ele = "element";
type action = (callback: Function, useCapture?: boolean) => void;
type removeAction = () => void;
type useListenterReturn = [action, removeAction];
type EleType<T> = T extends FastEle ? createFastElement : createElement;

type root = createElement;
type createFastElement = (elementId: HTMLElement | null) => Array<FastElement>;
type createElement = (elementId: string) => HTMLElement | null;
type classToggle = { ON: string; OFF: string };
type useListener = (
  type: keyof HTMLElementEventMap,
  fastElement: FastElement
) => useListenterReturn;
type useClassToggle = (args: classToggle) => classToggle;
type useRoot = (rootID: string) => Array<FastElement>;
type createPseudo = (styleText: string) => void;
type useElement = (tagName: Array<string>) => Array<FastElement>;
type useLink = (callback: Function) => void;
type repeat = (tagName: string, count: number) => Array<string>;
type applyStyle = (args: Object) => void;
type useStyle = (fastElement: Array<FastElement>) => Array<applyStyle>;
export type FastElementMethod = {
  useListener: useListener;
  useClassToggle: useClassToggle;
  createFastElement: createFastElement;
  createElement: createElement;
  root: root;
  useRoot: useRoot;
  createPseudo: createPseudo;
  useElement: useElement;
  useLink: useLink;
  repeat: repeat;
  useStyle: useStyle;
};

export function createElement(elementName: string): HTMLElement | null {
  return document.createElement(elementName);
}

export function root(elementId: string): HTMLElement | null {
  return document.getElementById(elementId);
}

export function createFastElement(
  elementId: HTMLElement | null
): Array<FastElement> {
  return [
    {
      target: elementId,
      append: function (args: Array<FastElement>) {
        for (let i of args) {
          this.target.appendChild(i.target);
        }
        return this;
      },
      set: function (attr: string, value: string) {
        this.target.setAttribute(attr, value);
        return this;
      },
      text: function (value: string) {
        this.target.textContent = value;
        return this;
      },
      remove: function (node: FastElement) {
        this.target.removeChild(node.target);
        return this;
      },
      removeAll: function () {
        this.target.innerHTML = "";
        return this;
      },
      class: function (value: string) {
        this.set("class", value);
        return this;
      },
    },
  ];
}

function initUseElement(
  createFastElement: EleType<FastEle>,
  createElement: EleType<Ele>
) {
  function useElement(tagName: Array<string>): Array<FastElement> {
    const generateFastelement = (elementName: string) => {
      const [FastElement] = createFastElement(createElement(elementName));
      return FastElement;
    };
    return tagName.map(generateFastelement);
  }

  return [useElement];
}

export const [useElement] = initUseElement(createFastElement, createElement);

function initUseRoot(createFastElement: EleType<FastEle>, root: root) {
  function useRoot(rootID: string): Array<FastElement> {
    return createFastElement(root(rootID));
  }

  return [useRoot];
}

export const [useRoot] = initUseRoot(createFastElement, root);

export function useListener(
  type: keyof HTMLElementEventMap,
  fastElement: FastElement
): useListenterReturn {
  function action(callback: Function, useCapture?: boolean): void {
    fastElement.target.addEventListener(type, callback as any, useCapture);
  }
  function removeAction(): void {
    fastElement.target.removeEventListener(
      type,
      fastElement.target as any,
      true
    );
  }
  return [action, removeAction];
}

export function useStyle(fastElement: Array<FastElement>): Array<applyStyle> {
  const fastElementArray = fastElement;
  let applyStyleArray = [];

  for (let i of fastElementArray) {
    function applyStyle(args:Object): void {
        Object.assign(i.target.style,args);
    }
    applyStyleArray.push(applyStyle);
  }

  return applyStyleArray;
}

export function repeat(tagName: string, count: number): Array<string> {
  let result = [];
  for (let i = 0; i < count; i++) {
    result.push(tagName);
  }
  return result;
}

export function useLink(callback: Function): void {
  const generate = callback();
  generate();
}

export function createPseudo(styleText: string): void {
  let headData = Array.from(document.head.children);
  let checkStyleTag = headData.filter(
    (i) => i.toString() === "[object HTMLStyleElement]"
  ).length;

  if (checkStyleTag === 1) {
    let styleElement = document.getElementsByTagName("style")[0];
    let existStyle = styleElement.textContent;
    let newStyle = styleText;
    styleElement.innerHTML =
      `${existStyle} /*new style added*/ ${newStyle}`.replace(/\s/g, "");
  } else {
    let styleElement = document.createElement("style");
    styleElement.appendChild(document.createTextNode(styleText));
    document.head.appendChild(styleElement);
  }
}

export function useClassToggle(args: classToggle): classToggle {
  return {
    ON: args.ON,
    OFF: args.OFF,
  };
}

export const FastElementMethodCollection: FastElementMethod = {
  useClassToggle,
  createPseudo,
  createElement,
  createFastElement,
  useElement,
  useLink,
  repeat,
  useStyle,
  useRoot,
  useListener,
  root,
};
