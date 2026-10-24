function getStreams(tmdbId, mediaType, season, episode) {
    const MOVY_BASE = 'https://www.movy.sx';

    return fetch(`https://api.themoviedb.org/3/${mediaType === 'tv' ? 'tv' : 'movie'}/${tmdbId}?api_key=c634c44a7f34f71a7d6560411ab1f0c5`)
        .then(res => res.json())
        .then(data => {
            const title = data.title || data.name;
            if (!title) return [];

            let searchUrl = `${MOVY_BASE}/search?q=${encodeURIComponent(title)}`;
            if (mediaType === 'tv' && season && episode) {
                searchUrl += `&season=${season}&episode=${episode}`;
            }

            return fetch(searchUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Referer': MOVY_BASE
                }
            });
        })
        .then(res => res ? res.text() : '')
        .then(html => {
            const match = html.match(/src=["'](https?:\/\/[^"']+\.(m3u8|mp4|embed)[^"']*)["']/i);
            const streamUrl = match ? match[1] : null;

            if (!streamUrl) return [];

            return [{
                name: "Movy.sx",
                title: `Movy.sx - ${mediaType === 'tv' ? `S${season}E${episode}` : 'Movie'}`,
                url: streamUrl,
                quality: '1080p'
            }];
        })
        .catch(error => {
            console.error('[Movy] Error:', error.message);
            return [];
        });
}

module.exports = { getStreams };
