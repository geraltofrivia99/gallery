(this.webpackJsonpgal=this.webpackJsonpgal||[]).push([[0],[,,,,,,,function(e,t,n){e.exports=n(15)},,,,,function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t);var o=n(0),c=n.n(o),a=n(4),r=n.n(a),i=(n(12),n(1)),l=n(6),u=n(2),s=n(5),m=Object(o.memo)((function(e){var t=e.image,n=e.cacheImage,a=Object(o.useState)(!0===n[t]),r=Object(i.a)(a,2),l=r[0],u=r[1];return Object(o.useEffect)((function(){if(void 0===n[t]){var e=new Image(300,200);e.src=t,e.decode().then((function(){n[t]=!0,u(!0)})).catch((function(){n[t]=!1}))}}),[t]),l?c.a.createElement("img",{className:"image",src:t,alt:""}):c.a.createElement("div",{className:"image-placeholder"})}));var f=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(e){window.setTimeout(e,1e3/60)};function d(e,t,n,o,c){var a=o?e.scrollTop:e.scrollLeft,r=t-a,i=0;n="undefined"===typeof n?500:n;!function t(){var l,u=function(e,t,n,o){var c=(e/=o)*e,a=c*e;return t+n*(6*a*c+-15*c*c+10*a)}(i+=20,a,r,n);o?(l=u,e.scrollTop=l):function(t){e.scrollLeft=t}(u),i<n?f(t):c&&"function"===typeof c&&c()}()}var g={preventScroll:!0},h=(n(13),function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:20,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:15,n=1;return new Array(t).fill(0).map((function(t,o){return new Array(e).fill(0).map((function(e,t){return{image:"https://picsum.photos/id/".concat(n++,"/300/200"),cell:t,rowNumber:o}}))}))}()),v={},w=null,p=Object(o.memo)((function(e){var t=e.columnIndex,n=e.rowIndex,o=e.style,a=n%h.length,r=t%h[a].length,i=h[a][r],l=i.image,s=i.cell;return c.a.createElement("div",{id:n+":"+t,tabIndex:0,className:"cell-inner",key:t+" "+n,style:Object(u.a)(Object(u.a)({},o),{},{left:o.left+5,top:o.top+5,width:o.width-5,height:o.height-5})},c.a.createElement("div",{className:"image-container"},c.a.createElement(m,{image:l,cacheImage:v})),c.a.createElement("div",{className:"details"},c.a.createElement("span",{className:"title"},"Image number in row: ",s," "),c.a.createElement("span",{className:"info"},"Lorem ...")))})),b=Object(o.forwardRef)((function(e,t){var n=e.style,o=Object(l.a)(e,["style"]);return c.a.createElement("div",Object.assign({ref:t,style:Object(u.a)(Object(u.a)({},n),{},{paddingLeft:5,paddingTop:5})},o))})),E=function(){var e=Object(o.useRef)(),t=Object(o.useRef)(),n=Object(o.useCallback)(function(e,t){var n=!1;return function(){n||(e.apply(this,arguments),n=!0,setTimeout((function(){return n=!1}),t))}}((function(e){e.preventDefault(),e.stopPropagation(),87===e.keyCode?(w=87,r("UP")):83===e.keyCode?(w=83,r("DOWN")):65===e.keyCode?(w=65,r("LEFT")):68===e.keyCode&&(w=68,r("RIGHT"))}),300),[]),a=function(e){e&&e.focus(g)},r=function(e){if("LEFT"===e)a(document.activeElement.previousSibling);else if("RIGHT"===e)a(document.activeElement.nextSibling);else if("UP"===e){var t=document.activeElement.id.split(":"),n=Object(i.a)(t,2),o=n[0],c=n[1];a(document.getElementById("".concat(+o-1,":").concat(c)))}else{var r=document.activeElement.id.split(":"),l=Object(i.a)(r,2),u=l[0],s=l[1];a(document.getElementById("".concat(+u+1,":").concat(s)))}};return Object(o.useEffect)((function(){e.current.scrollToItem({align:"start",columnIndex:2e3,rowIndex:2e3}),setTimeout((function(){document.getElementById("".concat(2e3,":").concat(2e3)).focus(g)}),500)}),[]),c.a.createElement("div",{onFocus:function(n){var o=n.target.getBoundingClientRect(),c=o.left,a=o.right,r=o.top,i=o.bottom,l=e.current._outerRef,u=l.scrollTop,s=l.scrollLeft;if(83===w&&i>=window.innerHeight){var m=i-window.innerHeight+u;d(e.current._outerRef,m,1e3,!0)}else if(87===w&&r<=0){var f=u-Math.abs(r);d(e.current._outerRef,f,1e3,!0)}else if(68===w&&a>=t.current.offsetWidth){var g=a-t.current.offsetWidth+s;d(e.current._outerRef,g,1e3,!1)}else if(65===w&&c<=0){var h=s-Math.abs(c);d(e.current._outerRef,h,1e3,!1)}w=null},onKeyDown:n,ref:t},c.a.createElement(s.a,{className:"Grid",columnCount:4e3,columnWidth:function(){return 305},height:window.innerHeight,innerElementType:b,rowCount:4e3,rowHeight:function(){return 205},width:window.innerWidth,ref:e},p))};n(14);var y=function(){return c.a.createElement(E,null)};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(c.a.createElement(c.a.StrictMode,null,c.a.createElement(y,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}],[[7,1,2]]]);
//# sourceMappingURL=main.b0333350.chunk.js.map