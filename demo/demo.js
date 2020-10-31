"use strict";

function initBuffers(gl) {
    const buffers = {
        trianglePosition: Object.assign(gl.createBuffer(), {
            itemSize: 3, 
            numItems: 3
        }),
        triangleColor: Object.assign(gl.createBuffer(), {
            itemSize: 4,
            numItems: 3
        })
    };

    // initialize triangle vertex position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.trianglePosition);
    const vertices = [
         0.0,  1.0, 0.0,
        -1.0, -1.0, 0.0,
         1.0, -1.0, 0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // initialize triangle vertex color buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.triangleColor);
    const colors = [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    return buffers;
}
 
function initScene(gl, width, height) {
    // initialize shader program
    const defaultVertexShader = `
        attribute vec3 a_Position;
        attribute vec4 a_Color;

        uniform mat4 u_ModelView;
        uniform mat4 u_Projection;

        varying lowp vec4 v_Color;

        void main(void) {
            gl_Position = u_Projection * u_ModelView * vec4(a_Position, 1.0);
            v_Color = a_Color;
        }
    `;
    const defaultFragmentShader = `
        varying lowp vec4 v_Color;

        void main(void) {
            gl_FragColor = v_Color;
        }
    `;
    const defaultSP = mygl.linkProgram(gl, [
        mygl.ccShader(gl, defaultFragmentShader, gl.FRAGMENT_SHADER), 
        mygl.ccShader(gl, defaultVertexShader, gl.VERTEX_SHADER)
    ]);
    gl.useProgram(defaultSP);

    // initialize shader parameter locations
    defaultSP.locations = {
        a_Position:  gl.getAttribLocation(defaultSP, "a_Position"),
        a_Color: gl.getAttribLocation(defaultSP, "a_Color"),
        u_Projection: gl.getUniformLocation(defaultSP, "u_Projection"),
        u_ModelView: gl.getUniformLocation(defaultSP, "u_ModelView")
    }

    gl.enableVertexAttribArray(defaultSP.locations.a_Position);
    gl.enableVertexAttribArray(defaultSP.locations.a_Color);

    //initialize model view and projection matrices

    const mvMatrix = mat4.create();
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, [0.0, 0.0, -4.0]);

    const aspect_ratio = width / height;
    const pMatrix = mat4.create();
    mat4.perspective(45, aspect_ratio, 0.1, 100.0, pMatrix);

    // return everything wrapped in a scene object
    return { 
        viewportWidth: width,
        viewportHeight: height,
        mvMatrix,
        pMatrix,
        buffers: initBuffers(gl),
        defaultSP
    };
}

function drawScene(gl, scene) {
    mat4.rotateY(scene.mvMatrix, 0.01);
    gl.viewport(0, 0, scene.viewportWidth, scene.viewportHeight);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // pass triangle position
    gl.bindBuffer(gl.ARRAY_BUFFER, scene.buffers.trianglePosition);
    gl.vertexAttribPointer(scene.defaultSP.locations.a_Position, 
                           scene.buffers.trianglePosition.itemSize,
                           gl.FLOAT, false, 0, 0);

    // pass triangle vertex colors
    gl.bindBuffer(gl.ARRAY_BUFFER, scene.buffers.triangleColor);
    gl.vertexAttribPointer(scene.defaultSP.locations.a_Color,
                           scene.buffers.triangleColor.itemSize,
                           gl.FLOAT, false, 0, 0);

    // pass model view projection matrix to vertext shader
    gl.uniformMatrix4fv(scene.defaultSP.locations.u_Projection, 
                        false, scene.pMatrix);
    gl.uniformMatrix4fv(scene.defaultSP.locations.u_ModelView,
                        false, scene.mvMatrix);

    // draw our lovely triangle
    gl.drawArrays(gl.TRIANGLES, 0, scene.buffers.trianglePosition.numItems);
}
