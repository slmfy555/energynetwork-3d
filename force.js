// Random tree
// 这里原始数据是 papers5和edge4
const csvdata = d3.csv("nodes.csv", function (data1) {
  d3.csv("edge_2_year.csv", function (data2) {
    var nodedata = Array();
    var edgedata = Array();
    for (var i = 0; i < data1.length; i++) {
      nodedata.push(data1[i]);
    }
    for (var i = 0; i < data2.length; i++) {
      edgedata.push(data2[i]);
    }
    // console.log(nodedata);
    // console.log(edgedata);

    const node = [];
    const edge = [];
    let size2 = edgedata.length;
    for (let i = 0; i < size2; i++) {
      let a = {};
      a.id = edgedata[i].id;
      a.source = edgedata[i].target;
      a.target = edgedata[i].source;
      a.year = edgedata[i].year;
      // a.date = edgedata[i].date;
      edge.push(a);
    }
    let size = nodedata.length;
    for (let i = 0; i < size; i++) {
      let a = {};
      a.id = nodedata[i].id;
      a.year = nodedata[i].publication_year;
      // a.date = nodedata[i].publication_date;
      node.push(a);
    }
    // console.log(node);

    // console.log(edge);
    const initData = {};
    initData.nodes = node;
    initData.links = edge;
    // console.log(initData)
    initData.links.forEach((link) => {
      // 这里设置的源节点和目标节点是相反的，为了表示粒子流动方向是从旧到新
      const a = initData.nodes[link.target];
      const b = initData.nodes[link.source];
      !a.neighbors && (a.neighbors = []);
      !b.neighbors && (b.neighbors = []);
      a.neighbors.push(b);
      b.neighbors.push(a);

      !a.links && (a.links = []);
      !b.links && (b.links = []);
      a.links.push(link);
      b.links.push(link);
    });
    const highlightNodes = new Set();
    const highlightLinks = new Set();
    let hoverNode = null;

    // console.log(initData);
    // const initData = {
    //     nodes: [ {id: 0 } ],
    //     links: []
    //   };
    const elem = document.getElementById("3d-graph");

    const Graph = ForceGraph3D()(elem)
      .graphData(initData)
      .enableNodeDrag(false)
      .nodeLabel("id")
      // .dagMode('null')
      .nodeRelSize(2)
      .nodeOpacity(1)
      .linkOpacity(0.2)
      // 箭头属性
      .linkDirectionalArrowLength(7.5)
      .linkDirectionalArrowRelPos(1)
      // 发射粒子属性
      // .linkDirectionalParticles(1)
      .linkDirectionalParticleSpeed(0.02)
      // .linkDirectionalParticleWidth(10)
      // .linkDirectionalParticleColor(()=>'rgba(255,0,0,0.1)')
      //   .onNodeClick(removeNode)
      .nodeColor((node) =>
        highlightNodes.has(node)
          ? node === hoverNode
            ? "rgb(255,0,0,1)"
            : "rgba(255,160,0,0.8)"
          : "rgba(0,255,255,0.6)"
      )
      .linkWidth((link) => (highlightLinks.has(link) ? 4 : 1))
      .linkDirectionalParticles((link) => (highlightLinks.has(link) ? 4 : 0))
      .linkDirectionalParticleWidth(4);
    // .onNodeHover(node => {
    //   // no state change
    //   if ((!node && !highlightNodes.size) || (node && hoverNode === node)) return;

    //   highlightNodes.clear();
    //   highlightLinks.clear();
    //   if (node) {
    //     highlightNodes.add(node);
    //     node.neighbors.forEach(neighbor => highlightNodes.add(neighbor));
    //     node.links.forEach(link => highlightLinks.add(link));
    //   }

    //   hoverNode = node || null;

    //   updateHighlight();
    // })
    // .onLinkHover(link => {
    //   highlightNodes.clear();
    //   highlightLinks.clear();

    //   if (link) {
    //     highlightLinks.add(link);
    //     highlightNodes.add(link.source);
    //     highlightNodes.add(link.target);
    //   }

    //   updateHighlight();
    // });
    // function updateHighlight() {
    //   // trigger update of highlighted objects in scene
    //   Graph
    //     .nodeColor(Graph.nodeColor())
    //     .linkWidth(Graph.linkWidth())
    //     .linkDirectionalParticles(Graph.linkDirectionalParticles());
    // }
    Graph.nodeVisibility(false).linkVisibility(false);

    //   setInterval(() => {
    //     const { nodes, links } = Graph.graphData();
    //     const id = nodes.length;
    //     Graph.graphData({
    //       nodes: [...nodes, { id }],
    //       links: [...links, { source: id, target: Math.round(Math.random() * (id-1)) }]
    //     });
    //   }, 1000);

    //
    // var nowyear = settings.year;

    function startinterval() {
      if (settings.year < 2023) {
        d3.select("#text").text(settings.year).style("color", "white");
      }

      // if (settings.year == 2023) {
      //   //2023
      //   Graph.nodeVisibility(true).linkVisibility(true);
      //   clearInterval(end1);
      //   console.log("stop");
      // }
      // console.log(i++)
      Graph.nodeVisibility((node) => {
        //console.log(node.attributes.year);
        //if(node.attributes.year){
        // console.log(node)
        // console.log(node.x,node.y,node.z,node.id)
        if (node.year <= settings.year) {
          return node;
        }
        //}
      }, true);
      Graph.linkVisibility((link) => {
        if (link.year <= settings.year) {
          return node;
        }
      }, true);

      if (settings.year < 2023) {
        controlleryear.updateDisplay();
        settings.year += 1;
      }

      // console.log(nowyear++);
    }
    var end1 = setInterval(startinterval, 1000);

    d3.select("#btn1").on("click", btn1click);
    d3.select("#btn2").on("click", btn2click);
    var isload = true;
    function btn2click() {
      highlightNodes.clear();
      highlightLinks.clear();
      updateHighlight();
    }
    function btn1click() {
      if (isload) {
        isload = false;
        d3.select("#btn1").text("Load");
        clearInterval(end1);
      } else {
        isload = true;
        d3.select("#btn1").text("Pause");
        end1 = setInterval(startinterval, 1000);
      }
    }
    // setInterval(() => {

    // },5000);

    //Define GUI
    const Settings = function () {
      this.year = 1980;
      this.nodeSize = 2;
      this.linkOpacity = 0.2;
      this.DAG = null;
      this.nodeOpacity = 1;
      this.arrowLength = 7.5;
      this.arrowRelPos = 1;
      this.Particles = 1;
      this.ParticleSpeed = 0.02;
      this.ParticleWidth = 10;
      this.cameraRotation = false;
      this.cameraRotationSpeed = 0.02;
      this.cameraPosition = 1400;
    };
    const settings = new Settings();
    const gui = new dat.GUI();
    // 年份进度条
    const controlleryear = gui.add(settings, "year", 1975, 2022).step(1);
    // 节点大小
    const controllernodeSize = gui.add(settings, "nodeSize", 0, 50).step(1);
    // 节点和边透明度
    const controllerlinkOpacity = gui
      .add(settings, "linkOpacity", 0, 1)
      .step(0.1);
    const controllernodeOpacity = gui
      .add(settings, "nodeOpacity", 0, 1)
      .step(0.1);
    // 箭头长度和位置
    const controllerarrowLength = gui
      .add(settings, "arrowLength", 0, 50)
      .step(1);
    const controllerarrowRelPos = gui
      .add(settings, "arrowRelPos", 0, 1)
      .step(0.1);
    // 发射的粒子
    // const controllerParticles = gui.add(settings, "Particles", 0, 10).step(1);
    // const controllerParticleSpeed = gui.add(settings, "ParticleSpeed", 0, 0.49).step(0.01);
    // const controllerParticleWidth = gui.add(settings, "ParticleWidth", 0, 50).step(1);
    const controllerDAG = gui.add(settings, "DAG", [
      "td",
      "bu",
      "lr",
      "rl",
      "zout",
      "zin",
      "radialout",
      "radialin",
      null,
    ]);

    // 相机
    const controllercameraRotation = gui.add(settings, "cameraRotation");
    const controllercameraRoationSpeed = gui
      .add(settings, "cameraRotationSpeed", 0, 0.06)
      .step(0.005);
    const controllercameraPosition = gui
      .add(settings, "cameraPosition", 1000, 10000)
      .step(1000);

    controllerDAG.onChange(
      (orientation) => Graph && Graph.dagMode(orientation)
    );
    controllernodeOpacity.onChange(updateNodeOpacity);
    controlleryear.onChange(updateYear);
    controllernodeSize.onChange(updateNodeSize);
    controllerlinkOpacity.onChange(updateLinkOpacity);
    controllerarrowLength.onChange(updatearrowLength);
    controllerarrowRelPos.onChange(updatearrowRelPos);
    controllercameraPosition.onChange(updatecameraPosition);
    // controllerParticles.onChange(updateParticles);
    // controllerParticleSpeed.onChange(updateParticleSpeed);
    // controllerParticleWidth.onChange(updateParticleWidth);
    let angle = 0;
    setInterval(() => {
      if (settings.cameraRotation) {
        Graph.cameraPosition({
          x: settings.cameraPosition * Math.sin(angle),
          z: settings.cameraPosition * Math.cos(angle),
        });
        angle += settings.cameraRotationSpeed;
      }
    }, 10);

    function updatecameraPosition() {
      Graph.cameraPosition({ z: settings.cameraPosition });
    }

    function updateParticles() {
      Graph.linkDirectionalParticles(settings.Particles);
    }

    function updateParticleSpeed() {
      Graph.linkDirectionalParticleSpeed(settings.ParticleSpeed);
    }

    function updateParticleWidth() {
      Graph.linkDirectionalParticleWidth(settings.ParticleWidth);
    }

    function updatearrowLength() {
      Graph.linkDirectionalArrowLength(settings.arrowLength);
    }
    function updatearrowRelPos() {
      Graph.linkDirectionalArrowRelPos(settings.arrowRelPos);
    }

    function updateNodeOpacity() {
      Graph.nodeOpacity(settings.nodeOpacity);
    }
    function updateLinkOpacity() {
      Graph.linkOpacity(settings.linkOpacity);
    }
    function updateNodeSize() {
      Graph.nodeRelSize(settings.nodeSize);
    }
    function updateYear() {
      d3.select("#text").text(settings.year);
      Graph.nodeVisibility((node) => {
        //console.log(node.attributes.year);
        //if(node.attributes.year){
        // console.log(node)
        // console.log(node.x,node.y,node.z,node.id)
        if (node.year <= settings.year) {
          return node;
        }
        //}
      }, true);
      Graph.linkVisibility((link) => {
        if (link.year <= settings.year) {
          return node;
        }
      }, true);
    }

    Graph.onNodeClick((node) => {
      console.log(node.id);
      // no state change
      if ((!node && !highlightNodes.size) || (node && hoverNode === node))
        return;

      //  highlightNodes.clear();
      //  highlightLinks.clear();
      if (node) {
        highlightNodes.add(node);
        node.neighbors.forEach((neighbor) => highlightNodes.add(neighbor));
        node.links.forEach((link) => highlightLinks.add(link));
      }

      hoverNode = node || null;

      updateHighlight();
    });
    function updateHighlight() {
      // trigger update of highlighted objects in scene
      Graph.nodeColor(Graph.nodeColor())
        .linkWidth(Graph.linkWidth())
        .linkDirectionalParticles(Graph.linkDirectionalParticles());
      // console.log(highlightNodes)
      // console.log(highlightLinks)
    }
  });
});
