"use strict";

function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector("#canvas");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  // setup GLSL program
  var program = webglUtils.createProgramFromScripts(gl, [
    "vertex-shader-3d",
    "fragment-shader-3d",
  ]);

  // look up where the vertex data needs to go.
  var positionLocation = gl.getAttribLocation(program, "a_position");
  var colorLocation = gl.getAttribLocation(program, "a_color");

  // lookup uniforms
  var matrixLocation = gl.getUniformLocation(program, "u_matrix");

  // Create a buffer to put positions in
  var positionBuffer = gl.createBuffer();
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // Put geometry data into buffer
  setGeometry(gl);

  // Create a buffer to put colors in
  var colorBuffer = gl.createBuffer();
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = colorBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  // Put geometry data into buffer
  setColors(gl);

  function radToDeg(r) {
    return (r * 180) / Math.PI;
  }

  function degToRad(d) {
    return (d * Math.PI) / 180;
  }

  var translation = [30, 16, 0];
  var rotation = [degToRad(0), degToRad(67), degToRad(16)];
  var scale = [1, 1, 1];

  drawScene();

  // Setup a ui.
  webglLessonsUI.setupSlider("#x", {
    value: translation[0],
    slide: updatePosition(0),
    max: gl.canvas.width,
  });
  webglLessonsUI.setupSlider("#y", {
    value: translation[1],
    slide: updatePosition(1),
    max: gl.canvas.height,
  });
  webglLessonsUI.setupSlider("#z", {
    value: translation[2],
    slide: updatePosition(2),
    max: gl.canvas.height,
  });
  webglLessonsUI.setupSlider("#angleX", {
    value: radToDeg(rotation[0]),
    slide: updateRotation(0),
    max: 360,
  });
  webglLessonsUI.setupSlider("#angleY", {
    value: radToDeg(rotation[1]),
    slide: updateRotation(1),
    max: 360,
  });
  webglLessonsUI.setupSlider("#angleZ", {
    value: radToDeg(rotation[2]),
    slide: updateRotation(2),
    max: 360,
  });
  webglLessonsUI.setupSlider("#scaleX", {
    value: scale[0],
    slide: updateScale(0),
    min: -5,
    max: 5,
    step: 0.01,
    precision: 2,
  });
  webglLessonsUI.setupSlider("#scaleY", {
    value: scale[1],
    slide: updateScale(1),
    min: -5,
    max: 5,
    step: 0.01,
    precision: 2,
  });
  webglLessonsUI.setupSlider("#scaleZ", {
    value: scale[2],
    slide: updateScale(2),
    min: -5,
    max: 5,
    step: 0.01,
    precision: 2,
  });

  function updatePosition(index) {
    return function (event, ui) {
      translation[index] = ui.value;
      drawScene();
    };
  }

  function updateRotation(index) {
    return function (event, ui) {
      var angleInDegrees = ui.value;
      var angleInRadians = (angleInDegrees * Math.PI) / 180;
      rotation[index] = angleInRadians;
      drawScene();
    };
  }

  function updateScale(index) {
    return function (event, ui) {
      scale[index] = ui.value;
      drawScene();
    };
  }

  // Draw the scene.
  function drawScene() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.DEPTH_TEST);

    // Clear the canvas.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Turn on culling. By default backfacing triangles
    // will be culled.
    // gl.enable(gl.CULL_FACE);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the position attribute
    gl.enableVertexAttribArray(positionLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 3; // 3 components per iteration
    var type = gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
      positionLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );

    // Turn on the color attribute
    gl.enableVertexAttribArray(colorLocation);

    // Bind the color buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
    var size = 3; // 3 components per iteration
    var type = gl.UNSIGNED_BYTE; // the data is 8bit unsigned values
    var normalize = true; // normalize the data (convert from 0-255 to 0-1)
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
      colorLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );

    // ortographic projection
    var left = 0;
    var right = gl.canvas.clientWidth;
    var bottom = gl.canvas.clientHeight;
    var top = 0;
    var near = 800;
    var far = -800;
    var matrix = m4.oblique(left, right, bottom, top, near, far);

    // // Compute the matrices
    // var matrix = m4.projection(
    //   gl.canvas.clientWidth,
    //   gl.canvas.clientHeight,
    //   800
    // );
    matrix = m4.translate(
      matrix,
      translation[0],
      translation[1],
      translation[2]
    );
    matrix = m4.xRotate(matrix, rotation[0]);
    matrix = m4.yRotate(matrix, rotation[1]);
    matrix = m4.zRotate(matrix, rotation[2]);
    matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);

    // Set the matrix.
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    // Draw the geometry.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 48 * 6;
    gl.drawArrays(primitiveType, offset, count);
  }
}

var m4 = {
  projection: function (width, height, depth) {
    // Note: This matrix flips the Y axis so 0 is at the top.
    return [
      2 / width,
      0,
      0,
      0,
      0,
      -2 / height,
      0,
      0,
      0,
      0,
      2 / depth,
      0,
      -1,
      1,
      0,
      1,
    ];
  },

  getShearMatrix : function (theta, phi) {
    return[
      1,0,-1/Math.tan(m4.degToRad(theta)),0,
      0,1,-1/Math.tan(m4.degToRad(phi)),0,
      0,0,1,0,
      0,0,0,1
  ];
  },

  degToRad : function (d) {
    return d * Math.PI / 180;
  },

  // oblique projection matrix
  oblique: function (left, right, bottom, top, near, far) {
    var shx = 0.1;
    var shy = 0.4;
    var O = [
      2 / (right - left), 0, 0, 0,
      0, 2 / (top - bottom), 0, 0,
      shx * (2 / (right - left)), shy * (2 / (top - bottom)), 2 / (near - far), 0,
      -(right + left) / (right - left), -(top + bottom) / (top - bottom), -(near + far) / (near - far), 1
    ];    

    return O;

  },

  orthographic: function (left, right, bottom, top, near, far) {
    return [
      2 / (right - left), 0, 0, 0,
      0, 2 / (top - bottom), 0, 0,
      0, 0, 2 / (near - far), 0,

      (left + right) / (left - right),
      (bottom + top) / (bottom - top),
      (near + far) / (near - far),
      1,
    ];
  },

  multiply: function (a, b) {
    var a00 = a[0 * 4 + 0];
    var a01 = a[0 * 4 + 1];
    var a02 = a[0 * 4 + 2];
    var a03 = a[0 * 4 + 3];
    var a10 = a[1 * 4 + 0];
    var a11 = a[1 * 4 + 1];
    var a12 = a[1 * 4 + 2];
    var a13 = a[1 * 4 + 3];
    var a20 = a[2 * 4 + 0];
    var a21 = a[2 * 4 + 1];
    var a22 = a[2 * 4 + 2];
    var a23 = a[2 * 4 + 3];
    var a30 = a[3 * 4 + 0];
    var a31 = a[3 * 4 + 1];
    var a32 = a[3 * 4 + 2];
    var a33 = a[3 * 4 + 3];
    var b00 = b[0 * 4 + 0];
    var b01 = b[0 * 4 + 1];
    var b02 = b[0 * 4 + 2];
    var b03 = b[0 * 4 + 3];
    var b10 = b[1 * 4 + 0];
    var b11 = b[1 * 4 + 1];
    var b12 = b[1 * 4 + 2];
    var b13 = b[1 * 4 + 3];
    var b20 = b[2 * 4 + 0];
    var b21 = b[2 * 4 + 1];
    var b22 = b[2 * 4 + 2];
    var b23 = b[2 * 4 + 3];
    var b30 = b[3 * 4 + 0];
    var b31 = b[3 * 4 + 1];
    var b32 = b[3 * 4 + 2];
    var b33 = b[3 * 4 + 3];
    return [
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ];
  },

  translation: function (tx, ty, tz) {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1];
  },

  xRotation: function (angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
  },

  yRotation: function (angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
  },

  zRotation: function (angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  },

  scaling: function (sx, sy, sz) {
    return [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1];
  },

  translate: function (m, tx, ty, tz) {
    return m4.multiply(m, m4.translation(tx, ty, tz));
  },

  xRotate: function (m, angleInRadians) {
    return m4.multiply(m, m4.xRotation(angleInRadians));
  },

  yRotate: function (m, angleInRadians) {
    return m4.multiply(m, m4.yRotation(angleInRadians));
  },

  zRotate: function (m, angleInRadians) {
    return m4.multiply(m, m4.zRotation(angleInRadians));
  },

  scale: function (m, sx, sy, sz) {
    return m4.multiply(m, m4.scaling(sx, sy, sz));
  },

  // shear matrix
};

// Fill the buffer with the values that define a letter 'F'.
function setGeometry(gl) {
  // buffer data for HOLLOW CUBE
  let a = 150.0
  let b = 25.0
  let c = a+b
  let d = a+2*b
  let e = b
  let f = 87.5
  let g = f + b

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
        // solid hollow cube
        // bottom face
        0, d, 0, b, d, d, b, d, 0, b, d, d, 0, d, 0, 0, d, d,
        //
        c, d, 0, d, d, d, d, d, 0, d, d, d, c, d, 0, c, d, d,
        //
        b, d, 0, c, d, b, c, d, 0, c, d, b, b, d, 0, b, d, b,
        //
        b, d, c, c, d, d, c, d, c, c, d, d, b, d, c, b, d, d,
        // inside border bottom face
        b, d, b, b, c, c, b, c, b, b, c, c, b, d, b, b, d, c,
        //
        c, d, b, c, c, c, c, d, c, c, c, c, c, d, b, c, c, b, 
        //
        b, d, b, c, c, b, c, d, b, c, c, b, b, d, b, b, c, b, 
        //
        b, d, c, c, c, c, b, c, c, c, c, c, b, d, c, c, d, c, 
        // outside border bottom face
        0, d, 0, 0, c, d, 0, c, 0, 0, c, d, 0, d, 0, 0, d, d,
        //
        d, d, 0, d, c, d, d, d, d, d, c, d, d, d, 0, d, c, 0, 
        //
        0, d, 0, d, c, 0, d, d, 0, d, c, 0, 0, d, 0, 0, c, 0, 
        //
        0, d, d, d, c, d, 0, c, d, d, c, d, 0, d, d, d, d, d, 
        // top face
        0, c, 0, b, c, d, b, c, 0, b, c, d, 0, c, 0, 0, c, d,
        //
        c, c, 0, d, c, d, d, c, 0, d, c, d, c, c, 0, c, c, d,
        //
        b, c, 0, c, c, b, c, c, 0, c, c, b, b, c, 0, b, c, b,
        //
        b, c, c, c, c, d, c, c, c, c, c, d, b, c, c, b, c, d,
        // top pyramid
        f, e, f, g, e, g, g, e, f, g, e, g, f, e, f, f, e, g,
        //side 1
        0, c, 0, f, e, g, f, e, f, f, e, g, 0, c, 0, 0, c, b,
        b, c, 0, f, e, f, g, e, f, f, e, f, b, c, 0, 0, c, 0,
        b, c, b, g, e, f, g, e, g, g, e, f, b, c, b, b, c, 0,
        0, c, b, g, e, g, f, e, g, g, e, g, 0, c, b, b, c, b,
        //side 2
        0, c, d, f, e, f, f, e, g, f, e, f, 0, c, d, 0, c, c,
        b, c, d, f, e, g, g, e, g, f, e, g, b, c, d, 0, c, d,
        b, c, c, g, e, g, g, e, f, g, e, g, b, c, c, b, c, d,
        0, c, c, g, e, f, f, e, f, g, e, f, 0, c, c, b, c, c,
        //side 3
        d, c, 0, g, e, g, g, e, f, g, e, g, d, c, 0, d, c, b,
        c, c, 0, g, e, f, f, e, f, g, e, f, c, c, 0, d, c, 0,
        c, c, b, f, e, f, f, e, g, f, e, f, c, c, b, c, c, 0,
        d, c, b, f, e, g, g, e, g, f, e, g, d, c, b, c, c, b,
        //side 4
        d, c, d, g, e, f, g, e, g, g, e, f, d, c, d, d, c, c,
        c, c, d, g, e, g, f, e, g, g, e, g, c, c, d, d, c, d,
        c, c, c, f, e, g, f, e, f, f, e, g, c, c, c, c, c, d,
        d, c, c, f, e, f, g, e, f, f, e, f, d, c, c, c, c, c,
    ]),
    gl.STATIC_DRAW
  );
}
// Fill the buffer with colors for the 'F'.
function setColors(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Uint8Array([
        // bottom face
        100, 220, 50, 100, 220, 50, 100, 220, 50, 100, 220, 50, 100, 220, 50, 100,
        220, 50,
        //
        100, 220, 50, 100, 220, 50, 100, 220, 50, 100, 220, 50, 100, 220, 50, 100,
        220, 50,
        //
        100, 220, 50, 100, 220, 50, 100, 220, 50, 100, 220, 50, 100, 220, 50, 100,
        220, 50,
        //
        100, 220, 50, 100, 220, 50, 100, 220, 50, 100, 220, 50, 100, 220, 50, 100,
        220, 50,
        // inside border bottom face
        100, 50, 50, 100, 50, 50, 100, 50, 50, 100, 50, 50, 100, 50, 50, 100,
        50, 50,
        //
        100, 50, 50, 100, 50, 50, 100, 50, 50, 100, 50, 50, 100, 50, 50, 100,
        50, 50,
        //
        100, 50, 50, 100, 50, 50, 100, 50, 50, 100, 50, 50, 100, 50, 50, 100,
        50, 50,
        //
        100, 50, 50, 100, 50, 50, 100, 50, 50, 100, 50, 50, 100, 50, 50, 100,
        50, 50,
        // outside border bottom face
        100, 50, 99, 100, 50, 99, 100, 50, 99, 100, 50, 99, 100, 50, 99, 100,
        50, 99, 
        //
        100, 50, 99, 100, 50, 99, 100, 50, 99, 100, 50, 99, 100, 50, 99, 100,
        50, 99, 
        //
        100, 50, 99, 100, 50, 99, 100, 50, 99, 100, 50, 99, 100, 50, 99, 100,
        50, 99, 
        //
        100, 50, 99, 100, 50, 99, 100, 50, 99, 100, 50, 99, 100, 50, 99, 100,
        50, 99, 
        // top face
        100, 220, 50, 100, 220, 50, 100, 220, 50, 100, 220, 50, 100, 220, 50, 100,
        220, 50,
        //
        100, 220, 50, 100, 220, 50, 100, 220, 50, 100, 220, 50, 100, 220, 50, 100,
        220, 50,
        //
        100, 220, 50, 100, 220, 50, 100, 220, 50, 100, 220, 50, 100, 220, 50, 100,
        220, 50,
        //
        100, 220, 50, 100, 220, 50, 100, 220, 50, 100, 220, 50, 100, 220, 50, 100,
        220, 50,
        // top pyramid
        100, 200, 50, 100, 200, 50, 100, 200, 50, 100, 200, 50, 100, 200, 50, 100,
        200, 50,
        //side 1
        233, 150, 70, 233, 150, 70, 233, 150, 70, 233, 150, 70, 233, 150, 70, 233,
        150, 70,
        200, 150, 200, 200, 150, 200, 200, 150, 200, 200, 150, 200, 200, 150, 200, 200,
        150, 200,
        150, 98, 211, 150, 98, 211, 150, 98, 211, 150, 98, 211, 150, 98, 211, 150,
        98, 211,
        111, 121, 111, 111, 121, 111, 111, 121, 111, 111, 121, 111, 111, 121, 111, 111,
        121, 111,
        //side 2
        233, 150, 70, 233, 150, 70, 233, 150, 70, 233, 150, 70, 233, 150, 70, 233,
        150, 70,
        200, 150, 200, 200, 150, 200, 200, 150, 200, 200, 150, 200, 200, 150, 200, 200,
        150, 200,
        150, 98, 211, 150, 98, 211, 150, 98, 211, 150, 98, 211, 150, 98, 211, 150,
        98, 211,
        111, 121, 111, 111, 121, 111, 111, 121, 111, 111, 121, 111, 111, 121, 111, 111,
        121, 111,
        //side 3
        233, 150, 70, 233, 150, 70, 233, 150, 70, 233, 150, 70, 233, 150, 70, 233,
        150, 70,
        200, 150, 200, 200, 150, 200, 200, 150, 200, 200, 150, 200, 200, 150, 200, 200,
        150, 200,
        150, 98, 211, 150, 98, 211, 150, 98, 211, 150, 98, 211, 150, 98, 211, 150,
        98, 211,
        111, 121, 111, 111, 121, 111, 111, 121, 111, 111, 121, 111, 111, 121, 111, 111,
        121, 111,        
        //side 4
        233, 150, 70, 233, 150, 70, 233, 150, 70, 233, 150, 70, 233, 150, 70, 233,
        150, 70,
        200, 150, 200, 200, 150, 200, 200, 150, 200, 200, 150, 200, 200, 150, 200, 200,
        150, 200,
        150, 98, 211, 150, 98, 211, 150, 98, 211, 150, 98, 211, 150, 98, 211, 150,
        98, 211,
        111, 121, 111, 111, 121, 111, 111, 121, 111, 111, 121, 111, 111, 121, 111, 111,
        121, 111, 
    ]),
    gl.STATIC_DRAW
  );
}

main();
