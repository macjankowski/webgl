var gl;
var canvas;
var shaderProgram;
var vertexBuffer;
var indexBuffer;
var pointsBuffer;
var mvMatrix;
var pMatrix

//var triangleVertices;
var numberOfVertices;
var numberOfVerticesInPoints


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
    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram,
        "aVertexColor");
}

var graph
var points = []
var flattenPoints


function setupBuffers() {
    pointsBuffer = gl.createBuffer();
    vertexBuffer = gl.createBuffer();

    graph = Graph.generateGraph()
    points = generatePoints()
    numberOfVertices = graph.vertices.length
    flattenPoints = [].concat.apply([], points)

    numberOfVerticesInPoints = flattenPoints.length

    console.log("generated graph is: " + graph.vertices);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(graph.vertices),
        gl.STATIC_DRAW);
    vertexBuffer.itemSize = 3;
    vertexBuffer.numberOfItems = numberOfVertices / vertexBuffer.itemSize;
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    gl.bindBuffer(gl.ARRAY_BUFFER, pointsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flattenPoints), gl.STATIC_DRAW);
    pointsBuffer.itemSize = 3;
    pointsBuffer.numberOfItems = numberOfVerticesInPoints / pointsBuffer.itemSize;


    var indexArray = graph.getElementArray()
    indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexArray),
        gl.STATIC_DRAW);
    indexBuffer.itemSize = 1
    indexBuffer.numberOfItems = indexArray.length

}

function draw(currentTime) {

    requestAnimFrame(draw);

    if (currentTime == undefined) {
        currentTime = Date.now();
    }

//function draw() {

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT);

//	updateModelViewMatrix();
//	modifyVertices(triangleVertices);
    graph.kohonen(points);

    console.log("draw")

//    gl.disableVertexAttribArray(shaderProgram.vertexColorAttribute);
    gl.vertexAttrib4f(shaderProgram.vertexColorAttribute, 1.0, 0.0, 0.0, 1.0);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(graph.vertices),
        gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
        vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    gl.drawElements(gl.LINES, indexBuffer.numberOfItems, gl.UNSIGNED_SHORT, 0);


    gl.vertexAttrib4f(shaderProgram.vertexColorAttribute, 1.0, 1.0, 1.0, 1.0);
    gl.bindBuffer(gl.ARRAY_BUFFER, pointsBuffer);
//    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flattenPoints),
//        gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
        vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.POINTS, 0, 100);

}


function startup() {
    canvas = document.getElementById("myGLCanvas");
    gl = WebGLDebugUtils.makeDebugContext(createGLContext(canvas));
    setupShaders();
    setupBuffers();
//    setupProjectionMatrix();
//    setupModelViewMatrix();

    gl.clearColor(0.0, 0.0, 0.2, 1.0);
    draw();
}


window.requestAnimFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame || window.oRequestAnimationFrame
        || window.msRequestAnimationFrame
        || function (/* function */callback, /* DOMElement */element) {
        window.setTimeout(callback, 16.7);
    };
})();


function generatePoints() {
    var points = []

    for (var i = 0; i < 1000; i++) {
        var p = []
        p[0] = Math.random() * 2 - 1.0
        p[1] = Math.random() * 2 - 1.0
        p[2] = 0.0;
        points.push(p)
    }
    return points
}



