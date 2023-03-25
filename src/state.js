"use strict";

// HTML ELEMENTS.
/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
var rotateX = document.getElementById("rotate-x");
var rotateY = document.getElementById("rotate-y");
var rotateZ = document.getElementById("rotate-z");
var translationX = document.getElementById("translate-x");
var translationY = document.getElementById("translate-y");
var translationZ = document.getElementById("translate-z");
var scaleX = document.getElementById("scale-x");
var scaleY = document.getElementById("scale-y");
var scaleZ = document.getElementById("scale-z");
var cameraRotate = document.getElementById("camera-rotate");
var cameraRadius = document.getElementById("camera-radius");
var projectionView = document.getElementById("projection-view");
var shaderView = document.getElementById("shader-view");
var resetButton = document.getElementById("reset-button");
var fileInput = document.getElementById("fileinput");
var saveInput = document.getElementById("saveinput");
var saveButton = document.getElementById("save-button");
var selector = document.getElementById("object-option");
var projectionViewVal = 1;
const normalMtx = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];

function changeSlider(obj, isReset=false) {
	rotateX.value = obj.rotation[0];
	rotateY.value = obj.rotation[1];
	rotateZ.value = obj.rotation[2];
	translationX.value = obj.translation[0];
	translationY.value = obj.translation[1];
	translationZ.value = obj.translation[2];
	scaleX.value = obj.scale[0];
	scaleY.value = obj.scale[1];
	scaleZ.value = obj.scale[2];
  
	document.getElementById("rotate-x-value").innerHTML = obj.rotation[0];
	document.getElementById("rotate-y-value").innerHTML = obj.rotation[1];
	document.getElementById("rotate-z-value").innerHTML = obj.rotation[2];
	document.getElementById("translate-x-value").innerHTML = obj.translation[0];
	document.getElementById("translate-y-value").innerHTML = obj.translation[1];
	document.getElementById("translate-z-value").innerHTML = obj.translation[2];
	document.getElementById("scale-x-value").innerHTML = obj.scale[0];
	document.getElementById("scale-y-value").innerHTML = obj.scale[1];
	document.getElementById("scale-z-value").innerHTML = obj.scale[2];

  if (isReset) {
    cameraRotate.value = 0;
    cameraRadius.value = 1;
    document.getElementById("camera-rotate-value").innerHTML = 0;
    document.getElementById("camera-radius-value").innerHTML = 1;
  }
}

rotateX.addEventListener("input", function (e) {
  objects[selectedIdx].rotation[0] = degToRad(e.target.value);
  document.getElementById("rotate-x-value").innerHTML = e.target.value;
  for (var i = 0; i < objects.length; i++) {
    console.log("idx", i, "rotation", objects[i].rotation);
  }
  drawObject();
});

rotateY.addEventListener("input", function (e) {
  objects[selectedIdx].rotation[1] = degToRad(e.target.value);
  document.getElementById("rotate-y-value").innerHTML = e.target.value;
  drawObject();
});

rotateZ.addEventListener("input", function (e) {
  objects[selectedIdx].rotation[2] = degToRad(e.target.value);
  document.getElementById("rotate-z-value").innerHTML = e.target.value;
  drawObject();
});

translationX.addEventListener("input", function (e) {
  objects[selectedIdx].translation[0] = e.target.value;
  document.getElementById("translate-x-value").innerHTML = e.target.value;
  drawObject();
});

translationY.addEventListener("input", function (e) {
  objects[selectedIdx].translation[1] = e.target.value;
  document.getElementById("translate-y-value").innerHTML = e.target.value;
  drawObject();
});

translationZ.addEventListener("input", function (e) {
  objects[selectedIdx].translation[2] = e.target.value;
  document.getElementById("translate-z-value").innerHTML = e.target.value;
  drawObject();
});

scaleX.addEventListener("input", function (e) {
  objects[selectedIdx].scale[0] = e.target.value;
  document.getElementById("scale-x-value").innerHTML = e.target.value;
  drawObject();
});

scaleY.addEventListener("input", function (e) {
  objects[selectedIdx].scale[1] = e.target.value;
  document.getElementById("scale-y-value").innerHTML = e.target.value;
  drawObject();
});

scaleZ.addEventListener("input", function (e) {
  objects[selectedIdx].scale[2] = e.target.value;
  document.getElementById("scale-z-value").innerHTML = e.target.value;
  drawObject();
});

cameraRotate.addEventListener("input", function (e) {
  document.getElementById("camera-rotate-value").innerHTML = e.target.value;
});

cameraRadius.addEventListener("input", function (e) {
  const val = e.target.value;
  const matrix = [val, 0, 0, 0, 0, val, 0, 0, 0, 0, val, 0, 0, 0, 0, 1];
  view_matrix = multiply(matrix, normalMtx);
  document.getElementById("camera-radius-value").innerHTML = e.target.value;
  drawObject();
});

projectionView.addEventListener("change", function (e) {
  projectionViewVal = parseInt(e.target.value);
  const left = 0;
  const right = gl.canvas.clientWidth;
  const bottom = gl.canvas.clientHeight;
  const top = 0;
  const near = 800;
  const far = -800;

  if (projectionViewVal === 1) {
    proj_matrix = orthographic(left, right, bottom, top, near, far);
  } else if (projectionViewVal === 2) {
    proj_matrix = oblique(left, right, bottom, top, near, far);
  } else {
    proj_matrix = normalMtx;
  }
  console.log(proj_matrix);
  drawObject();
});

resetButton.addEventListener("click", function (e) {
  const obj = {
    rotation: [0, 0, 0],
    translation: [0, 0, 0],
    scale: [1, 1, 1],
  }
  changeSlider(obj, true);
  proj_matrix = normalMtx;
  view_matrix = normalMtx;

  for (var i = 0; i < objects.length; i++) {
    objects[i].rotation = [0, 0, 0];
    objects[i].translation = [0, 0, 0];
    objects[i].scale = [1, 1, 1];
  }

  drawObject();
});

saveButton.addEventListener("click", function (e) {
  let fileName = document.getElementById("saveinput").value;

  if (!fileName) {
      fileName = "model-" + new Date().getTime();
  }
  fileName += ".json";

  const element = document.createElement('a');

  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(objects)));
  element.setAttribute('download', fileName);
  element.style.display = 'none';

  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  alert("Model saved successfully!");
});

// loader
fileInput.addEventListener("click", function (e) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target.result;
      const data = JSON.parse(result);

      objects.push(...data);
      changeSlider(objects[0]);

      // draw all objects
      drawObject();
    };
    reader.readAsText(file);
  };
  input.click();
});

// Object selector
selector.addEventListener("change", (e) => {
  selectedIdx = e.target.value;
  console.log("Selected Obj Index : " + selectedIdx);
  if (objects.length === 0) {
    return;
  }
  changeSlider(objects[selectedIdx]);
});
