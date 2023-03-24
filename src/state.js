'use strict';


/** 
 * @type {string} 
 * @description Vertex shader source code.
*/
const vertex = `
    attribute vec3 position;
    attribute vec3 normal;

    uniform mat4 Vmatrix;
    uniform mat4 Mmatrix;
    uniform mat4 Nmatrix;

    attribute vec3 color;
    varying vec3 vLighting;
    varying vec3 vColor;

    void main(void) {
        gl_Position = Vmatrix*Mmatrix*vec4(position, 1.);
        vec3 ambientLight = vec3(0.3, 0.3, 0.3);
        vec3 directionalLightColor = vec3(1, 1, 1);
        vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
        vec4 transformedNormal = Nmatrix*vec4(normal, 1.);
        
        float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
        vLighting = ambientLight + (directionalLightColor * directional);
        vColor = color;
    }
`;

/** 
 * @type {string} 
 * @description Fragment shader source code.
 * */
// Fragment shader program
const fragment = `
    precision mediump float;
    varying vec3 vColor;
    varying vec3 vLighting;
                
    void main(void) {
        gl_FragColor = vec4(vColor, 1.);
        gl_FragColor.rgb *= vLighting;
    }
`;

// HTML ELEMENTS.
/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas');
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
var loadButton = document.getElementById("load-button");
var saveButton = document.getElementById("save-button");
var projectionViewVal = 1;
var translation = [0, 0, 0];
var rotation = [degToRad(0), degToRad(0), degToRad(0)];
var scale = [1, 1, 1];
var camera = [0, 0]
var isShading = false;

rotateX.addEventListener("input", function (e) {
    rotation[0] = degToRad(e.target.value);
    document.getElementById("rotate-x-value").innerHTML = e.target.value;
    drawObject();
});

rotateY.addEventListener("input", function (e) {
    rotation[1] = degToRad(e.target.value);
    document.getElementById("rotate-y-value").innerHTML = e.target.value;
    drawObject();
});

rotateZ.addEventListener("input", function (e) {
    rotation[2] = degToRad(e.target.value);
    document.getElementById("rotate-z-value").innerHTML = e.target.value;
    drawObject();
});

translationX.addEventListener("input", function (e) {
    translation[0] = e.target.value;
    document.getElementById("translate-x-value").innerHTML = e.target.value;
    drawObject();
});

translationY.addEventListener("input", function (e) {
    translation[1] = e.target.value;
    document.getElementById("translate-y-value").innerHTML = e.target.value;
    drawObject();
});

translationZ.addEventListener("input", function (e) {
    translation[2] = e.target.value;
    document.getElementById("translate-z-value").innerHTML = e.target.value;
    drawObject();
});

scaleX.addEventListener("input", function (e) {
    scale[0] = e.target.value;
    document.getElementById("scale-x-value").innerHTML = e.target.value;
    drawObject();
});

scaleY.addEventListener("input", function (e) {
    scale[1] = e.target.value;
    document.getElementById("scale-y-value").innerHTML = e.target.value;
    drawObject();
});

scaleZ.addEventListener("input", function (e) {
    scale[2] = e.target.value;
    document.getElementById("scale-z-value").innerHTML = e.target.value;
    drawObject();
});

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
})

loadButton.addEventListener("click", function (e) {
    console.log("Load");
})

saveButton.addEventListener("click", function (e) {
    console.log("Save");
})

shaderView.addEventListener("change", function (e) {
    console.log(e.target.value);
    isShading = parseInt(e.target.value);
    drawObject();
})