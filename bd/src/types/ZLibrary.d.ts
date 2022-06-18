declare namespace ZLibrary {
    namespace DiscordModules {
        namespace GuildStore {
            function getGuild(guild_id: string): Object;
        }

        namespace SortedGuildStore {
            function getSortedGuilds(): Object[];
        }

        namespace GuildChannelsStore {
            function getDefaultChannel(guild_id: string): Object;
            function getChannels(guild_id: string);
        }

        namespace ChannelStore {
            function getChannel(channel_id: string): Object;
        }

        namespace UserStore {
            function getCurrentUser(): Object;
        }

        namespace MessageActions {
            function sendMessage(channel_id: string, msg_obj: Object): void;
        }
    }

    namespace WebpackModules {
        function getByProps(prop: string)
    }
}