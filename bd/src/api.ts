const { GuildStore, SortedGuildStore, GuildChannelsStore, ChannelStore, UserStore, MessageActions } = ZLibrary.DiscordModules;
const VoiceStateStore = ZLibrary.WebpackModules.getByProps("getCurrentClientVoiceChannelId");

export class Guild {
    id: string = ''
    name: string = ''

    constructor(obj: Object) { Object.assign(this, obj) }
    static fromId(id: string): Guild { return new Guild(GuildStore.getGuild(id)) }

    get textChannels(): Channel[] {
        return GuildChannelsStore.getChannels(this.id).SELECTABLE.map((obj) => Channel.fromObj(obj.channel))
    }

    get voiceChannels(): Channel[] {
        return GuildChannelsStore.getChannels(this.id).VOCAL.map((obj) => Channel.fromObj(obj.channel))
    }
}

export class Channel {
    id: string = ''
    name: string = ''
    guild_id: string = ''

    static fromObj(obj: Object) { return Object.assign(new this, obj) }
    static fromId(id: string) { return this.fromObj(ChannelStore.getChannel(id)) }

    get guild(): Guild { return Guild.fromId(this.guild_id) }
}

export class TextChannel extends Channel {

    sendMessage(msg: string) {
        const msgObj = {
            content: msg,
            invalidEmojis: [],
            validNonShortcutEmojis: [],
            tts: false,
            stickerIds: [],
            allowedMentions: []
        }
        MessageActions.sendMessage(this.id, msgObj)
    }
}

export class VoiceChannel extends Channel { }

export function getCurrentVoiceChannel(): VoiceChannel | undefined {
    let currentUserId: string = UserStore.getCurrentUser().id

    let allVoiceStates: Object[] = VoiceStateStore.getAllVoiceStates()
    let currentVoiceState = Object.values(allVoiceStates).find((voiceState) => voiceState[currentUserId] !== undefined)

    if (currentVoiceState === undefined)
        return undefined

    let currentVoiceChannelId: string = currentVoiceState[currentUserId].channelId
    return Channel.fromId(currentVoiceChannelId) as VoiceChannel
}

export function getAllGuilds(): Guild[] {
    return SortedGuildStore.getSortedGuilds().map((guild_obj: Object) => {
        return new Guild(guild_obj.guilds[0])
    })
}