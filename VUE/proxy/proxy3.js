// 用一个全局变量存储被注册的副作用函数
let activeEffect;
function effect(fn) {
  const effectFn = () => {
    // 清楚依赖集合
    cleanup(effectFn);
    // 当effectFn执行时, 将其设置为当前激活的副作用函数
    activeEffect = effectFn;
    fn();
  };
  // activeEffect.deps 用来储存所有与该副作用函数相关的依赖集合
  effectFn.deps = [];
  // 执行副作用函数
  effectFn();
}
const data = {
  ok: true,
  text: 'hello world',
};
// 储存副作用函数的桶
const bucket = new WeakMap();

const obj = new Proxy(data, {
  get(target, key) {
    // 将副作用函数activeEffect 添加到存储副作用函数的桶中
    track(target, key);
    // 返回属性值
    return target[key];
  },
  set(target, key, value) {
    // 设置属性值
    target[key] = value;
    // 把副作用函数从桶里取出并执行
    trigger(target, key);
  },
});
// 追踪变化
function track(target, key) {
  // 没有activeEffect, 直接返回
  if (!activeEffect) return target[key];
  // 根据target从“桶”中取得depsMap, 它也是一个Map类型: key --> effects
  let depsMap = bucket.get(target);
  // 如果不存在depsMap, 那么新建一个Map并与target关联
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()));
  }
  // 再根据 key 从 depsMap 中取得 deps,它是一个Set类型
  // 里面存储着所有与当前key相关联的副作用函数: effects
  let deps = depsMap.get(key);
  // 如果deps不存在, 同样新建一个 Set 并与 key 关联
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  // 最后将当前激活的副作用函数添加到依赖集合deps中
  deps.add(activeEffect);
  // deps就是一个与当前副作用函数存在联系的依赖集合
  // 将其添加到activeEffect.deps数组中
  activeEffect.deps.push(deps); //新增
  console.log('get----deps收集', key, deps); // zwj-log
}
// 触发变化
function trigger(target, key) {
  // 根据target 从桶里取得 depsMap, 它是 key --> effects
  const depsMap = bucket.get(target);
  console.log('set----depsMap', key, depsMap); // zwj-log
  if (!depsMap) return;
  // 根据key取得所有副作用函数 effects
  const effects = depsMap.get(key);
  console.log('set----effects', key, effects); // zwj-log

  const effectToRun = new Set(effects); // 新增
  // 执行副作用函数

  effectToRun && effectToRun.forEach((effectFn) => effectFn()); // 新增
  // effects && effects.forEach((fn) => fn());  // 删除
  console.log('执行完副作用函数'); // zwj-log
}
// 清除
function cleanup(effectFn) {
  // 遍历effectFn.deps数组
  for (let i = 0; i < effectFn.deps.length; i++) {
    // deps是依赖集合
    const deps = effectFn.deps[i];
    // 将effectFn从依赖数组中移除
    deps.delete(effectFn);
  }
  // 最后需要重置effectFn.deps 数组
  effectFn.deps.length = 0;
}
effect(() => {
  document.body.innerHTML = obj.ok ? obj.text : 'not';
});
