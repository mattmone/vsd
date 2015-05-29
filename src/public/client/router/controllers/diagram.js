module.exports = function($scope, $state, $stateParams) {

  var m = [20, 120, 20, 120],
    w = 1280 - m[1] - m[3],
    h = 800 - m[0] - m[2],
    i = 0,
    j = 0,
    root, json;

  var tree = d3.layout.tree()
    .size([h, w]);

  var diagonal = d3.svg.diagonal()
    .projection(function(d) {
      return [d.y, d.x];
    });

  var vis = d3.select("#router-diagram").append("svg:svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
    .append("svg:g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");


  function build(route) {

      var o = {
        name: route.path
      };

      var j;

      if (route.children.length) {
        o.children = [];
        for (j = 0; j < route.children.length; j++) {
          o.children.push(build(route.children[j]));
        }
      }

      if (route.actions.length) {
        if (!o.children) {
          o.children = [];
        }
        for (j = 0; j < route.actions.length; j++) {
          o.children.push({
            name: route.actions[j].url
          });
        }
      }

      return o;

      //
      //
      // children.concat(controller.routes.map(function(item) {
      //   return { name: item.name };
      // }));
      //


    }

  json = build($scope.router.root);

  root = json;
  root.x0 = h / 2;
  root.y0 = 0;

  function toggleAll(d) {
    if (d.children) {
      d.children.forEach(toggleAll);
      toggle(d);
    }
  }

  // Initialize the display to show a few nodes.
  //toggleAll(root);
  //root.children.forEach(toggleAll);
  //toggle(root.children[1]);
  // toggle(root.children[1].children[2]);
  // toggle(root.children[9]);
  // toggle(root.children[9].children[0]);

  update(root);


  function update(source) {
    var duration = d3.event && d3.event.altKey ? 5000 : 500;

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse();

    // Normalize for fixed-depth.
    nodes.forEach(function(d) {
      d.y = d.depth * 180;
    });

    // Update the nodes…
    var node = vis.selectAll("g.node")
      .data(nodes, function(d) {
        return d.id || (d.id = ++i);
      });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("svg:g")
      .attr("class", "node")
      .attr("transform", function(d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
      })
      .on("click", function(d) {
        toggle(d);
        update(d);
      });

    nodeEnter.append("svg:circle")
      .attr("r", 1e-6)
      .style("fill", function(d) {
        return d._children ? "lightsteelblue" : "#fff";
      });

    nodeEnter.append("svg:a")
      .attr("x", function(d) {
        return d.children || d._children ? -10 : 10;
      })
      .attr("xlink:href", function(d) {
        console.log(d);
        return d.url;
      }).append("svg:text")
      .attr("x", function(d) {
        return d.children || d._children ? -10 : 10;
      })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) {
        return d.children || d._children ? "end" : "start";
      })
      .text(function(d) {
        return d.name;
      })
      .style("fill-opacity", 1e-6);

    // nodeEnter.append("svg:a")
    //   .attr("x", function(d) {
    //     return d.children || d._children ? -10 : 10;
    //   })
    //   .attr("xlink:href", function(d){console.log(d);return d.url;})
    //   .attr("dy", ".35em")
    //   .attr("text-anchor", function(d) {
    //     return d.children || d._children ? "end" : "start";
    //   })
    //   .text(function(d) {
    //     return d.name;
    //   })
    //   .style("fill-opacity", 1e-6);


    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) {
        return "translate(" + d.y + "," + d.x + ")";
      });

    nodeUpdate.select("circle")
      .attr("r", 4.5)
      .style("fill", function(d) {
        return d._children ? "lightsteelblue" : "#fff";
      });

    nodeUpdate.select("text")
      .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) {
        return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

    nodeExit.select("circle")
      .attr("r", 1e-6);

    nodeExit.select("text")
      .style("fill-opacity", 1e-6);

    // Update the links…
    var link = vis.selectAll("path.link")
      .data(tree.links(nodes), function(d) {
        return d.target.id;
      });

    // Enter any new links at the parent's previous position.
    link.enter().insert("svg:path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {
          x: source.x0,
          y: source.y0
        };
        return diagonal({
          source: o,
          target: o
        });
      })
      .transition()
      .duration(duration)
      .attr("d", diagonal);

    // Transition links to their new position.
    link.transition()
      .duration(duration)
      .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {
          x: source.x,
          y: source.y
        };
        return diagonal({
          source: o,
          target: o
        });
      })
      .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  // Toggle children.
  function toggle(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
  }


};


// module.exports = function($scope, $state, $stateParams) {

//   function build(route) {

//       var o = {
//         name: route.path
//       };

//       var j;

//       if (route.children.length) {
//         o.children = [];
//         for (j = 0; j < route.children.length; j++) {
//           o.children.push(build(route.children[j]));
//         }
//       }

//       if (route.actions.length) {
//         if (!o.children) {
//           o.children = [];
//         }
//         for (j = 0; j < route.actions.length; j++) {
//           o.children.push({
//             name: route.actions[j].url
//           });
//         }
//       }

//       return o;

//       //
//       //
//       // children.concat(controller.routes.map(function(item) {
//       //   return { name: item.name };
//       // }));
//       //


//     }

//   json = build($scope.router.root);

//   var width = 960,
//     height = 2200;

// var cluster = d3.layout.cluster()
//     .size([height, width - 160]);

// var diagonal = d3.svg.diagonal()
//     .projection(function(d) { return [d.y, d.x]; });

// var svg = d3.select("#router-diagram").append("svg")
//     .attr("width", width)
//     .attr("height", height)
//   .append("g")
//     .attr("transform", "translate(40,0)");

//   var nodes = cluster.nodes(json),
//       links = cluster.links(nodes);

//   var link = svg.selectAll(".link")
//       .data(links)
//     .enter().append("path")
//       .attr("class", "link")
//       .attr("d", diagonal);

//   var node = svg.selectAll(".node")
//       .data(nodes)
//     .enter().append("g")
//       .attr("class", "node")
//       .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

//   node.append("circle")
//       .attr("r", 4.5);

//   node.append("text")
//       .attr("dx", function(d) { return d.children ? -8 : 8; })
//       .attr("dy", 3)
//       .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
//       .text(function(d) { return d.name; });

// d3.select(self.frameElement).style("height", height + "px");



// };