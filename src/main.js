'use strict';
let a = 150.0
let b = 25.0
let c = a+b
let d = a+2*b
let e = b
let f = (d-b)/2
let g = f + b

var _Pmatrix;
var _Vmatrix;
var _Mmatrix;
var _Nmatrix;

var normalMatrix = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
var proj_matrix = [ 1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1 ];
var view_matrix = [ 1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1 ];
var objects = [];
var selectedIdx = 0;
var isShading = false;

const drawObject = () => {
  for (let i = 0; i < objects.length; i++) {
    const {vertices, colors} = objects[i];
    initBuffers(vertices, convertColors(colors), i);
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);
  }
}

const initBuffers = (vertices, colors, idx) => {
    gl.enable(gl.DEPTH_TEST);

    gl.depthFunc(gl.LEQUAL); 
    var verticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    var normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    var normalV = getVectorNormal(vertices);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalV), gl.STATIC_DRAW);

        /*======== Associating attributes to vertex shader =====*/
    _Pmatrix = gl.getUniformLocation(program, "Pmatrix");
    _Vmatrix = gl.getUniformLocation(program, "Vmatrix");
    _Mmatrix = gl.getUniformLocation(program, "Mmatrix");
    _Nmatrix = gl.getUniformLocation(program, "Nmatrix");

    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    var _position = gl.getAttribLocation(program, "position");
    gl.vertexAttribPointer(_position, 3, gl.FLOAT, false,0,0);
    gl.enableVertexAttribArray(_position);
 
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    var _color = gl.getAttribLocation(program, "color");
    gl.vertexAttribPointer(_color, 3, gl.FLOAT, false,0,0) ;
    gl.enableVertexAttribArray(_color);
 
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    var _normal = gl.getAttribLocation(program, "normal");
    gl.vertexAttribPointer(_normal, 3, gl.FLOAT, false,0,0);
    gl.enableVertexAttribArray(_normal);
 
    gl.useProgram(program);
    
    var { translation, rotation, scale } = objects[idx];
    var model_matrix = projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 800);
    model_matrix = translate(model_matrix, translation[0], translation[1], translation[2]);
    model_matrix = xRotate(model_matrix, rotation[0]);
    model_matrix = yRotate(model_matrix, rotation[1]);
    model_matrix = zRotate(model_matrix, rotation[2]);
    model_matrix = scaleM(model_matrix, scale[0], scale[1], scale[2]);
    
    gl.uniformMatrix4fv(_Pmatrix, false, proj_matrix);
    gl.uniformMatrix4fv(_Vmatrix, false, view_matrix);
    gl.uniformMatrix4fv(_Mmatrix, false, model_matrix);
    if (isShading){
      //
      normalMatrix = getVectorNormal2(model_matrix, view_matrix);
      gl.uniformMatrix4fv(_Nmatrix, false, normalMatrix);
    }else{
      normalMatrix = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
      gl.uniformMatrix4fv(_Nmatrix, false, normalMatrix);
    }
    console.log(normalMatrix);

}


const initShader = (gl, type, source) => {
    // Create and compile the shader.
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    // Check compile status.
    // If success then return the created shader.
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    // If there is an error, log it and delete the shader.
    console.error(gl.getShaderInfoLog(shader));
    alert('Failed to initialize the shader.');
    gl.deleteShader(shader);
};

const createProgram = (gl, vertexShader, fragmentShader) => {
    // Create program.
    let program = gl.createProgram();

    // Attach shader to program.
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // Link program.
    gl.linkProgram(program);

    // Check link status.
    // If success then return the created program.
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    // If there is an error, log it and delete the program.
    console.error(gl.getProgramInfoLog(program));
    alert('Failed to initialize the shader program.');
    gl.deleteProgram(program);
};



const gl = canvas.getContext('webgl');
if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
}
// Set webgl viewport.
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
// Set clear color.
gl.clearColor(0.0, 0.0, 0.0, 1.0);

const vertexShader = initShader(gl, gl.VERTEX_SHADER, vertex);
const fragmentShader = initShader(gl, gl.FRAGMENT_SHADER, fragment);
const program = createProgram(gl, vertexShader, fragmentShader);

drawObject() ;

//Contoh Untuk Draw Scene
  // // Draw the scene.
  // function drawScene() {
  //   webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  //   // Tell WebGL how to convert from clip space to pixels
  //   gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  //   gl.enable(gl.DEPTH_TEST);

  //   // Clear the canvas.
  //   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //   // Turn on culling. By default backfacing triangles
  //   // will be culled.
  //   // gl.enable(gl.CULL_FACE);

  //   // Tell it to use our program (pair of shaders)
  //   gl.useProgram(program);

  //   // Turn on the position attribute
  //   gl.enableVertexAttribArray(positionLocation);

  //   // Bind the position buffer.
  //   gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  //   // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  //   var size = 3; // 3 components per iteration
  //   var type = gl.FLOAT; // the data is 32bit floats
  //   var normalize = false; // don't normalize the data
  //   var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  //   var offset = 0; // start at the beginning of the buffer
  //   gl.vertexAttribPointer(
  //     positionLocation,
  //     size,
  //     type,
  //     normalize,
  //     stride,
  //     offset
  //   );

  //   // Turn on the color attribute
  //   gl.enableVertexAttribArray(colorLocation);

  //   // Bind the color buffer.
  //   gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

  //   // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
  //   var size = 3; // 3 components per iteration
  //   var type = gl.UNSIGNED_BYTE; // the data is 8bit unsigned values
  //   var normalize = true; // normalize the data (convert from 0-255 to 0-1)
  //   var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  //   var offset = 0; // start at the beginning of the buffer
  //   gl.vertexAttribPointer(
  //     colorLocation,
  //     size,
  //     type,
  //     normalize,
  //     stride,
  //     offset
  //   );

  //   // ortographic projection
  //   var left = 0;
  //   var right = gl.canvas.clientWidth;
  //   var bottom = gl.canvas.clientHeight;
  //   var top = 0;
  //   var near = 800;
  //   var far = -800;
  //   var matrix;

  //   if (projectionViewVal == 1) {
  //     matrix = m4.oblique(left, right, bottom, top, near, far);
  //   } else if (projectionViewVal == 2) {
  //     matrix = m4.orthographic(left, right, bottom, top, near, far);
  //   } else {
  //     // TODO
  //     matrix = m4.oblique(left, right, bottom, top, near, far);
  //   }

  //   // // Compute the matrices
  //   // var matrix = m4.projection(
  //   //   gl.canvas.clientWidth,
  //   //   gl.canvas.clientHeight,
  //   //   800
  //   // );
  //   matrix = m4.translate(
  //     matrix,
  //     translation[0],
  //     translation[1],
  //     translation[2]
  //   );
  //   matrix = m4.xRotate(matrix, rotation[0]);
  //   matrix = m4.yRotate(matrix, rotation[1]);
  //   matrix = m4.zRotate(matrix, rotation[2]);
  //   matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);

  //   // Set the matrix.
  //   gl.uniformMatrix4fv(matrixLocation, false, matrix);

  //   // Draw the geometry.
  //   var primitiveType = gl.TRIANGLES;
  //   var offset = 0;
  //   var count = 48 * 6;
  //   gl.drawArrays(primitiveType, offset, count);
  // 