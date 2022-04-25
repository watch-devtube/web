const { Datastore } = require("@google-cloud/datastore");

const datastore = new Datastore();
const flat = arr => arr.reduce((acc, val) => acc.concat(val), []);


module.exports.Videos = class Videos {
  constructor(ids) {
    this.ids = ids || [];
    this.videoKeys = this.ids.map(id => datastore.key(["video", id]));
  }

  fetch() {
    if (!this.videoKeys.length) {
      return Promise.resolve([]);
    }

    const alwaysArrayOfSpeakers = video =>
      Object.assign(video, { speaker: flat([video.speaker]).filter(Boolean) });
    return datastore
      .get(this.videoKeys)
      .then(([videos]) => videos)
      .then(videos => videos.map(alwaysArrayOfSpeakers))
      .then(videos =>
        videos.sort(
          (a, b) => this.ids.indexOf(a.objectID) - this.ids.indexOf(b.objectID)
        )
      );
  }


}
