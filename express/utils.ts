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
    flatMap<E>(callback: (t: T) => Array<E>): Array<E>

  }
}

if (!Array.prototype.shuffle) {
  Array.prototype.shuffle = function<T>(): T[] {
    return shuffle(this)
  }
}


if (!Array.prototype.flatMap) {
  Array.prototype.flatMap = function(f: Function) {
    return this.reduce((ys: any, x: any) => {
        return ys.concat(f.call(this, x))
    }, [])
  }
}

export {}