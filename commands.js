// commands.js
const searchData = []
const { isValidUrl,findLinkByRandomText,generateRandomText,downloadAndSendSubtitles,getsublink ,getPageCount,zoom,cinerusearch,baiscope} = require('./lib/utils')
module.exports = ({client,msg,config,is_bot,sender,q,body,args,isOwner,chatId,inq}) => ({
    alive: () => {
        client.sendMessage(chatId, `Hello ${sender},\n\tI'm Alive now`);
    },
    menu: () => {
        client.sendMessage(chatId, `Hello ${sender},\n\tThis is my menu\n`+
        `/start - Start the bot\n`+
        `/search - Search a subtitle from movie title\n`+
        `/sub - Get a subtitle file from movie link ( only websites that can i access , use /sites for check supported websites )\n`+
        `/menu - Get the bot menu\n`+
        `/alive - Check bot online/offline\n`+
        `/sites - Check supported websites\n` );
    },
    sites: () => {
        client.sendMessage(chatId, `Hello ${sender},\n\tI can download subtitles from\n\n`+
        `   1. cineru.lk\n`+
        `   2. baiscope.lk/\n`+
        `   3. zoom.lk\n`+
        `   4. opensubtitles.com\n` );
    },
    sub: async() => {
        if(q!== ''){
            if(isValidUrl(q)){
                const sublink = await getsublink(link)
                if(sublink !== null){
                const ms = await client.sendMessage(chatId, `Downloading your file`);
              
                const deleid = ms.message_id
                await downloadAndSendSubtitles(client,sublink,chatId,deleid)
                }else{
                client.sendMessage(chatId, `Give me a link that website suports for me. use /sites for get the websites list that can I download`);
                }
            }else{
        // const messageId = msg?.message?.message_id
        // client.bot.deleteMessage(chatId, messageId)
        const link = findLinkByRandomText(q,searchData)
        if(link !== null){
        const sublink = await getsublink(link)
        if(sublink !== null){
        const ms = await client.sendMessage(chatId, `Downloading your file`);
      
        const deleid = ms.message_id
        await downloadAndSendSubtitles(client,sublink,chatId,deleid)
        }else{
        client.sendMessage(chatId, `Sorry dear, I cannot find subtitle file. `);
        }
    }else{
        client.sendMessage(chatId, `Sorry dear,I can not download it. use /search for request a new subtitle `);
        }
    }
    }else{
        client.sendMessage(chatId, `I need a movie link for download a subtitle`);
        }
    },
    owner : () => {
        if (isOwner) {
            client.sendMessage(chatId, `Hello ${sender},\n\tI'm here to help you, my boss. what should I do?\n`);
        }// else {
        //     client.sendMessage(chatId, `Hello ${sender},\n\tThis is only for my owners`);
        // }
    },
    search : async () => {
        if(q!==""){
        if(q.includes('--bscope')){
            const messageId = msg?.message?.message_id

            q = q.replace('--bscope','').trim()
            const result = await baiscope(`https://www.baiscope.lk/?s=${encodeURIComponent(q)}`);
            const data = result?.data;
            currentPage = result.currentPage;
            totalPages = result.totalPages;
            if(data !== undefined && data.length !==0 ){
                let buttons = [];
                let text =  '__Select a movie or episode from below :__ \n\n\`\`\`Baiscope.lk\`\`\`\n\n'
                for (let s = 1; s <= data.length; s += 3) {
                    let buttonsub = [];
                    for (let index = 0; index < 3; index++) {
                        const item = data[s + index - 1]; 
                        if (item !== undefined) {
                            const rand = generateRandomText(5)
                            searchData.push({ text : rand , link : item.link})
                            text += `\`${s + index}.\` **${item.title.replace('[සිංහල උපසිරැසි සහිතව]','').replace('[BLURAY UPDATE]','').replace('[සිංහල උපසිරසි]','').replace('[සිංහල උපසිරසි සමඟ]','').trim()}**\n`;
                            buttonsub.push({ text: `${s + index}`, callback_data: `/sub ${rand}` });
                        }
                    }
                    buttons.push(buttonsub);
                }
                let pages =[]
                if(totalPages !== 1) {  
                    if(totalPages <= 4){
                        for (let i = 2; i <= totalPages; i++) {
                        pages.push({text : `page ${i}` , callback_data : `/searchpg ${i} ${q} --bscope`}) 
                        }
                        pages.push({text : `Next Page` , callback_data : `/searchpg ${currentPage+1} ${q} --bscope`}) 
                    }else{
                        pages.push({text : `Page 2` , callback_data : `/searchpg 2 ${q} --bscope`}) 
                        pages.push({text : `Page 3` , callback_data : `/searchpg 3 ${q} --bscope`})
                        pages.push({text : `Last Page` , callback_data : `/searchpg ${totalPages} ${q} --bscope`})
                            
                        pages.push({text : `Next Page` , callback_data : `/searchpg ${currentPage+1} ${q} --bscope`}) 
                    }
              //buttons.push(pages)
            }
            buttons.push([{ text: `Zoom`, callback_data: `/search --zoom ${q}` },{ text: `English`, callback_data: `/search --eng ${q}` },{ text: `Cineru`, callback_data: `/search --cineru ${q}` }])
            if(messageId !== undefined || messageId !== null){
                await client.bot.deleteMessage(chatId, messageId)
            }
                // await client.sendMessage(chatId, `__Select a movie or episode from below :__ `)
                return await client.sendMessage(chatId, text, {
                    parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: buttons }
                });

            }else{
                client.sendMessage(chatId, `There is no results for this movie in baiscope.lk`);
            }
        }else if(q.includes('--zoom')){
            const messageId = msg?.message?.message_id
    
            q = q.replace('--zoom','').trim()
            const result = await zoom(`https://www.zoom.lk/?s=${encodeURIComponent(q)}`);
            const data = result?.data;
            currentPage = result.currentPage;
            totalPages = result.totalPages;
            if(data !== undefined && data.length !==0 ){
                let buttons = [];
                let text =  '__Select a movie or episode from below :__ \n\n\`\`\`Zoom.lk\`\`\`\n\n'
                for (let s = 1; s <= data.length; s += 3) {
                    let buttonsub = [];
                    for (let index = 0; index < 3; index++) {
                        const item = data[s + index - 1]; 
                        if (item !== undefined) {
                            const rand = generateRandomText(5)
                            searchData.push({ text : rand , link : item.link})
                            text += `\`${s + index}.\` **${item.title.replace('(සිංහල උපසිරැසි)','').replace('(Sinhala Subtitle)','').replace('සිංහල උපසිරැසි','').replace('Sinhala Subtitle','').trim()}**\n`;
                            buttonsub.push({ text: `${s + index}`, callback_data: `/sub ${rand}` });
                        }
                    }
                    buttons.push(buttonsub);
                }
                let pages =[]
                if(totalPages !== 1) {  
                if(totalPages <= 4){
                    for (let i = 2; i <= totalPages; i++) {
                    pages.push({text : `page ${i}` , callback_data : `/searchpg ${i} ${q} --zoom`}) 
                    }
                    pages.push({text : `Next Page` , callback_data : `/searchpg ${currentPage+1} ${q} --zoom`}) 
                }else{
                    pages.push({text : `Page 2` , callback_data : `/searchpg 2 ${q} --zoom`}) 
                    pages.push({text : `Page 3` , callback_data : `/searchpg 3 ${q} --zoom`})
                    pages.push({text : `Last Page` , callback_data : `/searchpg ${totalPages} ${q} --zoom`})
                        
                    pages.push({text : `Next Page` , callback_data : `/searchpg ${currentPage+1} ${q} --zoom`}) 
                }
              //buttons.push(pages)
            }
                buttons.push([{ text: `Baiscope`, callback_data: `/search --bscope ${q}` },{ text: `Cineru`, callback_data: `/search --cineru ${q}` },{ text: `English`, callback_data: `/search --eng ${q}` }])
                if(messageId !== undefined || messageId !== null){
                    await client.bot.deleteMessage(chatId, messageId)
                }
                 // await client.sendMessage(chatId, `__Select a movie or episode from below :__ `)
                return await client.sendMessage(chatId, text, {
                    parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: buttons }
                });

            }else{
                client.sendMessage(chatId, `There is no results for this movie in zoom.lk`);
            }
        }else if(q.includes('--cineru')){
            const messageId = msg?.message?.message_id
  
            q = q.replace('--cineru','').trim()
            const result = await cinerusearch(`https://cineru.lk/?s=${encodeURIComponent(q)}`);
            const data = result?.data;
            currentPage = result.currentPage;
            totalPages = result.totalPages;
            if(data !== undefined && data.length !==0 ){
                let buttons = [];
                let text =  '__Select a movie or episode from below :__ \n\n\`\`\`Cineru.lk\`\`\`\n\n'
                for (let s = 1; s <= data.length; s += 3) {
                    let buttonsub = [];
                    for (let index = 0; index < 3; index++) {
                        const item = data[s + index - 1]; 
                        if (item !== undefined) {
                            const rand = generateRandomText(5)
                            searchData.push({ text : rand , link : item.link})
                            text += `\`${s + index}.\` **${item.title.replace(' | සිංහල උපසිරැසි සමඟ','').replace(' Sinhala Subtitles','').trim()}**\n`;
                            buttonsub.push({ text: `${s + index}`, callback_data: `/sub ${rand}` });
                        }
                    }
                    buttons.push(buttonsub);
                }
                let pages =[]
                if(totalPages !== 1) {  
                if(totalPages <= 4){
                    for (let i = 2; i <= totalPages; i++) {
                    pages.push({text : `page ${i}` , callback_data : `/searchpg ${i} ${q} --cineru`}) 
                    }
                    pages.push({text : `Next Page` , callback_data : `/searchpg ${currentPage+1} ${q} --cineru`}) 
                }else{
                    pages.push({text : `Page 2` , callback_data : `/searchpg 2 ${q} --cineru`}) 
                    pages.push({text : `Page 3` , callback_data : `/searchpg 3 ${q} --cineru`})
                    pages.push({text : `Last Page` , callback_data : `/searchpg ${totalPages} ${q} --cineru`})
                        
                    pages.push({text : `Next Page` , callback_data : `/searchpg ${currentPage+1} ${q} --cineru`}) 
                }
              //buttons.push(pages)
            }
                buttons.push([{ text: `Baiscope`, callback_data: `/search --bscope ${q}` },{ text: `Zoom`, callback_data: `/search --zoom ${q}` },{ text: `English`, callback_data: `/search --eng ${q}` }])
                if(messageId !== undefined || messageId !== null){
                    await client.bot.deleteMessage(chatId, messageId)
                }
                // await client.sendMessage(chatId, `__Select a movie or episode from below :__ `)
                return await client.sendMessage(chatId, text, {
                    parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: buttons }
                });

            }else{
                client.sendMessage(chatId, `There is no results for this movie in cineru.lk`);
            }
        }else if(q.includes('--eng')){
            const messageId = msg?.message?.message_id
            if(messageId !== undefined || messageId !== null){
                client.bot.deleteMessage(chatId, messageId)
            }
            q = q.replace('--eng','').trim()
            client.sendMessage(chatId, `Currently not supported this`);
        }else{


            const result = await cinerusearch(`https://cineru.lk/?s=${encodeURIComponent(q)}`);
            const data = result?.data;
            currentPage = result.currentPage;
            totalPages = result.totalPages;
            if(data !== undefined && data.length !==0 ){
                let buttons = [];
                let text =  '__Select a movie or episode from below :__ \n\n\`\`\`Cineru.lk\`\`\`\n\n'
                for (let s = 1; s <= data.length; s += 3) {
                    let buttonsub = [];
                    for (let index = 0; index < 3; index++) {
                        const item = data[s + index - 1]; 
                        if (item !== undefined) {
                            const rand = generateRandomText(5)
                            searchData.push({ text : rand , link : item.link})
                            text += `\`${s + index}.\` **${item.title.replace(' | සිංහල උපසිරැසි සමඟ','').replace(' Sinhala Subtitles','').trim()}**\n`;
                            buttonsub.push({ text: `${s + index}`, callback_data: `/sub ${rand}` });
                        }
                    }
                    buttons.push(buttonsub);
                }
                let pages =[]
                if(totalPages !== 1) {  
                if(totalPages <= 4){
                    for (let i = 2; i <= totalPages; i++) {
                    pages.push({text : `page ${i}` , callback_data : `/searchpg ${i} ${q} --cineru`}) 
                    }
                    pages.push({text : `Next Page` , callback_data : `/searchpg ${currentPage+1} ${q} --cineru`}) 
                }else{
                    pages.push({text : `Page 2` , callback_data : `/searchpg 2 ${q} --cineru`}) 
                    pages.push({text : `Page 3` , callback_data : `/searchpg 3 ${q} --cineru`})
                    pages.push({text : `Last Page` , callback_data : `/searchpg ${totalPages} ${q} --cineru`})
                        
                    pages.push({text : `Next Page` , callback_data : `/searchpg ${currentPage+1} ${q} --cineru`}) 
                }
              //buttons.push(pages)
            }
                buttons.push([{ text: `Baiscope`, callback_data: `/search --bscope ${q}` },{ text: `Zoom`, callback_data: `/search --zoom ${q}` },{ text: `English`, callback_data: `/search --eng ${q}` }])
              //  await client.sendMessage(chatId, `__Select a movie or episode from below :__ `)
                return await client.sendMessage(chatId, text, {
                    parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: buttons }
                });

            }else{
                const result = await baiscope(`https://www.baiscope.lk/?s=${encodeURIComponent(q)}`);
                const data = result?.data;
                currentPage = result.currentPage;
                totalPages = result.totalPages;
                if(data !== undefined && data.length !==0 ){
                    let buttons = [];
                    let text =  '__Select a movie or episode from below :__ \n\n\`\`\`Baiscope.lk\`\`\`\n\n'
                    for (let s = 1; s <= data.length; s += 3) {
                        let buttonsub = [];
                        for (let index = 0; index < 3; index++) {
                            const item = data[s + index - 1]; 
                            if (item !== undefined) {
                                const rand = generateRandomText(5)
                                searchData.push({ text : rand , link : item.link})
                                text += `\`${s + index}.\` **${item.title.replace('[සිංහල උපසිරැසි සහිතව]','').replace('[BLURAY UPDATE]','').replace('[සිංහල උපසිරසි]','').replace('[සිංහල උපසිරසි සමඟ]','').trim()}**\n`;
                                buttonsub.push({ text: `${s + index}`, callback_data: `/sub ${rand}` });
                            }
                        }
                        buttons.push(buttonsub);
                    }
                    let pages =[]
                    if(totalPages !== 1) {  
                        if(totalPages <= 4){
                            for (let i = 2; i <= totalPages; i++) {
                            pages.push({text : `page ${i}` , callback_data : `/searchpg ${i} ${q} --bscope`}) 
                            }
                            pages.push({text : `Next Page` , callback_data : `/searchpg ${currentPage+1} ${q} --bscope`}) 
                        }else{
                            pages.push({text : `Page 2` , callback_data : `/searchpg 2 ${q} --bscope`}) 
                            pages.push({text : `Page 3` , callback_data : `/searchpg 3 ${q} --bscope`})
                            pages.push({text : `Last Page` , callback_data : `/searchpg ${totalPages} ${q} --bscope`})
                                
                            pages.push({text : `Next Page` , callback_data : `/searchpg ${currentPage+1} ${q} --bscope`}) 
                        }
                  //buttons.push(pages)
                }
                buttons.push([{ text: `Zoom`, callback_data: `/search --zoom ${q}` },{ text: `English`, callback_data: `/search --eng ${q}` },{ text: `Cineru`, callback_data: `/search --cineru ${q}` }])
                 
                  //  await client.sendMessage(chatId, `__Select a movie or episode from below :__ `)
                    return await client.sendMessage(chatId, text, {
                        parse_mode: 'Markdown',
                        reply_markup: { inline_keyboard: buttons }
                    });
    
                }else{
                    const result = await zoom(`https://www.zoom.lk/?s=${encodeURIComponent(q)}`);
                    const data = result?.data;
                    currentPage = result.currentPage;
                    totalPages = result.totalPages;
                    if(data !== undefined && data.length !==0 ){
                        let buttons = [];
                        let text =  '__Select a movie or episode from below :__ \n\n\`\`\`Zoom.lk\`\`\`\n\n'
                        for (let s = 1; s <= data.length; s += 3) {
                            let buttonsub = [];
                            for (let index = 0; index < 3; index++) {
                                const item = data[s + index - 1]; 
                                if (item !== undefined) {
                                    const rand = generateRandomText(5)
                                    searchData.push({ text : rand , link : item.link})
                                    text += `\`${s + index}.\` **${item.title.replace('(සිංහල උපසිරැසි)','').replace('(Sinhala Subtitle)','').replace('සිංහල උපසිරැසි','').replace('Sinhala Subtitle','').trim()}**\n`;
                                    buttonsub.push({ text: `${s + index}`, callback_data: `/sub ${rand}` });
                                }
                            }
                            buttons.push(buttonsub);
                        }
                        let pages =[]
                        if(totalPages !== 1) {  
                        if(totalPages <= 4){
                            for (let i = 2; i <= totalPages; i++) {
                            pages.push({text : `page ${i}` , callback_data : `/searchpg ${i} ${q} --zoom`}) 
                            }
                            pages.push({text : `Next Page` , callback_data : `/searchpg ${currentPage+1} ${q} --zoom`}) 
                        }else{
                            pages.push({text : `Page 2` , callback_data : `/searchpg 2 ${q} --zoom`}) 
                            pages.push({text : `Page 3` , callback_data : `/searchpg 3 ${q} --zoom`})
                            pages.push({text : `Last Page` , callback_data : `/searchpg ${totalPages} ${q} --zoom`})
                                
                            pages.push({text : `Next Page` , callback_data : `/searchpg ${currentPage+1} ${q} --zoom`}) 
                        }
                        //buttons.push(pages)
                    }
                        buttons.push([{ text: `Baiscope`, callback_data: `/search --bscope ${q}` },{ text: `Cineru`, callback_data: `/search --cineru ${q}` },{ text: `English`, callback_data: `/search --eng ${q}` }])
                      //  await client.sendMessage(chatId, `__Select a movie or episode from below :__ `)
                        return await client.sendMessage(chatId, text, {
                            parse_mode: 'Markdown',
                            reply_markup: { inline_keyboard: buttons }
                        });
        
                    }else{
                        return await client.sendMessage(chatId, `There is no results for this movie in any website that i can access.`);
                    
                    
                    }
                
                }


            }

        }
    }else{
        await client.sendMessage(chatId, `I need a movie title or query for search a movie.`);
    }
    },
    inline : async () =>{
        if(inq!==''){
const result = await cinerusearch(`https://cineru.lk/?s=${encodeURIComponent(inq)}`);
const data = result?.data;
if(data !== undefined && data.length !==0 ){
    let results = []
    let x = data.length > 10 ? 10 : data.length;
    for (let s = 0; s < x; s += 3) {


                const url = await getsublink(data[s].link)
        const item = {
            type: 'document',
                id: s,
                title: `${data[s].title.replace(' | සිංහල උපසිරැසි සමඟ','').replace(' Sinhala Subtitles','').trim()}`,
                document_url: url,
                mime_type: 'application/zip'
        }
        results.push(item);
    }

    await client.bot.answerInlineQuery(msg.id, results);

}else{
    const result = await baiscope(`https://www.baiscope.lk/?s=${encodeURIComponent(inq)}`);
    const data = result?.data;
    if(data !== undefined && data.length !==0 ){
        let results = []
        let x = data.length > 10 ? 10 : data.length;
        for (let s = 0; s < x; s += 3) {
    
    
                    const url = await getsublink(data[s].link)
            const item = {
                type: 'document',
                    id: s,
                    title: `${data[s].title.replace('(සිංහල උපසිරැසි)','').replace('(Sinhala Subtitle)','').replace('සිංහල උපසිරැසි','').replace('Sinhala Subtitle','').trim()}`,
                    document_url: url,
                    mime_type: 'application/zip'
            }
            
            results.push(item);
        }
    
        await client.bot.answerInlineQuery(msg.id, results);
    

    }else{
        const result = await zoom(`https://www.zoom.lk/?s=${encodeURIComponent(inq)}`);
        const data = result?.data;
        if(data !== undefined && data.length !==0 ){
            let results = []
            let x = data.length > 10 ? 10 : data.length;
            for (let s = 0; s < x; s += 3) {
        
                    const url = await getsublink(data[s].link)
                const item = {
                    type: 'document',
                        id: s,
                        title: `${data[s].title.replace('(සිංහල උපසිරැසි)','').replace('(Sinhala Subtitle)','').replace('සිංහල උපසිරැසි','').replace('Sinhala Subtitle','').trim()}`,
                        document_url: url,
                        mime_type: 'application/vnd.rar'
                }
                results.push(item);
            }
        
            await client.bot.answerInlineQuery(msg.id, results);
        

        }else{
            let re =[
                {
                    type: 'article',
                    id: '1',
                    title: 'No results for this query',
                }
            ]

            await client.bot.answerInlineQuery(msg.id, re);
        
        
        }
    
    }


}
        }
    },
    // searchpg:async () => {
    //     if(q.includes('--cineru')){
    //         const messageId = msg?.message?.message_id
    //          q = q.replace('--cineru','').trim()
    //          const qparts = q.split(" ");
    //         const pgno = qparts[0];
    //         const query =  qparts.slice(1).join(" ")
          
    //     }else if(q.includes('--bscope')){
    //         const messageId = msg?.message?.message_id
    //         q = q.replace('--bscope','').trim()
    //         const qparts = q.split(" ");
    //         const pgno = qparts[0];
    //         const query =  qparts.slice(1).join(" ")

    //     }else if(q.includes('--zoom')){
    //         const messageId = msg?.message?.message_id
    //         q = q.replace('--zoom','').trim()
    //         const qparts = q.split(" ");
    //         const pgno = qparts[0];
    //         const query =  qparts.slice(1).join(" ")
            
    //     }else if(q.includes('--eng')){
    //         const messageId = msg?.message?.message_id
    //         q = q.replace('--eng','').trim()
    //         const qparts = q.split(" ");
    //         const pgno = qparts[0];
    //         const query =  qparts.slice(1).join(" ")
            
    //     }
    // },
    // Add more commands as needed
});
