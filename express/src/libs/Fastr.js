const fs = require("fs");
const path = require("path");

const { alwaysArray } = require("./Arrays");
const { orderBy, isEmpty } = require("lodash");
const { decode, encode } = require("@msgpack/msgpack");

const indices = new Map()
indices.set('satisfaction', '_videoIdsBySatisfaction')
indices.set('recordingDate', '_videoIdsByNew')


class FastIndex {

  constructor() {
    this._videos = {}
    this._videoIdsByNew = [];
    this._videoIdsBySatisfaction = []
  }

  videos(order) {
    const index = indices.get(order);
    if (!index) {
      throw new Error(`No index for order: ${order}`)
    }
    return this[index].map(objectID => this._videos[objectID]);
  }

  pushAll(videos) {
    videos.forEach(video => {
      this._videos[video.objectID] = this.toIndexedVideo(video);
    });

    orderBy(videos, ["satisfaction"], ['desc'])
      .forEach(({ objectID }) => this._videoIdsBySatisfaction.push(objectID))

    orderBy(videos, ["recordingDate"], ['desc'])
      .forEach(({ objectID }) => this._videoIdsByNew.push(objectID))

  }

  toIndexedVideo({ objectID, title, channelTitle, recordingDate, satisfaction, speaker }) {
    const speakerTwt = alwaysArray(speaker).map(speaker => speaker.twitter);
    const speakerNames = alwaysArray(speaker).map(speaker => speaker.name);
    const indexedVideo = {
      objectID,
      title,
      channelTitle,
      recordingDate,
      satisfaction,
      speakerNames,
      speakerTwt
    }
    return indexedVideo;
  };

}

class IndexFile {
  constructor(indexFile) {
    this.indexFile = indexFile;
  }

  read() {
    const cwd = process.cwd();
    const dataDir = path.resolve(cwd, "data")
    const dataHome = path.resolve(dataDir);
    return fs.readFileSync(path.join(path.resolve(dataHome), this.indexFile))
  }
}

module.exports.Fastr = class Fastr {
  constructor(options) {
    const { indexFile, documents } = options;
    if (!indexFile && !documents) {
      throw { message: "Neither 'indexFile' nor 'documents' parameter are specified!" };
    }

    if (indexFile) {
      console.time(`Loading Loki and Lunr data from ${indexFile}`);
      this.index = this.loadIndex(new IndexFile(indexFile).read());
      console.timeEnd(`Loading Loki and Lunr data from ${indexFile}`);
    } else {
      this.index = this.buildIndex(documents);
    }
  }

  buildIndex(docs) {
    console.time("Populate Loki database");

    const index = new FastIndex();
    index.pushAll(docs);

    console.timeEnd("Populate Loki database");
    return index;
  }

  loadIndex(serializedIndex) {
    console.time(`Loading Loki data from Buffer`);

    const { _videos, _videoIdsByNew, _videoIdsBySatisfaction } = decode(serializedIndex);
    const index = new FastIndex();
    index._videos = _videos;
    index._videoIdsByNew = _videoIdsByNew;
    index._videoIdsBySatisfaction = _videoIdsBySatisfaction;

    console.timeEnd(`Loading Loki data from Buffer`);
    return index;
  }

  serialize() {
    return encode(this.index)
  }

  serializeToFile() {
    const index = this.serialize();
    const absDir = path.resolve("data");
    if (!fs.existsSync(absDir)) {
      fs.mkdirSync(absDir);
    }
    fs.writeFileSync(path.join(absDir, indexFile), index);
  }

  search(criteria, order = "satisfaction") {
    const videos = this.index.videos(order);
    const matchingVideos = videos.filter(video => criteria.isSatisfiedBy(video))
    return matchingVideos.map(({ objectID }) => objectID);
  }

}

module.exports.Criteria = class Criteria {
  // private _query?: string;
  // private _speakers?: string[];
  // private _channels?: string[];
  // private _ids?: string[];
  // private _noIds?: string[];

  constructor() {

  }

  limitIds(ids) {
    this._ids = ids;
    return this;
  }

  limitSpeakers(speakers) {
    this._speakers = speakers;
    return this;
  }

  limitChannels(channels) {
    this._channels = channels;
    return this;
  }

  limitFts(query) {
    this._query = query.trim().toLowerCase();
    return this;
  }

  excludeIds(ids) {
    this._noIds = ids;
    return this;
  }

  isSatisfiedBy(video) {
    const isExcluded = !isEmpty(this._noIds) && this._noIds.includes(video.objectID);
    if (isExcluded) {
      return false;
    }

    if (!isEmpty(this._query)) {
      return video.title.toLowerCase().includes(this._query) ||
        video.channelTitle.toLowerCase().includes(this._query) ||
        video.speakerNames.some(name => name.toLowerCase().includes(this._query))
    }

    const noChannel = isEmpty(this._channels);
    const noSpeakers = isEmpty(this._speakers);
    const noIds = isEmpty(this._ids);

    if (noChannel && noSpeakers && noIds) {
      return true;
    }

    const channelMatch = !noChannel && this._channels.some(it => video.channelTitle === it)
    const speakerMatch = !noSpeakers && this._speakers.some(it => video.speakerTwt.includes(it))
    const exactIdMatch = !noIds && this._ids.some(it => video.objectID === it)
    return channelMatch || speakerMatch || exactIdMatch;
  }
}