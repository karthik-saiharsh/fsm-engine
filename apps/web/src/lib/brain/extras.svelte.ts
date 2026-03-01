/* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the GPL V3 license.
 * I would prefer it if you provide credits, in case you use my code for your projects :)
 */

import { TextAlignJustifyIcon } from "@lucide/svelte";

/**
 * @fileoverview This class contains global stores that aren't
 * as important and so needn't belong in the ProjectClass */

class SecondaryStores {
    grid_shown = $state(false);
}

const secondary_stores = new SecondaryStores();
export default secondary_stores;
