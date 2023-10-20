import { storage } from '@extend-chrome/storage';
import { GetFeedResponse, SavedJobsAlarm } from '@/types';

type GetFeedParams = {
    topicId: string,
    headers: Headers
}
const getFeed = async ({ topicId, headers }: GetFeedParams): Promise<GetFeedResponse> => {
    const params = { topic_id: topicId, q: "", per_page: "50", sort: "recency" }
    const url = new URL(`https://www.upwork.com/ab/jobs/search/url`);
    url.search = new URLSearchParams(params).toString();
    return fetch(url, {
        headers: new Headers(headers),
    }).then(res => res.json())
}

const sendNotification = (alarm: SavedJobsAlarm, newJobs: GetFeedResponse["searchResults"]["jobs"]) => {
    chrome.notifications.create({
        type: "list",
        title: `New ${newJobs.length} jobs found for "${alarm.text}"`,
        iconUrl: "https://www.upwork.com/favicon.ico",
        message: "Click to view jobs",
        silent: false,
        items: newJobs.map(job => {
            return { title: job.title || "", message: job.publishedOn || "" }
        })
    })
}

const controlRSSFeed = async () => {
    const data: {
        siteheaders?: Headers,
        alarms?: SavedJobsAlarm[],
        user?: {
            userUid: string,
            orgUid: string
        },
        seenJobs?: string[]
    } = await storage.local.get([
        "siteheaders",
        "alarms",
        "user",
        "seenJobs"
    ]);

    if (!data.siteheaders) { console.log("No rss token found."); return; }
    if (!data.alarms) { console.log("No alarms found."); return; }
    if (!data.user) { console.log("No user found."); return; }
    if (!data.seenJobs) { data.seenJobs = []; }

    const output: {
        search: string,
        newJobs: number,
        seenJobs: number
    }[] = []


    console.log(`Reading ${data.alarms.length} RSS feeds...`)

    for (const alarm of data.alarms) {
        const feed = await getFeed({ topicId: alarm.searchId, headers: data.siteheaders });
        const newJobs = feed.searchResults.jobs.filter(jobPosting => (data.seenJobs || []).includes(jobPosting.ciphertext) === false)

        data.seenJobs = [...new Set([...data.seenJobs, ...newJobs.map(job => job.ciphertext)])];
        await storage.local.set({ seenJobs: data.seenJobs })

        if (newJobs.length) {
            sendNotification(alarm, newJobs);
            output.push({ search: alarm.text, newJobs: newJobs.length, seenJobs: data.seenJobs.length })
        }
        await new Promise(resolve => setTimeout(resolve, 1000))
    }
    if (output.length) {
        console.table(output)
    }

}

const config = {
    interval: 30 * 1000
}
setInterval(controlRSSFeed, config.interval)