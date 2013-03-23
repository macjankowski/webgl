var gl;
var canvas;
var shaderProgram;
var vertexBuffer;
var pointsBuffer;
var mvMatrix;
var pMatrix

//var triangleVertices;
var numberOfVertices = 1500;
var numberOfPoints = 150;


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

function setupBuffers() {
    vertexBuffer = gl.createBuffer();

    generateGraph();
    console.log("generated graph is: " + graph.getVertices());
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(graph.getVertices()),
        gl.STATIC_DRAW);
    vertexBuffer.itemSize = 3;
    vertexBuffer.numberOfItems = numberOfVertices;

    pointsBuffer = gl.createBuffer();
    generatePoints()
    console.log("generated graph is: " + points);
    gl.bindBuffer(gl.ARRAY_BUFFER, pointsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points),
        gl.STATIC_DRAW);
    pointsBuffer.itemSize = 3;
    pointsBuffer.numberOfItems = numberOfPoints;
}

function draw(currentTime) {

    requestAnimFrame(draw);

    if (currentTime == undefined) {
        currentTime = Date.now();
    }

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT);

//	updateModelViewMatrix();
//	modifyVertices(triangleVertices);
    kohonen(graph);

    console.log("draw")
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(graph.getVertices()),
        gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
        vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    gl.drawArrays(gl.LINES, 0, vertexBuffer.numberOfItems);


}

function setupProjectionMatrix() {

    pMatrix = mat4.create();
    mat4.identity(pMatrix);
    // mat4.perspective(60, gl.viewportWidth/gl.viewportHeight, -100.0, 100.0,
    // pMatrix);
    // console.log("perspective matrix: "+mat4.str(pMatrix));
    gl.uniformMatrix4fv(shaderProgram.uPMatrixUniform, false, pMatrix);
}

function setupModelViewMatrix() {

    mvMatrix = mat4.create();
    mat4.identity(mvMatrix);
    // mat4.translate(mvMatrix, [-0.2, 0.4, 0.0], mvMatrix);
    // mat4.rotate(mvMatrix, Math.PI/4, [0,0,1], mvMatrix);
    console.log("model/view matrix: " + mat4.str(mvMatrix));
    gl.uniformMatrix4fv(shaderProgram.uMVMatrixUniform, false, mvMatrix);
}

function updateModelViewMatrix() {

    // mat4.translate(mvMatrix, [0.01, 0.0, 0.0], mvMatrix);
    mat4.rotate(mvMatrix, Math.PI / 90, [ 1, 1, 1 ], mvMatrix);
    console.log("model/view matrix: " + mat4.str(mvMatrix));
    gl.uniformMatrix4fv(shaderProgram.uMVMatrixUniform, false, mvMatrix);
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

var KOHONEN_ITERATIONS = 10;
function kohonen(graph) {


    function getClosest(graph, ex) {

        var min = 1000;
        var closestIndex = 0;
        for (var i = 0; i < graph.edges.length; i++) {
            var edge = graph.edges[i];

            var tmp = distance(edge.from, ex);
            if (tmp < min) {
                min = tmp;
                closestIndex = i;
            }

        }
        return closestIndex;
    }

    for (var i = 0; i < numberOfPoints; i++) {
        var P = points[i];
//        console.log("Przyciagam do "+P)
        var closestIndex = getClosest(graph, P);
        moveVertex(closestIndex, P)
    }
}

function moveVertex(closestIndex, P) {

    function alpha(t) {
        return (KOHONEN_ITERATIONS - t) / KOHONEN_ITERATIONS;
    }
//          console.log("before: closest x = "+graph.edges[closestIndex].from[0])
//          console.log("before: closest y = "+graph.edges[closestIndex].from[1])
    graph.edges[closestIndex].from[0] = graph.edges[closestIndex].from[0] + alpha(1) * (P[0] - graph.edges[closestIndex].from[0]);
    graph.edges[closestIndex].from[1] = graph.edges[closestIndex].from[1] + alpha(1) * (P[1] - graph.edges[closestIndex].from[1]);

    graph.edges[closestIndex].to[0] = graph.edges[closestIndex].to[0] + alpha(5) * (graph.edges[closestIndex].from[0] - graph.edges[closestIndex].to[0]);
    graph.edges[closestIndex].to[1] = graph.edges[closestIndex].to[1] + alpha(5) * (graph.edges[closestIndex].from[1] - graph.edges[closestIndex].to[1]);

//          console.log("after: closest x = "+graph.edges[closestIndex].from[0])
//          console.log("after: closest y = "+graph.edges[closestIndex].from[1])
}


var graph = {edges: [], rEdges: []}


graph.indexEdges = function () {

    for (var i = 0; i < graph.edges.length; i++) {
        var edge = graph.edges[i]
        graph.rEdges.push({from: edge[1], to: edge[0]})
    }
}

graph.getVertices = function () {
    var vertices = []
    for (var i = 0; i < graph.edges.length; i++) {
        var edge =

        vertices.push(graph.edges[i].from[0])
        vertices.push(graph.edges[i].from[1])
        vertices.push(graph.edges[i].from[2])

        vertices.push(graph.edges[i].to[0])
        vertices.push(graph.edges[i].to[1])
        vertices.push(graph.edges[i].to[2])
    }
    return vertices;
}




function generateGraph() {

    var count = 0;

    function nextPoint() {
        var p = []
        p[0] = Math.random() / 2 - 0.5
        p[1] = Math.random() / 2 - 0.5
        p[2] = 0.0;
//        console.log("generated next point: " + vec3.str(p));
        return p
    }

    function nextNeighbour(basePoint, step) {
        var p = []
        p[0] = basePoint[0] + Math.random() / (6.5 - step * 1.5) - step / 10;
        p[1] = basePoint[1] + Math.random() / (6.5 - step * 1.5) - step / 10;
        p[2] = 0.0;
//        console.log("generated next neighbour: " + vec3.str(p));
        return p
    }

    function generateEdges(point, step) {
        if (step == 0) {
            return;
        } else {
            for (var i = 0; i < 10; i++) {

                var newPoint = nextNeighbour(point, step)
                var edge = {from: point, to: newPoint}
                graph.edges.push(edge)
                generateEdges(newPoint, step - 1)
            }
        }
    }

    generateEdges(nextPoint(), 4);
    console.log("Generating edges took ")
}

var points = []

function generatePoints() {

    function nextPointInKohonen() {
        var p = []
        p[0] = Math.random() * 2 - 1.0
        p[1] = Math.random() * 2 - 1.0
        p[2] = 0.0;
//        console.log("generated next point: " + vec3.str(p));
        return p
    }

    for (var i = 0; i < numberOfPoints; i++) {
        points.push(nextPointInKohonen())
    }
}

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame || window.oRequestAnimationFrame
        || window.msRequestAnimationFrame
        || function (/* function */callback, /* DOMElement */element) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

// utils


