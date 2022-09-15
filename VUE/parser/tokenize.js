// 定义状态机的状态
const State = {
  initial: 1, // 初始状态
  tagOpen: 2, // 标签开始状态
  tagName: 3, // 标签名称状态
  text: 4, // 文本状态
  tagEnd: 5, // 结束标签状态
  tagEndName: 6, // 结束标签名称状态
};
function isAlpha(char) {
  return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
}
// 接受模板字符串作为参数，并将模板切割为Token返回
function tokenize(str) {
  // 状态机的当前状态为初始状态
  let currentState = State.initial;
  // 用于缓存字符
  const chars = [];
  // 生成的Token会存储到tokens数组中
  const tokens = [];
  while (str) {
    const char = str[0];
    switch (currentState) {
      // 状态机处于初始状态
      case State.initial:
        if (char === '<') {
          // 1. 状态机切换到标签开始转态
          currentState = State.tagOpen;
          // 2. 消费字符 '<'
          str = str.slice(1);
        } else if (isAlpha(char)) {
          // 1. 遇到字母, 切换到文本状态
          currentState = State.text;
          // 2. 将当前字母缓存到chars数组
          chars.push(char);
          // 3. 消费当前字符
          str = str.slice(1);
        }
        break;
      // 状态机处于标签开始状态
      case State.tagOpen:
        if (isAlpha(char)) {
          // 1.遇到字母,切换到标签名称状态
          currentState = State.tagName;
          // 2.将当前字符缓存到chars数组
          chars.push(char);
          // 3.消费当前字符
          str = str.slice(1);
        } else if (char === '/') {
          // 1.遇到字符/ ,切换到结束标签状态
          currentState = State.tagEnd;
          // 2.消费字符/
          str = str.slice(1);
        }
        break;
      // 状态机处于标签名称状态
      case State.tagName:
        if (isAlpha(char)) {
          // 1.遇到字母,由于当前处于标签名称状态,所以不需要切换状态
          // 但需要将当前字符缓存到chars数组
          chars.push(char);
          // 2.消费当前字符
          str = str.slice(1);
        } else if (char === '>') {
          // 1.遇到字符> ,切换到初始转
          currentState = State.initial;
          // 2.同时创建一个标签Token,并添加到tokens数组中
          // 注意,此时chars数组中缓存的字符就是标签名称
          tokens.push({
            type: 'tag',
            name: chars.join(''),
          });
          // 3.chars数组的内容已经被消费,清空它
          chars.length = 0;
          // 4.同时消费当前字符 >
          str = str.slice(1);
        }
        break;
      // 状态机处于文本状态
      case State.text:
        if (isAlpha(char)) {
          chars.push(char);
          str = str.slice(1);
        } else if (char === '<') {
          currentState = State.tagOpen;
          tokens.push({
            type: 'text',
            context: chars.join(''),
          });
          chars.length = 0;
          str = str.slice(1);
        }
        break;
      // 状态机处于标签结束状态
      case State.tagEnd:
        if (isAlpha(char)) {
          currentState = State.tagEndName;
          chars.push(char);
          str = str.slice(1);
        }
        break;
      // 状态机处于标签结束名称状态
      case State.tagEndName:
        if (isAlpha(char)) {
          chars.push(char);
          str = str.slice(1);
        } else if (char === '>') {
          currentState = State.initial;
          tokens.push({
            type: 'tagEnd',
            name: chars.join(''),
          });
          chars.length = 0;
          str = str.slice(1);
        }
        break;

      default:
        break;
    }
  }
  return tokens;
}
module.exports = tokenize;
// const tokens = tokenize(`<div><p>Vue</p><p>Template</p></div>`);
// console.log(tokens); // zwj-log
