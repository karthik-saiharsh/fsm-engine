/* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the GPL V3 license.
 * I would prefer it if you provide credits, in case you use my code for your projects :)
 */

/**
 * Starts a browser download of whatever `href` points to (a blob or data URL).
 * @param href URL of the file contents
 * @param filename Name the downloaded file is saved as
 */
export function downloadFromUrl(href: string, filename: string) {
    const link = document.createElement("a");
    link.href = href;
    link.download = filename;
    link.style.display = "none";

    // Some browsers only start the download if the link is part of the page
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
