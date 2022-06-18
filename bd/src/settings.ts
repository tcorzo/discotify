import { Guild, Channel } from "./api";

export interface DiscotifySettings {
    guildsSettings: GuildSettings[]
}

export interface GuildSettings {
    guildId?: string
    musicChannelId?: string
    musicCommand?: string
}

// Settings
export function setGuildSettings(settings: DiscotifySettings, guild: Guild, guildSettings: GuildSettings): DiscotifySettings {
    let oldGuildSettings = getGuildSettings(settings, guild) ?? { guildId: guild.id }

    settings.guildsSettings = settings.guildsSettings.filter((gSettings) => gSettings.guildId !== guild.id)

    guildSettings = {
        guildId: oldGuildSettings.guildId,
        musicChannelId: guildSettings.musicChannelId ?? oldGuildSettings.musicChannelId,
        musicCommand: guildSettings.musicCommand ?? oldGuildSettings.musicCommand
    }

    settings.guildsSettings.push(guildSettings)
    return settings
}

export function getGuildSettings(settings: DiscotifySettings, guild: Guild): GuildSettings {
    let foundSettings = settings.guildsSettings.find((s) => s.guildId === guild.id)
    if (foundSettings === undefined) {
        foundSettings = { guildId: guild.id }
        settings.guildsSettings.push(foundSettings)
    }

    return foundSettings
}

export function getMusicChannelForGuild(settings: DiscotifySettings, guild: Guild): Channel | undefined {
    let guildSettings = getGuildSettings(settings, guild)
    if (guildSettings.musicChannelId)
        return Channel.fromId(guildSettings.musicChannelId)
    else
        return undefined
}