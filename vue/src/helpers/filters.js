import { dayjs } from "./datetime";

export const durationFull = it => {
  if (!it) {
    return it;
  }

  const videoDuration = dayjs.duration(it);
  const hours = videoDuration.hours();
  const minutes = videoDuration.minutes();
  return hours ? `${hours} hour(s)` : `${minutes} minutes`;
};

export const published = it => (it ? dayjs(it).format("MMM YYYY") : it);
export const year = it => (it ? dayjs(it).format("YYYY") : it);

export const ago = it => {
  return dayjs(it).fromNow();
};
