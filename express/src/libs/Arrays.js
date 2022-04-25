function flat(arr) {
  return arr.reduce((acc, val) => acc.concat(val), []);
}

module.exports.alwaysArray = function alwaysArray(something) {
  if (!something) {
    return [];
  }
  return flat([something]);
}
