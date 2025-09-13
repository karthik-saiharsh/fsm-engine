//@ts-nocheck
import { Stage, Layer, Group, Circle, Text, Arrow } from "react-konva";
import {
  editorState,
  currentSelected,
  arrowStates,
  arrows,
} from "../lib/backend";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Nodes } from "../lib/backend";
import { useRef, useState } from "react";
import clsx from "clsx";
import { Check, X } from "lucide-react";

const Editor = () => {
  const currentEditorState = useAtomValue(editorState);

  const [nodeList, updateNodeList] = useAtom(Nodes);

  const [currSelected, setCurrSelected] = useAtom(currentSelected);

  const [transitionTracker, setTransitionTracker] = useAtom(arrowStates);
  const [transitions, updateTransitions] = useAtom(arrows);

  const [trNameEditor, setTrNameEditor] = useState([
    false,
    undefined,
    undefined,
  ]); // Will have [show/hide, current text, transition text id]

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
        transitions: [],
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

      transitions.forEach((tr) => {
        let tre = null;
        let trText = null;
        if (tr && (tr.from == id || tr.to == id)) {
          tre = layerRef.current.findOne(`#tr${tr.id}`);
          tre.destroy(); // Delete the arrow

          trText = layerRef.current.findOne(`#trtext${tr.id}`);
          trText.destroy(); // Also delete the Label of the transition

          // Delete the transition for the other node participating in the state
          if (tr.from == id) {
            const aliveNodeTransitions = nodeList[tr.to].transitions;

            for (let i = 0; i < aliveNodeTransitions.length; i++) {
              if (aliveNodeTransitions[i].trId == tr.id) {
                nodeList[tr.to].transitions.splice(i, 1);
              }
            }
          } else {
            const aliveNodeTransitions = nodeList[tr.from].transitions;

            for (let i = 0; i < aliveNodeTransitions.length; i++) {
              if (aliveNodeTransitions[i].trId == tr.id) {
                nodeList[tr.from].transitions.splice(i, 1);
              }
            }
          }

          transitions[tr.id] = undefined; // remove the arrow entry from the array
        }
      });

      updateTransitions(transitions);

      // Update the nodeList store
      nodeList[id] = undefined;
      updateNodeList(nodeList);

      // If the deleted Node is the one currently selected
      // Then deselect it
      if (currSelected == id) setCurrSelected("nil");

      return;
    }

    // If current editor state is connect
    if (currentEditorState == "connect") {
      // Track which two states are clicked on
      if (transitionTracker == undefined) {
        setTransitionTracker(id);
        return;
      } else {
        const points = getPoints(transitionTracker, id);

        const newTransition = {
          id: transitions.length,
          from: transitionTracker,
          to: id,
          points: points,
          stroke: "#ffffffe6",
          strokeWidth: 2,
          fill: "#ffffffe6",
          name: `transition ${transitions.length}`,
          tension: transitionTracker == id ? 1 : 0.5,
        };

        transitions.push(newTransition);
        updateTransitions(transitions);

        // Add this transition to the correcponding node
        nodeList[transitionTracker].transitions.push({
          from: undefined,
          to: id,
          trId: transitions.length - 1,
        });

        nodeList[id].transitions.push({
          from: transitionTracker,
          to: undefined,
          trId: transitions.length - 1,
        });
        updateNodeList(nodeList);
        setTransitionTracker(undefined);
        return;
      }
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

    // Update position of arrows if they exist
    if (nodeList[id].transitions.length > 0) {
      nodeList[id].transitions.forEach((tr) => {
        let points = [];

        if (tr.from == undefined) points = getPoints(id, tr.to);

        if (tr.to == undefined) points = getPoints(tr.from, id);

        // Update points in the global store
        transitions[tr.trId].points = points;
        updateTransitions(transitions);

        // Update position on the editor
        const arr = layerRef.current.findOne(`#tr${tr.trId}`);
        arr.points(points);

        // Update Position of text
        const trText = layerRef.current.findOne(`#trtext${tr.trId}`);
        trText.x(points[2] - 3 * transitions[tr.trId].name.length);
        trText.y(points[3] - 30);
      });
    }
  }

  // Generate Points for drawing transition arrow
  function getPoints(id1, id2) {
    if (id1 == id2) {
      // Self-loop
      const node = layerRef.current.findOne(`#g${id1}`);
      const x = node.x();
      const y = node.y();
      const radius = node.children[0].radius();
      const offset = 30;

      const points = [
        x - radius / 1.5,
        y - radius, // Start point (left of the node)
        x,
        y - radius - 2 * offset, // Control point (top)
        x + radius / 1.5,
        y - radius, // End point (right of the node)
      ];

      return points;
    }

    const clickedGroup = layerRef.current.findOne(`#g${id2}`);

    const startNode = layerRef.current.findOne(`#g${id1}`);

    const dx = clickedGroup.x() - startNode.x();
    const dy = clickedGroup.y() - startNode.y();
    let angle = Math.atan2(-dy, dx);

    const startRadius = startNode.children[0].radius() + 10;
    const endRadius = clickedGroup.children[0].radius() + 10;

    const start = [
      startNode.x() + -startRadius * Math.cos(angle + Math.PI),
      startNode.y() + startRadius * Math.sin(angle + Math.PI),
    ];

    const end = [
      clickedGroup.x() + -endRadius * Math.cos(angle),
      clickedGroup.y() + endRadius * Math.sin(angle),
    ];

    const midpoint = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];

    const dist = Math.sqrt((start[0] - end[0]) ** 2 + (start[1] - end[1]) ** 2);

    const subpoint2 =
      start[0] < end[0]
        ? [midpoint[0], midpoint[1] - 0.3 * dist]
        : [midpoint[0], midpoint[1] + 0.3 * dist];

    const points = [
      start[0],
      start[1],
      subpoint2[0],
      subpoint2[1],
      end[0],
      start[0] < end[0] ? end[1] - 20 : end[1] + 20,
    ];

    return points;
  }

  return (
    <>
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
                    onDragMove={() => handleNodeDrag(node.id)}
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

                    {/* If state is final, draw an extra outer circle */}
                    {node.type == "final" && (
                      <Circle
                        x={0}
                        y={0}
                        id={`${node.id}`}
                        radius={2 * node.name.length + node.radius + 5}
                        fill={"transparent"}
                        strokeWidth={3}
                        stroke={node.fill}
                      />
                    )}

                    <Text
                      x={-node.radius - node.name.length / 2}
                      y={-node.radius / 3.5}
                      width={2 * node.radius + node.name.length}
                      height={2 * node.radius}
                      text={node.name}
                      fontSize={20}
                      fill="#ffffff"
                      align="center"
                    />

                    {/* If state is initial, draw an incoming arrow */}
                    {node.type == "initial" && (
                      <Arrow
                        x={-1 * (node.radius + 40)}
                        y={0}
                        points={[-node.radius / 1.5, 0, node.radius - 5, 0]}
                        pointerLength={10}
                        pointerWidth={10}
                        fill={"#ffffff80"}
                        stroke={"#ffffff80"}
                        strokeWidth={3}
                      />
                    )}
                  </Group>
                )
            )}
            {/* Transition Arrows */}
            {transitions.map(
              (transition) =>
                transition && (
                  <Group key={transition.id}>
                    {/* Transition arrow object */}
                    <Arrow
                      key={transition.id}
                      id={`tr${transition.id}`}
                      stroke={transition.stroke}
                      strokeWidth={transition.strokeWidth}
                      fill={transition.fill}
                      points={transition.points}
                      tension={transition.tension}
                    />
                    {/* Add a Label to the middle of the arrow */}
                    <Text
                      id={`trtext${transition.id}`}
                      x={transition.points[2] - 2 * transition.name.length}
                      y={transition.points[3] - 30}
                      text={transition.name}
                      fontSize={16}
                      fill="#ffffff"
                      align="center"
                      onClick={() =>
                        (currentEditorState != "create" &&
                          currentEditorState != "delete") &&
                        setTrNameEditor([true, transition.name, transition.id])
                      }
                    />
                  </Group>
                )
            )}
          </Group>
        </Layer>
      </Stage>

      {/* Popup window to edit name of transition */}
      <TransitionNameEditor showVar={trNameEditor[0]}>
        <span className="absolute text-center leading-13 w-fit px-2 h-15 bg-primary-bg border border-border-bg rounded-2xl shadow-[0px_0px_100px_0px_#000000] transition-all ease-in-out duration-300 flex justify-center items-center">
          <input
            type="text"
            placeholder="Enter State Name..."
            value={trNameEditor[1] ?? ""}
            onChange={(e) => {
              setTrNameEditor([true, e.target.value, trNameEditor[2]]);
            }}
            className="text-white font-github text-base px-2 border border-border-bg hover:border-input-active focus:border-2 focus:border-blue-500 transition-all ease-in-out outline-none w-full h-10 rounded-lg"
          />

          <button
            onClick={() => setTrNameEditor([false, undefined, undefined])}
            className="rounded-xl text-black bg-white ml-2 px-2 py-2 hover:scale-110 transition-all cursor-pointer active:scale-95 ease-in-out"
          >
            <X size={20} color="#000000" />
          </button>

          <button
            onClick={() => {
              const trText = layerRef.current.findOne(
                `#trtext${trNameEditor[2]}`
              );

              if (trNameEditor[1].length == 0) return; // Prevent empty transition names

              trText.text(trNameEditor[1]); // Update transition text
              transitions[trNameEditor[2]].name = trNameEditor[1]; // Update transition name in store
              updateTransitions(transitions);

              // Update location of text
              trText.x(
                transitions[trNameEditor[2]].points[2] -
                  3 * trNameEditor[1].length
              );
              trText.y(transitions[trNameEditor[2]].points[3] - 20);

              // Reset editor state
              setTrNameEditor([false, undefined, undefined]);
            }}
            className="rounded-xl text-black bg-blue-500 ml-2 px-2 py-2 hover:scale-110 transition-all cursor-pointer active:scale-95 ease-in-out"
          >
            <Check size={20} color="#ffffff" />
          </button>
        </span>
      </TransitionNameEditor>
    </>
  );
};

// Transition Name Editor
function TransitionNameEditor(props: {
  children: ReactHTMLElement;
  showVar: boolean;
}) {
  return (
    <div
      className={clsx(
        "select-none w-full h-20 absolute z-50 mx-auto flex justify-center items-center transition-all ease-in-out duration-300",
        {
          "-top-50": !props.showVar,
          "top-0 focus": props.showVar,
        }
      )}
    >
      {props.children}
    </div>
  );
}

export default Editor;
