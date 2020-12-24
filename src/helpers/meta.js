const IMAGE = "https://dev.tube/open_graph.jpg";
const TITLE = "The best developer videos from YouTube";
const DESCR = "🍿 Enjoy the best developer videos and tutorials from YouTube";

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
