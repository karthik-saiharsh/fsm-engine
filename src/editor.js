$(document).ready(function () {
  // first we need to create a stage
  let stage = new Konva.Stage({
    container: "editor-container", // id of container <div>
    width: $(window).width(),
    height: $(window).height(),
  });

  // then create layer
  layerRef = new Konva.Layer();

  // create our shape
  var circle = new Konva.Circle({
    x: stage.width() / 2,
    y: stage.height() / 2,
    radius: 70,
    fill: "red",
    stroke: "black",
    strokeWidth: 4,
  });

  // add the shape to the layer
  layerRef.add(circle);

  // add the layer to the stage
  stage.add(layerRef);
});
