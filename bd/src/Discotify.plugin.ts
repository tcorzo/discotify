import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import { URL } from "url";
import plugin_config from '../../config/plugin_config'

import { getAllGuilds, getCurrentVoiceChannel, TextChannel } from './api'
import { DiscotifySettings, getGuildSettings, getMusicChannelForGuild, setGuildSettings } from './settings'

const { GuildChannelsStore } = ZLibrary.DiscordModules

const PLUGIN_NAME = plugin_config.bd_app_name

// Server config
const PORT = plugin_config.port
const PLAY_PATH = plugin_config.play_path


export function discotifyPlugin(Plugin, ZLibrary) {

    const { Settings } = ZLibrary;

    return class Discotify extends Plugin {
        settings: DiscotifySettings
        server: Server

        onStart() {
            this.startServer()
        }

        onStop() {
            this.server.close();
        }

        getSettingsPanel() {
            let musicChannelSettingGroup = new Settings.SettingGroup(
                'Servers\' configuration ⚙',
                { shown: true },
            )
            getAllGuilds().forEach((guild) => {
                musicChannelSettingGroup.append(
                    new Settings.SettingGroup(`${guild.name}`)
                        .append(
                            new Settings.Textbox(
                                'Music command ⌨', '',
                                getGuildSettings(this.settings, guild)?.musicCommand,
                                (c: string) => { this.settings = setGuildSettings(this.settings, guild, { musicCommand: c }) }
                            )
                        )
                        .append(
                            new Settings.RadioGroup(
                                `Music channel 🎵🎶`,
                                "The server's text channel where the bot commands will be sent 🤖.",
                                getMusicChannelForGuild(this.settings, guild)?.id,
                                guild.textChannels
                                    .map((chan) => {
                                        return {
                                            name: chan.name,
                                            value: chan.id,
                                        };
                                    }),
                                (id: string) => { setGuildSettings(this.settings, guild, { musicChannelId: id }) }
                            ),
                            // new Settings.Dropdown(
                            //     `${guild.name}'s music channel 🎵🎶`,
                            //     "The server's text channel where the bot commands will be sent 🤖.",
                            //     this.getMusicChannelForGuild(guild)?.id,
                            //     guild.textChannels()
                            //         .map((chan) => {
                            //             return {
                            //                 label: chan.name,
                            //                 value: chan.id,
                            //             };
                            //         }),
                            //     (id) => { this.setGuildSettings(guild, { musicChannelId: id }) }
                            // )
                        )
                );
            })

            return Settings.SettingPanel.build(
                this.saveSettings.bind(this),
                musicChannelSettingGroup
            );
        }

        // General
        startServer() {
            let discotify = this

            this.server = createServer((req: IncomingMessage, res: ServerResponse) => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Request-Method', '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET');
                res.setHeader('Access-Control-Allow-Headers', '*');

                if (req.url === undefined) {
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end('URL must be present\n');
                    return
                }

                let url = new URL(req.url, `http://${req.headers.host}`);
                let playUrl = url.searchParams.get(plugin_config.params.play_url);

                if (req.method !== 'GET') {
                    // Method not allowed
                    res.writeHead(405, { 'Content-Type': 'text/plain' });
                    return
                }
                if (url.pathname !== PLAY_PATH) {
                    // Not Found
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    return
                }
                if (playUrl === null) {
                    // Bad request
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    return
                }

                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end();

                try {
                    discotify.sendPlayCommand(playUrl);
                } catch (error) {
                    console.log(error);
                }
            })
            this.server.listen(PORT);

            console.log(`${PLUGIN_NAME} running on port ${PORT}`);
        }

        sendPlayCommand(url: string) {
            let currentGuild = getCurrentVoiceChannel()?.guild

            if (currentGuild === undefined) {
                ZLibrary.Toasts.show('Discotify: Not connected to any voice channel', { type: "error" })
                return
            }

            let guildSettings = getGuildSettings(this.settings, currentGuild)

            if (guildSettings.musicCommand === undefined) {
                ZLibrary.Toasts.show(`Discotify: No music command set for ${currentGuild.name}`, { type: "error" })
                return
            }

            let musicChannel: TextChannel
            // This should play on the guild's default channel
            if (guildSettings.musicChannelId !== undefined)
                musicChannel = TextChannel.fromId(guildSettings.musicChannelId) as TextChannel
            else
                musicChannel = TextChannel.fromObj(GuildChannelsStore.getDefaultChannel(currentGuild.id)) as TextChannel

            musicChannel.sendMessage(`${guildSettings.musicCommand} ${url}`)
        }


    }

}
