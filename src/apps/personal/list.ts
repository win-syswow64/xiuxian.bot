import { APlugin, type AEvent } from 'alemonjs'
import {
  getListComponent,
  getKillComponent,
  isThereAUserPresent,
  Server
} from '../../api/index.js'
export class List extends APlugin {
  constructor() {
    super({
      rule: [{ reg: /^(#|\/)?杀神榜$/, fnc: 'killGodChart' }]
    })
  }

  /**
   * 杀神榜
   * @param e
   * @returns
   */
  async killGodChart(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const img = await getKillComponent(await Server.getKillList(), UID)
    if (typeof img != 'boolean') e.reply(img)
  }
}
