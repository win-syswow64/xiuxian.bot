import koaRouter from 'koa-router'
import { ERROE_CODE, OK_CODE } from '../../config/ajax'
import { goods } from 'xiuxian-db'
const router = new koaRouter({ prefix: '/api/v1/goods' })

// 物品查询接口
router.get('/search', async ctx => {
  const query = ctx.request.query as {
    names: string
    typing: string
    page: string
    pageSize: string
  }
  const obj = {}
  if (typeof query.names == 'string') {
    try {
      obj['name'] = JSON.parse(query.names)
    } catch {
      ctx.body = {
        code: ERROE_CODE,
        msg: '非法请求',
        data: null
      }
      return
    }
  }
  if (typeof query.typing == 'string') {
    try {
      obj['type'] = Number(query.typing)
    } catch {
      ctx.body = {
        code: ERROE_CODE,
        msg: '非法请求',
        data: null
      }
      return
    }
  }
  const error = () => {
    ctx.body = {
      code: ERROE_CODE,
      msg: '数据错误',
      data: null
    }
  }
  if (typeof query.page == 'string' && typeof query.pageSize == 'string') {
    // 添加分页参数
    const page = parseInt(query.page) || 1 // 当前页数，默认为1
    const pageSize = parseInt(query.pageSize) || 10 // 每页数据数量，默认为10
    const offset = (page - 1) * pageSize // 计算偏移量
    await goods
      .findAndCountAll({
        where: obj,
        limit: pageSize,
        offset: offset
      })
      .then(res => {
        const totalCount = res.count // 总数据量
        const totalPages = Math.ceil(totalCount / pageSize) // 总页数
        ctx.body = {
          code: OK_CODE,
          msg: '请求完成',
          data: {
            items: res.rows, // 当前页的数据
            page: page,
            pageSize: pageSize,
            totalCount: totalCount,
            totalPages: totalPages
          }
        }
      })
      .catch(error)
    return
  } else {
    await goods
      .findAndCountAll({
        where: obj
      })
      .then(res => {
        const totalCount = res.count
        ctx.body = {
          code: OK_CODE,
          msg: '请求完成',
          data: {
            items: res.rows,
            totalCount: totalCount
          }
        }
      })
      .catch(error)
    return
  }
})

export default router
