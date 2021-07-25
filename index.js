const cheerio = require('cheerio');
const axios  = require('axios');
const xl = require('excel4node');
const wb  = new xl.Workbook()
const ws = wb .addWorksheet('Sheet 1');
const url = "https://store.steampowered.com/tags/ru/%D0%9C%D0%9C%D0%9E/"
const gameArr = []


const parse = async () => {
    const getHTML = async (url) => {
        const { data } = await axios.get(url)
        return cheerio.load(data)
    }
    const $ = await getHTML(url);
    // const getPageCount = $("#NewReleases_links").children().last().text()
    const getPageCount = 4
    for (let page = 0; page <= getPageCount; page++) {
        const selector = await getHTML(url);
        ws.cell(1,1).string("name game")
        ws.cell(1,2).string("cost game")
        selector("a.tab_item").each((page, element) => {
            const title = selector(element).find("div.tab_item_name").text()
            const cost = selector(element).find("div.discount_final_price").text()
            gameArr.push( {
                title: title,
                cost: cost
            });
        })
    }
    for(let i = 2; i <= gameArr.length; i++) {
        if(gameArr[i]) {
            ws.cell(i, 1).string(`${gameArr[i].title ? gameArr[i].title : '-'}`)
            ws.cell( i, 2).string(`${gameArr[i].cost ? gameArr[i].cost :  "-"}`)
        }
    }
}

parse().then(() => {
    wb .write('Excel.xlsx');
});