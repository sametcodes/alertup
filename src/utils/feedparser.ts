import he from 'he';

type JobDetails = {
    hasBudget?: boolean;
    hasHourlyRate?: boolean;
    budget?: number,
    hourly?: { min: number; max: number; };

    content?: string;
    category?: string;
    skills?: string[];
    country?: string;
    link?: string;
    postedOn?: Date;
};

export const removeHTMLTags = (str: string) => str.replace(/<[^>]*>?/gm, '');

export function parseJobDescription(content: string): JobDetails {
    const hourlyPriceRegex = /<b>Hourly Range<\/b>:\s*\$([\d.]+)-\$([\d.]+)/gm;
    const fixedPriceRegex = /<b>Budget<\/b>:\s*\$([\d,.]+)/gm
    const categoryRegex = /<b>Category<\/b>:\s*(.+?)<br \/>/gm;
    const skillsRegex = /<b>Skills<\/b>:\s*([\s\S]+?)<br \/>/gm;
    const countryRegex = /<b>Country<\/b>:\s*(.+?)(?:\n<br \/>|<a href)/gm;
    const linkRegex = /<a href="(https:\/\/www\.upwork\.com\/jobs\/[^"]+)"/gm;
    const postedOnRegex = /<b>Posted On<\/b>:\s*(.+?)<br \/>/;
    const contentRegex = /^([\s\S]*?)<br \/><br \/><b>/gm;

    const response: JobDetails = {};
    const hourlyPriceMatch = hourlyPriceRegex.exec(content);
    if (hourlyPriceMatch) {
        response.hasHourlyRate = true;
        response.hourly = {
            min: Number(hourlyPriceMatch[1]),
            max: Number(hourlyPriceMatch[2])
        }
    } else {
        const fixedPriceMatch = fixedPriceRegex.exec(content);
        if (fixedPriceMatch) {
            response.budget = Number(fixedPriceMatch[1]);
            response.hasBudget = true;
        }
    }

    const categoryMatch = categoryRegex.exec(content);
    if (categoryMatch) {
        response.category = he.decode(categoryMatch[1].trim());
    }

    const skillsMatch = skillsRegex.exec(content);
    if (skillsMatch) {
        response.skills = he.decode(skillsMatch[1]).split(',').map(skill => skill.trim());
    }

    const countryMatch = countryRegex.exec(content);
    if (countryMatch) {
        response.country = he.decode(countryMatch[1].trim());
    }

    const linkMatch = linkRegex.exec(content);
    if (linkMatch) {
        response.link = linkMatch[1];
    }

    const contentMatch = contentRegex.exec(content);
    if (contentMatch) {
        response.content = removeHTMLTags(contentMatch[1]);
    }

    const postedOnMatch = content.match(postedOnRegex);
    if (postedOnMatch) {
        response.postedOn = new Date(postedOnMatch[1]);
    }

    return response;
}

export function parseItems(xml: string) {
    const itemRegex = /<item>([\s\S]*?)<\/item>/gm;
    const items = [];

    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
        const itemContent = match[1];

        const title = /<title>\s*<!\[CDATA\[(.*?)\]\]>\s*<\/title>/gm.exec(itemContent)
        const link = /<link>(.*?)<\/link>/.exec(itemContent)
        const description = /<description>\s*<!\[CDATA\[(.*?)\]\]>\s*<\/description>/gms.exec(itemContent)
        const contentEncoded = /<content:encoded>\s*<!\[CDATA\[(.*?)\]\]>\s*<\/content:encoded>/gms.exec(itemContent);
        const pubDate = /<pubDate>(.*?)<\/pubDate>/.exec(itemContent)
        const guid = /<guid>(.*?)<\/guid>/.exec(itemContent)

        items.push({
            title: title ? title[1] : null,
            link: link ? link[1] : null,
            description: description ? description[1] : null,
            contentEncoded: contentEncoded ? contentEncoded[1] : null,
            meta: parseJobDescription(contentEncoded ? contentEncoded[1] : ""),
            pubDate: pubDate ? pubDate[1] : null,
            guid: guid ? guid[1] : null,
            postId: guid ? guid[1].split('%7E').pop()?.replace('?source=rss', "") || "" : ""
        });
    }

    return items;
}