// Best-effort preview image for a memory. Only YouTube links have a reliable one;
// everything else returns undefined and the UI draws a type placeholder.
export const deriveImage = (type: string, link: string): string | undefined => {
    if (type !== "YoutubeLink") return undefined;
    try {
        const u = new URL(link);
        const id = u.hostname === "youtu.be" ? u.pathname.slice(1) : u.searchParams.get("v");
        return id && /^[\w-]{11}$/.test(id) ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : undefined;
    } catch {
        return undefined;
    }
};
