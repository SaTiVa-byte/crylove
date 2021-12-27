
var config = require('./config.json');
var discord = require('discord.js');
var client = new discord.Client();
var fs = require('fs');
var prefix = '-';
var db = require('quick.db');

client.on('ready', async function () {
    console.log(`ready, logged in as ${client.user.tag}`);
    setInterval(() => {
        client.user.setActivity(`-help | in ${client.guilds.size} Server`, {
            type: "WATCHING"
        });
    }, 16000);
});

//logging
client.on('messageDelete', async message => {

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    function sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }
    }

    if (message.guild) {
        if (message.author.bot) return;
        var y = db.get('messagedelete_' + message.guild.id);
        if (y !== `enabled`) return;
        var x = db.get('loggingchannel_' + message.guild.id);
        x = client.channels.get(x);
        if (message.channel == x) return;
        var embed = new discord.RichEmbed()
            .setColor('#FF0000')
            .setAuthor(message.author.tag, message.author.avatarURL)
            .setDescription(`**Nachrichten Gelöscht von** ${message.author} **in** ${message.channel} \n${message.content}`)
            .setFooter(`ID: ${client.guilds.id}`, client.guilds.iconURL)
            .setTimestamp();
        x.send(embed).catch();
    }

});

client.on("channelCreate", async function (channel) {
    if (!channel.guild) return;
    var y = db.get(`channelcreate_${channel.guild.id}`);
    if (y !== 'enabled') return;
    var x = db.get('loggingchannel_' + channel.guild.id);
    var x = client.channels.get(x);
    var embed = new discord.RichEmbed()
        .setColor('#09dc0b')
        .setAuthor(channel.guild.name, channel.guild.iconURL)
        .setTitle('Channel Erstellt')
        .addField('Channel', channel)
        .addField('Type', channel.type)
        .setFooter(`ID: ${channel.guild.id}`, channel.guild.iconURL)
        .setTimestamp();
    x.send(embed).catch();


});

client.on("channelDelete", async function (channel) {
    if (!channel.guild) return;
    var y = db.get(`channelcreate_${channel.guild.id}`);
    if (y !== 'enabled') return;
    var x = db.get('loggingchannel_' + channel.guild.id);
    var x = client.channels.get(x);

    var embed = new discord.RichEmbed()
        .setColor('#FF0000')
        .setAuthor(channel.guild.name, channel.guild.iconURL)
        .setTitle('Channel Gelöscht')
        .addField('Name', channel.name)
        .addField('Type', channel.type)
        .setFooter(`ID: ${channel.guild.id}`, channel.guild.iconURL)
        .setTimestamp();
    x.send(embed).catch();


});
client.on("emojiCreate", async function (emoji) {

    var y = db.get(`emojicreate_${emoji.guild.id}`);
    if (y !== 'enabled') return;
    var x = db.get('loggingchannel_' + emoji.guild.id);
    var x = client.channels.get(x);

    var embed = new discord.RichEmbed()
        .setColor('#09dc0b')
        .setAuthor(emoji.guild.name, emoji.guild.iconURL)
        .setTitle('Emoji Erstellt')
        .addField('Emoji Hinzugefügt', emoji + ` :${emoji.name}:`)
        .setFooter(`ID: ${emoji.guild.id}`, emoji.guild.iconURL)
        .setTimestamp();
    x.send(embed).catch();


});
client.on("emojiDelete", async function (emoji) {
    var y = db.get(`emojidelete_${emoji.guild.id}`);
    if (y !== 'enabled') return;
    var x = db.get('loggingchannel_' + emoji.guild.id);
    var x = client.channels.get(x);

    var embed = new discord.RichEmbed()
        .setColor('#FF0000')
        .setAuthor(emoji.guild.name, emoji.guild.iconURL)
        .setTitle('Emoji Entfernt')
        .addField('Name', `[:${emoji.name}:](${emoji.url})`)
        .setFooter(`ID: ${emoji.guild.id}`, emoji.guild.iconURL)
        .setTimestamp();
    x.send(embed).catch();


});
client.on("guildBanAdd", async function (guild, user) {

    var y = db.get(`guildbanadd_${guild.id}`);
    if (y !== 'enabled') return;
    var x = db.get('loggingchannel_' + guild.id);
    var x = client.channels.get(x);

    var embed = new discord.RichEmbed()
        .setColor('#FF0000')
        .setAuthor(user.tag, user.avatarURL)
        .setDescription(`:police_officer: :lock: ${user.tag} **wurde gebannt** `)
        .setFooter(`ID: ${guild.id}`, guild.iconURL)
        .setTimestamp();
    x.send(embed).catch();

});
client.on("guildBanRemove", async function (guild, user) {

    var y = db.get(`guildbanremove_${guild.id}`);
    if (y !== 'enabled') return;
    var x = db.get('loggingchannel_' + guild.id);
    var x = client.channels.get(x);

    var embed = new discord.RichEmbed()
        .setColor('GREEN')
        .setAuthor(user.tag, user.avatarURL)
        .setDescription(`:police_officer: :unlock: ${user.tag} **wurde entbannt**`)
        .setFooter(`ID: ${guild.id}`, guild.iconURL)
        .setTimestamp();
    x.send(embed).catch();
});
client.on("guildMemberAdd", async function (member) {

    var y = db.get(`guildmemberadd_${member.guild.id}`);
    if (y !== 'enabled') return;
    var x = db.get('loggingchannel_' + member.guild.id);
    var x = client.channels.get(x);

    var embed = new discord.RichEmbed()
        .setColor('GREEN')
        .setAuthor(member.user.tag, member.user.avatarURL)
        .setDescription(`:inbox_tray: ${member.user.tag} **ist dem Server gejoint**`)
        .addField('Account erstellung', member.user.createdAt)
        .setFooter(`ID: ${member.user.id}`)
        .setTimestamp();
    x.send(embed).catch();
});
client.on("guildMemberRemove", async function (member) {
    var y = db.get(`guildmemberremove_${member.guild.id}`);
    if (y !== 'enabled') return;
    var x = db.get('loggingchannel_' + member.guild.id);
    var x = client.channels.get(x);

    var embed = new discord.RichEmbed()
        .setColor('RED')
        .setAuthor(member.user.tag, member.user.avatarURL)
        .setDescription(`:outbox_tray: ${member.user.tag} **hat den Server verlassen**`)
        .setFooter(`ID: ${member.user.id}`)
        .setTimestamp();
    x.send(embed).catch();

});

client.on("messageDeleteBulk", async function (messages) {

    var y = db.get(`messagebulkdelete_${messages.random().guild.id}`);
    if (y !== 'enabled') return;
    var x = db.get('loggingchannel_' + messages.random().guild.id);
    var x = client.channels.get(x);
    if (messages.random().channel == x) return;

    await messages.array().reverse().forEach(m => {
        var x = m.createdAt.toString().split(' ');
        fs.appendFile('messagebulkdelete.txt', `[${m.author.tag}], [#${m.channel.name}]: ["${m.content}"], erstellt am [${x[0]} ${x[1]} ${x[2]} ${x[3]} ${x[4]}]\n\n`, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    });

    var embed = new discord.RichEmbed()
        .setColor('#FFD700')
        .setAuthor(messages.random().guild.name, messages.random().guild.iconURL)
        .setDescription(`**${messages.array().length} Nachrichten wurden gelöscht in** ${messages.random().channel}`)
        .setFooter(`ID: ${messages.random().guild.id}`)
        .setTimestamp();
        await x.send(embed).catch();
        await x.send(`Hier der Log von den Nachrichten: \n`).catch();
        await x.send(({
            files: [{
               attachment: 'messagebulkdelete.txt'
            }]
    })).catch();

    fs.unlink('messagebulkdelete.txt', function (err) {
        if (err) throw err;
        console.log('File deleted!');
    });

});

client.on("roleCreate", async function (role) {
    var y = db.get(`rolecreate_${role.guild.id}`);
    if (y !== 'enabled') return;
    var x = db.get('loggingchannel_' + role.guild.id);
    var x = client.channels.get(x);


    var embed = new discord.RichEmbed()
        .setColor('#09dc0b')
        .setAuthor(role.guild.name, role.guild.iconURL)
        .setTitle(`Role ${role.name} Erstellt`)
        .setDescription(`Name: ${role.name} \nFarbe: ${role.color} \nHervorgehoben: ${role.hoist} \nPingbar?: ${role.mentionable}`)
        .setFooter(`ID: ${role.id}`)
        .setTimestamp();
    x.send(embed).catch();

});
client.on("roleDelete", async function (role) {

    var y = db.get(`roledelete_${role.guild.id}`);
    if (y !== 'enabled') return;
    var x = db.get('loggingchannel_' + role.guild.id);
    var x = client.channels.get(x);

    var embed = new discord.RichEmbed()
        .setColor('#FF0000')
        .setAuthor(role.guild.name, role.guild.iconURL)
        .setTitle(`Role ${role.name} Gelöscht`)
        .setDescription(`Name: ${role.name} \nColor: ${role.color} \nHervorgehoben: ${role.hoist} \nPingbar?: ${role.mentionable}`)
        .setFooter(`ID: ${role.id}`)
        .setTimestamp();

    x.send(embed).catch();

});

client.on('message', async message => {

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (message.content.indexOf(prefix) !== 0) return;

    function sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }

    }

    if (command === "help") {
        if (!message.guild) return message.channel.send(`Commands nur im Server benutzen, nicht per DM!`);
        if (!message.member.hasPermission(`MANAGE_CHANNELS`) || !message.member.hasPermission(`MANAGE_GUILD`)) return message.channel.send(`:no_entry: Sorry, aber du! Hast zu wenig Rechte!`);
        var embed = new discord.RichEmbed()
            .setAuthor(`Hilfe für ${message.guild.name}`, message.guild.iconURL)
            .setTitle(`Konfiguration für's Loggen in ${message.guild.name}\n`)
            .setColor('PURPLE');
        var y = await db.get(`allenabled_${message.guild.id}`);
        if (y == 'enabled') {
            embed.addField('loggt für gelöschte nachrichten [1]', "enabled");
            embed.addField('loggt für erstellte rolen [2]', "enabled");
            embed.addField('loggt für gelöschte rolen [3]', "enabled");
            embed.addField('loggt für mehr gelöschte nachrichten [4]', "enabled");
            embed.addField('loggt für spieler geleavt/spieler kicks [5]', "enabled");
            embed.addField('loggt für spieler gejoint [6]', "enabled");
            embed.addField('loggt für server bans [7]', "enabled");
            embed.addField('loggt für server unbans [8]', "enabled");
            embed.addField('loggt für emoji erstellt [9]', "enabled");
            embed.addField('loggt für emoji gelöscht [10]', "enabled");
            embed.addField('loggt für channel erstellt [11]', "enabled");
            embed.addField('loggt für channel gelöscht [12]', "enabled");
            embed.addField(`----------------------`, `Commands: \n\`${prefix}enable [number]\` - Aktiviert Logs\n\`${prefix}enable all\` - Aktiviert alle Logs \n \`${prefix}disable [number]\` - Deaktiviert Logs \n\`${prefix}disable all\` - Deaktiviert alle Logs \n \`${prefix}reset\` - Aktualisiert den Cache für den ganzen Server; alles wird auf Standart gesetzt, mit keinen Logs Channel`);
            var x = await db.get('loggingchannel_' + message.guild.id);
            if (x == null) embed.addField(`Es gibt kein Logs Channel auf diesem Server. Um einen zu erstellen, tippe:`, `\`${prefix}setchannel #channel\``);
            if (x !== null) {
                var y = client.channels.get(x);
                embed.addField(`----------------------`, `Der Aktuelle Channel ist ${y}. \n Um ein anderen Channel zu benutzen, tippe **${prefix}setchannel #channel**.`);
            }
            embed.setFooter(`Bot wurde erstellt von SaTiVa!`);
        } else if (y == "disabled") {
            embed.addField('loggt für gelöschte nachrichten [1]', "disabled");
            embed.addField('loggt für erstellte rolen [2]', "disabled");
            embed.addField('loggt für gelöschte rolen [3]', "disabled");
            embed.addField('loggt für mehr gelöschte nachrichten [4]', "disabled");
            embed.addField('loggt für spieler geleavt/spieler kicks [5]', "disabled");
            embed.addField('loggt für spieler gejoint [6]', "disabled");
            embed.addField('loggt für server bans [7]', "disabled");
            embed.addField('loggt für server unbans [8]', "disabled");
            embed.addField('loggt für emoji erstellt [9]', "disabled");
            embed.addField('loggt für emoji gelöscht [10]', "disabled");
            embed.addField('loggt für channel erstellt [11]', "disabled");
            embed.addField('loggt für channel gelöscht [12]', "disabled");
            embed.addField(`----------------------`, `Commands: \n\`${prefix}enable [number]\` - Aktiviert Logs\n\`${prefix}enable all\` - Aktiviert alle Logs \n \`${prefix}disable [number]\` - Deaktiviert Logs \n\`${prefix}disable all\` - Deaktiviert alle Logs\n \`${prefix}reset\` - Aktualisiert den Cache für den ganzen Server; alles wird auf Standart gesetzt, mit keinen Logs Channel`);
            var x = await db.get('loggingchannel_' + message.guild.id);
            if (x == null) embed.addField(`Es gibt kein Logs Channel auf diesem Server. Um einen zu erstellen, tippe:`, `\`${prefix}setchannel #channel\``);
            if (x !== null) {
                var y = client.channels.get(x);
                embed.addField(`----------------------`, `Der Aktuelle Channel ist ${y}. \n Um ein anderen Channel zu benutzen, tippe **${prefix}setchannel #channel**.`);
            }
        } else {

            var x = await db.get('messagedelete_' + message.guild.id);
            if (x == null || x == "disabled") {
                embed.addField('loggt gelöschte nachrichten [1]', "disabled");
            } else {
                embed.addField('loggt gelöschte nachrichten [1]', "enabled");
            }
            var x = await db.get('rolecreate_' + message.guild.id);
            if (x == null || x == "disabled") {
                embed.addField('loggt erstellte rolen [2]', "disabled");
            } else {
                embed.addField('loggt erstellte rolen [2]', "enabled");
            }
            var x = await db.get('roledelete_' + message.guild.id);
            if (x == null || x == "disabled") {
                embed.addField('loggt gelöschte rolen [3]', "disabled");
            } else {
                embed.addField('loggt gelöschte rolen [3]', "enabled");
            }
            var x = await db.get('messagebulkdelete_' + message.guild.id);
            if (x == null || x == "disabled") {
                embed.addField('loggt mehr gelöschte nachrichten [4]', "disabled");
            } else {
                embed.addField('loggt mehr gelöschte nachrichten [4]', "enabled");
            }
            var x = await db.get('guildmemberremove_' + message.guild.id);
            if (x == null || x == "disabled") {
                embed.addField('loggt spieler geleavt/spieler kicks [5]', "disabled");
            } else {
                embed.addField('loggt spieler geleavt/spieler kicks [5]', "enabled");
            }
            var x = await db.get('guildmemberadd_' + message.guild.id);
            if (x == null || x == "disabled") {
                embed.addField('loggt spieler gejoint [6]', "disabled");
            } else {
                embed.addField('loggt spieler gejoint [6]', "enabled");
            }
            var x = await db.get('guildbanadd_' + message.guild.id);
            if (x == null || x == "disabled") {
                embed.addField('loggt server bans [7]', "disabled");
            } else {
                embed.addField('loggt server bans [7]', "enabled");
            }
            var x = await db.get('guildbanremove_' + message.guild.id);
            if (x == null || x == "disabled") {
                embed.addField('loggt server unbans [8]', "disabled");
            } else {
                embed.addField('loggt server unbans [8]', "enabled");
            }
            var x = await db.get('emojicreate_' + message.guild.id);
            if (x == null || x == "disabled") {
                embed.addField('loggt emoji erstellt [9]', "disabled");
            } else {
                embed.addField('loggt emoji erstellt [9]', "enabled");
            }
            var x = await db.get('emojidelete_' + message.guild.id);
            if (x == null || x == "disabled") {
                embed.addField('loggt emoji gelöscht [10]', "disabled");
            } else {
                embed.addField('loggt emoji gelöscht [10]', "enabled");
            }
            var x = await db.get('channelcreate_' + message.guild.id);
            if (x == null || x == "disabled") {
                embed.addField('loggt channel erstellen [11]', "disabled");
            } else {
                embed.addField('loggt channel erstellen [11]', "enabled");
            }
            var x = await db.get('channeldelete_' + message.guild.id);
            if (x == null || x == "disabled") {
                embed.addField('loggt channel gelöscht [12]', "disabled");
            } else {
                embed.addField('loggt channel gelöscht [12]', "enabled");
            }
            embed.addField(`----------------------`, `Commands: \n\`${prefix}enable [number]\` - Aktiviert Logs\n\`${prefix}enable all\` - Aktiviert alle Logs \n \`${prefix}disable [number]\` - Deaktiviert Logs \n\`${prefix}disable all\` - Deaktiviert alle Logs\n \`${prefix}reset\` - Aktualisiert den Cache für den ganzen Server; alles wird auf Standart gesetzt, mit keinen Logs Channel`);
            var x = await db.get('loggingchannel_' + message.guild.id);
            if (x == null) embed.addField(`Es gibt kein Logs Channel auf diesem Server. Um einen zu erstellen, tippe:`, `\`${prefix}setchannel #channel\``);
            if (x !== null) {
                var y = client.channels.get(x);
                embed.addField(`----------------------`, `Der Aktuelle Channel ist ${y}. \n Um ein anderen Channel zu benutzen, tippe, **${prefix}setchannel #channel**.`);
            }
        }
        embed.setFooter(`Bot wurde erstellt von SaTiVa!`);
        embed.addField(`----------------------\n`, `[Discord Server](https://discord.gg/rHnnFdSu7H)`);
        message.channel.send(embed);

    }

    if (command == "reset") {
        if (!message.guild) return message.reply('Du musst den Command in einem Server eingeben!');
        if (!message.member.hasPermission(`MANAGE_CHANNELS`) || !message.member.hasPermission(`MANAGE_GUILD`)) return message.channel.send(`:no_entry: Sorry, aber du! Hast zu wenig Rechte!`);
        await db.delete(`loggingchannel_${message.guild.id}`);
        await db.delete(`allenabled_${message.guild.id}`);
        await db.delete(`messagedelete_${message.guild.id}`);
        await db.delete('rolecreate_' + message.guild.id);
        await db.delete('roledelete_' + message.guild.id);
        await db.delete('messagebulkdelete_' + message.guild.id);
        await db.delete('guildmemberremove_' + message.guild.id);
        await db.delete('guildmemberadd_' + message.guild.id);
        await db.delete('guildbanadd_' + message.guild.id);
        await db.delete('guildbanremove_' + message.guild.id);
        await db.delete('emojicreate_' + message.guild.id);
        await db.delete('emojidelete_' + message.guild.id);
        await db.delete('channelcreate_' + message.guild.id);
        await db.delete('channeldelete_' + message.guild.id);
        message.channel.send(`Fertig, alles gecleart auf dem Server. Tippe \`${prefix}help\` um alles neu einzustellen!`);
    }

    if (command == "disable") {

        if (!message.guild) return message.reply('Du musst den Command in einem Server eingeben!');
        if (!message.member.hasPermission(`MANAGE_CHANNELS`) || !message.member.hasPermission(`MANAGE_GUILD`)) return message.channel.send(`:no_entry: Sorry, aber du! Hast zu wenig Rechte!`);
        if (!args[0]) return message.channel.send(`Gebe eine nummer ein die nicht geloggt werden soll. Tippe \`${prefix}help\``);
        var x = await db.get('loggingchannel_' + message.guild.id);
        if (x == null || x == 'none') {
            return message.channel.send(`Du hast noch kein Logs Channel. Tippe \`${prefix}help\``);
        }
        if (args[0] > 12 || args[0] < 1) return message.reply(`tippe \`${prefix}help\` finde eine nummer die du deaktivieren möchtest für`);
        switch (args[0]) {
            case "1":
                await db.set(`messagedelete_${message.guild.id}`, 'disabled');
                message.channel.send(`Ok, deaktiviert für die logs nachrichten gelöscht`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "2":
                await db.set(`rolecreate_${message.guild.id}`, 'disabled');
                message.channel.send(`Ok, deaktiviert für die logs erstellte rolen`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "3":
                await db.set(`roledelete_${message.guild.id}`, 'disabled');
                message.channel.send(`Ok, deaktiviert für die logs gelöschte rolen`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "4":
                await db.set(`messagebulkdelete_${message.guild.id}`, 'disabled');
                message.channel.send(`Ok, deaktiviert für die logs mehrere nachrichten gelöscht`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "5":
                await db.set(`guildmemberremove_${message.guild.id}`, 'disabled');
                message.channel.send(`Ok, deaktiviert für die logs spieler geleavt/spieler kicks`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "6":
                await db.set(`guildmemberadd_${message.guild.id}`, 'disabled');
                message.channel.send(`Ok, deaktiviert für die logs neue spieler`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "7":
                await db.set(`guildbanadd_${message.guild.id}`, 'disabled');
                message.channel.send(`Ok, deaktiviert für die logs gebannte spieler`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "8":
                await db.set(`guildbanremove_${message.guild.id}`, 'disabled');
                message.channel.send(`Ok, deaktiviert für die logs entbannte spieler`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "9":
                await db.set(`emojicreate_${message.guild.id}`, 'disabled');
                message.channel.send(`Ok, deaktiviert für die logs emoji erstellt`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "10":
                await db.set(`emojidelete_${message.guild.id}`, 'disabled');
                message.channel.send(`Ok, deaktiviert die logs für emoji gelöscht`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "11":
                await db.set(`channelcreate_${message.guild.id}`, 'disabled');
                message.channel.send(`Ok, deaktiviert für die logs channel erstellt`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "12":
                await db.set(`channeldelete_${message.guild.id}`, 'disabled');
                message.channel.send(`Ok, deaktiviert die logs für channel gelöscht`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "all":
                await db.set(`allenabled_${message.guild.id}`, 'disabled');
                await db.set(`messagedelete_${message.guild.id}`, 'disabled');
                await db.set('rolecreate_' + message.guild.id, 'disabled');
                await db.set('roledelete_' + message.guild.id, 'disabled');
                await db.set('messagebulkdelete_' + message.guild.id, 'disabled');
                await db.set('guildmemberremove_' + message.guild.id, 'disabled');
                await db.set('guildmemberadd_' + message.guild.id, 'disabled');
                await db.set('guildbanadd_' + message.guild.id, 'disabled');
                await db.set('guildbanremove_' + message.guild.id, 'disabled');
                await db.set('emojicreate_' + message.guild.id, 'disabled');
                await db.set('emojidelete_' + message.guild.id, 'disabled');
                await db.set('channelcreate_' + message.guild.id, 'disabled');
                await db.set('channeldelete_' + message.guild.id, 'disabled');
                message.channel.send(`Ok deaktiviert alle Logs für diesen Server!`);
        }
    }

    if (command == "enable") {
        if (!message.guild) return message.reply('Du musst den Command in einem Server eingeben!');
        if (!message.member.hasPermission(`MANAGE_CHANNELS`) || !message.member.hasPermission(`MANAGE_GUILD`)) return message.channel.send(`:no_entry: Sorry, aber du! Hast zu wenig Rechte!`);
        if (!args[0]) return message.channel.send(`Gebe eine nummer ein die geloggt werden soll. Tippe \`${prefix}help\``);
        var x = await db.get('loggingchannel_' + message.guild.id);
        if (x == null || x == 'none') {
            return message.channel.send(`Du hast noch kein Logs Channel. Tippe \`${prefix}help\``);
        }
        if (args[0] > 12 || args[0] < 1) return message.reply(`Tippe \`${prefix}help\` finde eine nummer die du aktivieren möchtest für`);
        switch (args[0]) {
            case "1":
                await db.set(`messagedelete_${message.guild.id}`, 'enabled');
                message.channel.send(`Ok, aktiviert die logs für gelöschte nachrichten`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "2":
                await db.set(`rolecreate_${message.guild.id}`, 'enabled');
                message.channel.send(`Ok, aktiviert die logs für erstellte rolen`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "3":
                await db.set(`roledelete_${message.guild.id}`, 'enabled');
                message.channel.send(`Ok, aktiviert die logs für gelöschte rolen`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "4":
                await db.set(`messagebulkdelete_${message.guild.id}`, 'enabled');
                message.channel.send(`Ok, aktiviert die logs für mehrere gelöschte nachrichten`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "5":
                await db.set(`guildmemberremove_${message.guild.id}`, 'enabled');
                message.channel.send(`Ok, aktiviert die logs für spieler geleavt/spieler kicks`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "6":
                await db.set(`guildmemberadd_${message.guild.id}`, 'enabled');
                message.channel.send(`Ok, aktiviert die logs für neue spieler`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "7":
                await db.set(`guildbanadd_${message.guild.id}`, 'enabled');
                message.channel.send(`Ok, aktiviert die logs für gebannte spieler`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "8":
                await db.set(`guildbanremove_${message.guild.id}`, 'enabled');
                message.channel.send(`Ok, aktiviert die logs für entbannte spieler`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "9":
                await db.set(`emojicreate_${message.guild.id}`, 'enabled');
                message.channel.send(`Ok, aktiviert die logs für erstellte emojis`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "10":
                await db.set(`emojidelete_${message.guild.id}`, 'enabled');
                message.channel.send(`Ok, aktiviert die logs für gelöschte emojis`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "11":
                await db.set(`channelcreate_${message.guild.id}`, 'enabled');
                message.channel.send(`Ok, aktiviert die logs für erstellte channel`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "12":
                await db.set(`channeldelete_${message.guild.id}`, 'enabled');
                message.channel.send(`Ok, aktiviert die logs für gelöschte channel`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "all":
                await db.set(`allenabled_${message.guild.id}`, 'enabled');

                await db.set('rolecreate_' + message.guild.id, 'enabled');
                await db.set(`messagedelete_${message.guild.id}`, 'enabled');
                await db.set('roledelete_' + message.guild.id, 'enabled');
                await db.set('messagebulkdelete_' + message.guild.id, 'enabled');
                await db.set('guildmemberremove_' + message.guild.id, 'enabled');
                await db.set('guildmemberadd_' + message.guild.id, 'enabled');
                await db.set('guildbanadd_' + message.guild.id, 'enabled');
                await db.set('guildbanremove_' + message.guild.id, 'enabled');
                await db.set('emojicreate_' + message.guild.id, 'enabled');
                await db.set('emojidelete_' + message.guild.id, 'enabled');
                await db.set('channelcreate_' + message.guild.id, 'enabled');
                await db.set('channeldelete_' + message.guild.id, 'enabled');
                message.channel.send(`Ok aktiviert alle Logs für diesen Server.`);
        }
    }

    if (command == "setchannel") {
        if (!message.guild) return message.reply('Du musst den Command in einem Server eingeben!');
        if (!message.member.hasPermission(`MANAGE_CHANNELS`) || !message.member.hasPermission(`MANAGE_GUILD`)) return message.channel.send(`:no_entry: Sorry, aber du! Hast zu wenig Rechte für diesen Command!`);
        if (!args[0] || args[1]) return message.reply(`bitte gebe richtig den Channel an, ungefähr so: \`${prefix}setchannel #channel\``);

        x = message.mentions.channels.first();
        if (!x) return message.channel.send(`bitte gebe richtig den Channel an, ungefähr so: \`${prefix}setchannel #channel\``);
        await db.set(`loggingchannel_${message.guild.id}`, x.id);
        message.channel.send(`Ok, Logs Channel würde für diesen Server so gesetzt ${x}`);
    }

});

client.on('error', e => {
    console.log(e);
});
client.login(config.token || process.env.TOKEN).catch(e => console.log(e));
