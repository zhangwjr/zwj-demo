let arr = new Array(10000000);

let st1 = new Date().getTime();
arr.forEach(function (item) {

})
let et1 = new Date().getTime();
console.log('forEach:' + (et1 - st1) + 'ms');


let startTime = new Date().getTime()
for (let i = 0; i < arr.length; i++) {

}
let endTime = new Date().getTime();
console.log('for:' + (endTime - startTime) + 'ms');