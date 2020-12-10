const request = require("request-promise")
const cheerio = require("cheerio")
const fs = require("fs")
const json2csv = require("json2csv").Parser;

        const products = ["https://www.healthmug.com/product/haslab-baby-tone-up-syrup-100ml/1774809053",
                            "https://www.healthmug.com/product/sbl-arsenic-album-30-ch-30ml/1934955399",
                            "https://www.healthmug.com/product/sbl-alfalfa-tonic-paediatric-180ml/1333334883",
                             "https://www.healthmug.com/product/dr-reckeweg-r89-lipocol-30ml/228458883"];

(async() => {
        let productData = [];

        for(let product of products){
                    const response = await request({
            uri: product,
            headers: {
                accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "en-GB,en-US;q=0.9,en;q=0.8"
            },
            gzip: true,
        });

        let $ = cheerio.load(response);
        let name = $('div[class="prodcutDetailTitle"]>h1>span').text().trim();
        let about = $('div[class="productDetailFull"]').text();
        let price  = $('div[class="productDetailPrice"]>span[class="productBoxSellingPrice"]').text().trim()
	    let brand_name = $('div[class="prodcutDetailTitle"]>h2').text().trim();
	    let company_name = $('div[class="productBrandImg"]>img').attr("alt").trim();
	    let drug_image = $('#m_0 img').attr('src');
	    let brand_image = $('.productBrandImg img').attr('src');
	    let pack_size = $('div[class="propertyRow"]>.propertyValue').text();
	    let variant_unit = $('div[class="customeSelectBox"] option').text();

        productData.push({
            name, 
            about, 
            price, 
            brand_name, 
            company_name, 
            drug_image, 
            brand_image, 
            pack_size, 
            variant_unit,
        });
        


        const j2cp = new json2csv()
        const csv = j2cp.parse(productData)

        fs.writeFileSync("./products.csv", csv, "utf-8");
}
}
)();