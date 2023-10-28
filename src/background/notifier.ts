import { storage } from '@extend-chrome/storage';
import { GetFeedResponse, SeenJob, SavedTopicAlert } from '@/types';
import { DEFAULT_INTERVAL_TIME } from '@/utils/consts';

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
    }).then(res => res.json()).catch(err => {
        console.error(err);
        return null;
    })
}

const sendNotification = (alert: SavedTopicAlert, newJobs: GetFeedResponse["searchResults"]["jobs"]) => {
    chrome.notifications.create({
        type: "list",
        title: `New ${newJobs.length} jobs found for "${alert.text}"`,
        iconUrl: "https://www.upwork.com/favicon.ico",
        message: "Click to open jobs",
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
        alerts?: SavedTopicAlert[],
        user?: {
            userUid: string,
            orgUid: string
        },
        seenJobs?: SeenJob[]
    } = await storage.local.get([
        "siteheaders",
        "alerts",
        "user",
        "seenJobs"
    ]);

    if (!data.siteheaders) { console.log("No rss token found."); return; }
    if (!data.alerts) { console.log("No alerts found."); return; }
    if (!data.user) { console.log("No user found."); return; }

    const output: {
        search: string,
        newJobs: number,
        seenJobs: number
    }[] = []

    console.log(`Reading ${data.alerts.length} RSS feeds...`)
    const justInstalled = data.seenJobs === undefined;

    for (const alert of data.alerts) {
        const feed = await getFeed({ topicId: alert.searchId, headers: data.siteheaders });
        if (!feed) continue;

        const seenJobsIds = (data.seenJobs || []).map(job => job.jobId) as string[];
        const newJobs = feed.searchResults.jobs.filter(jobPosting => seenJobsIds.includes(jobPosting.ciphertext) === false)

        data.seenJobs = [
            ...(data.seenJobs || []),
            ...newJobs.map(job => ({
                jobId: job.ciphertext,
                postedOn: new Date(job.publishedOn).getTime(),
                topicId: alert.searchId
            }))
        ];

        await storage.local.set({ seenJobs: data.seenJobs })

        if (newJobs.length && justInstalled === false) {
            sendNotification(alert, newJobs);
            output.push({ search: alert.text, newJobs: newJobs.length, seenJobs: data.seenJobs.length })
        }

        await new Promise(resolve => setTimeout(resolve, 1000))
    }
    if (output.length) console.table(output)
}

let intervalId: ReturnType<typeof setInterval> | undefined;
const startChecking = () => {
    if (intervalId) {
        console.log("Clearing current interval.")
        clearInterval(intervalId);
    }
    storage.local.get('checkJobsInterval').then(({ checkJobsInterval }) => {
        console.log({ checkJobsInterval })
        const currentIntervalTime = checkJobsInterval || DEFAULT_INTERVAL_TIME;
        intervalId = setInterval(controlRSSFeed, Number(currentIntervalTime) * 1000)
    })
}
storage.local.changeStream.subscribe((changes) => {
    if (changes?.checkJobsInterval) {
        console.log("Interval time changed.");
        startChecking();
    }
})
startChecking();

chrome.notifications.onClicked.addListener(async (notificationId: string) => {
    const data: { [key: string]: [] } = await storage.local.get([notificationId]);
    if (!data[notificationId]) { console.log("No job links found."); return; }
    data[notificationId].forEach(link => chrome.tabs.create({ url: link }))
    await storage.local.remove([notificationId])
    chrome.notifications.clear(notificationId)
})