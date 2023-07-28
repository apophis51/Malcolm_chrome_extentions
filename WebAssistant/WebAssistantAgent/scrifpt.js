// for more information on manifest action https://developer.chrome.com/docs/extensions/mv3/content_scripts/

//alert("HACKED")
const allText = document.body.textContent;

const insertion = document.querySelector('body');
const div1  = document.createElement('div');
const p1 = document.createElement('p');
p1.textContent = "Traffic On [Date]";
const p2 = document.createElement('p');
p2.textContent = "NNew traffic on [Date]";
const p3 = document.createElement('p');
let locationNow = window.location.href;

console.log(locationNow)
p3.textContent = locationNow;


insertion.prepend(p1)
insertion.prepend(p3)
insertion.prepend(p2)
insertion.prepend(allText)
console.log(allText)

