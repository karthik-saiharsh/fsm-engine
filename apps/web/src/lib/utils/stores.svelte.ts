/* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the GPL V3 license.
 * I would prefer it if you provide credits, in case you use my code for your projects :)
 */

/**
 * @fileoverview This file has all the stores used throught the Web engine runtime
 */

import type { ProjectDetailsType } from "./types";

/**
 * Store for Current Project Metadata
 * @see ProjectDetailsType
 */
export let ProjectData: ProjectDetailsType = $state({
    show_proj_selector: true,
    proj_type: null,
});
