let activeEffect;
function effect(fn) {
  activeEffect = fn;
  fn();
}
const data = {
  text: 'hello world',
  ok: true,
};
// 储存副作用函数的桶
const bucket = new WeakMap();
const obj = new Proxy(data, {
  // 拦截读取操作
  get(target, key) {
    // 没有activeEffect, 直接返回
    if (!activeEffect) return target[key];
    // 根据target从“桶”中取得depsMap, 它也是一个Map类型: key --> effects
    let depsMap = bucket.get(target);
    console.log('depsMap', depsMap); // zwj-log
    // 如果不存在depsMap, 那么新建一个Map并与target关联
    if (!depsMap) {
      bucket.set(target, (depsMap = new Map()));
    }
    console.log('桶', bucket); // zwj-log
    // 再根据 key 从 depsMap 中取得 deps,它是一个Set类型
    // 里面存储着所有与当前key相关联的副作用函数: effects
    let deps = depsMap.get(key);
    // 如果deps不存在, 同样新建一个 Set 并与 key 关联
    if (!deps) {
      depsMap.set(key, (deps = new Set()));
    }
    console.log('depsMap', depsMap); // zwj-log
    // 最后将当前激活的副作用函数添加到“桶”里
    deps.add(activeEffect);
    console.log('deps----结束', key, deps); // zwj-log
    // 返回属性值
    return target[key];
  },
  // 拦截设置操作
  set(target, key, value) {
    // 设置属性值
    target[key] = value;
    // 根据target 从桶里取得 depsMap, 它是 key --> effects
    const depsMap = bucket.get(target);
    console.log('设置 depsMap', depsMap); // zwj-log
    if (!depsMap) return;
    // 根据key取得所有副作用函数 effects
    const effects = depsMap.get(key);
    // 执行副作用函数
    effects && effects.forEach((fn) => fn());
  },
});
effect(() => {
  document.body.innerHTML = obj.ok ? obj.text : 'not';
});
