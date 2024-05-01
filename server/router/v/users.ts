import koaRouter from 'koa-router'
import { ERROE_CODE, OK_CODE } from '../../config/ajax.js'
import { UserType, user } from '../../../src/db/models.js'
const router = new koaRouter({ prefix: '/api/v1/users' })

/**
 * 重置密码
 * x-wwww-from-urlencoded
 */
router.put('/password', async ctx => {
  ctx.body = {
    code: OK_CODE,
    msg: '待生产'
  }
})

router.get('/message', async ctx => {
  const UID = ctx.state.user.uid
  await user
    .findOne({
      where: {
        uid: UID
      },
      raw: true
    })
    .then((res: any) => res)
    .then((res: UserType) => {
      if (res) {
        ctx.body = {
          code: OK_CODE,
          msg: '查询成功',
          data: res
        }
        return
      }
      ctx.body = {
        code: ERROE_CODE,
        msg: '查询错误',
        data: null
      }
    })
    .catch(err => {
      console.log(err)
      ctx.body = {
        code: ERROE_CODE,
        msg: '服务器错误',
        data: null
      }
    })
})

export default router