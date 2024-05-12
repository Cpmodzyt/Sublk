// const axios = require('axios');
// const cheerio = require('cheerio');

// const opensub = async (url) =>{
//     try {
//         const response = await axios.get(url);
//         const html = response.data;
//         const result ={}
//         const $ = cheerio.load(html);
//         const data = []
//         $('ul.list-subtitles.boxes li.box').each((index, element) => {
//             // Extract data from the box
//             const title = $(element).find('h2.box-home-headline a').text().trim();
//             const imageUrl = $(element).find('img.box-home-img').attr('src');
//             const link = 'https://www.opensubtitles.com' +$(element).find('a.box-cover').attr('href');

//             data.push({title,imageUrl,link})
            
//         });
//         result.data = data;
//         return result;
//     } catch (error) {
//         console.error('Error fetching or processing data:', error);
//         reply(`${error}`)
//         return null;
//     }
// }

// const url = 'https://www.opensubtitles.com/en/en/search-all/q-avatar/hearing_impaired-include/machine_translated-/trusted_sources-';
// const result = await opensub(url);
// json(result)


// const subfilelink = async (url)=> {
//     try {
//         const response = await axios.get(url);
//         const html = response.data;
//         const $ = cheerio.load(html);
//         const firstTrOdd = $('#ajax_subtitles_datatable_531592 > tbody > tr:nth-child(1) > td:nth-child(9) > span.non_vip_area > a')

//         // Find the td within the tr and extract the href from the first a tag
//         const href = firstTrOdd.attr('href');
//         return href;
//     } catch (error) {
//         console.error('Error fetching or processing data:', error);
//         reply(`${error}`)
//         return null;
//     }
// }

// const url2 = 'https://www.opensubtitles.com/en/movies/2009-avatar';
// const data = await subfilelink(url2);
// json(data)
