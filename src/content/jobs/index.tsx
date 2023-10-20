import React, { useState, useEffect } from "react"
import { BellOff, BellRing } from "lucide-react"
import { storage } from '@extend-chrome/storage'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast";

import { SavedJobs, SavedJobsAlarm } from '@/types';

export const SavedJobsList = () => {
    const { toast } = useToast()
    const [loading, setLoading] = useState<boolean>(true)
    const [jobs, setJobs] = useState<SavedJobsAlarm[]>([])

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

    const getAlarms = async (savedJobs: SavedJobs[]): Promise<SavedJobsAlarm[]> => {
        return storage.local.get('alarms').then(result => {
            const savedAlarms: SavedJobsAlarm[] = result.alarms || [];
            return savedJobs.map((job) => ({
                ...job, alarm: savedAlarms.some((alarm) => alarm.searchId === job.searchId)
            }))
        })
    }

    const getSavedJobs = async () => {
        const savedJobs = await storage.local.get('siteheaders').then(result => {
            const headers = new Headers(result.siteheaders)
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
        });

        const savedJobsWithAlarm = await getAlarms(savedJobs)
        setJobs(savedJobsWithAlarm);
        setLoading(false);
    }

    const onSwitchAlarm = (job: SavedJobsAlarm) => {
        const jobIndex = jobs.findIndex((_job) => _job.searchId === job.searchId);
        const updatedJobs = [...jobs];
        updatedJobs[jobIndex].alarm = !updatedJobs[jobIndex].alarm;

        const switchedTo = updatedJobs[jobIndex].alarm;
        setJobs(updatedJobs);
        toast({
            title: `Alarm switched`,
            description: `Alarm switched for "${updatedJobs[jobIndex].text}" job to ${switchedTo}.`,
        })

        if (switchedTo) {
            storage.local.get('alarms').then(result => {
                const savedAlarm: SavedJobsAlarm[] = result.alarms || [];
                storage.local.set({
                    alarms: [...savedAlarm, {
                        text: job.text,
                        alarm: job.alarm,
                        searchId: job.searchId
                    }]
                })
            });
        } else {
            storage.local.get('alarms').then(result => {
                const savedAlarms: SavedJobsAlarm[] = result.alarms || [];
                storage.local.set({ alarms: savedAlarms.filter((alarm) => alarm.searchId !== job.searchId) })
            });
        }
    }

    return <Card className="mt-5">
        <CardHeader>
            <CardTitle>Set Alarm</CardTitle>
            <CardDescription>Change alarm settings for the saved jobs.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
            {loading && <div>Loading...</div>}
            {!loading && jobs.map((job) => {
                return <div key={job.searchId} className="flex items-center justify-between space-x-2">
                    <Label htmlFor="necessary" className="flex flex-col space-y-1">
                        <a href={job.href}>
                            {job.text}
                        </a>
                        <span className="font-normal leading-snug text-muted-foreground">{job.filterCount}</span>
                    </Label>
                    <span className="cursor-pointer" onClick={onSwitchAlarm.bind(null, job)}>
                        {job.alarm
                            ? <BellRing size={24} className="text-green-500" />
                            : <BellOff size={24} className="text-gray-500" />}
                    </span>
                </div>
            })}
        </CardContent>
    </Card>
}