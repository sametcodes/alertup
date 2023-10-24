
export type SavedTopic = {
    text: string,
    href: string,
    searchId: string,
    filterCount: string,
}

export type SeenJob = {
    jobId: string;
    postedOn: number;
    topicId: string;
}

export type SavedTopicAlert = SavedTopic & {
    alert: boolean;
}

export type GetFeedResponse = {
    url: string
    searchGuid: string
    searchResults: {
        q: string
        paging: {
            total: number
            offset: number
            count: number
            resultSetTs: number
        }
        spellcheck: {
            corrected_queries: Array<string>
        }
        jobs: Array<{
            title: string
            createdOn: string
            type: number
            ciphertext: string
            description: string
            category2: string
            subcategory2: string
            duration?: string
            shortDuration?: string
            durationLabel?: string
            engagement?: string
            shortEngagement?: string
            amount: {
                currencyCode: string
                amount: number
            }
            recno: number
            uid: string
            client: {
                paymentVerificationStatus: number
                location: {
                    country: string
                }
                totalSpent: number
                totalReviews: number
                totalFeedback: number
                compstringRid: number
                compstringName: string
                edcUserId: number
                lastContractPlatform: string
                lastContractRid: number
                lastContractTitle: string
                feedbackText: string
                compstringOrgUid: string
                hasFinancialPrivacy: boolean
            }
            freelancersToHire: number
            relevanceEncoded: string
            enterpriseJob: boolean
            tierText: string
            tier: string
            tierLabel: string
            isSaved: string
            feedback: string
            proposalsTier: string
            isApplied: boolean
            sticky: boolean
            stickyLabel: string
            jobTs: string
            prefFreelancerLocationMandatory: boolean
            prefFreelancerLocation: Array<string>
            premium: boolean
            plusBadge: string
            publishedOn: string
            renewedOn?: string
            sandsService: string
            sandsSpec: string
            sandsAttrs: string
            occupation: string
            attrs: Array<{
                parentSkillUid: string
                freeText: string
                skillType: number
                uid: string
                highlighted: boolean
                prettyName: string
            }>
            isLocal: boolean
            workType: string
            locations: Array<string>
            occupations: {
                category: {
                    uid: string
                    prefLabel: string
                }
                subcategories: Array<{
                    uid: string
                    prefLabel: string
                }>
                oservice: {
                    uid: string
                    prefLabel: string
                }
            }
            weeklyBudget: {
                currencyCode: string
                amount: number
            }
            hourlyBudgetText?: string
            hourlyBudget: {
                type?: string
                min: number
                max: number
            }
            tags: Array<string>
            clientRelation: string
            totalFreelancersToHire: string
            teamUid: string
            multipleFreelancersToHirePredicted: string
            connectPrice: number
        }>
        facets: {
            jobType: {
                weekly_retainer: number
                "0": number
                "1": number
            }
            workload: {
                part_time: number
                full_time: number
                "as_needed,part_time": number
                as_needed: number
                none: number
            }
            duration: string
            clientHires: {
                "0": number
                "1-9": number
                "10-": number
            }
            budget: string
            contractorTier: {
                "1": number
                "2": number
                "3": number
            }
            categories2: string
            previousClients: {
                all: number
            }
            proposals: {
                "5-9": number
                "20-49": number
                "0-4": number
                "10-14": number
                "*": number
                "15-19": number
            }
            amount: {
                "5000-": number
                "*": number
                "0-99": number
                "100-499": number
                "1000-4999": number
                "500-999": number
            }
            userLocationMatch: string
            services: string
            specs: string
            attrs: string
            durationV2: string
            enterprise: string
            userDomesticJobsLastDays: string
            durationV3: {
                weeks: number
                months: number
                semester: number
                ongoing: number
            }
            occupations: string
            engagementDuration: string
            freelancersNeeded: string
            location: {
                "South America": number
                "Papua New Guinea": number
                Cambodia: number
                Kazakhstan: number
                Paraguay: number
                Bahamas: number
                Mali: number
                "Marshall Islands": number
                Panama: number
                Guadeloupe: number
                "Eastern Asia": number
                Laos: number
                Argentina: number
                Africa: number
                Seychelles: number
                Zambia: number
                Belize: number
                Bahrain: number
                "Saint Barthelemy": number
                Namibia: number
                Finland: number
                Comoros: number
                "Faroe Islands": number
                "Palestinian Territories": number
                "Netherlands Antilles": number
                Georgia: number
                "Saint Kitts and Nevis": number
                Yemen: number
                "Puerto Rico": number
                Eritrea: number
                Aruba: number
                Madagascar: number
                Sweden: number
                "Cocos (Keeling) Islands": number
                Malawi: number
                Andorra: number
                Liechtenstein: number
                Poland: number
                "United States Virgin Islands": number
                Bulgaria: number
                Jordan: number
                Tunisia: number
                "Congo, the Democratic Republic of the": number
                "United Arab Emirates": number
                Kenya: number
                "French Polynesia": number
                Lebanon: number
                Djibouti: number
                Azerbaijan: number
                "Czech Republic": number
                Mauritania: number
                "Saint Lucia": number
                Guernsey: number
                Mayotte: number
                Israel: number
                "San Marino": number
                Australia: number
                Tajikistan: number
                "Central America": number
                Myanmar: number
                "Eastern Africa": number
                Cameroon: number
                Gibraltar: number
                Cyprus: number
                "Northern Mariana Islands": number
                Malaysia: number
                Oman: number
                Iceland: number
                Armenia: number
                Gabon: number
                "Western Asia": number
                Luxembourg: number
                Polynesia: number
                Brazil: number
                "Turks and Caicos Islands": number
                Algeria: number
                Jersey: number
                Slovenia: number
                "Antigua and Barbuda": number
                Colombia: number
                Ecuador: number
                Moldova: number
                Vanuatu: number
                "United States Minor Outlying Islands": number
                Italy: number
                Honduras: number
                Haiti: number
                Burundi: number
                Singapore: number
                "French Guiana": number
                "American Samoa": number
                Russia: number
                Netherlands: number
                China: number
                Martinique: number
                Kyrgyzstan: number
                Reunion: number
                Bhutan: number
                Romania: number
                "Middle Africa": number
                Togo: number
                "Southern Asia": number
                Philippines: number
                "Cote d'Ivoire": number
                Uzbekistan: number
                Asia: number
                "British Virgin Islands": number
                Zimbabwe: number
                Montenegro: number
                Indonesia: number
                Dominica: number
                Benin: number
                Angola: number
                "Eastern Europe": number
                Portugal: number
                "Brunei Darussalam": number
                Grenada: number
                Greece: number
                "Cayman Islands": number
                Latvia: number
                Mongolia: number
                Morocco: number
                Guatemala: number
                Guyana: number
                Chile: number
                Nepal: number
                "Northern Europe": number
                "Isle of Man": number
                Ukraine: number
                Tanzania: number
                Ghana: number
                "Central Asia": number
                Anguilla: number
                India: number
                "South-Eastern Asia": number
                Canada: number
                Maldives: number
                Turkey: number
                Belgium: number
                Taiwan: number
                "Southern Europe": number
                "South Africa": number
                "Trinidad and Tobago": number
                Bermuda: number
                "Central African Republic": number
                Jamaica: number
                Peru: number
                Turkmenistan: number
                Germstring: number
                Americas: number
                Fiji: number
                "Hong Kong": number
                "United States": number
                Guinea: number
                "Micronesia, Federated States of": number
                Chad: number
                Somalia: number
                "Sao Tome and Principe": number
                Thailand: number
                "Costa Rica": number
                "Saint Martin (French part)": number
                Vietnam: number
                Nigeria: number
                Kuwait: number
                Croatia: number
                Uruguay: number
                "Cook Islands": number
                "Sri Lanka": number
                "United Kingdom": number
                Switzerland: number
                Spain: number
                "Western Africa": number
                Venezuela: number
                "Burkina Faso": number
                Swaziland: number
                Caribbean: number
                Estonia: number
                Austria: number
                "South Korea": number
                Mozambique: number
                "El Salvador": number
                Monaco: number
                Guam: number
                Lesotho: number
                "Northern Africa": number
                Hungary: number
                Europe: number
                Japan: number
                Belarus: number
                Curacao: number
                Mauritius: number
                "Western Europe": number
                Albania: number
                "New Zealand": number
                "Northern America": number
                "Sint Maarten (Dutch part)": number
                Senegal: number
                Macedonia: number
                Ethiopia: number
                Egypt: number
                "Sierra Leone": number
                Bolivia: number
                Oceania: number
                Malta: number
                "Saudi Arabia": number
                "Cape Verde": number
                Pakistan: number
                Gambia: number
                Ireland: number
                Qatar: number
                Slovakia: number
                France: number
                Serbia: number
                Lithuania: number
                "Bosnia and Herzegovina": number
                "Australia and New Zealand": number
                Niger: number
                Rwanda: number
                Bangladesh: number
                Barbados: number
                Nicaragua: number
                Norway: number
                "Southern Africa": number
                Botswana: number
                "Saint Vincent and the Grenadines": number
                Macao: number
                Melanesia: number
                Denmark: number
                "Dominican Republic": number
                Mexico: number
                Uganda: number
                Micronesia: number
                Suriname: number
                Greenland: number
            }
            timezone: {
                "": number
                "America/Sao_Paulo": number
                "Asia/Vladivostok": number
                "Europe/Berlin": number
                "Africa/Cairo": number
                "Europe/Moscow": number
                "Pacific/Honolulu": number
                "Australia/Hobart": number
                "Europe/London": number
                "Asia/Baghdad": number
                "Asia/Shanghai": number
                "America/Tijuana": number
                "America/Managua": number
                "Asia/Kamchatka": number
                "Asia/Yerevan": number
                "Africa/Harare": number
                "America/Nome": number
                "America/Chicago": number
                "Asia/Yakutsk": number
                "America/Halifax": number
                "America/Indiana/Indianapolis": number
                "Europe/Paris": number
                "Asia/Tehran": number
                "America/La_Paz": number
                "Asia/Tashkent": number
                "Asia/Bangkok": number
                "Pacific/Midway": number
                "America/Recife": number
                "America/Buenos_Aires": number
                "Australia/Adelaide": number
                "Asia/Yangon": number
                "Asia/Katmandu": number
                "Asia/Almaty": number
                "America/Phoenix": number
                "Europe/Prague": number
                "America/Mexico_City": number
                "Asia/Tbilisi": number
                "Asia/Novosibirsk": number
                "Asia/Jerusalem": number
                "Europe/Lisbon": number
                "Atlantic/South_Georgia": number
                "Asia/Karachi": number
                "Australia/Perth": number
                "Australia/Darwin": number
                "Asia/Calcutta": number
                "America/Bogota": number
                "Asia/Kabul": number
                "America/New_York": number
                "Atlantic/Azores": number
                "Asia/Krasnoyarsk": number
                EET: number
                "Pacific/Auckland": number
                "Europe/Minsk": number
                "Africa/Casablanca": number
                "America/Caracas": number
                "Europe/Kiev": number
                "Asia/Magadan": number
                "America/Regina": number
                "Pacific/Guam": number
                "Africa/Algiers": number
                "Asia/Irkutsk": number
                "America/St_Johns": number
                "America/Fortaleza": number
                "America/Denver": number
                "America/Indiana/Knox": number
                "Australia/Sydney": number
                "Etc/UTC": number
                "Asia/Tokyo": number
                "Pacific/Apia": number
                "Asia/Istanbul": number
                "Asia/Omsk": number
                "America/Los_Angeles": number
                "Australia/Brisbane": number
                "Asia/Yekaterinburg": number
                "Europe/Athens": number
            }
            connectPrice: {
                "8": number
                "12": number
                "16": number
                "0-4": number
            }
            contractToHire: {
                false: number
                true: number
            }
            categories: Array<string>
            subcategories: Array<string>
            paymentVerified: {
                "1": number
            }
        }
        isSearchWithEmptyParams: boolean
        currentQuery: {
            q: string
            t: string
            amount: string
            client_hires: string
            contractor_tier: string
            payment_verified: string
            hourly_rate: string
            from_recent_search: string
            sort: string
        }
        queryParsedParams: {
            q: string
            job_type: string
            budget: string
            client_hires: string
            contractor_tier: string
            verified_payment_only: string
            hourly_rate: string
            sort: string
            paging: string
        }
        pageTitle: string
        jobSearchError: boolean
        rssLink: string
        atomLink: string
        smartSearch: {
            downloadTeamApplication: boolean
        }
    }
    filters: {
        q: string
        sort: string
        skills: {
            name: string
            label: string
            options: Array<string>
        }
        categories: Array<{
            urlName: string
            value: string
            label: string
            activeLabel: string
            checked: boolean
            count: number
            subcategories: Array<{
                urlName: string
                value: string
                label: string
                activeLabel: string
                checked: boolean
                count: number
            }>
        }>
        jobType: {
            name: string
            label: string
            loggingSublocation: string
            loggingLabel: string
            options: Array<{
                value: string
                label: string
                checked: boolean
                count: number
            }>
        }
        contractorTier: {
            name: string
            label: string
            loggingSublocation: string
            loggingLabel: string
            options: Array<{
                value: string
                label: string
                checked: boolean
                count: number
            }>
        }
        contractToHire: {
            name: string
            label: string
            loggingSublocation: string
            value: string
            checked: boolean
            count: number
        }
        clientHires: {
            name: string
            label: string
            loggingSublocation: string
            loggingLabel: string
            options: Array<{
                value: string
                label: string
                checked: boolean
                count: number
            }>
        }
        proposals: {
            name: string
            label: string
            loggingSublocation: string
            loggingLabel: string
            options: Array<{
                value: string
                label: string
                checked: boolean
                count: number
                activeLabel: string
            }>
        }
        amount: {
            name: string
            label: string
            loggingSublocation: string
            disabledJobTypeValue: string
            disabledMessage: string
            options: Array<{
                value: string
                label: string
                checked: boolean
                count: number
            }>
            customAmount: {
                value: string
                label: string
                checked: boolean
                customMin: string
                customMax: string
            }
        }
        workload: {
            name: string
            label: string
            loggingSublocation: string
            loggingLabel: string
            options: Array<{
                value: string
                label: string
                checked: boolean
                count: number
            }>
            disabledJobTypeValue: string
            disabledMessage: string
        }
        duration_v3: {
            name: string
            label: string
            loggingSublocation: string
            loggingLabel: string
            options: Array<{
                value: string
                label: string
                checked: boolean
                count: number
            }>
            disabledJobTypeValue: string
            disabledMessage: string
        }
        previousClients: {
            name: string
            label: string
            loggingSublocation: string
            value: string
            checked: boolean
            count: number
        }
        paymentVerified: {
            name: string
            label: string
            loggingSublocation: string
            value: string
            checked: boolean
            count: number
        }
        talentClouds: {
            name: string
            label: string
            loggingSublocation: string
            options: Array<string>
        }
        userLocationMatch: {
            name: string
            label: string
            loggingSublocation: string
            value: string
            checked: boolean
            count: number
        }
        occupation: {
            name: string
            label: string
            loggingSublocation: string
            options: Array<string>
        }
        ontologySkills: {
            name: string
            label: string
            loggingSublocation: string
            options: Array<string>
        }
        hourly_rate: {
            name: string
            label: string
            loggingSublocation: string
            options: Array<string>
            customHourlyRate: {
                value: string
                checked: boolean
                label: string
                customMin: number
                customMax: string
            }
        }
        freelancers_needed: {
            name: string
            label: string
            loggingSublocation: string
            loggingLabel: string
            options: Array<{
                value: string
                label: string
                checked: boolean
                count: number
            }>
        }
        location: {
            name: string
            label: string
            loggingSublocation: string
            options: Array<{
                uid: string
                label: string
                subRegionUid?: string
                regionUid?: string
                value: string
                type: string
                checked: boolean
                count: number
            }>
        }
        timezones: {
            name: string
            label: string
            loggingSublocation: string
            options: Array<{
                value: string
                label: string
                checked: boolean
                count: number
            }>
        }
        connects: {
            name: string
            label: string
            loggingSublocation: string
            loggingLabel: string
            options: Array<{
                value: string
                label: string
                checked: boolean
                count: number
            }>
        }
    }
}
