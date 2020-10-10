
/* built-ins */
let sum = (...args) => args.reduce((acc, cur) => acc + cur);
let sub = (...args) => args.reduce((acc, cur) => acc - cur);
let equals = (...args) => args.every((val, i, arr) => val === arr[0]);
/* end built-ins */

let a = 1;
let b = 2;
let f = (x, y) => {return sum(a,b,x,y);};
f(3,4)
