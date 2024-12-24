import _dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
import utc from 'dayjs/plugin/utc'

_dayjs.extend(customParseFormat)
_dayjs.extend(utc)
_dayjs.extend(duration)

export const dayjs = _dayjs
