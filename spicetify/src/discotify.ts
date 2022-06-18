// NAME: discotify
// AUTHOR: tcorzo
// VERSION: 0.0.1
// DESCRIPTION: Play a track or playlist on a Discord bot straight from Spotify!

import extension_config from '../../config/plugin_config'

(function Discotify() {
    const { Player, ContextMenu, URI } = Spicetify;

    const PLAYABLE = [URI.isTrack, URI.isPlaylistV1OrV2, URI.isAlbum];

    const PORT = extension_config.port;
    const PLAY_PATH = extension_config.play_path;

    // Wait until all necesary modules are loaded
    if (!(Player && ContextMenu && URI)) {
        setTimeout(Discotify, 300);
        return;
    }

    // Add context menu items for shareable items
    new ContextMenu.Item(
        'Play over Discotify',
        sendTrack,
        isShareable
    ).register();

    function sendTrack(uris: string[]) {
        const uri = URI.fromString(uris[0]);
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('load', (res) => console.log(res));
        xhr.open(
            'GET',
            `http://localhost:${PORT}${PLAY_PATH}?${extension_config.params.play_url}=${uri.toPlayURL()}`
        );
        xhr.send();
    }

    function isShareable(uris: string[]) {
        return PLAYABLE.some((validator) => validator(uris[0]));
    }
})();
