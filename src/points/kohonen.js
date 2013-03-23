var gl;
var canvas;
var shaderProgram;
var vertexBuffer;
var indexBuffer;

var numberOfVertices;


function setupShaders() {

    var vertexShader = loadShaderFromDOM("shader-vs")
    var fragmentShader = loadShaderFromDOM("shader-fs")

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Failed to setup shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram,
        "aVertexPosition");
    shaderProgram.uPMatrixUniform = gl.getUniformLocation(shaderProgram,
        "uPMatrix");
    shaderProgram.uMVMatrixUniform = gl.getUniformLocation(shaderProgram,
        "uMVMatrix");
}

var graph
var points = []

function setupBuffers() {
    vertexBuffer = gl.createBuffer();

    graph = Graph.generateGraph()
    points = [].concat.apply([], generatePoints())
//    points = graph.vertices
    numberOfVertices = points.length

    console.log("generated points are: " + points);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points),
        gl.STATIC_DRAW);
    vertexBuffer.itemSize = 3;
    vertexBuffer.numberOfItems = numberOfVertices / vertexBuffer.itemSize;
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
}


function draw() {

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT);

    console.log("draw")
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points),
        gl.STATIC_DRAW);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
        vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.POINTS, 0, vertexBuffer.numberOfItems);
}


function startup() {
    canvas = document.getElementById("myGLCanvas");
    gl = WebGLDebugUtils.makeDebugContext(createGLContext(canvas));
    setupShaders();
    setupBuffers();

    gl.clearColor(0.0, 0.0, 0.2, 1.0);
    draw();
}


window.requestAnimFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame || window.oRequestAnimationFrame
        || window.msRequestAnimationFrame
        || function (/* function */callback, /* DOMElement */element) {
        window.setTimeout(callback, 1000 / 560);
    };
})();


function generatePoints() {
    var points = []

    for (var i = 0; i < 363; i++) {
        var p = []
        p[0] = Math.random() * 2 - 1.0
        p[1] = Math.random() * 2 - 1.0
        p[2] = 0.0;
        points.push(p)
    }
    return points
}