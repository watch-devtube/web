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

export const truncate = (it, max) => it
  ? it.slice(0, max) + (max < it.length ? '...' : '')
  : it

export const published = it => it
  ? dayjs(it * 1000).format('YYYY MMM')
  : it
