const useElement = (list) => {
  let element = [];
  for (let i of list) {
    element.push({
      target: document.createElement(i),
      set: function (attr, value) {
        this.target.setAttribute(attr, value);
      },
      text: function (value) {
        this.target.textContent = value;
      },
      removeAll: function () {
        this.target.innerHTML = "";
      },
      append: function () {
        let list = arguments;
        if (list !== 0) {
          for (let i of list) {
            this.target.appendChild(i.target);
          }
        }
      },
      removeChild: function (child) {
        this.target.removeChild(child.target);
      },
      
    });
  }
  return element;
};

const useRoot = (root) => {
  return [{
    target: document.getElementById(root),
    append: function (child) {
      this.target.appendChild(child.target);
    },
    removeAll: function () {
      this.target.innerHTML = "";
    },
    removeChild: function (child) {
      this.target.removeChild(child.target);
    }
  }];
}

const useListener = (type, node) => {
  let action = function (callback, useCapture) {
    node.target.addEventListener(type, callback, useCapture);
  };
  let removeAction = function () {
    node.target.removeEventListener(type, node.target, true);
  };
  return [action, removeAction];
};

const useStyle = function () {
  let children = arguments;
  let applyStyle = function (style) {
    for (let i in style) {
      Object.assign(children[i].target.style, style[i]);
    }
  };
  return [applyStyle];
};

let createPseudo = function (styleText) {
  let headData = [...document.head.children].toString().split(",");
  let styleTagContain = headData.filter(
    (data) => data === "[object HTMLStyleElement]"
  );

  if (styleTagContain.length === 1) {
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
};

const createFastElement = function (child) {
  return [
    {
      target: child,
      set: function (attr, value) {
        child.setAttribute(attr, value);
      },
      text: function (value) {
        child.textContent = value;
      },
      removeAll: function () {
        child.innerHTML = "";
      },
      append: function () {
        let list = arguments;
        if (list !== 0) {
          for (let i of list) {
            child.appendChild(i);
          }
        }
      },
      removeChild: function (child) {
        child.removeChild(child);
      },
    },
  ];
};

const useElementRepeat = function(ele,count){
  let result = [];
  for(let i = 0;i < count;i++){
    result.push(ele);
  }
  return result;
}