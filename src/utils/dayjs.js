import dayjs from 'dayjs'
import 'dayjs/locale/id'

dayjs.locale('id')

export default {
  install(app) {
    app.config.globalProperties.$dayjs = dayjs
    app.provide('dayjs', dayjs)
  },
}
