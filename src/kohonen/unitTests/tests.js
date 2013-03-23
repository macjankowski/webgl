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

    equal(graph.vertices.length/3, 121, "Graph size is not ok");
});