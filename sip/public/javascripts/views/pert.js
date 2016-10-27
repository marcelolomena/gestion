$(document).ready(function () {
    if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
    var $ = go.GraphObject.make;  // for more concise visual tree definitions

    // colors used, named for easier identification
    var blue = "#0288D1";
    var pink = "#B71C1C";
    var pinkfill = "#F8BBD0";
    var bluefill = "#B3E5FC";

    function changeColor(e, obj) {
        /*
        myDiagram.startTransaction("changed color");
        // get the context menu that holds the button that was clicked
        var contextmenu = obj.part;
        // get the node data to which the Node is data bound
        var nodedata = contextmenu.data;
        // compute the next color for the node
        var newcolor = "lightblue";
        switch (nodedata.color) {
            case "lightblue": newcolor = "lightgreen"; break;
            case "lightgreen": newcolor = "lightyellow"; break;
            case "lightyellow": newcolor = "orange"; break;
            case "orange": newcolor = "lightblue"; break;
        }
        // modify the node data
        // this evaluates data Bindings and records changes in the UndoManager
        myDiagram.model.setDataProperty(nodedata, "color", newcolor);
        myDiagram.commitTransaction("changed color");
        */
        bootbox.prompt({
            title: "Ingresar Comentario!",
            inputType: 'textarea',
            callback: function (result) {
                console.log(result);
            }
        });
    }

    myDiagram =
        $(go.Diagram, "myDiagramDiv",
            {
                initialAutoScale: go.Diagram.Uniform,
                initialContentAlignment: go.Spot.Center,
                layout: $(go.LayeredDigraphLayout)
            });

    // The node template shows the activity name in the middle as well as
    // various statistics about the activity, all surrounded by a border.
    // The border's color is determined by the node data's ".critical" property.
    // Some information is not available as properties on the node data,
    // but must be computed -- we use converter functions for that.
    myDiagram.nodeTemplate =
        $(go.Node, "Auto",
            $(go.Shape, "Rectangle",  // the border
                { fill: "white", strokeWidth: 2 },
                new go.Binding("fill", "critical", function (b) { return (b ? pinkfill : bluefill); }),
                new go.Binding("stroke", "critical", function (b) { return (b ? pink : blue); })),
            $(go.Panel, "Table",
                { padding: 0.5 },
                $(go.RowColumnDefinition, { column: 1, separatorStroke: "black" }),
                $(go.RowColumnDefinition, { column: 2, separatorStroke: "black" }),
                $(go.RowColumnDefinition, { row: 1, separatorStroke: "black", background: "white", coversSeparators: true }),
                $(go.RowColumnDefinition, { row: 2, separatorStroke: "black" }),
                $(go.TextBlock, // earlyStart
                    new go.Binding("text", "earlyStart"),
                    { row: 0, column: 0, margin: 5, textAlign: "center" }),
                $(go.TextBlock,
                    new go.Binding("text", "length"),
                    { row: 0, column: 1, margin: 5, textAlign: "center" }),
                $(go.TextBlock,  // earlyFinish
                    new go.Binding("text", "",
                        function (d) { return (d.earlyStart + d.length).toFixed(2); }),
                    { row: 0, column: 2, margin: 5, textAlign: "center" }),

                $(go.TextBlock,
                    new go.Binding("text", "text"),
                    {
                        row: 1, column: 0, columnSpan: 3, margin: 5,
                        textAlign: "center", font: "bold 14px sans-serif"
                    }),

                $(go.TextBlock,  // lateStart
                    new go.Binding("text", "",
                        function (d) { return (d.lateFinish - d.length).toFixed(2); }),
                    { row: 2, column: 0, margin: 5, textAlign: "center" }),
                $(go.TextBlock,  // slack
                    new go.Binding("text", "",
                        function (d) { return (d.lateFinish - (d.earlyStart + d.length)).toFixed(2); }),
                    { row: 2, column: 1, margin: 5, textAlign: "center" }),
                $(go.TextBlock, // lateFinish
                    new go.Binding("text", "lateFinish"),
                    { row: 2, column: 2, margin: 5, textAlign: "center" }),

                $(go.TextBlock, { margin: 5 },

                    new go.Binding("text", "key")),
                { // second arg will be this GraphObject, which in this case is the Node itself:
                    contextMenu:     // define a context menu for each node
                    $(go.Adornment, "Vertical",  // that has one button
                        $("ContextMenuButton",
                            $(go.TextBlock, "Formulario"),
                            { click: changeColor })
                        // more ContextMenuButtons would go here
                    )  // end Adornment
                }

            )  // end Table Panel
        );  // end Node


    // also define a context menu for the diagram's background
    myDiagram.contextMenu =
        $(go.Adornment, "Vertical",
            $("ContextMenuButton",
                $(go.TextBlock, "Undo"),
                { click: function (e, obj) { e.myDiagram.commandHandler.undo(); } },
                new go.Binding("visible", "", function (o) {
                    return o.myDiagram.commandHandler.canUndo();
                }).ofObject()),
            $("ContextMenuButton",
                $(go.TextBlock, "Redo"),
                { click: function (e, obj) { e.myDiagram.commandHandler.redo(); } },
                new go.Binding("visible", "", function (o) {
                    return o.myDiagram.commandHandler.canRedo();
                }).ofObject()),
            // no binding, always visible button:
            $("ContextMenuButton",
                $(go.TextBlock, "New Node"),
                {
                    click: function (e, obj) {
                        var diagram = e.myDiagram;
                        diagram.startTransaction('new node');
                        var data = {};
                        diagram.model.addNodeData(data);
                        part = diagram.findPartForData(data);
                        part.location = diagram.toolManager.contextMenuTool.mouseDownPoint;
                        diagram.commitTransaction('new node');
                    }
                })
        );

    // The link data object does not have direct access to both nodes
    // (although it does have references to their keys: .from and .to).
    // This conversion function gets the GraphObject that was data-bound as the second argument.
    // From that we can get the containing Link, and then the Link.fromNode or .toNode,
    // and then its node data, which has the ".critical" property we need.
    //
    // But note that if we were to dynamically change the ".critical" property on a node data,
    // calling myDiagram.model.updateTargetBindings(nodedata) would only update the color
    // of the nodes.  It would be insufficient to change the appearance of any Links.
    function linkColorConverter(linkdata, elt) {
        var link = elt.part;
        if (!link) return blue;
        var f = link.fromNode;
        if (!f || !f.data || !f.data.critical) return blue;
        var t = link.toNode;
        if (!t || !t.data || !t.data.critical) return blue;
        return pink;  // when both Link.fromNode.data.critical and Link.toNode.data.critical
    }

    // The color of a link (including its arrowhead) is red only when both
    // connected nodes have data that is ".critical"; otherwise it is blue.
    // This is computed by the binding converter function.
    myDiagram.linkTemplate =
        $(go.Link,
            { toShortLength: 6, toEndSegmentLength: 20 },
            $(go.Shape,
                { strokeWidth: 4 },
                new go.Binding("stroke", "", linkColorConverter)),
            $(go.Shape,  // arrowhead
                { toArrow: "Triangle", stroke: null, scale: 1.5 },
                new go.Binding("fill", "", linkColorConverter))
        );

    // here's the data defining the graph
    var nodeDataArray = [
        { key: 1, text: "Start", length: 0, earlyStart: 0, lateFinish: 0, critical: true },
        { key: 2, text: "Ingresar Solicitud", length: 4, earlyStart: 0, lateFinish: 4, critical: true },
        { key: 3, text: "Validar y activar solicitud", length: 5.33, earlyStart: 0, lateFinish: 9.17, critical: false },
        { key: 4, text: "Generar RPF", length: 5.17, earlyStart: 4, lateFinish: 9.17, critical: true },
        { key: 5, text: "Enviar Invitaciones", length: 6.33, earlyStart: 4, lateFinish: 15.01, critical: false },
        { key: 6, text: "Recibir Y valorar Propuestas", length: 5.17, earlyStart: 9.17, lateFinish: 14.34, critical: true },
        { key: 7, text: "Generar Ficha", length: 4.5, earlyStart: 10.33, lateFinish: 19.51, critical: false },
        { key: 8, text: "TAREA EXTERNA", length: 5.17, earlyStart: 14.34, lateFinish: 19.51, critical: true },
        { key: 9, text: "Ajustar Clausulas Legales", length: 0, earlyStart: 19.51, lateFinish: 19.51, critical: true }
    ];
    var linkDataArray = [
        { from: 1, to: 2 },
        { from: 1, to: 3 },
        { from: 2, to: 4 },
        { from: 2, to: 5 },
        { from: 3, to: 6 },
        { from: 4, to: 6 },
        { from: 5, to: 7 },
        { from: 6, to: 8 },
        { from: 7, to: 9 },
        { from: 8, to: 9 }
    ];
    myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

    // create an unbound Part that acts as a "legend" for the diagram
    myDiagram.add(
        $(go.Node, "Auto",
            $(go.Shape, "Rectangle",  // the border
                { fill: bluefill }),
            $(go.Panel, "Table",
                $(go.RowColumnDefinition, { column: 1, separatorStroke: "black" }),
                $(go.RowColumnDefinition, { column: 2, separatorStroke: "black" }),
                $(go.RowColumnDefinition, { row: 1, separatorStroke: "black", background: bluefill, coversSeparators: true }),
                $(go.RowColumnDefinition, { row: 2, separatorStroke: "black" }),
                $(go.TextBlock, "Early Start",
                    { row: 0, column: 0, margin: 5, textAlign: "center" }),
                $(go.TextBlock, "Length",
                    { row: 0, column: 1, margin: 5, textAlign: "center" }),
                $(go.TextBlock, "Early Finish",
                    { row: 0, column: 2, margin: 5, textAlign: "center" }),

                $(go.TextBlock, "Activity Name",
                    {
                        row: 1, column: 0, columnSpan: 3, margin: 5,
                        textAlign: "center", font: "bold 14px sans-serif"
                    }),

                $(go.TextBlock, "Late Start",
                    { row: 2, column: 0, margin: 5, textAlign: "center" }),
                $(go.TextBlock, "Slack",
                    { row: 2, column: 1, margin: 5, textAlign: "center" }),
                $(go.TextBlock, "Late Finish",
                    { row: 2, column: 2, margin: 5, textAlign: "center" })
            )  // end Table Panel
        ));
});