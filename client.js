//client.js
const TelegramClient = require('./index');
const config = require('./config');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/', async(req, res) => {
    try{
     return res.status(200).send({ status : true, response : 'connected successfull!' });
   
    }catch(e){
    return res.send({error:`${e}`})
    }
})
const ownerUsernames = config.ownerUsernames.split(',')
const client = new TelegramClient(config.bottoken);
const { isValidUrl } = require('./lib/utils')
client.on('start', async (msg) => {
console.log(JSON.stringify(msg,null,2))
    const chatId = msg?.chat?.id ? msg.chat.id : msg?.type === 'callback_query' && msg?.from?.id ? msg?.from?.id : '' ;
    const username = msg?.chat?.first_name && msg?.chat?.last_name ?  msg.chat.first_name + ' ' + msg.chat.last_name : '';
    client.sendMessage(chatId, `Hey ${username},\n\tWelcome to the ${config.botname} ${config.shortdesk}\n\nSend me a search query or type @${config.botusername} for use inline search`);
});


client.on('message', async (msg) => {

const type = msg?.type;
const is_bot = msg.from?.is_bot;
const inq = type === 'inline_query' ? msg.query : ''
const body = type === 'callback_query' ?  msg.data  : msg.text ? msg.text : '';
const args = body.split(" ");
const isCommand = body.startsWith('/');
const command = isCommand ? args[0] : '';
const q = isCommand ? args.slice(1).join(" ") : args.join(" ");
const sender = msg.from?.username;
const isOwner = ownerUsernames.includes(sender);
const chatId = msg?.chat?.id ? msg.chat.id : type === 'callback_query' && msg?.from?.id ? msg?.from?.id :  type === 'inline_query'  ?  msg?.from?.id : '';
const sendername = msg?.chat?.first_name && msg?.chat?.last_name ?  msg.chat.first_name + ' ' + msg.chat.last_name : '';

// console.log(JSON.stringify(msg))

const createCommands = require('./commands');
const commands = createCommands({client,msg,config,is_bot,sender,q,body,args,isOwner,chatId,inq});
if (isCommand) {
    switch (command) {
        case '/alive':
            commands.alive();
            break;
        case '/menu':
            commands.menu();
            break;
        case '/owner':
            commands.owner();
            break;
        case '/sub':
            commands.sub();
            break;
        case '/sites':
            commands.sites();
            break;
        case '/search':
            commands.search();
            break;
        default:
            break;
    }
}else{
    if(q !== ""){
        if(isValidUrl(q)){

        }else{
    commands.search();
    } 
}
    if(type === 'inline_query'){
        commands.inline({client,msg,config,is_bot,sender,q,body,args,isOwner,chatId});   
    }  
}


})
