import { Stage, Layer, Group, Circle, Text, Arrow } from "react-konva";
import { node_list, editor_state, stage_ref } from "../lib/stores";
import { useAtom, useAtomValue } from "jotai";
import {
  HandleEditorClick,
  HandleDragEnd,
  HandleStateClick,
  HandleScrollWheel,
} from "../lib/editor";

const Editor = () => {
  // Jotai Atoms
  const nodeList = useAtomValue(node_list);
  const editorState = useAtomValue(editor_state);
  const [stageRef, setStageRef] = useAtom(stage_ref);
  // Jotai Atoms

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onClick={HandleEditorClick}
      draggable={editorState == "Pan"}
      ref={(el) => setStageRef(el)}
      onWheel={HandleScrollWheel}
    >
      <Layer>
        <Group>
          {
            /******** Display The States of the FSM ********/
            nodeList.map(
              (circle, i) =>
                circle && (
                  <Group
                    key={i}
                    id={`state_${circle.id}`}
                    x={circle.x}
                    y={circle.y}
                    draggable={!["Add", "Remove"].includes(editorState)}
                    onDragEnd={(e) => HandleDragEnd(e, circle.id)}
                    onClick={(e) => HandleStateClick(e, circle.id)}
                  >
                    <Circle
                      x={0}
                      y={0}
                      radius={2 * circle.name.length + circle.radius}
                      fill={circle.fill}
                    />
                    <Text
                      x={-circle.radius - circle.name.length / 2}
                      y={-circle.radius / 4.5}
                      width={2 * circle.radius + circle.name.length}
                      height={2 * circle.radius}
                      text={circle.name}
                      fontSize={20}
                      fill="#ffffff"
                      align="center"
                    />

                    {/* If state is initial, draw an incoming arrow */}
                    {circle.type.initial && (
                      <Arrow
                        id="start_arrow"
                        x={-1 * (2 * circle.radius + 2.5*circle.name.length)}
                        y={0}
                        points={[-circle.radius / 1.5, 0, circle.radius - 5, 0]}
                        pointerLength={10}
                        pointerWidth={10}
                        fill={"#ffffff80"}
                        stroke={"#ffffff80"}
                        strokeWidth={3}
                      />
                    )}

                    {/* If state is final, draw an extra outer circle */}
                    {circle.type.final && (
                      <Circle
                        x={0}
                        y={0}
                        radius={2 * circle.name.length + circle.radius + 5}
                        fill={"transparent"}
                        strokeWidth={3}
                        stroke={circle.fill}
                      />
                    )}
                  </Group>
                )
            )
          }
        </Group>
      </Layer>
    </Stage>
  );
};

export default Editor;
