'use strict';


class Object{
        /*
    Constructor
    @param id: id of the shape
    @method: the method to use to draw the shape
    @vertices: the vertices of the shape
    @rgbColor: the color of the shape
    @name: the name of the shape
    */

    constructor(id, vertices, colors){
        this.id = id;
        this.vertices = vertices;
        this.colors = colors;
    }

    getVertices(){
        return this.vertices;
    }

}
/** 
 * @type {string} 
 * @description Vertex shader source code.
*/
const vertex = `
    attribute vec3 position;
    attribute vec3 normal;

    uniform mat4 Pmatrix;
    uniform mat4 Vmatrix;
    uniform mat4 Mmatrix;
    uniform mat4 Nmatrix;

    attribute vec3 color;
    varying vec3 vLighting;
    varying vec3 vColor;

    void main(void) {
        gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);
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
