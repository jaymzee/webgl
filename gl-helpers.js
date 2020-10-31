'use strict';

const mygl = {
    initGL(canvas) {  
        const gl = canvas.getContext('webgl');
        if (!gl) {
            alert('WebGL not available in your browser!')
        }
        return gl;
    },

    ccShader(gl, shaderSrc, shaderType) {
        const shader = gl.createShader(shaderType);
        gl.shaderSource(shader, shaderSrc);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert('Shader compile error:\n' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    },

    linkProgram(gl, shaders) {
        const prog = gl.createProgram();
        for (let shader of shaders) {
            gl.attachShader(prog, shader);
        }
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            alert('Could not initialize shaders');
            gl.deleteProgram(prog);
            return null;
        }
        return prog;
    },

    mat4x4ToStr(m) {
        function f(x) {
            //return x.toFixed(4).padStart(7);
            return x.toExponential(4).padStart(10);
        }

        let s = `[ ${f(m[0])}, ${f(m[1])}, ${f(m[2])}, ${f(m[3])} ]\n` +
                `[ ${f(m[4])}, ${f(m[5])}, ${f(m[6])}, ${f(m[7])} ]\n` +
                `[ ${f(m[8])}, ${f(m[9])}, ${f(m[10])}, ${f(m[11])} ]\n` +
                `[ ${f(m[12])}, ${f(m[13])}, ${f(m[14])}, ${f(m[15])} ]\n`
        return s;
    }
};