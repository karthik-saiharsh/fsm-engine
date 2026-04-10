<!--
    /* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
     * You may use, distribute and modify this code under the
     * terms of the GPL V3 license.
     * I would prefer it if you provide credits, in case you use my code for your projects :)
     */ 
-->

<script lang="ts">
    /******** COMPONENT IMPORTS ********/
    import {
        Stage,
        Text,
        Layer,
        Circle,
        Group,
        Arrow,
        Label,
        Tag,
    } from "svelte-konva";
    import TopBar from "./editor/TopBar.svelte";
    import ProjectDetailsPopup from "./popus/ProjectDetailsPopup.svelte";
    import Dock from "./Dock.svelte";
    import NodeCustomizer from "./popus/NodeCustomizer.svelte";
    /******** COMPONENT IMPORTS ********/

    /****** BACKEND IMPORTS ******/
    import secondary_stores from "../brain/extras.svelte";
    import ProjectClass from "../brain/store.svelte";
    import TransitionCustomizer from "./popus/TransitionCustomizer.svelte";
    import Window from "./generic/Window.svelte";
    import type { KonvaWheelEvent } from "svelte-konva";
    import SaveDialog from "./popus/SaveDialog.svelte";

    const defaultLook = ProjectClass.defaultNodeLook;
    const Nodes = ProjectClass.nodes;
    const NodeProps = ProjectClass.node_properties;

    const Transitions = ProjectClass.transitions;
    const TransitionProps = ProjectClass.transition_properties;
    /****** BACKEND IMPORTS ******/

    /******** LUCIDE ICON IMPORTS ********/
    /******** LUCIDE ICON IMPORTS ********/

    /******** REACTIVE VARIABLES ********/
    let width: number = $state(0); // Width of Konav Stage
    let height: number = $state(0); // Width of Konav Stage
    let startAngle: number = $state(Math.PI); // Store rotation angle for the single start state arrow
    let stage: ReturnType<typeof Stage> | undefined = $state(); // Konva Stage
    /******** REACTIVE VARIABLES ********/

    /********* FUNCTIONS *********/
    /** Get a list of points to draw a transition curve between 2 states */
    function getTransitionPoints(id: number): [number[], number[]] {
        /** All the math and values you see in this function is purely empirical
         * I tested it with a couple of values, and settled on whatever looked good.
         * So all the sum and product constants you see further down are arbitrary choices
         */
        const start = NodeProps.get(Transitions.get(id)?.from!)!;
        const end = NodeProps.get(Transitions.get(id)?.to!)!;

        const StartR = start.radius ?? ProjectClass.defaultNodeLook.radius;
        const EndR = end.radius ?? ProjectClass.defaultNodeLook.radius;

        const delx = end.x - start.x;
        const dely = end.y - start.y;

        if (delx === 0 && dely === 0) {
            const nodeRadius = Math.max(StartR!, EndR!);
            const loopLift = Math.max(30, nodeRadius * 1.8);
            const loopWidth = Math.max(36, nodeRadius * 2.2);

            const startPoint = [
                start.x - nodeRadius * 0.7,
                start.y - nodeRadius * 0.8,
            ];
            const control = [start.x, start.y - loopLift - loopWidth * 0.25];
            const endPoint = [
                start.x + nodeRadius * 0.7,
                start.y - nodeRadius * 0.8,
            ];

            return [
                [...startPoint, ...control, ...endPoint],
                [control[0] - Transitions.get(id)?.on.length!, control[1] - 10],
            ];
        }

        const theta = Math.atan2(dely, delx);

        const start2 = [
            start.x + StartR! * Math.cos(theta),
            start.y + StartR! * Math.sin(theta) - Math.sign(delx) * 10,
        ];

        const end2 = [
            end.x - EndR! * Math.cos(theta),
            end.y - EndR! * Math.sin(theta) - Math.sign(delx) * 10,
        ];

        const perpendicular = [-dely, delx];
        const vec_len = Math.sqrt(
            perpendicular[0] ** 2 + perpendicular[1] ** 2
        );

        const xmid = (start2[0] + end2[0]) / 2;
        const ymid = (start2[1] + end2[1]) / 2;

        const xControl = xmid + (-dely / vec_len) * 5;
        const yControl = ymid + (-delx / vec_len) * 50;

        return [
            [...start2, xControl, yControl, ...end2],
            [xControl, yControl - 20],
        ];
    }

    /** Zoom the Canvas, got it from konva documentation */
    function handleScroll(e: KonvaWheelEvent) {
        e.evt.preventDefault();

        if (!stage?.node) return;

        // const stage = stageRef.current;
        const oldScale = stage.node.scaleX();
        const pointer = stage.node.getPointerPosition();

        if (!pointer) return;

        const mousePointTo = {
            x: (pointer.x - stage.node.x()) / oldScale,
            y: (pointer.y - stage.node.y()) / oldScale,
        };

        // how to scale? Zoom in? Or zoom out?
        let direction = e.evt.deltaY > 0 ? 1 : -1;

        // when we zoom on trackpad, e.evt.ctrlKey is true
        // in that case lets revert direction
        if (e.evt.ctrlKey) {
            direction = -direction;
        }

        const scaleBy = 1.01;
        const newScale =
            direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        stage.node.scale({ x: newScale, y: newScale });

        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };
        stage.node.position(newPos);
    }
    /********* FUNCTIONS *********/
</script>

<!-- Main Editor Window -->
<main
    class="w-screen h-screen overflow-hidden flex flex-col max-md:hidden transition-all ease-in-out duration-300">
    <TopBar />
    <div
        id="body"
        bind:clientWidth={width}
        bind:clientHeight={height}
        class="w-full flex-1 h-screen bg-card">
        <Stage
            {width}
            {height}
            onclick={(e) => {
                // Call only if left click
                if (e.evt.button === 0) {
                    ProjectClass.onStageClick(e);
                }
            }}
            onwheel={(e) => handleScroll(e)}
            bind:this={stage}>
            <Layer>
                {#each ProjectClass.node_properties.keys() as id}
                    <Group
                        onclick={(e) => {
                            ProjectClass.onNodeClick(e, id);
                        }}
                        x={NodeProps.get(id)?.x}
                        y={NodeProps.get(id)?.y}
                        draggable
                        ondragmove={(e) => ProjectClass.onNodeDrag(e, id)}>
                        <Circle
                            radius={NodeProps.get(id)?.radius ??
                                defaultLook.radius}
                            fill={NodeProps.get(id)?.color ?? defaultLook.color}
                            stroke={secondary_stores.current_select === id
                                ? "#0396c7"
                                : (NodeProps.get(id)?.stroke ??
                                  defaultLook.stroke)} />

                        <!-- The calculations for attributes x,y were obtained empirically, so don't try to make logical sense of them; these partical calculations just seem to work -->
                        <Text
                            fill={ProjectClass.theme === "dark"
                                ? "#ffffff"
                                : "#00000090"}
                            fontSize={18}
                            text={Nodes.get(id)!.value.length > 10
                                ? Nodes.get(id)?.value.substring(0, 7) + "..."
                                : Nodes.get(id)?.value}
                            x={-(
                                (Nodes.get(id)!.value.length > 10
                                    ? 10
                                    : (Nodes.get(id)?.value.length ?? 0)) * 9
                            ) / 2}
                            y={-9}
                            align="center"
                            verticalAlign="middle"
                            fontFamily="Sans" />

                        {#if Nodes.get(id)?.isStart}
                            {@const radius =
                                NodeProps.get(id)?.radius ?? defaultLook.radius}
                            <Arrow
                                x={0}
                                y={0}
                                points={[
                                    Math.cos(startAngle) * (radius! + 40),
                                    Math.sin(startAngle) * (radius! + 40),
                                    Math.cos(startAngle) * (radius! + 4),
                                    Math.sin(startAngle) * (radius! + 4),
                                ]}
                                pointerLength={10}
                                pointerWidth={10}
                                fill={NodeProps.get(id)?.stroke ??
                                    defaultLook.stroke}
                                stroke={NodeProps.get(id)?.stroke ??
                                    defaultLook.stroke}
                                strokeWidth={2}
                                tension={0}
                                draggable
                                ondragmove={(e) => {
                                    e.target.x(0);
                                    e.target.y(0);
                                    const stage = e.target.getStage();
                                    const pointerPos =
                                        stage?.getPointerPosition();
                                    const group = e.target.getParent();
                                    if (pointerPos && group) {
                                        const dx = pointerPos.x - group.x();
                                        const dy = pointerPos.y - group.y();
                                        startAngle = Math.atan2(dy, dx);
                                    }
                                }} />
                        {/if}

                        {#if Nodes.get(id)?.isEnd}
                            <Circle
                                radius={(NodeProps.get(id)?.radius ??
                                    defaultLook.radius)! + 6}
                                fill="#00000000"
                                stroke={secondary_stores.current_select === id
                                    ? ProjectClass.theme === "dark"
                                        ? "#ffffff"
                                        : "#00000090"
                                    : (NodeProps.get(id)?.stroke ??
                                      defaultLook.stroke)}
                                strokeWidth={2} />
                        {/if}
                    </Group>
                {/each}

                {#each ProjectClass.transition_properties.keys() as id}
                    {@const transitionData = getTransitionPoints(id)}
                    <Arrow
                        stroke={TransitionProps.get(id)?.stroke}
                        strokewidth={TransitionProps.get(id)?.strokeWidth}
                        fill={TransitionProps.get(id)?.stroke}
                        points={transitionData[0]}
                        tension={TransitionProps.get(id)?.curvature} />

                    <Label
                        onclick={(e) => ProjectClass.onTransitionClick(e, id)}
                        x={transitionData[1][0] -
                            (Transitions.get(id)?.on.length ?? 0) ** 1.5}
                        y={transitionData[1][1] - 10}
                        opacity={0.75}>
                        <Tag
                            fill={ProjectClass.theme === "dark"
                                ? "#ffffff80"
                                : "#000000"}
                            lineJoin="round"
                            shadowColor={ProjectClass.theme === "dark"
                                ? "#ffffff40"
                                : "#00000090"}
                            shadowBlur={30}
                            cornerRadius={8} />
                        <Text
                            text={Transitions.get(id)?.on}
                            fontFamily="Sans"
                            fontSize={16}
                            padding={5}
                            fill="white" />
                    </Label>
                {/each}
            </Layer>
        </Stage>
    </div>
</main>

<!-- Disable Right click -->
<svelte:window oncontextmenu={(e) => e.preventDefault()} />

<!-- Additional Overlays and Popup Windows -->
<ProjectDetailsPopup />
<NodeCustomizer />
<TransitionCustomizer />
<Window is_shown={secondary_stores.show_transition_table} />
<!-- Additional Overlays and Popup Windows -->

<!-- Options Dock -->
<Dock {stage} />
<SaveDialog {stage} />
<!-- Options Dock -->

{#if secondary_stores.grid_shown && ProjectClass.theme === "dark"}
    <style>
        #body {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-0 -0 10 10'%3E%3Cpath d='M 0 1 L 10 1 M 1 0 L 1 10' stroke='%23ffffff25' stroke-dasharray='1' stroke-width='0.3' /%3E%3C/svg%3E");
            background-size: 30px 30px;
        }
    </style>
{:else if secondary_stores.grid_shown && ProjectClass.theme === "light"}
    <style>
        #body {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-0 -0 10 10'%3E%3Cpath d='M 0 1 L 10 1 M 1 0 L 1 10' stroke='%2300000050' stroke-dasharray='1' stroke-width='0.3' /%3E%3C/svg%3E");
            background-size: 30px 30px;
        }
    </style>
{/if}
