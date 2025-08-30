import { Stage, Layer, Rect, Circle } from "react-konva";
import { editorState } from "../backend";
import { useAtomValue } from "jotai";

const Editor = () => {
  const currentEditorState = useAtomValue(editorState);

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      draggable={currentEditorState == "select"}
    >
      <Layer>
        <Rect
          x={20}
          y={50}
          width={100}
          height={100}
          fill="red"
          shadowBlur={10}
          draggable={currentEditorState == "select"}
        />
        <Circle x={200} y={100} radius={50} fill="green" draggable={currentEditorState == "select"} />
      </Layer>
    </Stage>
  );
};

export default Editor;
