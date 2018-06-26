import dayjs from 'dayjs'

const sameFlatten = arr =>
  arr.reduce((acc, item) =>
    [...acc, (Array.isArray(item) ? sameFlatten(item) : item)]
  , [])

export const flatten = it => !it ? it : sameFlatten(it)

const makeKilo = it => it < 100000
  ? Math.round(it / 1000) + '.' + (it % 1000).toString().charAt(0)
  : Math.round(it / 1000)

export const views = it => it && it >= 1000
  ? `${makeKilo(it)}K`
  : it

export const duration = it =>
  it ? dayjs(it * 1000).format('h [h] m min') : it

export const truncate = (it, max) => it
  ? it.slice(0, max) + (max < it.length ? '...' : '')
  : it

export const published = it => it
  ? dayjs(it * 1000).format('YYYY MMM')
  : it
