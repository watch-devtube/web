export class OgImage {

    url: string

    constructor(twitterHandle: String) {
        let avatarUrl = Buffer.from(`http://avatars.io/twitter/${twitterHandle}`).toString('base64')
        this.url = `https://res.cloudinary.com/eduardsi/image/upload/l_fetch:${avatarUrl},w_180,h_180,g_south_west,x_650,y_270,r_max,bo_2px_solid_white/e_colorize,co_white,l_text:Lato_35:@${twitterHandle.toUpperCase()},g_south_west,x_220,y_307/dazzle_xcifcf.png`
    }

}