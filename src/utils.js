function getVectorNormal(vpos) {
  const n = vpos.length;
  var vNormals = [];
  for (let i = 0; i < n; i += 18) {
    const p1 = [vpos[i], vpos[i + 1], vpos[i + 2]];
    const p2 = [vpos[i + 15], vpos[i + 16], vpos[i + 17]];
    const p3 = [vpos[i + 3], vpos[i + 4], vpos[i + 5]];
    const vec1 = subtractVectors(p2, p1);
    const vec2 = subtractVectors(p3, p1);
    const normalDirection = cross(vec1, vec2);
    const vecNormal = normalize(normalDirection);
    for (let j = 0; j < 6; j++) {
      vNormals = vNormals.concat(vecNormal);
    }
  }
  return vNormals;
}

function subtractVectors(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function normalize(v) {
  var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  // make sure we don't divide by 0.
  if (length > 0.00001) {
    return [v[0] / length, v[1] / length, v[2] / length];
  } else {
    return [0, 0, 0];
  }
}

function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function convertColors(colors) {
  var colorsArray = [];
  for (let i = 0; i < colors.length; i++) {
    colorsArray.push(colors[i] / 255);
  }
  return colorsArray;
}

function radToDeg(r) {
  return (r * 180) / Math.PI;
}

function degToRad(d) {
  return (d * Math.PI) / 180;
}

function projection(width, height, depth) {
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
}

function getShearMatrix(theta, phi) {
  return [
    1,
    0,
    -1 / Math.tan(degToRad(theta)),
    0,
    0,
    1,
    -1 / Math.tan(degToRad(phi)),
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
  ];
}

function oblique(left, right, bottom, top, near, far) {
  const shx = 0.1;
  const shy = 0.4;
  const O = [
    2 / (right - left),
    0,
    0,
    0,
    0,
    2 / (top - bottom),
    0,
    0,
    shx * (2 / (right - left)),
    shy * (2 / (top - bottom)),
    2 / (near - far),
    0,
    -(right + left) / (right - left),
    -(top + bottom) / (top - bottom),
    -(near + far) / (near - far),
    1,
  ];

  return O;
}

function orthographic(left, right, bottom, top, near, far) {
  return [
    2 / (right - left),
    0,
    0,
    0,
    0,
    2 / (top - bottom),
    0,
    0,
    0,
    0,
    2 / (near - far),
    0,
    (left + right) / (left - right),
    (bottom + top) / (bottom - top),
    (near + far) / (near - far),
    1,
  ];
}

function perspective(fovy, aspect, near, far) {
  const f = 1.0 / Math.tan(fovy / 2);
  const rangeInv = 1.0 / (near - far);

  return [
    f / aspect,
    0,
    0,
    0,
    0,
    f,
    0,
    0,
    0,
    0,
    (near + far) * rangeInv,
    -1,
    0,
    0,
    2 * near * far * rangeInv,
    0,
  ];
}

function transformVertices(vertices, matrix) {
  const transformedVertices = [];
  for (let i = 0; i < vertices.length; i += 3) {
    const vec4 = [vertices[i], vertices[i + 1], vertices[i + 2], 1];
    const transformedVec4 = multiply(matrix, vec4);
    transformedVertices.push(
      transformedVec4[0],
      transformedVec4[1],
      transformedVec4[2]
    );
  }
  return transformedVertices;
}

function multiply(a, b) {
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
}

function inverse(m) {
  var m00 = m[0 * 4 + 0];
  var m01 = m[0 * 4 + 1];
  var m02 = m[0 * 4 + 2];
  var m03 = m[0 * 4 + 3];
  var m10 = m[1 * 4 + 0];
  var m11 = m[1 * 4 + 1];
  var m12 = m[1 * 4 + 2];
  var m13 = m[1 * 4 + 3];
  var m20 = m[2 * 4 + 0];
  var m21 = m[2 * 4 + 1];
  var m22 = m[2 * 4 + 2];
  var m23 = m[2 * 4 + 3];
  var m30 = m[3 * 4 + 0];
  var m31 = m[3 * 4 + 1];
  var m32 = m[3 * 4 + 2];
  var m33 = m[3 * 4 + 3];
  var tmp_0 = m22 * m33;
  var tmp_1 = m32 * m23;
  var tmp_2 = m12 * m33;
  var tmp_3 = m32 * m13;
  var tmp_4 = m12 * m23;
  var tmp_5 = m22 * m13;
  var tmp_6 = m02 * m33;
  var tmp_7 = m32 * m03;
  var tmp_8 = m02 * m23;
  var tmp_9 = m22 * m03;
  var tmp_10 = m02 * m13;
  var tmp_11 = m12 * m03;
  var tmp_12 = m20 * m31;
  var tmp_13 = m30 * m21;
  var tmp_14 = m10 * m31;
  var tmp_15 = m30 * m11;
  var tmp_16 = m10 * m21;
  var tmp_17 = m20 * m11;
  var tmp_18 = m00 * m31;
  var tmp_19 = m30 * m01;
  var tmp_20 = m00 * m21;
  var tmp_21 = m20 * m01;
  var tmp_22 = m00 * m11;
  var tmp_23 = m10 * m01;

  var t0 =
    tmp_0 * m11 +
    tmp_3 * m21 +
    tmp_4 * m31 -
    (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
  var t1 =
    tmp_1 * m01 +
    tmp_6 * m21 +
    tmp_9 * m31 -
    (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
  var t2 =
    tmp_2 * m01 +
    tmp_7 * m11 +
    tmp_10 * m31 -
    (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
  var t3 =
    tmp_5 * m01 +
    tmp_8 * m11 +
    tmp_11 * m21 -
    (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

  var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

  return [
    d * t0,
    d * t1,
    d * t2,
    d * t3,
    d *
      (tmp_1 * m10 +
        tmp_2 * m20 +
        tmp_5 * m30 -
        (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
    d *
      (tmp_0 * m00 +
        tmp_7 * m20 +
        tmp_8 * m30 -
        (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
    d *
      (tmp_3 * m00 +
        tmp_6 * m10 +
        tmp_11 * m30 -
        (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
    d *
      (tmp_4 * m00 +
        tmp_9 * m10 +
        tmp_10 * m20 -
        (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
    d *
      (tmp_12 * m13 +
        tmp_15 * m23 +
        tmp_16 * m33 -
        (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
    d *
      (tmp_13 * m03 +
        tmp_18 * m23 +
        tmp_21 * m33 -
        (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
    d *
      (tmp_14 * m03 +
        tmp_19 * m13 +
        tmp_22 * m33 -
        (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
    d *
      (tmp_17 * m03 +
        tmp_20 * m13 +
        tmp_23 * m23 -
        (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
    d *
      (tmp_14 * m22 +
        tmp_17 * m32 +
        tmp_13 * m12 -
        (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
    d *
      (tmp_20 * m32 +
        tmp_12 * m02 +
        tmp_19 * m22 -
        (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
    d *
      (tmp_18 * m12 +
        tmp_23 * m32 +
        tmp_15 * m02 -
        (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
    d *
      (tmp_22 * m22 +
        tmp_16 * m02 +
        tmp_21 * m12 -
        (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02)),
  ];
}

function translationM(tx, ty, tz) {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1];
}

function xRotation(angleInRadians) {
  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);
  return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
}

function yRotation(angleInRadians) {
  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);
  return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
}

function zRotation(angleInRadians) {
  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);
  return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}

function scaling(sx, sy, sz) {
  return [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1];
}

function translate(m, tx, ty, tz) {
  return multiply(m, translationM(tx, ty, tz));
}

function xRotate(m, angleInRadians) {
  return multiply(m, xRotation(angleInRadians));
}

function yRotate(m, angleInRadians) {
  return multiply(m, yRotation(angleInRadians));
}

function zRotate(m, angleInRadians) {
  return multiply(m, zRotation(angleInRadians));
}

function scaleM(m, sx, sy, sz) {
  return multiply(m, scaling(sx, sy, sz));
}

function getVectorNormal2(modelMatrix, viewMatrix) {
  var temp = multiply(modelMatrix, viewMatrix);
  var mvMatrix = [];
  var normalMatrix = [];

  for (var i = 0; i < 16; i += 4) {
    mvMatrix.push([temp[i], temp[i + 1], temp[i + 2], temp[i + 3]]);
  }

  normalMatrix = invert(mvMatrix);
  normalMatrix = transpose(normalMatrix);
  var normalVector = [];
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      normalVector.push(normalMatrix[i][j]);
    }
  }
  return normalVector;
}

function invert(a) {
  var temp;
  var N = a.length;
  var E = [];

  for (var i = 0; i < N; i++) E[i] = [];

  for (i = 0; i < N; i++)
    for (var j = 0; j < N; j++) {
      E[i][j] = 0;
      if (i == j) E[i][j] = 1;
    }

  for (var k = 0; k < N; k++) {
    temp = a[k][k];

    for (var j = 0; j < N; j++) {
      a[k][j] /= temp;
      a[k][j] /= temp;
    }

    for (var i = k + 1; i < N; i++) {
      temp = a[i][k];

      for (var j = 0; j < N; j++) {
        a[i][j] -= a[k][j] * temp;
        E[i][j] -= E[k][j] * temp;
      }
    }
  }

  for (var k = N - 1; k > 0; k--) {
    for (var i = k - 1; i >= 0; i--) {
      temp = a[i][k];

      for (var j = 0; j < N; j++) {
        a[i][j] -= a[k][j] * temp;
        E[i][j] -= E[k][j] * temp;
      }
    }
  }

  for (var i = 0; i < N; i++) for (var j = 0; j < N; j++) a[i][j] = E[i][j];
  return a;
}

function transpose(matrix) {
  return matrix[0].map((col, i) => matrix.map((row) => row[i]));
}
