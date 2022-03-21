export function createElement(elementName) {
    return document.createElement(elementName);
}
export function root(elementId) {
    return document.getElementById(elementId);
}
export function createFastElement(elementId) {
    return [
        {
            target: elementId,
            append: function (args) {
                for (let i of args) {
                    this.target.appendChild(i.target);
                }
                return this;
            },
            set: function (attr, value) {
                this.target.setAttribute(attr, value);
                return this;
            },
            text: function (value) {
                this.target.textContent = value;
                return this;
            },
            remove: function (node) {
                this.target.removeChild(node.target);
                return this;
            },
            removeAll: function () {
                this.target.innerHTML = "";
                return this;
            },
            class: function (value) {
                this.set("class", value);
                return this;
            },
        },
    ];
}
function initUseElement(createFastElement, createElement) {
    function useElement(tagName) {
        const generateFastelement = (elementName) => {
            const [FastElement] = createFastElement(createElement(elementName));
            return FastElement;
        };
        return tagName.map(generateFastelement);
    }
    return [useElement];
}
export const [useElement] = initUseElement(createFastElement, createElement);
function initUseRoot(createFastElement, root) {
    function useRoot(rootID) {
        return createFastElement(root(rootID));
    }
    return [useRoot];
}
export const [useRoot] = initUseRoot(createFastElement, root);
export function useListener(type, fastElement) {
    function action(callback, useCapture) {
        fastElement.target.addEventListener(type, callback, useCapture);
    }
    function removeAction() {
        fastElement.target.removeEventListener(type, fastElement.target, true);
    }
    return [action, removeAction];
}
export function useStyle(fastElement) {
    const fastElementArray = fastElement;
    let applyStyleArray = [];
    for (let i of fastElementArray) {
        function applyStyle(args) {
            Object.assign(i.target.style, args);
        }
        applyStyleArray.push(applyStyle);
    }
    return applyStyleArray;
}
export function repeat(tagName, count) {
    let result = [];
    for (let i = 0; i < count; i++) {
        result.push(tagName);
    }
    return result;
}
export function useLink(callback) {
    const generate = callback();
    generate();
}
export function createPseudo(styleText) {
    let headData = Array.from(document.head.children);
    let checkStyleTag = headData.filter((i) => i.toString() === "[object HTMLStyleElement]").length;
    if (checkStyleTag === 1) {
        let styleElement = document.getElementsByTagName("style")[0];
        let existStyle = styleElement.textContent;
        let newStyle = styleText;
        styleElement.innerHTML =
            `${existStyle} /*new style added*/ ${newStyle}`.replace(/\s/g, "");
    }
    else {
        let styleElement = document.createElement("style");
        styleElement.appendChild(document.createTextNode(styleText));
        document.head.appendChild(styleElement);
    }
}
export function useClassToggle(args) {
    return {
        ON: args.ON,
        OFF: args.OFF,
    };
}
export const FastElementMethodCollection = {
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
