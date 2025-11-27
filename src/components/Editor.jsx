import { Stage, Layer, Group, Circle, Text, Arrow, Label, Tag } from "react-konva";
import {
  node_list,
  editor_state,
  stage_ref,
  transition_list,
  layer_ref,
} from "../lib/stores";
import { useAtom, useAtomValue } from "jotai";

import {
  HandleDragEnd,
  HandleEditorClick,
  HandleScrollWheel,
  HandleStateClick,
  HandleStateDrag,
} from "../lib/editor";
import { handleTransitionClick } from "../lib/transitions";

const Editor = () => {
  // Jotai Atoms
  const nodeList = useAtomValue(node_list);
  const editorState = useAtomValue(editor_state);
  const [_stageRef, setStageRef] = useAtom(stage_ref);
  const [transitionList, _setTransitionList] = useAtom(transition_list);
  const [_layerRef, setLayerRef] = useAtom(layer_ref);
  // Jotai Atoms

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onClick={HandleEditorClick}
      draggable
      ref={(el) => setStageRef(el)}
      onWheel={HandleScrollWheel}
    >
      <Layer ref={(el) => setLayerRef(el)}>
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
                    onDragEnd={(e) => {
                      HandleDragEnd(e, circle.id);
                      HandleStateDrag(e, circle.id);
                    }}
                    // onDragMove={(e) => HandleStateDrag(e, circle.id)}
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
                      y={-circle.radius / 4}
                      width={2 * circle.radius + circle.name.length}
                      height={2 * circle.radius}
                      text={circle.name}
                      fontSize={20}
                      fontStyle="bold"
                      fill="#ffffff"
                      align="center"
                    />

                    {/* If state is initial, draw an incoming arrow */}
                    {circle.type.initial && (
                      <Arrow
                        id="start_arrow"
                        x={-1 * (2 * circle.radius + 2.5 * circle.name.length)}
                        y={0}
                        points={[-circle.radius / 1.5, 0, circle.radius - 5, 0]}
                        pointerLength={10}
                        pointerWidth={10}
                        fill={"#ffffffdd"}
                        stroke={"#ffffffdd"}
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
          <Group key={transitionList}>
            {
              /******** Display The Transitions of the FSM ********/
              transitionList.map(
                (transition, idx) =>
                  transition && (
                    <Group key={idx} id={`tr_${transition.id}`}>
                      {/* Transition arrow object */}
                      <Arrow
                        id={`transition_${transition.id}`}
                        stroke={transition.stroke}
                        strokeWidth={transition.strokeWidth}
                        fill={transition.fill}
                        points={transition.points}
                        tension={transition.tension}
                        onClick={() => handleTransitionClick(transition.id)}
                      />
                      {/* Add a Label to the middle of the arrow */}
                      <Label
                        id={`tr_label${transition.id}`}
                        x={
                          transition.points[2] -
                          2 * transition.name.toString().length
                        }
                        y={transition.points[3] - 10}
                        onClick={() => handleTransitionClick(transition.id)}
                      >
                        <Tag
                          fill="#ffffff50"
                          opacity={0.8}
                          cornerRadius={5}
                          pointerDirection="down"
                          pointerWidth={10}
                          pointerHeight={10}
                          lineJoin="round"
                        />
                        <Text
                          id={`trtext_${transition.id}`}
                          text={
                            transition.name.length == 0
                              ? "tr"
                              : transition.name.toString()
                          }
                          fontSize={transition.fontSize}
                          fontStyle={transition.fontStyle}
                          fill={transition.name_fill}
                          align={transition.name_align}
                          padding={5}
                        />
                      </Label>
                    </Group>
                  )
              )
            }
          </Group>
        </Group>
      </Layer>
    </Stage>
  );
};

export default Editor;
