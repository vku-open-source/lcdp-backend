export function extractContentFromTags(
    content: string,
    tagName: string
): string[] {
    const regex = new RegExp(`<${tagName}[^>]*>(.*?)</${tagName}>`, "gis");
    const matches = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
        matches.push(match[1]);
    }
    return matches;
}
