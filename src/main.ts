import { Client, DiscordAPIError } from 'discord.js'
import { SnkDatabase, SnkGuild } from './system/database'

import { setupCommands, getCommands } from './commands'
import { setupJobs } from './jobs'

import config from '../config.json'//--Obtengo token

export const client: any = new Client();; // Instancia del cliente
export let database: SnkDatabase; // Base de datos

client.on('ready', () => {
  console.log('Ready');
  database = new SnkDatabase(() => { // Se inicializa la base de datos
    console.log('Registering guilds...')
    client.guilds.cache.forEach((guild: any) => {     //recorro todas las propiedades del servidor
      database.registerGuild(guild.id);
    });
    setupCommands(); // Solo inicializar comandos luego de que el bot está en ready y la db inicializó
    setupJobs();
  }, client);
});

client.on('message', (msg: any) => {//-- captura los mensajes en msg

  const guild = database.getSoftGuild(msg.guild.id);

  if (msg.content.startsWith(guild.getPrefix())) {
    const cmd = msg.content.substring(1).split(' ')[0]
    if ((cmd === 'install' || cmd === 'setchannel') || msg.channel.id === guild.getChannelid()) {
      for (const item of getCommands()) {
        if (item.getAliases().includes(cmd)) {

          item.call(
            client,
            msg,
            database.getPlayer(msg)
          )
        }
      }
    }
  }

});

client.login(config['token'])

