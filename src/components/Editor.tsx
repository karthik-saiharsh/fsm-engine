//@ts-nocheck
import { Stage, Layer, Group, Circle, Text } from "react-konva";
import { editorState, currentSelected } from "../lib/backend";
import { useAtomValue, useSetAtom } from "jotai";
import { Nodes } from "../lib/backend";
import { useRef } from "react";

const Editor = () => {
  let currentEditorState = useAtomValue(editorState);

  let nodeList = useAtomValue(Nodes);
  let updateNodeList = useSetAtom(Nodes);

  let currSelected = useAtomValue(currentSelected);
  let setCurrSelected = useSetAtom(currentSelected);

  // Konva Layer Reference
  let layerRef = useRef(null);

  // Handle Creating Nodes by clicking
  function handleEditorClick(e: any) {
    // Return if not in create mode
    if (currentEditorState != "create") return;

    const group = e.target.getStage().findOne("Group");
    if (!group) return;

    const clickPos = group.getRelativePointerPosition();

    updateNodeList((nodes: Node[]) => [
      ...nodes,
      {
        x: clickPos.x,
        y: clickPos.y,
        radius: 35,
        fill: "#ffffff80",
        id: nodes.length,
        strokeWidth: 0,
        strokeColor: "#ffffff",
        name: `q${nodes.length}`,
        type: nodeList.length == 0 ? "initial" : "intermediate",
      },
    ]);
  }

  // Handle Node Deletion/Selection
  function handleNodeClick(id) {
    // If editor state is set to delete mode, remove the state
    const clickedNode = layerRef.current.findOne(`#${id}`);

    if (currentEditorState == "delete") {
      const clickedGroup = layerRef.current.findOne(`#g${id}`);
      clickedGroup.destroy(); // Delete the Node

      // Update the nodeList store
      nodeList[id] = undefined;
      updateNodeList(nodeList);

      // If the deleted Node is the one currently selected
      // Then deselect it
      if (currSelected == id) setCurrSelected("nil");
      return;
    }

    // Draw a stroke around the selected node
    clickedNode.to({
      duration: 0.1,
      strokeWidth: 2,
      easing: Konva.Easings.EaseInOut,
    });

    // Deselected the old node if any available
    if (currSelected != "nil") {
      const oldNode = layerRef.current.findOne(`#${currSelected}`);

      oldNode.to({
        duration: 0.1,
        strokeWidth: 0,
        easing: Konva.Easings.EaseInOut,
      });
    }

    // If same node is clicked, toggle selection
    if (currSelected == id) {
      setCurrSelected("nil");
    } else {
      // Update value of current selected
      setCurrSelected(id);
    }
  }

  // Handle Updating Node Positions when dragged around
  function handleNodeDrag(id) {
    const draggedNode = layerRef.current.findOne(`#g${id}`);

    nodeList[id].x = draggedNode.x();
    nodeList[id].y = draggedNode.y();
    updateNodeList(nodeList);
  }

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      draggable={currentEditorState == "grab"}
      onClick={handleEditorClick}
    >
      <Layer ref={layerRef}>
        <Group key={nodeList}>
          {nodeList.map(
            (node) =>
              node && (
                <Group
                  key={node.name}
                  x={node.x}
                  y={node.y}
                  id={`g${node.id}`}
                  draggable={currentEditorState == "select"}
                  onClick={() => handleNodeClick(node.id)}
                  onDragEnd={() => handleNodeDrag(node.id)}
                >
                  <Circle
                    x={0}
                    y={0}
                    id={`${node.id}`}
                    radius={2 * node.name.length + node.radius}
                    fill={node.fill}
                    strokeWidth={node.strokeWidth}
                    stroke={node.strokeColor}
                  />

                  <Text
                    x={-node.radius}
                    y={-node.radius/3}
                    width={2 * node.radius}
                    height={2 * node.radius}
                    text={node.name}
                    fontSize={20}
                    fill="#ffffff"
                    align="center"
                  />
                </Group>
              )
          )}
        </Group>
      </Layer>
    </Stage>
  );
};

export default Editor;
