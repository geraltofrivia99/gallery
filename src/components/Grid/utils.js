
function inOutQuintic(t, b, c, d) {
  var ts = (t/=d)*t,
  tc = ts*t;
  return b+c*(6*tc*ts + -15*ts*ts + 10*tc);
};

const requestAnimFrame = (function(){
    return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function( callback ){ window.setTimeout(callback, 1000 / 60); };
})();

export function scrollTo(scrollingEl, to, duration, isVertical, callback) {
    function moveVertical(amount) {
      scrollingEl.scrollTop = amount;
    }
    function moveHorizontal(amount) {
      scrollingEl.scrollLeft = amount;
    }
    function position() {
      return isVertical ? scrollingEl.scrollTop : scrollingEl.scrollLeft;
    }
    let start = position(),
      change = to - start,
      currentTime = 0,
      increment = 20;
    duration = (typeof(duration) === 'undefined') ? 500 : duration;
    const animateScroll = function() {
      currentTime += increment;
      var val = inOutQuintic(currentTime, start, change, duration);
      if (isVertical) {
          moveVertical(val);
      } else {
          moveHorizontal(val);
      }
      if (currentTime < duration) {
        requestAnimFrame(animateScroll);
      } else {
        if (callback && typeof(callback) === 'function') {
            callback();
        }
      }
    };
    animateScroll();
}


export function debounce(f, ms) {
  let isCooldown = false;
  return function() {
    if (isCooldown) return;
    f.apply(this, arguments);
    isCooldown = true;
    setTimeout(() => isCooldown = false, ms);
  };
}

