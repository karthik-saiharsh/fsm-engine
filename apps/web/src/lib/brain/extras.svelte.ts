/* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the GPL V3 license.
 * I would prefer it if you provide credits, in case you use my code for your projects :)
 */

/**
 * @fileoverview This class contains global stores that aren't
 * as important and so needn't belong in ProjectClass */


/**
 * Describes the parameters of the alert window popup
 */
export interface AlertParams {
    /** Should the Window be visible */
    visible: boolean,
    /** What kind of a window is it ? Info only shows info
     * confirm has a yes/no button that the user has to acknowledge
     */
    type: "info" | "confirm",
    /** What message should be displayed */
    message: string | null,

    /** If type is confirm, what has to be done on accept */
    onAccept: null | (() => void),

    /** What to do on cancel if type is confirm*/
    onReject: null | (() => void),
};

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

    // Show transition table window
    show_transition_table = $state(false);

    // Save Dialog Visibility
    show_save_dialog = $state(false);

    // Language Specific Settings Window
    show_lang_settings = $state(false);

    // Custom Alert Window
    alert_popup: AlertParams = $state({
        visible: false,
        type: "info",
        message: null,
        onAccept: null,
        onReject: null,
    });

    /**
     * Opens a new Alert Window
     * @param alert_params parameters of the alert window. see @interface AlertParams
     */
    openAlert(type: "info" | "confirm", message: string, onAccept?: () => void, onReject?: () => void) {

        // Define a fallback default onRejectFunction that simple closes the alert again
        const defaultClose = () => {
            this.alert_popup = { ...this.alert_popup, visible: false };
        }


        if (type === "info") {
            this.alert_popup = { visible: true, type, message, onAccept: null, onReject: defaultClose };
        } else {

            this.alert_popup = {
                visible: true,
                type,
                message,
                onAccept: onAccept ? () => { defaultClose(); onAccept() } : defaultClose, // After the onAccept function runs, the alert must close again, hence defaultClose is called before onAccept to close the alert popup
                onReject: onReject ?? defaultClose
            }
        }
    }

}

const secondary_stores = new SecondaryStores();
export default secondary_stores;
