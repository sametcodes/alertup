import { storage } from '@extend-chrome/storage';
import { GetFeedResponse, SeenJob, SavedTopicAlarm } from '@/types';

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

const sendNotification = (alarm: SavedTopicAlarm, newJobs: GetFeedResponse["searchResults"]["jobs"]) => {
    chrome.notifications.create({
        type: "list",
        title: `New ${newJobs.length} jobs found for "${alarm.text}"`,
        iconUrl: "https://www.upwork.com/favicon.ico",
        message: "Click to view jobs",
        silent: false,
        items: newJobs.map(job => {
            return { title: job.title || "", message: job.publishedOn || "" }
        })
    }, (notificationId) => {
        const newJobLinks = newJobs.map(job => `https://www.upwork.com/jobs/${job.ciphertext}`)
        storage.local.set({ [notificationId]: newJobLinks })
    })
}

const controlRSSFeed = async () => {
    const data: {
        siteheaders?: Headers,
        alarms?: SavedTopicAlarm[],
        user?: {
            userUid: string,
            orgUid: string
        },
        seenJobs?: SeenJob[]
    } = await storage.local.get([
        "siteheaders",
        "alarms",
        "user",
        "seenJobs"
    ]);

    if (!data.siteheaders) { console.log("No rss token found."); return; }
    if (!data.alarms) { console.log("No alarms found."); return; }
    if (!data.user) { console.log("No user found."); return; }

    const output: {
        search: string,
        newJobs: number,
        seenJobs: number
    }[] = []

    console.log(`Reading ${data.alarms.length} RSS feeds...`)

    for (const alarm of data.alarms) {
        const feed = await getFeed({ topicId: alarm.searchId, headers: data.siteheaders });

        const seenJobsIds = (data.seenJobs || []).map(job => job.jobId) as string[];
        const newJobs = feed.searchResults.jobs.filter(jobPosting => seenJobsIds.includes(jobPosting.ciphertext) === false)

        data.seenJobs = [
            ...(data.seenJobs || []),
            ...newJobs.map(job => ({
                jobId: job.ciphertext,
                postedOn: new Date(job.publishedOn).getTime(),
                topicId: alarm.searchId
            }))
        ];

        await storage.local.set({ seenJobs: data.seenJobs })

        if (newJobs.length) {
            sendNotification(alarm, newJobs);
            output.push({ search: alarm.text, newJobs: newJobs.length, seenJobs: data.seenJobs.length })
        }

        await new Promise(resolve => setTimeout(resolve, 1000))
    }
    if (output.length) console.table(output)

}

const config = { interval: 30 * 1000 }
setInterval(controlRSSFeed, config.interval)

chrome.notifications.onClicked.addListener(async (notificationId: string) => {
    const data: { [key: string]: [] } = await storage.local.get([notificationId]);
    if (!data[notificationId]) { console.log("No job links found."); return; }
    data[notificationId].forEach(link => chrome.tabs.create({ url: link }))
    await storage.local.remove([notificationId])
    chrome.notifications.clear(notificationId)
})