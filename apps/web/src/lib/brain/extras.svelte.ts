/* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the GPL V3 license.
 * I would prefer it if you provide credits, in case you use my code for your projects :)
 */

/**
 * @fileoverview This class contains global stores that aren't
 * as important and so needn't belong in ProjectClass */

class SecondaryStores {
    // should grid be shown ?
    grid_shown = $state<boolean>(true);

    // id of current selected state
    current_select = $state<number | null>(null);

    // names available for reuse when making a new state
    deleted_state_names = $state<number[]>([]);

    // When connecting 2 states, this keeps track of the from state 
    from_node = $state<number | null>(null);

    // Keep track of currently selected Transition
    current_tr = $state<number | null>(null);
}

const secondary_stores = new SecondaryStores();
export default secondary_stores;
