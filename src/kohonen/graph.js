/**
 * Created with IntelliJ IDEA.
 * User: mac
 * Date: 3/17/13
 * Time: 12:40 PM
 * To change this template use File | Settings | File Templates.
 */

var KOHONEN_ITERATIONS = 10;

function Graph() {

    this.firstVertex = null
    this.vertices = []
    this.defaultColor = []

}

Graph.prototype.getByIndex = function(index)
{

    function findByIndex(vertex) {

        if (vertex.index == index) {
            return vertex;
        } else {
            for (var i = 0; i < vertex.neighbours.length; i++) {
                var neighbour = vertex.neighbours[i]
                var found = findByIndex(neighbour)
                if(found) return found
            }
        }
    }

    return   findByIndex(this.firstVertex)
}

Graph.prototype.getElementArray = function () {

    var elementArray = []

    function addToElementArray(vertex, parent) {

        if (parent != null) {
            elementArray.push(parent.index / 3)
            elementArray.push(vertex.index / 3)
        }

        for (var i = 0; i < vertex.neighbours.length; i++) {
            var neighbour = vertex.neighbours[i]
            addToElementArray(neighbour, vertex)
        }

    }

    addToElementArray(this.firstVertex, null)
    return elementArray
}

Graph.generateGraph = function generateGraph() {

    var count = 0;

    function startVertex() {
        var p = []
        p[0] = Math.random() / 2 - 0.5
        p[1] = Math.random() / 2 - 0.5
        p[2] = 0.0;
//        console.log("generated next point: " + vec3.str(p));

        var index = graph.vertices.length
        var vertex = new Vertex(p, index, null)
        graph.vertices.push(p[0])
        graph.vertices.push(p[1])
        graph.vertices.push(p[2])

        return vertex
    }

    function nextNeighbour(parent, step) {
        var p = []
        var basePoint = parent.point
        p[0] = basePoint[0] + Math.random() / (6.5 - step * 1.5) - step / 10;
        p[1] = basePoint[1] + Math.random() / (6.5 - step * 1.5) - step / 10;
        p[2] = 0.0;
//        console.log("generated next neighbour: " + vec3.str(p));

        var index = graph.vertices.length
        var vertex = new Vertex(p, index, parent)
        graph.vertices.push(p[0])
        graph.vertices.push(p[1])
        graph.vertices.push(p[2])

        parent.addNeighbour(vertex)
        return vertex
    }

    function generate(vertex, step) {
        if (step == 0) {
            return;
        } else {
            for (var i = 0; i < 3; i++) {

                var neighbour = nextNeighbour(vertex, step)
                generate(neighbour, step - 1)
            }
        }
    }


    var graph = new Graph()
    graph.firstVertex = startVertex()
    generate(graph.firstVertex, 4);
//    console.log("Generating edges took ")
    return  graph
}

Graph.prototype.calculateDistance = function (points) {
    for (var i = 0; i < points.length; i++) {
        var point = points[i]
        var min = 1000
        var closest = getClosest(this.firstVertex, point, this.firstVertex)
        moveVertex(closest, point, 1)
    }

}



Graph.prototype.kohonen = function (points) {

    var min = 1000
    var self = this;

    function getClosest(vertex, ex, currentClosest) {

        var tmp = distance(vertex.point, ex);
        if (tmp < min) {
            min = tmp;
            currentClosest = vertex
        }


        for (var i = 0; i < vertex.neighbours.length; i++) {
            currentClosest = getClosest(vertex.neighbours[i], ex, currentClosest)
        }
        return currentClosest;
    }

//    point[0] = Math.random() * 2 - 1.0
//    point[1] = Math.random() * 2 - 1.0
//    point[2] = 0.0;

    for (var i = 0; i < points.length; i++) {
        var point = points[i]
        var min = 1000
        var closest = getClosest(this.firstVertex, point, this.firstVertex)
        moveVertex(closest, point, 1)
    }




    function moveVertex(vertex, P, step) {

        function alpha(t) {
            return (KOHONEN_ITERATIONS - t) / KOHONEN_ITERATIONS;
        }

        step++
        if (step > 3 || vertex == null) {
            return
        }


//    console.log("\nPrzyciagam do: "+P.join())
//    console.log("Before modification: "+vertex.point.join())
//
//    var fromGraph = graph.getByIndex(vertex.index)
//    console.log("Before modification (from graph): "+fromGraph.point.join())
//
//    console.log("Before modification (from graph.vertices): "+[graph.vertices[vertex.index], graph.vertices[vertex.index+1], graph.vertices[vertex.index+2]])

        vertex.point[0] = vertex.point[0] + alpha((step - 1) * 5 - 4) * (P[0] - vertex.point[0]);
        vertex.point[1] = vertex.point[1] + alpha((step - 1) * 5 - 4) * (P[1] - vertex.point[1]);

        self.vertices[vertex.index] = vertex.point[0]
        self.vertices[vertex.index + 1] = vertex.point[1]

//    console.log("After modification: "+vertex.point.join())
//
//    fromGraph = graph.getByIndex(vertex.index)
//    console.log("After modification (from graph): "+fromGraph.point.join())
//
//    console.log("After modification (from graph.vertices): "+[graph.vertices[vertex.index], graph.vertices[vertex.index+1], graph.vertices[vertex.index+2]])
    }
}


