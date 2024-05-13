//index.js
const EventEmitter = require('events');
const TelegramBot = require('node-telegram-bot-api');

process.env.NTBA_FIX_350 = true;

class TelegramClient extends EventEmitter {
    constructor(token) {
        super();
        this.bot = new TelegramBot(token, { polling: true });


        this.bot.on('start', (msg) => {
                this.emit('start', msg);
        });

        this.bot.on('message', (msg) => {
            if(msg?.text === '/start'){
                msg.type = 'start'
                this.emit('start', msg);
            }else{
                msg.type = 'message'
                this.emit('message', msg);
            }
        });
        
        this.bot.on('callback_query', (msg) => {
            msg.type = 'callback_query';
            this.emit('message', msg);
            });
            
            this.bot.on('inline_query', (msg) => {
            msg.type = 'inline_query';
            this.emit('message', msg);
            });
            
            this.bot.on('chosen_inline_result', (msg) => {
            msg.type = 'chosen_inline_result';
            this.emit('message', msg);
            });
            
            this.bot.on('channel_post', (msg) => {
            msg.type = 'channel_post';
            this.emit('message', msg);
            });
            
            this.bot.on('edited_message', (msg) => {
            msg.type = 'edited_message';
            this.emit('message', msg);
            });
            
            this.bot.on('edited_message_text', (msg) => {
            msg.type = 'edited_message_text';
            this.emit('message', msg);
            });
            
            this.bot.on('edited_channel_post', (msg) => {
            msg.type = 'edited_channel_post';
            this.emit('message', msg);
            });
            
            this.bot.on('shipping_query', (msg) => {
            msg.type = 'shipping_query';
            this.emit('message', msg);
            });
            
            this.bot.on('pre_checkout_query', (msg) => {
            msg.type = 'pre_checkout_query';
            this.emit('message', msg);
            });
            
            this.bot.on('poll', (msg) => {
            msg.type = 'poll';
            this.emit('message', msg);
            });
            
            this.bot.on('poll_answer', (msg) => {
            msg.type = 'poll_answer';
            this.emit('message', msg);
            });
            
            this.bot.on('chat_member', (msg) => {
            msg.type = 'chat_member';
            this.emit('message', msg);
            });
            
            this.bot.on('my_chat_member', (msg) => {
            msg.type = 'my_chat_member';
            this.emit('message', msg);
            });

            this.bot.on('polling_error', (error) => {
                //console.log(error);  // => 'EFATAL'
              });

              this.sendMessage = this.bot.sendMessage.bind(this.bot); 
            
    }

    connect() {
        // No need for this method, as the bot starts polling automatically in the constructor
    }
}

module.exports = TelegramClient;
