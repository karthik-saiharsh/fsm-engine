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
import { useRef } from "react";

const Editor = () => {
  const currentEditorState = useAtomValue(editorState);

  const [nodeList, updateNodeList] = useAtom(Nodes);

  const [currSelected, setCurrSelected] = useAtom(currentSelected);

  const [transitionTracker, setTransitionTracker] = useAtom(arrowStates);
  const [transitions, updateTransitions] = useAtom(arrows);

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
          points: points,
          stroke: "#ffffff",
          strokeWidth: 2,
          fill: "#ffffff",
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
      });
    }
  }

  // Generate Points for drawing transition arrow
  function getPoints(id1, id2) {
    const clickedGroup = layerRef.current.findOne(`#g${id2}`);

    const startNode = layerRef.current.findOne(`#g${id1}`);

    const dx = clickedGroup.x() - startNode.x();
    const dy = clickedGroup.y() - startNode.y();
    let angle = Math.atan2(-dy, dx);

    const radius = 50;

    const start = [
      startNode.x() + -radius * Math.cos(angle + Math.PI),
      startNode.y() + radius * Math.sin(angle + Math.PI),
    ];

    const end = [
      clickedGroup.x() + -radius * Math.cos(angle),
      clickedGroup.y() + radius * Math.sin(angle),
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
      end[1],
    ];

    return points;
  }

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      draggable={currentEditorState == "grab"}
      onClick={handleEditorClick}
    >
      <Layer ref={layerRef}>
        <Group key={nodeList || transitions}>
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

                  <Text
                    x={-node.radius}
                    y={-node.radius / 3}
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
          {/* Transition Arrows */}
          {transitions.map((transition) => (
            <Arrow
              key={transition.id}
              id={`tr${transition.id}`}
              stroke={transition.stroke}
              strokeWidth={transition.strokeWidth}
              fill={transition.fill}
              points={transition.points}
              tension={0.5}
            />
          ))}
        </Group>
      </Layer>
    </Stage>
  );
};

export default Editor;
