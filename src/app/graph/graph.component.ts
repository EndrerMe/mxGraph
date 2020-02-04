// Vendors
import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

// Extentions
import { ZoomBinding } from 'src/app/shared/extentions/ZoomBinding.extention';
declare const mxCell: any;
declare const mxToolbar: any;
declare const mxGeometry: any;
declare const mxEvent: any;
declare const mxGraphHandler: any;
declare const mxConstants: any;
declare const mxConnectionHandler: any;
declare const mxUtils: any;
declare const mxCircleLayout: any;
declare const mxRubberband: any;
declare const mxConnectionConstraint: any;
declare const mxVertexHandler: any;
declare const mxDragSource: any;
declare const mxPopupMenu: any;
declare const mxGraph: any;
declare const mxConstraintHandler: any;
declare const mxEdgeHandler: any;

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements AfterViewInit {
  @ViewChild('container') container: ElementRef;
  private tb1Container;
  private tb2Container;
  private tb3Container;
  private tb4Container;
  private toolbar1;
  private toolbar2;
  private toolbar3;
  private toolbar4;
  private graph;
  private model;
  private rubberband;
  private layout;
  private currentCell;
  private parent;
  private currentColor = '#fcba03';
  private constraintHandler;
  private combo;
  private menu;

  constructor() { }


  ngAfterViewInit() {
    this.initToolbars();
    this.initGraph();
  }

  private initGraph() {
    this.graph = new mxGraph(this.container.nativeElement);
    this.model = this.graph.getModel();
    this.parent = this.graph.getDefaultParent();
    this.toolbar1.enabled = false;
    this.layout = new mxCircleLayout(this.graph);
    this.menu = new mxPopupMenu();
    this.menu.init();
    this.layout.execute(this.graph.getDefaultParent());
    this.graph.setPanning(true);
    this.graph.panningHandler.useRightButtonForPanning = true;
    ZoomBinding.BindZoomToElement(document, this.graph);
    this.graphSetting();
    this.disableDefaultContextMenu();
    this.disableFloatingConection();
    this.addItemsToToolbar();
    // this.testDraw();
  }

  private addItemsToToolbar() {
    this.addVertex('assets/poligons/02_Green-SQ-32X32.svg', 60, 60, './../../assets/poligons/02_Green-SQ-32X32.svg', this.toolbar1);
    this.addVertex('assets/poligons/02_Green-SQ-32X32.svg', 60, 60, './../../assets/poligons/02_Green-SQ-32X32.svg', this.toolbar1);
    this.addVertex('assets/poligons/02_Green-SQ-32X32.svg', 60, 60, './../../assets/poligons/02_Green-SQ-32X32.svg', this.toolbar1);
    this.addVertex('assets/poligons/02_Green-SQ-32X32.svg', 60, 60, './../../assets/poligons/02_Green-SQ-32X32.svg', this.toolbar2);
    this.addVertex('assets/poligons/02_Green-SQ-32X32.svg', 60, 60, './../../assets/poligons/02_Green-SQ-32X32.svg', this.toolbar3);
    this.addVertex('assets/poligons/02_Green-SQ-32X32.svg', 60, 60, './../../assets/poligons/02_Green-SQ-32X32.svg', this.toolbar4);
  }

  private initToolbars() {
    this.tb1Container = document.getElementById('toolbar1');
    this.tb2Container = document.getElementById('toolbar2');
    this.tb3Container = document.getElementById('toolbar3');
    this.tb4Container = document.getElementById('toolbar4');
    this.toolbar1 = new mxToolbar(this.tb1Container);
    this.toolbar2 = new mxToolbar(this.tb2Container);
    this.toolbar3 = new mxToolbar(this.tb3Container);
    this.toolbar4 = new mxToolbar(this.tb4Container);
  }

  public customCell() {
    const cell = new mxCell('', new mxGeometry(212, 212, 5, 15), 'endArrow=classic;html=1;');
    cell.geometry.setTerminalPoint(new mxPoint(0, 212), true);
    cell.geometry.setTerminalPoint(new mxPoint(212, 0), false);
    cell.geometry.relative = true;
    cell.edge = true;
    this.graph.addCells(cell);
    console.log(cell)
  }

  private disableFloatingConection() {
    if (this.graph.connectionHandler.connectImage == null) {
      this.graph.connectionHandler.isConnectableCell = (cell) => {
        // add 'if' for elements with fixed point for starting edge
        if (cell && cell.type === 'test') {
          return false;
        }
        return true;
      };
      mxEdgeHandler.prototype.isConnectableCell = (cell) => {
        return this.graph.connectionHandler.isConnectableCell(cell);
      };
    }
  }

  private disableDefaultContextMenu(): void {
    mxEvent.disableContextMenu(this.container.nativeElement);
  }

  private graphSetting() {
    this.graph.dropEnabled = true;
    this.graph.setConnectable(true);
    this.graph.setMultigraph(false);
    this.graph.setAllowDanglingEdges(true);
    this.graph.getStylesheet().getDefaultEdgeStyle()['edgeStyle'] = 'orthogonalEdgeStyle';
    this.graph.foldingEnabled = false;
    this.graph.gridEnabled = false;
    mxGraphHandler.prototype.guidesEnabled = true;
    mxEdgeHandler.prototype.snapToTerminals = true;
    mxEdgeHandler.prototype.addEnabled = true;
    mxVertexHandler.prototype.rotationEnabled = true;
    mxConnectionHandler.prototype.movePreviewAway = false;
    mxConnectionHandler.prototype.waypointsEnabled = true;
    mxGraph.prototype.resetEdgesOnConnect = false;
    this.rubberband = new mxRubberband(this.graph);
    this.constraintHandler = new mxConstraintHandler(this.graph);
    this.rubberband.fadeOut = true;
    this.graphEvent();
    this.addListeners();
    this.testAnything();
    // this.edgeSettings();
  }

  public addWaypoints() {
    const cell = this.graph.getModel().getCell(this.currentCell.id);
    const constraint = new mxConnectionConstraint(new mxPoint(1, 0.5), true);
    this.graph.getConnectionPoint(cell, constraint);
  }

  private testAnything() {
    // Waypoints
    this.graph.getAllConnectionConstraints = function(terminal) {
      const cell = terminal.cell;
      if (terminal != null && this.model.isVertex(cell)) {
        return [new mxConnectionConstraint(new mxPoint(1, 1), true)];
      }

      return null;
    };

    mxConstraintHandler.prototype.intersects = (icon, point, source, existingEdge) => {
      return (!source || existingEdge) || mxUtils.intersects(icon.bounds, point);
    };

    // this.toolbar1.addOption(this.combo, 'title', 
    // this.addVertex('assets/poligons/02_Green-SQ-32X32.svg', 60, 60, './../../assets/poligons/02_Green-SQ-32X32.svg'));
  }

  private edgeSettings() {
    this.graph.getAllConnectionConstraints = function(terminal) {
      const geo = (terminal != null) ? this.getCellGeometry(terminal.cell) : null;

      if ((geo != null ? !geo.relative : false) &&
        this.getModel().isVertex(terminal.cell) &&
        this.getModel().getChildCount(terminal.cell) === 0) {
        return [new mxConnectionConstraint(new mxPoint(0, 0.5), false),
          new mxConnectionConstraint(new mxPoint(1, 0.5), false)];
      }

      return null;
    };

    // Makes sure non-relative cells can only be connected via constraints
    this.graph.connectionHandler.isConnectableCell = function(cell) {
      if (this.graph.getModel().isEdge(cell)) {
        return true;
      } else {
        const geo = (cell != null) ? this.graph.getCellGeometry(cell) : null;

        return (geo != null) ? geo.relative : false;
      }
    };
  }

  private addListeners() {
    this.graph.addListener(mxEvent.CLICK, (sender, evt) => {
      const cell = evt.properties.cell;
      if (cell) {
        this.currentCell = cell;
      } else {
        this.currentCell = undefined;
      }
    });

    document.addEventListener('keydown', (e) => {
      if ((e.keyCode === 8 || e.keyCode === 46) && this.currentCell) {
        this.graph.removeCells([this.currentCell]);
      }
    });
  }

  public changeColor() {
    const vertexStyle = this.graph.getStylesheet().getDefaultVertexStyle();
    this.currentColor = this.getRandomColor();
    vertexStyle.fillColor = this.currentColor;
  }

  private getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  public rotateCell() {
    if (this.currentCell) {
      this.graph.getModel().setStyle(this.currentCell, 'rotation=-125;');
    }
  }

  public changeGeometry() {
    if (this.currentCell) {

      this.graph.getModel().setGeometry(this.currentCell,
        new mxGeometry(this.currentCell.geometry.x, this.currentCell.geometry.y, 212, 212));
    }
  }

  public changeVertex() {
    const vertexStyle = this.graph.getStylesheet().getDefaultVertexStyle();
    vertexStyle.strokeWidth = 25;
    vertexStyle.strokeWidth = 7;
  }

  public changeStroke() {
    const vertexStyle = this.graph.getStylesheet().getDefaultVertexStyle();
    this.currentColor = this.getRandomColor();
    vertexStyle.strokeColor = this.currentColor;
  }

  public changeEdge() {
    const edgeStyle = this.graph.getStylesheet().getDefaultEdgeStyle();
    edgeStyle.strokeColor = '#ff0000';
    edgeStyle.strokeWidth = 7;
    // vertexStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_LABEL;
    edgeStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ARROW_CONNECTOR;
    // style[mxConstants.ARROW_WIDTH] = 100;
    // style[mxConstants.STYLE_ROUNDED] = true;
    edgeStyle[mxConstants.STYLE_STARTARROW] = mxConstants.ARROW_OVAL;
    // style[mxConstants.STYLE_PERIMETER] = 'ellipsePerimeter';
    // this.graph.alternateEdgeStyle = 'elbow=vertical';
  }

  private testDraw() {
    const v1 = this.graph.insertVertex(this.parent, null, 'vertexLabelsMovable', 20, 20, 80, 30);
    // Places sublabels inside the vertex
    const label11 = this.graph.insertVertex(v1, null, 'Label1', 0.5, 1, 0, 0, null, true);
    const label12 = this.graph.insertVertex(v1, null, 'Label2', 0.5, 0, 0, 0, null, true);
    // const cell = this.graph.insertVertex(this.parent, '12', '', 150, 150, 15, 75);
    // cell.endge = true;
  }

  private graphEvent() {
    mxDragSource.prototype.getDropTarget = (graph, x, y) => {
      let cell = graph.getCellAt(x, y);

      if (!graph.isValidDropTarget(cell)) {
        cell = null;
      }

      return cell;
    };
  }

  private addVertex(icon, w, h, image, toolbar) {
    const vertex = new mxCell(null, new mxGeometry(0, 0, w, h), ``);
    vertex.setVertex(true);
    vertex.type = 'test';

    this.addToolbarItem(this.graph, this.menu, vertex, icon, toolbar);
  };

  public toggleToolbar(toolbar) {
    const isShow = toolbar.classList.contains('active-toolbar');
    toolbar.classList.toggle('active-toolbar', !isShow);
  }

  private addToolbarItem(graph, menu, prototype, image, toolbar) {
    // Function that is executed when the image is dropped on
    // the graph. The cell argument points to the cell under
    // the mousepointer if there is one.
    const funct = (graph, evt, cell) => {
      graph.stopEditing(false);

      const pt = graph.getPointForEvent(evt);
      const vertex = graph.getModel().cloneCell(prototype);
      vertex.geometry.x = pt.x;
      vertex.geometry.y = pt.y;

      graph.setSelectionCells(graph.importCells([vertex], 0, 0, cell));
    }

    // Creates the image which is used as the drag icon (preview)
    const img = toolbar.addMode('null', image, funct, null, 'toolbar-element');
    mxUtils.makeDraggable(img, graph, funct);
  }

  private mxVertexToolHandler(state) {
    mxVertexHandler.apply(this, arguments);
  }

}
