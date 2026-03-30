/* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the GPL V3 license.
 * I would prefer it if you provide credits, in case you use my code for your projects :)
 */

/**
 * @fileoverview This class contains global stores that aren't
 * as important and so needn't belong in the ProjectClass */

class SecondaryStores {
    grid_shown = $state<boolean>(true); // should grid be shown ?
    current_select = $state<number | null>(null); // id of current selected state
    deleted_state_names = $state<number[]>([]); // names available for reuse when making a new state
}

const secondary_stores = new SecondaryStores();
export default secondary_stores;
