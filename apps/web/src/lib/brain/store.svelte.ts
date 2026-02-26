/* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the GPL V3 license.
 * I would prefer it if you provide credits, in case you use my code for your projects :)
 */

/**
 * This monolithic beast of a class has every detail of the current project.
 */

const date = new Date();

class Project {
    project_name: string = $state("");
    theme: "dark" | "light" = "dark";

    constructor() {
        this.project_name = `FSM_Project_${date.toDateString()}`;
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
