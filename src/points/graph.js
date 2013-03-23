/**
 * Created with IntelliJ IDEA.
 * User: mac
 * Date: 3/17/13
 * Time: 12:40 PM
 * To change this template use File | Settings | File Templates.
 */

function Graph(){

    this.firstVertex = null
    this.vertices = []

}

Graph.prototype.getElementArray = function() {

    var elementArray = []

    function addToElementArray(vertex, parent){

        if(parent != null){
            elementArray.push(parent.index/3)
            elementArray.push(vertex.index/3)
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
    graph.firstVertex =  startVertex()
    generate(graph.firstVertex, 4);
//    console.log("Generating edges took ")
    return  graph
}