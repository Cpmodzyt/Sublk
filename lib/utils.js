// utils.js
const axios = require('axios');
const cheerio = require('cheerio');
const AdmZip = require('adm-zip');


const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const findLinkByRandomText = (rand,searchData) =>{
    for (const item of searchData) {
        if (item.text === rand) {
            return item.link;  
        }
    }
    return null;  
}
const generateRandomText = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result+Date.now();
}

const  getDecodedName = (url) => {
    const pathname = new URL(url).pathname;
    const cleanPathname = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname; 
    const parts = cleanPathname.split('/'); 
    const lastPart = parts[parts.length - 1].replace(" ","-"); 
    return decodeURIComponent(lastPart);
}
const downloadAndSendSubtitles = async (client, url, chatId ,deleid) => {
    let response = ''
    try {
        response =  await axios.get(url, { responseType: 'arraybuffer' });

        // Check if it's a RAR file
        if (response.data.slice(0, 6).toString() === 'Rar!\x1A\x07\x00') {
            // It's a RAR file, extract it
            const rar = await unrar.createExtractorFromData(response.data);
            const files = await rar.getFileNames();
            let subtitles = [];

            for (const file of files) {
                if (file.endsWith('.srt') || entry.entryName.endsWith('.sub')) {
                    const data = await rar.extractFileToBuffer(file);
                    subtitles.push({ name: file, data: data, contentType: 'application/x-subrip' });
                }
            }
            if(deleid !== undefined || deleid !== null){
                await client.bot.deleteMessage(chatId, deleid)
            }
            if (subtitles.length > 0) {


                for (const subtitle of subtitles) {
                    await client.bot.sendDocument(chatId, subtitle.data, {}, { filename: subtitle.name, contentType: subtitle.contentType });
                }
            } else {
                await client.sendMessage(chatId, 'Subtitle files not found in the RAR archive.');
            }
        } else {
            // It's a ZIP file
            const zip = new AdmZip(response.data);
            const zipEntries = zip.getEntries();
            let subtitles = [];

            for (const entry of zipEntries) {
                if (entry.entryName.endsWith('.srt') || entry.entryName.endsWith('.sub')) {
                    subtitles.push({ name: entry.entryName, data: entry.getData(), contentType: 'application/x-subrip' });
                }
            }
            if(deleid !== undefined || deleid !== null){
                await client.bot.deleteMessage(chatId, deleid)
            }
            if (subtitles.length > 0) {
                for (const subtitle of subtitles) {
                    await client.bot.sendDocument(chatId, subtitle.data, {}, { filename: subtitle.name, contentType: subtitle.contentType });
                }
            } else {
                await client.sendMessage(chatId, 'Subtitle files not found in the ZIP archive.');
            }
        }
    } catch (e) {
        try {
            const response = await axios.get(url, { responseType: 'arraybuffer' });

            // const mimeType = fileType(response.data);
            if(deleid !== undefined || deleid !== null){
                await client.bot.deleteMessage(chatId, deleid)
            }
            const fname = getDecodedName(url)
            await client.bot.sendDocument(chatId, response.data, {}, { filename: `${fname}.rar`, contentType: 'application/vnd.rar' });
       
        } catch (error) {
            if(deleid !== undefined || deleid !== null){
                await client.bot.deleteMessage(chatId, deleid)
            }
        console.error('Error:', error.message);
        await client.sendMessage(chatId, 'An error occurred while processing your request.');
        }
    }
};



const getsublink = async (url) => {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        
        let zipLink = null;
        
        if(url.includes('baiscope.lk/')){
            zipLink =  $('a[href*="Downloads"]').attr('href');
        }else if(url.includes('cineru.lk/')){
            zipLink = $('a#btn-download').attr('data-link');
        }else if(url.includes('zoom.lk/')){
            zipLink = $('a.aligncenter.download-button').attr('href');
        }
        
       else{
            zipLink = null;
        }
        
        
        return zipLink;
    } catch (error) {
        return null;
    }
}

const getPageCount = async(url) => {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const pageCountText = $('.pagination .pages').text(); 
        const pageCountMatch = pageCountText.match(/Page (\d+) of (\d+)/); 
        if (pageCountMatch) {
            const [ currentPage, totalPages] = pageCountMatch.map(Number);
            return { totalPages ,currentPage };
        } else {
            return { totalPages : 1 ,currentPage:1 };
        }
    } catch (error) {
        console.log('Error fetching page count:'+`${error}`);
        return null;
    }
}

const zoom = async(url) => {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const data =[]
      const result = {}     
      const pageCountText = $('.pages').text(); 
      const pageCountMatch = pageCountText.match(/Page (\d+) of (\d+)/); 
      if (pageCountMatch) {
        const match = pageCountMatch.map(Number)
        result.totalPages = match[2];
        result.currentPage =match[1];
      } else {
          result.totalPages = 1;
          result.currentPage = 1;
      }
      $('.td_module_16').each((index, element) => {
        const title = $(element).find('.entry-title a').text().trim();
        const link = $(element).find('.entry-title a').attr('href');
        const imageUrl = $(element).find('img.entry-thumb').attr('data-img-url');
        const thumbnail = imageUrl.replace(/-\d+x\d+\.jpg$/, '.jpg');
        data.push({
          title,
          link,
          thumbnail
      })
  
      });
      result.data = data
      return result;
    } catch (error) {
      console.error('Error:', error);
      return {}
   }
}

const cinerusearch = async (url) => {
    
let scrapedData = [];
        try {
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);
           
            const result = {}
            const pageCountText = $('.pagination .pages').text(); 
            const pageCountMatch = pageCountText.match(/Page (\d+) of (\d+)/); 
            if (pageCountMatch) {
                const match = pageCountMatch.map(Number)
                result.totalPages = match[2];
                result.currentPage =match[1];
            } else {
                result.totalPages = 1;
                result.currentPage = 1;
            }
            $('article.item-list').each(async (index, element) => {
                const title = $(element).find('h2.post-box-title a').text().trim();
                const link = $(element).find('h2.post-box-title a').attr('href');
                const categories = $(element).find('span.post-cats a').map((_, ele) => $(ele).text()).get();
                let itemType = '';
                if (categories.includes('TV Series')) {
                    itemType = 'TV Series';
                    const item = { title,link, itemType };
                    scrapedData.push(item);
                } else if (categories.includes('චිත්‍රපට') || categories.includes('Films')) {
                    itemType = 'Movie';
                    const item = { title,link, itemType };
                    scrapedData.push(item);
                }
               
            });
            result.data = scrapedData
            sleep(1000)
            return result;
    
        } catch (error) {
    
            console.log('Error scraping item data:'+ `${error}`);
            return {};
        }
}

const baiscope = async (url) => {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const data =[]
      const result = {}
      const currentPage = parseInt($('.page-numbers.current').text());
      const totalPages = parseInt($('.page-numbers:not(.dots):not(.next)').last().text());
      result.currentPage = currentPage;
      result.totalPages = totalPages;
      $('.archive-layout-grid').each((index, element) => {
        const title = $(element).find('.entry-title a').text().trim();
        const link = $(element).find('.featured-image a').attr('href');
        const thumbnail = $(element).find('.featured-image a img').attr('src');
  
        data.push({
          title,
          link,
          thumbnail
      })
  
      });
      result.data = data
      return result;
    } catch (error) {
      console.error('Error:', error);
      return {}
   }
}

const isValidUrl = (url) => {
    const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // Protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // Domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR IP address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // Port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // Query string
        '(\\#[-a-z\\d_]*)?$','i'); // Fragment locator
    return urlPattern.test(url);
}

module.exports = { isValidUrl, sleep ,findLinkByRandomText,generateRandomText,downloadAndSendSubtitles,getsublink ,getPageCount,zoom,cinerusearch,baiscope}