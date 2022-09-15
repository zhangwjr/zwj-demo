const bucket = new Set();

const data = { text: 'hello world' };

const obj = new Proxy(data, {
  get(target, key, receiver) {
    console.log('读取操作', receiver); // zwj-log
    return target[key];
  },
  set(target, key, value, receiver) {
    console.log('设置操作', receiver); // zwj-log
    target[key] = value;
    return true;
  },
});
console.log(obj.text); // zwj-log
obj.text = 'hello vue3';
