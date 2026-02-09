/* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the GPL V3 license.
 * I would prefer it if you provide credits, in case you use my code for your projects :)
 */

/**
 * @fileoverview This file has all the type declarations
 */

/**
 * Type of the Project
 * NEW: New project
 * EXISTING: Open a saved project file
 */
export enum ProjectType {
    NEW,
    EXISTING,
}

/**
 * Project Metadata
 * show_proj_selector: show the project selection screen
 * proj_type: Type of the project @see ProjectType
 */
export interface ProjectDetailsType {
    show_proj_selector: boolean;
    proj_type: ProjectType | null;
}
