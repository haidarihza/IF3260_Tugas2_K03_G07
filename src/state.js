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

function changeSlider(obj, isReset = false) {
  rotateX.value = radToDeg(obj.rotation[0]);
  rotateY.value = radToDeg(obj.rotation[1]);
  rotateZ.value = radToDeg(obj.rotation[2]);
  translationX.value = obj.translation[0] * gl.canvas.clientWidth;
  translationY.value = obj.translation[1] * gl.canvas.clientHeight;
  translationZ.value = obj.translation[2] * gl.canvas.clientWidth;
  scaleX.value = obj.scale[0];
  scaleY.value = obj.scale[1];
  scaleZ.value = obj.scale[2];

  document.getElementById("rotate-x-value").innerHTML = Math.round(
    radToDeg(obj.rotation[0])
  );
  document.getElementById("rotate-y-value").innerHTML = Math.round(
    radToDeg(obj.rotation[1])
  );
  document.getElementById("rotate-z-value").innerHTML = Math.round(
    radToDeg(obj.rotation[2])
  );
  document.getElementById("translate-x-value").innerHTML = Math.round(
    obj.translation[0] * gl.canvas.clientWidth
  );
  document.getElementById("translate-y-value").innerHTML = Math.round(
    obj.translation[1] * gl.canvas.clientHeight
  );
  document.getElementById("translate-z-value").innerHTML = Math.round(
    obj.translation[2] * gl.canvas.clientWidth
  );
  document.getElementById("scale-x-value").innerHTML = obj.scale[0];
  document.getElementById("scale-y-value").innerHTML = obj.scale[1];
  document.getElementById("scale-z-value").innerHTML = obj.scale[2];

  if (isReset) {
    isShading = false;
    cameraAngleRadians = 0;
    oldValue = 0;

    document.getElementById("shader-view").value = 0;
    document.getElementById("camera-rotate").value = 0;
    document.getElementById("camera-rotate-value").innerHTML = 0;
  }
}

rotateX.addEventListener("input", function (e) {
  objects[selectedIdx].rotation[0] = degToRad(e.target.value);
  document.getElementById("rotate-x-value").innerHTML = e.target.value;
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
  objects[selectedIdx].translation[0] = e.target.value / gl.canvas.clientWidth;
  document.getElementById("translate-x-value").innerHTML = e.target.value;
  drawObject();
});

translationY.addEventListener("input", function (e) {
  objects[selectedIdx].translation[1] = e.target.value / gl.canvas.clientHeight;
  document.getElementById("translate-y-value").innerHTML = e.target.value;
  drawObject();
});

translationZ.addEventListener("input", function (e) {
  objects[selectedIdx].translation[2] = e.target.value / gl.canvas.clientWidth;
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
  cameraAngleRadians = degToRad(parseInt(e.target.value));

  let move = cameraAngleRadians - oldValue;

  view_matrix = multiply(yRotation(move), view_matrix);

  drawObject();

  oldValue = cameraAngleRadians;
});

function updateZoom(value) {
  view_matrix = multiply(scaling(value, value, value), view_matrix);
  drawObject();
}

projectionView.addEventListener("change", function (e) {
  projectionViewVal = parseInt(e.target.value);
  drawObject();
});

resetButton.addEventListener("click", function (e) {
  const obj = {
    rotation: [0, 0, 0],
    translation: [0, 0, 0],
    scale: [1, 1, 1],
  };
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
  if (objects.length === 0) {
    alert("No model to save!");
    return;
  }

  // compute the new vertices
  for (var i = 0; i < objects.length; i++) {
    objects[i].vertices = transformVertices(
      objects[i].vertices,
      objects[i].model_matrix
    );
  }

  let fileName = document.getElementById("saveinput").value;

  if (!fileName) {
    fileName = "model-" + new Date().getTime();
  }
  fileName += ".json";

  const element = document.createElement("a");
  const data = objects.map((obj) => {
    return {
      vertices: obj.vertices,
      colors: obj.colors,
    };
  });

  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(data))
  );
  element.setAttribute("download", fileName);
  element.style.display = "none";

  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  document.getElementById("saveinput").value = "";
  alert("Model saved successfully!");
});

// loader
fileInput.addEventListener("change", function (e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const result = e.target.result;
    const data = JSON.parse(result);

    objects = [];

    const optDiv = document.getElementById("object-option");
    optDiv.options[0].remove();
    for (var i = 0; i < data.length; i++) {
      const opt = document.createElement("option");
      opt.value = i;
      opt.innerHTML = "Hollow Object " + (i + 1);
      if (i === 0) {
        opt.selected = true;
      }

      // push default translation
      data[i].translation = [0, 0, 0];
      data[i].rotation = [0, 0, 0];
      data[i].scale = [1, 1, 1];

      optDiv.appendChild(opt);
      objects.push(data[i]);
    }
    changeSlider(objects[0], true);

    // draw all objects
    drawObject();
    document.getElementById("fileinput").value = "";
    alert("Model loaded successfully!");
  };
  reader.readAsText(file);
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

//Shader view
shaderView.addEventListener("change", (e) => {
  isShading = parseInt(e.target.value);
  drawObject();
});
