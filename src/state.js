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
var saveButton = document.getElementById("save-button");
var selector = document.getElementById("object-option");
var projectionViewVal = 1;

function addEventListeners() {
  console.log("selectedIdx ->", selectedIdx);
  var camera = [0, 0];

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
}

// TODO: handle camera
cameraRotate.addEventListener("input", function (e) {
  document.getElementById("camera-rotate-value").innerHTML = e.target.value;
});

cameraRadius.addEventListener("input", function (e) {
  document.getElementById("camera-radius-value").innerHTML = e.target.value;
});

projectionView.addEventListener("change", function (e) {
  projectionViewVal = parseInt(e.target.value);
  drawScene();
});

resetButton.addEventListener("click", function (e) {
  console.log("Reset");
});

saveButton.addEventListener("click", function (e) {
  console.log("Save");
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

      // push default transformation
      data.forEach((obj) => {
        obj.translation = [0, 0, 0];
        obj.rotation = [degToRad(0), degToRad(0), degToRad(0)];
        obj.scale = [1, 1, 1];
      });
      objects.push(...data);

      // draw all objects
      drawObject();
      // add event listeners after loading objects
      addEventListeners();
    };
    reader.readAsText(file);
  };
  input.click();
});

// Object selector
selector.addEventListener("change", (e) => {
  selectedIdx = e.target.value;
  console.log("Selected Obj Index : " + selectedIdx);
});
