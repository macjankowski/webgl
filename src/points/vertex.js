/**
 * Created with IntelliJ IDEA.
 * User: mac
 * Date: 3/16/13
 * Time: 9:15 PM
 * To change this template use File | Settings | File Templates.
 */

function Vertex(point, index, parent) {
    this.point = point
    this.index = index
    this.neighbours = []
    this.parent = parent
}

Vertex.prototype.addNeighbour = function(vertex){
    this.neighbours.push(vertex)
}

Vertex.prototype.getNeighbours = function(){
    return this.neighbours
}