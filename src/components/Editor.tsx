//@ts-nocheck
import { Stage, Layer, Group, Circle } from "react-konva";
import { editorState, currentSelected } from "../lib/backend";
import { useAtomValue, useSetAtom } from "jotai";
import { Nodes } from "../lib/backend";
import { useRef } from "react";

const Editor = () => {
  const currentEditorState = useAtomValue(editorState);

  const nodeList = useAtomValue(Nodes);
  const updateNodeList = useSetAtom(Nodes);

  const currSelected = useAtomValue(currentSelected);
  const setCurrSelected = useSetAtom(currentSelected);

  // Konva Layer Reference
  const layerRef = useRef(null);

  // Handle Creating Nodes by clicking
  function createNode(e: any) {
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
      },
    ]);
  }

  // Handle Node Deletion
  function deleteNode(id) {
    const selectedNode = layerRef.current.findOne(`#${id}`);

    // If editor state is set to delete mode, remove the state
    if (currentEditorState == "delete") {
      selectedNode.destroy();
      return;
    }

    // Draw a stroke around the selected node
    selectedNode.to({
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
      setCurrSelected('nil')
    } else {
      // Update value of current selected
      setCurrSelected(id);
    }
  }

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      draggable={currentEditorState == "grab"}
      onClick={createNode}
    >
      <Layer ref={layerRef}>
        <Group>
          {nodeList.map((node) => (
            <Circle
              key={node.id}
              x={node.x}
              y={node.y}
              radius={node.radius}
              fill={node.fill}
              draggable={currentEditorState == "select"}
              id={`${node.id}`}
              onClick={() => deleteNode(node.id)}
              strokeWidth={node.strokeWidth}
              stroke={node.strokeColor}
            />
          ))}
        </Group>
      </Layer>
    </Stage>
  );
};

export default Editor;
