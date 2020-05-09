const IMAGE = "https://dev.tube/open_graph.jpg";
const TITLE = "The best developer videos from YouTube";
const DESCR = "🍿 Enjoy the best developer videos and tutorials from YouTube";

import emojiStrip from "emoji-strip";

export const ogImage = (twt, name = "", desc = "") => {
  const avatarUrl = Buffer.from(
    `https://twitter-avatar.now.sh/${twt}`
  ).toString("base64");
  const bio = encodeURIComponent(encodeURIComponent(emojiStrip(desc)));
  return `https://res.cloudinary.com/eduardsi/image/upload/l_fetch:${avatarUrl},w_256,h_256,g_north_west,x_100,y_100,r_max,bo_2px_solid_white/e_colorize,co_white,l_text:Lato_50:${emojiStrip(
    name
  )},g_north_west,x_420,y_170/e_colorize,co_rgb:2790eb,l_text:Lato_25:@${twt},g_north_west,x_420,y_230/c_fit,w_500,e_colorize,co_white,l_text:Lato_25:${bio},g_north_west,x_420,y_280/open_graph_tnxtgt_3_ewisxm.png`;
};

export const meta = (params = {}) => [
  ...images(params.image || IMAGE),
  ...titles(params.title || TITLE),
  ...descriptions(params.descr || DESCR),
  { p: "twitter:card", c: "summary_large_image", id: "twitter:card" },
  { p: "twitter:site", c: "@WatchDevTube", id: "twitter:site" },
  { p: "twitter:creator", c: "@WatchDevTube", id: "twitter:creator" }
];

const images = img => {
  return [
    { id: "og:image", p: "og:image", c: img },
    { id: "twitter:image", p: "twitter:image", c: img }
  ];
};

const descriptions = desc => {
  return [
    { id: "description", n: "description", c: desc },
    { id: "twitter:description", n: "twitter:description", c: desc },
    { id: "og:description", p: "og:description", c: desc }
  ];
};
const titles = title => {
  return [
    {
      id: "twitter:title",
      n: "twitter:title",
      c: `${title} - on DevTube`
    },
    {
      id: "og:title",
      p: "og:title",
      c: `${title} - on DevTube`
    }
  ];
};
