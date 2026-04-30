/**
 * Mystify Screensaver — Windows NT 4.0 style
 * Activates after 3 minutes of idle input on the desktop.
 * Bouncing color-shifting polylines with trail effect.
 */
(function () {
  var IDLE_TIMEOUT = 180000;
  var NUM_SHAPES = 3;
  var VERTICES_PER_SHAPE = 4;
  var TRAIL_ALPHA = 0.04;
  var HUE_SPEED = 0.5;
  var MIN_VELOCITY = 1.5;
  var MAX_VELOCITY = 3.0;

  var idleTimer = null;
  var screensaverActive = false;
  var animationId = null;
  var canvas = null;
  var ctx = null;
  var shapes = [];

  function randomRange(min, max) {
    return min + Math.random() * (max - min);
  }

  function randomVelocity() {
    var speed = randomRange(MIN_VELOCITY, MAX_VELOCITY);
    return Math.random() < 0.5 ? -speed : speed;
  }

  function createShape(numVertices, w, h) {
    var vertices = [];
    for (var i = 0; i < numVertices; i++) {
      vertices.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: randomVelocity(),
        vy: randomVelocity()
      });
    }
    return {
      vertices: vertices,
      hue: Math.random() * 360
    };
  }

  function updateShape(shape, w, h) {
    for (var i = 0; i < shape.vertices.length; i++) {
      var v = shape.vertices[i];
      v.x += v.vx;
      v.y += v.vy;
      if (v.x <= 0) { v.x = 0; v.vx = Math.abs(v.vx); }
      if (v.x >= w) { v.x = w; v.vx = -Math.abs(v.vx); }
      if (v.y <= 0) { v.y = 0; v.vy = Math.abs(v.vy); }
      if (v.y >= h) { v.y = h; v.vy = -Math.abs(v.vy); }
    }
    shape.hue = (shape.hue + HUE_SPEED) % 360;
  }

  function drawShape(context, shape) {
    context.beginPath();
    context.moveTo(shape.vertices[0].x, shape.vertices[0].y);
    for (var i = 1; i < shape.vertices.length; i++) {
      context.lineTo(shape.vertices[i].x, shape.vertices[i].y);
    }
    context.closePath();
    context.strokeStyle = 'hsl(' + Math.floor(shape.hue) + ', 100%, 50%)';
    context.lineWidth = 2;
    context.stroke();
  }

  function animationLoop() {
    var w = canvas.width;
    var h = canvas.height;

    ctx.fillStyle = 'rgba(0, 0, 0, ' + TRAIL_ALPHA + ')';
    ctx.fillRect(0, 0, w, h);

    for (var i = 0; i < shapes.length; i++) {
      updateShape(shapes[i], w, h);
      drawShape(ctx, shapes[i]);
    }

    animationId = requestAnimationFrame(animationLoop);
  }

  function activateScreensaver() {
    screensaverActive = true;

    canvas = document.createElement('canvas');
    canvas.id = 'screensaver';
    canvas.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; cursor:none;';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    shapes = [];
    for (var i = 0; i < NUM_SHAPES; i++) {
      shapes.push(createShape(VERTICES_PER_SHAPE, canvas.width, canvas.height));
    }

    animationId = requestAnimationFrame(animationLoop);
  }

  function dismissScreensaver() {
    if (!screensaverActive) return;
    screensaverActive = false;
    cancelAnimationFrame(animationId);
    if (canvas && canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
    canvas = null;
    ctx = null;
    animationId = null;
    shapes = [];
  }

  function resetIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(activateScreensaver, IDLE_TIMEOUT);
  }

  function handleInput() {
    if (screensaverActive) {
      dismissScreensaver();
    }
    resetIdleTimer();
  }

  var events = ['mousemove', 'keydown', 'click', 'scroll'];
  for (var i = 0; i < events.length; i++) {
    document.addEventListener(events[i], handleInput, false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', resetIdleTimer);
  } else {
    resetIdleTimer();
  }
})();
