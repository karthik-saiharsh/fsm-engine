import { Stage, Layer, Group, Circle } from "react-konva";
import { editorState } from "../backend";
import { useAtomValue, useSetAtom } from "jotai";
import { Nodes } from "../backend";

const Editor = () => {
  const currentEditorState = useAtomValue(editorState);

  const nodeList = useAtomValue(Nodes);
  const updateNodeList = useSetAtom(Nodes);

  // Handle Creating Nodes by clicking
  function handleClick(e: any) {
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
      },
    ]);
  }

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      draggable={currentEditorState == "select"}
      onClick={handleClick}
    >
      <Layer>
        <Group>
          {nodeList.map((node) => (
            <Circle
              key={node.id}
              x={node.x}
              y={node.y}
              radius={node.radius}
              fill={node.fill}
              draggable={currentEditorState == "select"}
            />
          ))}
        </Group>
      </Layer>
    </Stage>
  );
};

export default Editor;
