'use strict'

const jsdom = require("jsdom")
const Requests = require ('./requests.js')

module.exports = class AnimeSaturnScrapeAPI extends Requests {
    constructor() {
        super()
        this.requests = new Requests()
        this.method = 'POST'
        this.hostUrl = 'https://www.animesaturn.tv/'
        this.headers = {
            'Accept': 'text/html, */*; q=0.01',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7',
            'Cookie': 'addtl_consent=1~39.4.3.9.6.9.13.6.4.15.9.5.2.11.1.7.1.3.2.10.3.5.4.21.4.6.9.7.10.2.9.2.18.7.20.5.20.6.5.1.4.11.29.4.14.4.5.3.10.6.2.9.6.6.9.4.4.29.4.5.3.1.6.2.2.17.1.17.10.9.1.8.6.2.8.3.4.146.8.42.15.1.14.3.1.18.25.3.7.25.5.18.9.7.41.2.4.18.21.3.4.2.7.6.5.2.14.18.7.3.2.2.8.20.8.8.6.3.10.4.20.2.13.4.6.4.11.1.3.22.16.2.6.8.2.4.11.6.5.33.11.8.1.10.28.12.1.3.21.2.7.6.1.9.30.17.4.9.15.8.7.3.6.6.7.2.4.1.7.12.13.22.13.2.12.2.10.1.4.15.2.4.9.4.5.4.7.13.5.15.4.13.4.14.10.15.2.5.6.2.2.1.2.14.7.4.8.2.9.10.18.12.13.2.18.1.1.3.1.1.9.25.4.1.19.8.4.5.3.5.4.8.4.2.2.2.14.2.13.4.2.6.9.6.3.2.2.3.5.2.3.6.10.11.6.3.16.3.11.3.1.2.3.9.19.11.15.3.10.7.6.4.3.4.6.3.3.3.3.1.1.1.6.11.3.1.1.11.6.1.10.5.2.6.3.2.2.4.3.2.2.7.15.7.14.1.3.3.4.5.4.3.2.2.5.4.1.1.2.9.1.6.9.1.5.2.1.7.10.11.1.3.1.1.2.1.3.2.6.1.12.5.3.1.3.1.1.2.2.7.7.1.4.1.2.6.1.2.1.1.3.1.1.4.1.1.2.1.8.1.7.4.3.2.1.3.5.3.9.6.1.15.10.28.1.2.2.12.3.4.1.6.3.4.7.1.3.1.1.3.1.5.3.1.3.4.1.1.4.2.1.2.1.2.2.2.4.2.1.2.2.2.4.1.1.1.2.2.1.1.1.1.2.1.1.1.2.2.1.1.2.1.2.1.7.1.2.1.1.1.2.1.1.1.1.2.1.1.3.2.1.1.8.1.1.6.2.1.6.2.3.2.1.1.1.2.2.3.1.1.4.1.1.2.2.1.1.4.3.1.2.2.1.2.1.2.3.1.1.2.4.1.1.1.5.1.3.6.3.1.5.2.3.4.1.2.3.1.4.2.1.2.2.2.1.1.1.1.1.1.11.1.3.1.1.2.2.5.2.3.3.5.1.1.1.4.2.1.1.2.5.1.9.4.1.1.3.1.7.1.4.5.1.7.2.1.1.1.2.1.1.1.4.2.1.12.1.1.3.1.2.2.3.1.2.1.1.1.2.1.1.2.1.1.1.1.2.4.1.5.1.2.4.3.8.2.2.9.7.2.2.1.2.1.4.6.1.1.6.1.1.2.6.3.1.2.201.300.100; euconsent-v2=CPrwW0APrwW0AAKAvBITDECsAP_AAH_AABCYJatV_H__bW9r8f5_aft0eY1P9_r77uQzDhfNk-4F3L_W_LwX52E7NF36tq4KmR4Eu3LBIUNlHNHUTVmwaokVryHsak2cpTNKJ6BEkHMRO2dYGF5umxtjeQKY5_p_d3fx2D-t_dv-39z3z81Xn3dZ_-_0-PCdU5_9Dfn9fRfb-9IL9_78v8v8_9_rk2_eX_3_79_77H9-f_8gloASYatxAF2ZQ4M2gYRQIgRhWEhFAoAIKAYWiAgAcHBTsrAJ9YRIAUAoAjAiBDgCjIgEAAAkASEQASBFggAABEAgABAAgEQgAYGAQUAFgIBAACAaBiiFAAIEhAkRERCmBAVAkEBLZUIJQXSGmEAVZYAUAiNgoAEQSAisAAQFg4BgiQErFggSYg2iAAYAUAolQrUUnpoCFgEAAAAA.YAAAAAAAAAAA; _ga_M9CR9PT6RL=GS1.1.1687022348.59.0.1687022348.0.0.0; _gid=GA1.2.1872798698.1691095266; dom3ic8zudi28v8lr6fgphwffqoz0j6c=e2afbf39-a60f-403e-8121-63e3173bb395%3A1%3A1; PHPSESSID=d9oquutiuuq520cu8jmq5g2hj5; _ga_5C04KRD2FY=GS1.1.1691769917.117.1.1691769921.0.0.0; ppu_main_e52f3361c86004938f4e51edb9aeeaaf=1; _ga=GA1.2.1598628650.1681214066; _gat_gtag_UA_93961448_5=1; _ga_CDVV3EQZH5=GS1.1.1691797811.296.0.1691797825.0.0.0',
            'Referer': 'https://www.animesaturn.tv/',
            'Sec-Ch-Ua': '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest'
        }
    }

    async getDocument() {
        var respData = await this.requests.makeRequest("GET", this.hostUrl, {}, {})
        const parsedDocument = new jsdom.JSDOM(respData)
        return parsedDocument
    }
}