/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common'


@Injectable()
export class WhatsAppAdapter {

  private getMainFlow = (/* realStateId: string */) => {
    // return addKeyword(EVENTS.WELCOME)
    //   .addAction(async (ctx, { flowDynamic }) => {
    //     console.log("🚀 ~ WhatsAppAdapter ~ .addAction ~ ctx:", ctx)
    //     const sanitizedMessage = ctx.body.trim().replaceAll('\n', '')
    //     console.log('Mensaje recibido es: ', sanitizedMessage)
    //     // const response = await this.openaiService.chatbotCall({
    //     //   message: sanitizedMessage,
    //     //   clientNumber: ctx.from
    //     // })
    //     await flowDynamic(`Recibido desde: ${ realStateId }`)
    //   })
  }

  public initInstance = (/* realStateId: string */) => {
    try {
      // const adapterFlow = createFlow([ this.getMainFlow(realStateId) ])
      // const adapterProvider = createProvider(WhatsAppProvider)
      // const adapterDB = new DatabaseAdapter()
      // const bot = createBot({
      //   flow: adapterFlow,
      //   provider: adapterProvider,
      //   database: adapterDB,
      // })
      // console.log(bot)
      // QRPortalWeb()
      // return bot
    } catch (error) {
      // TODO Track with Datadog
      throw Error(error.message)
    }
  }

  public getAssistant = async () => {
    try {
    } catch (error) {
      // TODO Track with Datadog
      throw Error(error.message)
    }
  }
}