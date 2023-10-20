import { SavedJobs } from "@/types"

export default {
    savedJobs: {
        selector: ".up-card-header + .up-card-section .up-skill-wrapper a:not(:first-child)[data-test='select-saved-search']",
        query: (x: string): SavedJobs[] => Array
            .from(document.querySelectorAll<HTMLLinkElement>(x))
            .map(a => {
                return {
                    text: a.innerText,
                    href: a.href,
                    searchId: a.href.split("/").splice(-1)[0]
                }
            })
    }
}