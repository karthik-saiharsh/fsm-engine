/* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the GPL V3 license.
 * I would prefer it if you provide credits, in case you use my code for your projects :)
 */

import { EngineTypes } from "@fsm/engine";

/** Stuff */
const date = new Date();
/** Stuff */

/**
 * This monolithic beast of a class has every detail of the current project.
 */
class Project {
    project_details = $state({
        name: "", // Project name
        author: "", // Project Author
        created: "", // Project Created At Date
        type: EngineTypes.FREE, // Type of the State Machine
    });

    theme: "dark" | "light" = "dark"; // UI Theme

    /****** TOGGLER VARIABLES ******/
    togglers = $state({
        show_proj_details: false,
    });
    /****** TOGGLER VARIABLES ******/

    /**
     * Create a new project
     */
    constructor() {
        this.project_details = {
            ...this.project_details,
            name: `FSM_Project_${date.toDateString()}`,
            author: "Unnamed Author",
            created: date.toDateString(),
        };
    }

    /**
     * Toggle Theme of the app
     */
    toggleTheme() {
        this.theme = this.theme === "dark" ? "light" : "dark";
        document.getElementById("body")?.classList.toggle("dark");
    }
}

// One instance to manage it all
const ProjectClass = new Project();
export default ProjectClass;
