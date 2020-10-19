
const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

declare global {
  interface Array<T> {
    shuffle(): Array<T>;
    dedup<E>(callback: (t: T) => E): Array<T>;
    flatMap<E>(callback: (t: T) => Array<E>): Array<E>
  }
}

if (!Array.prototype.shuffle) {
  Array.prototype.shuffle = function <T>(): T[] {
    return shuffle(this)
  }
}

if (!Array.prototype.dedup) {
  Array.prototype.dedup = function <T>(f: Function): T[] {
    return this.filter((that, pos, arr) => {
      return arr.map(it => f(it)).indexOf(f(that)) === pos;
    })
  }
}



if (!Array.prototype.flatMap) {
  Array.prototype.flatMap = function (f: Function) {
    return this.reduce((ys: any, x: any) => {
      return ys.concat(f.call(this, x))
    }, [])
  }
}

export { }