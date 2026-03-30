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
    /******** REACTIVE VARIABLES ********/

    /********* FUNCTIONS *********/
    function getTransitionPoints(id: number): [number[], number[]] {
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

            const xmid =
                0.25 * startPoint[0] + 0.5 * control[0] + 0.25 * endPoint[0];
            const ymid =
                0.25 * startPoint[1] + 0.5 * control[1] + 0.25 * endPoint[1];

            return [
                [...startPoint, ...control, ...endPoint],
                [xmid, ymid],
            ];
        }

        const theta = Math.atan2(dely, delx);

        const start2 = [
            start.x + StartR! * Math.cos(theta),
            start.y + StartR! * Math.sin(theta),
        ];

        const end2 = [
            end.x - EndR! * Math.cos(theta),
            end.y - EndR! * Math.sin(theta),
        ];

        const perpendicular = [-dely, delx];
        const vec_len = Math.sqrt(
            perpendicular[0] ** 2 + perpendicular[1] ** 2
        );

        const xmid = (start2[0] + end2[0]) / 2;
        const ymid = (start2[1] + end2[1]) / 2;

        const xControl = xmid + (-dely / vec_len) * 5;
        const yControl = ymid + (delx / vec_len) * 5;

        const curveMidX = 0.25 * start2[0] + 0.5 * xControl + 0.25 * end2[0];
        const curveMidY = 0.25 * start2[1] + 0.5 * yControl + 0.25 * end2[1];

        return [
            [...start2, xControl, yControl, ...end2],
            [curveMidX, curveMidY],
        ];
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
            draggable
            {width}
            {height}
            onclick={(e) => {
                // Call only if left click
                if (e.evt.button === 0) {
                    ProjectClass.onStageClick(e);
                }
            }}>
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
                            fill="#ffffff"
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
                        x={transitionData[1][0] -
                            (Transitions.get(id)?.on.length ?? 0)}
                        y={transitionData[1][1] - 10}
                        opacity={0.75}>
                        <Tag
                            fill="#1f1f1f"
                            lineJoin="round"
                            shadowColor="#ffffff20"
                            shadowBlur={30} />
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
<!-- Additional Overlays and Popup Windows -->

<!-- Options Dock -->
<Dock />
<!-- Options Dock -->

{#if secondary_stores.grid_shown}
    <style>
        #body {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-0 -0 10 10'%3E%3Cpath d='M 0 1 L 10 1 M 1 0 L 1 10' stroke='%23ffffff25' stroke-dasharray='1' stroke-width='0.3' /%3E%3C/svg%3E");
            background-size: 30px 30px;
        }
    </style>
{/if}
