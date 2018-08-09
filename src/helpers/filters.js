import dayjs from 'dayjs'

const sameFlatten = arr =>
  arr.reduce((acc, item) =>
    [...acc, (Array.isArray(item) ? sameFlatten(item) : item)]
  , [])

export const flatten = it => !it ? it : sameFlatten(it)

const makeKilo = it => it < 100000
  ? Math.round(it / 1000) + '.' + (it % 1000).toString().padStart(3, "0").charAt(0)
  : Math.round(it / 1000)

export const views = it => it && it >= 1000
  ? `${makeKilo(it)}K`
  : it

export const duration = it => {
  if (!it) {
    return it
  }

  const date = new Date(it * 1000)
  const hours = date.getUTCHours()
  const minutes = date.getUTCMinutes()
  return (hours ? `${hours} h `: '') + (minutes ? `${minutes} min` : '')
}

export const capitalizeIfNeeded = (it) => { 
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
  ]
  
  let noCapitalizeTag = tags.find(tag => new RegExp(`^${tag}$`, "i").test(it))
  return noCapitalizeTag || capitalize(it)
}

const capitalize = (str) => str.replace(/\b\w/g, l => l.toUpperCase())

export const truncate = (it, max) => it
  ? it.slice(0, max) + (max < it.length ? '...' : '')
  : it

export const published = it => it
  ? dayjs(it * 1000).format('YYYY MMM')
  : it
