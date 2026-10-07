/* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the GPL V3 license.
 * I would prefer it if you provide credits, in case you use my code for your projects :)
 */

import type Konva from "konva";

/**
 * Zooms the stage in or out while keeping the point under `anchor` where it is on screen.
 * @param stage The Konva stage to zoom
 * @param anchor Screen position that should stay fixed (mouse pointer, or the stage center)
 * @param zoomIn True to zoom in, false to zoom out
 * @param scaleBy How much one zoom step scales the stage by
 */
export function zoomStage(
    stage: Konva.Stage,
    anchor: Konva.Vector2d,
    zoomIn: boolean,
    scaleBy: number
) {
    const oldScale = stage.scaleX();
    const newScale = zoomIn ? oldScale * scaleBy : oldScale / scaleBy;

    // The point on the (unscaled) canvas that sits under the anchor
    const anchorOnCanvas = {
        x: (anchor.x - stage.x()) / oldScale,
        y: (anchor.y - stage.y()) / oldScale,
    };

    stage.scale({ x: newScale, y: newScale });
    stage.position({
        x: anchor.x - anchorOnCanvas.x * newScale,
        y: anchor.y - anchorOnCanvas.y * newScale,
    });
}
