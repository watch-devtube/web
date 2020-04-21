import dayjs from "dayjs";
import numeral from "numeral";

const sameFlatten = arr =>
  arr.reduce(
    (acc, item) => [...acc, Array.isArray(item) ? sameFlatten(item) : item],
    []
  );

export const flatten = it => (!it ? it : sameFlatten(it));

export const kilo = it => numeral(it).format("0a");

export const duration = it => {
  if (!it) {
    return it;
  }

  const date = new Date(it * 1000);
  const hours = Math.floor(it / 3600);
  const minutes = date.getUTCMinutes();
  return (hours ? `${hours}h ` : "") + (minutes ? `${minutes}m` : "");
};

export const dateFmt = it => {
  if (!it) {
    return it;
  }
  return dayjs(it * 1000).format("HH:mm");
};

export const durationFull = it => {
  if (!it) {
    return it;
  }

  const date = new Date(it * 1000);
  const hours = Math.floor(it / 3600);
  const minutes = date.getUTCMinutes();
  return hours ? `${hours} hours` : `${minutes} minutes`;
};

export const noemoji = it => {
  if (!it) {
    return it;
  }
  return it.replace(
    /([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
    ""
  );
};

export const capitalizeIfNeeded = it => {
  let tags = [
    "iOS",
    "IoT",
    "DI",
    "TDD",
    "GraphQL",
    "BDD",
    "PHP",
    ".NET",
    "DevOps",
    "ML",
    "HTML5",
    "API",
    "AWS",
    "RxJava",
    "CSS",
    "REST"
  ];

  const noCapitalizeTag = tags.find(tag =>
    new RegExp(`^${tag}$`, "i").test(it)
  );
  return noCapitalizeTag || capitalize(it);
};

const capitalize = str =>
  str ? str.replace(/\b\w/g, l => l.toUpperCase()) : str;

export const truncate = (it, max) =>
  it ? it.slice(0, max) + (max < it.length ? "..." : "") : it;

export const published = it => (it ? dayjs(it * 1000).format("YYYY MMM") : it);
