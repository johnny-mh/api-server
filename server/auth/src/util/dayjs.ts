import _dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import duration from 'dayjs/plugin/duration.js'
import utc from 'dayjs/plugin/utc.js'

_dayjs.extend(customParseFormat)
_dayjs.extend(utc)
_dayjs.extend(duration)

export const dayjs = _dayjs
