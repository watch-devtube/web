import * as querystring from 'querystring'
import * as emojiStrip from 'emoji-strip'

export class OgImage {

    url: string

    constructor(twitterHandle: String, name: String = "", desc: string = "") {
        let avatarUrl = Buffer.from(`http://avatars.io/twitter/${twitterHandle}`).toString('base64')
        let bio = querystring.escape(querystring.escape(emojiStrip(desc)))
        this.url = `https://res.cloudinary.com/eduardsi/image/upload/l_fetch:${avatarUrl},w_256,h_256,g_north_west,x_100,y_100,r_max,bo_2px_solid_white/e_colorize,co_white,l_text:Lato_50:${emojiStrip(name)},g_north_west,x_420,y_170/e_colorize,co_rgb:2790eb,l_text:Lato_25:@${twitterHandle},g_north_west,x_420,y_230/c_fit,w_500,e_colorize,co_white,l_text:Lato_25:${bio},g_north_west,x_420,y_280/open_graph_tnxtgt_2_mqvkpm.png`
    }

}