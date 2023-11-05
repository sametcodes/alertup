import React, { useState, useEffect } from "react"
import { BellOff, BellRing, Info } from "lucide-react"
import { storage } from '@extend-chrome/storage'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton"
import { DEFAULT_INTERVAL_TIME } from "@/utils/consts"

import { SavedTopic, SavedTopicAlert, SeenJob } from '@/types';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

const jobCheckIntervals = [
    { value: 30, label: '30 seconds' },
    { value: 60, label: '1 minute' },
    { value: 60 * 3, label: '3 minutes' },
    { value: 60 * 5, label: '5 minutes' },
    { value: 60 * 30, label: '30 minutes' },
    { value: 60 * 60, label: '1 hour' },
    { value: 60 * 60 * 3, label: '3 hours' },
]

export const SavedJobsList = () => {
    const { toast } = useToast()
    const [loading, setLoading] = useState<boolean>(true)
    const [jobs, setJobs] = useState<(SavedTopicAlert & { countInLastHour?: number })[]>([])
    const [jobInterval, setJobInterval] = useState<string>(DEFAULT_INTERVAL_TIME)

    useEffect(() => {
        getSavedJobs()
        getRequiredParamsFromCookie();
    }, [])

    const getRequiredParamsFromCookie = async () => {
        const userUidMatch = /jsTSize_([0-9]+)=/g.exec(document.cookie)
        const orgUidMatch = /current_organization_uid=([0-9]+);/g.exec(document.cookie)
        let userUid: string | null = null;
        let orgUid: string | null = null;

        if (userUidMatch) userUid = userUidMatch[1];
        if (orgUidMatch) orgUid = orgUidMatch[1];
        await storage.local.set({ user: { userUid, orgUid } })
    }

    const getAlerts = async (savedTopics: SavedTopic[]) => {
        return storage.local.get('alerts').then(result => {
            const savedAlerts: SavedTopicAlert[] = result.alerts || [];
            return savedTopics.map((job) => ({
                ...job, alert: savedAlerts.some((alert) => alert.searchId === job.searchId && alert.alert)
            }))
        })
    }

    const getJobsInterval = async () => {
        await storage.local.get('checkJobsInterval').then(({ checkJobsInterval }) => {
            setJobInterval(checkJobsInterval || DEFAULT_INTERVAL_TIME);
        })
    }

    const fetchTopics = async (headers: Headers): Promise<SavedTopic[]> => {
        return fetch("https://www.upwork.com/ab/jobs/search/feed/topics", { headers })
            .then(res => res.json())
            .then(res => {
                return res.map((job: {
                    id: number,
                    name: string;
                    q: string;
                    filterCount: string;
                }) => ({
                    text: job.name,
                    searchId: job.id,
                    href: `https://www.upwork.com/nx/jobs/search/?topic_id=${job.id}`,
                    filterCount: job.filterCount
                }))
            })
    }

    const fetchSeenJobs = async (): Promise<SeenJob[]> => {
        const data = await storage.local.get('seenJobs').then(result => result.seenJobs);
        if (!data) return [];
        return data;
    }

    const getJobsCount = (savedTopics: SavedTopicAlert[], seenJobs: SeenJob[]) => {
        return savedTopics.map((job) => {
            const jobsInLastHour = seenJobs.filter((seenJob) => seenJob.topicId === job.searchId &&
                seenJob.postedOn > Date.now() - 1000 * 60 * 60).length;
            return {
                ...job,
                countInLastHour: jobsInLastHour
            }
        })
    }

    const getSavedJobs = async () => {
        const topicAlerts = await storage.local.get('siteheaders').then(result => {
            const headers = new Headers(result.siteheaders)
            return fetchTopics(headers)
        });

        const alerts = await getAlerts(topicAlerts)
        const seenJobs = await fetchSeenJobs();
        await getJobsInterval()
        const topicsWithCount = getJobsCount(alerts, seenJobs);

        setJobs(topicsWithCount);
        setLoading(false);
    }

    const onSwitchAlert = async (job: SavedTopicAlert) => {
        const jobIndex = jobs.findIndex((_job) => _job.searchId === job.searchId);
        const updatedJobs = [...jobs];
        updatedJobs[jobIndex].alert = !updatedJobs[jobIndex].alert;

        const switchedTo = updatedJobs[jobIndex].alert;
        if (switchedTo) {
            await storage.local.get('alerts').then(result => {
                const savedAlerts: SavedTopicAlert[] = result.alerts || [];
                return storage.local.set({
                    alerts: [...savedAlerts, {
                        text: job.text,
                        alert: job.alert,
                        searchId: job.searchId
                    }]
                })
            });
        } else {
            await storage.local.get('alerts').then(result => {
                const savedAlerts: SavedTopicAlert[] = result.alerts || [];
                return storage.local.set({ alerts: savedAlerts.filter((alert) => alert.searchId !== job.searchId) })
            });
        }

        setJobs(updatedJobs);
        toast({
            title: `Alert switched ${switchedTo ? "on" : "off"}`,
            description: switchedTo
                ? `You will be notified when a new job is posted for ${job.text}.`
                : `You will not be notified when a new job is posted for ${job.text}.`,
        })
    }

    const onIntervalChange = async (value: string) => {
        const interval = jobCheckIntervals.find((interval) => interval.value.toString() === value);
        await storage.local.set({ checkJobsInterval: value })
        setJobInterval(value);
        toast({
            title: `Alert interval changed`,
            description: `You will be notified every ${interval?.label}.`,
        })
    }

    return <>
        <Card className="mt-5">
            <CardHeader>
                <CardTitle>Set Jobs Alert</CardTitle>
                <CardDescription>Change alert settings for your saved jobs.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                {loading && [...Array(4)].map((_, index) =>
                    <div key={index} className="flex items-center space-x-4">
                        <div key={index} className="space-y-2">
                            <Skeleton className="h-4 w-[220px] rounded-xl" />
                            <Skeleton className="h-3 w-[140px] rounded-xl" />
                            <Skeleton className="h-3 w-[100px] rounded-xl" />
                        </div>
                        <Skeleton className="h-8 w-8 rounded-2xl" />
                    </div>
                )}
                {!loading && jobs.map((job) => {
                    return <div key={job.searchId} className="flex items-center justify-between space-x-2">
                        <Label htmlFor="necessary" className="flex flex-col space-y-1">
                            <a href={job.href}>{job.text}</a>
                            <span className="font-normal leading-snug text-muted-foreground">{job.filterCount}</span>
                            <span className="font-normal leading-snug text-muted-foreground">{job.countInLastHour} jobs in the last hour</span>
                        </Label>
                        <span className="cursor-pointer" onClick={onSwitchAlert.bind(null, job)}>
                            {job.alert
                                ? <BellRing size={24} className="text-green-500" />
                                : <BellOff size={24} className="text-gray-500" />}
                        </span>
                    </div>
                })}
                {!loading && jobs.length === 0 &&
                    <Alert className="p-5">
                        <AlertTitle className="text-lg">No saved jobs found</AlertTitle>
                        <AlertDescription>
                            <p>{`You don't have any saved jobs. Search for jobs and save them to get alerts.`}</p>
                            <p><a href="https://support.upwork.com/hc/en-us/articles/211063078-Search-for-Jobs" className="text-green-600 hover:underline">Learn how to search for jobs</a></p>
                        </AlertDescription>
                    </Alert>}
            </CardContent>
            {jobs.length > 0 && <CardFooter className="flex flex-col">
                <div className="flex justify-between items-center mt-5 w-full">
                    <Label htmlFor="checkEvery" className="text-sm text-muted-foreground">Check jobs every</Label>
                    <Select onValueChange={onIntervalChange} value={jobInterval}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Check jobs every" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup id="checkEvery">
                                {jobCheckIntervals.map(interval => (
                                    <SelectItem key={interval.value}
                                        value={interval.value.toString()}>{interval.label}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <Separator className="mt-5" />

                <div>
                    <Popover>
                        <PopoverTrigger className="mt-5">
                            <div className="text-gray-400 flex gap-2 p-2">
                                <Info className="h-5 w-5" />
                                <span className="text-sm text-muted-foreground">I don&apos;t get notifications</span>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent>
                            Keep in mind that you need to visit Upwork daily basis to get notifications, at least once a day. Otherwise the browser may stop sending notifications.
                        </PopoverContent>
                    </Popover>
                </div>
            </CardFooter>}
        </Card>

    </>
}