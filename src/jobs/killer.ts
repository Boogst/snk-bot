import { SnkDefaults } from '../system/defaults';

import { Client, MessageEmbed } from 'discord.js';
import { database } from '../main';

import SnkJob from '../jobs';

export default class KillerJob extends SnkJob {

  constructor() {
    super(10);
  }

  run() {
    for (const manager of database.getPlayerManagers()) {
      for (const player of manager.getPlayers()) {
        if (player.hasBody() && new Date().getTime() >= player.getAttribute('deathdate')) {
          const guild = database.getSoftGuild(manager.getGuild());
          const user = player.getDiscordUser(guild);
          guild.getCommandChannel((channel: any) => {
            SnkDefaults.killPlayer(player, user, guild, 'Muerte Natural', channel);
          });
        }
      }
    }
  }
}

