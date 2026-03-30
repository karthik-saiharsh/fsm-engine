/* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the GPL V3 license.
 * I would prefer it if you provide credits, in case you use my code for your projects :)
 */

import type { EngineTypes } from "@fsm/engine";

export interface ProjectDetailsType {
    name: string; // Project name
    author: string; // Project Author
    created: string; // Project Created At Date
    type: EngineTypes; // Type of the State Machine
}

export enum NodeType {
    INTERMEDIATE,
    START,
    END
}

export interface NodeProps {
    color: string,
    stroke: string,
    x: number,
    y: number,
    radius: number
}

export interface TransitionProps {
    curvature: number,
    strokeWidth: number,
    stroke: string,
}

export enum DockModes {
    NIL,
    ADD,
    REMOVE,
    CONNECT,
}


export type PartialNodeProps = Partial<NodeProps> & Pick<NodeProps, 'x' | 'y'>