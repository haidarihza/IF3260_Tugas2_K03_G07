'use strict';

/** 
 * @type {string} 
 * @description Vertex shader source code.
*/
const vert = `
    attribute vec4 a_position;
    attribute vec4 a_color;

    uniform mat4 u_matrix;

    varying vec4 v_color;
    void main() {
    // Multiply the position by the matrix.
    gl_Position = u_matrix * a_position;

    // Pass the color to the fragment shader.
    v_color = a_color;
    }
`;

/** 
 * @type {string} 
 * @description Fragment shader source code.
 * */
const frag = `
    precision mediump float;
    // Passed in from the vertex shader.
    varying vec4 v_color;

    void main() {
    gl_FragColor = v_color;
    }
`;

// HTML ELEMENTS.
