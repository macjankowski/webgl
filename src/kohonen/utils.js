/**
 * Created with IntelliJ IDEA.
 * User: mac
 * Date: 3/19/13
 * Time: 11:38 PM
 * To change this template use File | Settings | File Templates.
 */


var square = function (x) {
    return x * x;
}

function distance(a, b) {
    if (a == undefined) {
        console.log("a is undefined")
    }
    return Math.sqrt(square(a[0] - b[0]) + square(a[1] - b[1]) + square(a[2] - b[2]))
}


function printVerticesForElements(elems, vertices){

    for (var i = 0; i < elems.length ; i += 2) {
        console.log(vertices[elems[i]], vertices[elems[i+1]])
    }
}

function printMax(elems){
    var max = 0
    for (var i = 0; i < elems.length ; i++) {
        if(elems[i] > max){
            max = elems[i]
        }
    }
    console.log("MAX IS "+max)
}

function printGraph(vertex) {

    console.log(vertex.index+" = "+vertex.point)

    for (var i = 0; i < vertex.neighbours.length; i++) {
        var neighbour = vertex.neighbours[i]
        printGraph(neighbour)
    }

}

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