const tokenize = require('./tokenize');
// parse函数接受模板作为参数
function parse(str) {
  // 首先对模板进行标记化,得到tokens
  const tokens = tokenize(str);
  // 创建Root根节点
  const root = {
    type: 'Root',
    children: [],
  };
  // 创建 elementStack 栈, 起初只有Root根节点
  const elementStack = [root];
  // 开启一个while循环扫描tokens, 直到所有 Token 都被扫描完毕为止
  while (tokens.length) {
    // 获取当前栈顶节点作为父节点, parent
    const parent = elementStack[elementStack.length - 1];
    // 当前扫描的Token
    const t = tokens[0];
    switch (t.type) {
      case 'tag':
        // 如果当前Token是开始标签, 则创建 Element类型的AST节点
        const elementNode = {
          type: 'Element',
          tag: t.name,
          children: [],
        };
        // 将其添加到父节点的children中
        parent.children.push(elementNode);
        // 将当前节点压入栈
        elementStack.push(elementNode);
        break;
      case 'text':
        // 如果当前 Token 是文本, 则创建 Text 类型的AST节点
        const textNode = {
          type: 'Text',
          context: t.content,
        };
        // 将其添加到父节点的children中
        parent.children.push(textNode);
        break;
      case 'tagEnd':
        // 遇到结束标签, 将栈顶节点弹出
        elementStack.pop();
        break;
    }
    tokens.shift();
  }
  return root;
}

const ast = parse(`<div><p>Vue</p><p>Template</p></div>`);
console.log(JSON.stringify(ast, null, 2)); // zwj-log
