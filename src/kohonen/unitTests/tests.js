/**
 * Created with IntelliJ IDEA.
 * User: mac
 * Date: 3/23/13
 * Time: 6:18 PM
 * To change this template use File | Settings | File Templates.
 */


test( "hello test", function() {
    ok( 1 == "1", "Passed!" );
});

var graph = Graph.generateGraph()

test( "test graph", function() {

    equal(graph.vertices.length/3, 121, "Graph size is ok");
    equal(graph.getByIndex(0).index, 0, "Found correct vertex");

    for (var i=0; i<362; i+=3){
        var foundVertex = graph.getByIndex(i)
        equal(foundVertex.index, i, "Found correct vertex");
    }
});