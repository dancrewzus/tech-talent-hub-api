import { Injectable } from '@nestjs/common'
import OpenAI from 'openai'

import { CreateAssistant, InsertMessage } from '../interfaces/chat.interface';
import { Utils, HandleErrors } from '../utils/utils';
import { DayJSAdapter } from './dayjs.adapter';
import { app } from '../constants';

@Injectable()
export class OpenAiAdapter {

  constructor(
    private readonly errors: HandleErrors,
    private readonly dayjs: DayJSAdapter,
    private readonly utils: Utils,
  ) {}

  private openai: OpenAI = null

  /**
   * Retrieves an instance of OpenAI. If not already instantiated, it creates a new instance.
   * @returns The OpenAI instance.
   */
  public getEntity = (): OpenAI => {
    try {
      if (!this.openai) {
        this.openai = new OpenAI();
        console.info('OpenAI instance created');
      }
      return this.openai;
    } catch (error) {
      this.errors.handleError(`Failed to get OpenAI entity: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /*********************** **
   * ASSISTANTS MANAGEMENT **
   *********************** **/

  /**
   * Creates a new assistant in OpenAI with the specified data.
   * @param openai The OpenAI instance.
   * @param data The data for creating the assistant, including name, description, and other properties.
   * @returns The created assistant.
   */
  public createAssistant = async (openai: OpenAI, data: CreateAssistant) => {
    try {
      const assistant = await openai.beta.assistants.create({ ...data })
      console.info("Created assistant: ", assistant)
      return assistant
    } catch (error) {
      this.errors.handleError(`Failed to create OpenAI assistant: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Retrieves an assistant by name.
   * @param openai The OpenAI instance.
   * @param assistantName The name of the assistant to retrieve.
   * @returns The assistant matching the name, if found.
   */
  public getAssistantByName = async (openai: OpenAI, assistantName: string) => {
    try {
      const allAssistants = await openai.beta.assistants.list()
      if(!allAssistants?.data.length) {
        this.errors.handleError('No assistants found')
      }
      const assistant = allAssistants.data.find((assistant) => assistant.name === assistantName)
      if(!assistant) {
        this.errors.handleError(`Could not find assistant named ${assistantName}`)
      }
      return assistant
    } catch (error) {
      this.errors.handleError(`Failed to get OpenAI assistant: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
 
  /**
   * Retrieves an assistant by name.
   * @param openai The OpenAI instance.
   * @param assistantName The name of the assistant to retrieve.
   * @returns True if found, false if not.
   */
  public checkAssistantByName = async (openai: OpenAI, assistantName: string): Promise<boolean> => {
    try {
      const allAssistants = await openai.beta.assistants.list()
      if(!allAssistants?.data.length) {
        console.error('No assistants found')
        return false
      }
      const assistant = allAssistants.data.find((assistant) => assistant.name === assistantName)
      if(!assistant) {
        console.error(`Could not find assistant named ${assistantName}`)
        return false
      }
      console.info(`Found assistant named ${assistantName}`)
      return true
    } catch (error) {
      console.error(`Failed to get OpenAI assistant: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false
    }
  }
  
  /**
   * Retrieves all assistants.
   * @param openai The OpenAI instance.
   * @returns An array of all assistants.
   */
  public getAllAssistants = async (openai: OpenAI) => {
    try {
      const allAssistants = await openai.beta.assistants.list()
      if(!allAssistants?.data.length) {
        this.errors.handleError('No assistants found')
      }
      return allAssistants?.data || []
    } catch (error) {
      this.errors.handleError(`Failed to get all OpenAI assistants: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Deletes an assistant by ID.
   * @param openai The OpenAI instance.
   * @param assistantId The ID of the assistant to delete.
   */
  public deleteAssistantById = async (openai: OpenAI, assistantId: string) => {
    try {
      await openai.beta.assistants.del(assistantId)
      return 
    } catch (error) {
      this.errors.handleError(`Failed to delete OpenAI assistant: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /******************* **
   * THREAD MANAGEMENT **
   ******************* **/

  /**
   * Creates a new thread.
   * @param openai The OpenAI instance.
   * @returns The created thread.
   */
  public createThread = async (openai: OpenAI) => {
    try {
      const thread = await openai.beta.threads.create()
      console.info("Created thread: ", thread)
      return thread
    } catch (error) {
      this.errors.handleError(`Failed to create OpenAI thread: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Validates whether a thread exists by its ID.
   * @param openai The OpenAI instance.
   * @param threadId The ID of the thread to validate.
   * @returns True if the thread exists, false otherwise.
   */
  public validateThreadExistence = async (openai: OpenAI, threadId: string) => {
    try {
      const exist = await openai.beta.threads.retrieve(threadId)
      return !!exist.id
    } catch (error) {
      console.error(`Error validating thread existence in OpenAI: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return false
    }
  }

  /**
   * Inserts a message into a thread.
   * @param openai The OpenAI instance.
   * @param threadId The ID of the thread where the message will be inserted.
   * @param data The message data, including role and content.
   */
  public insertMessageInThread = async (openai: OpenAI, threadId: string, data: InsertMessage) => {
    try {
      await openai.beta.threads.messages.create(threadId, { role: 'user', ...data })
      return
    } catch (error) {
      this.errors.handleError(`Failed to insert message in thread: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Retrieves all messages in a thread.
   * @param openai The OpenAI instance.
   * @param threadId The ID of the thread from which messages will be retrieved.
   * @returns An array of messages in the specified thread.
   */
  public getMessagesInThread = async (openai: OpenAI, threadId: string) => {
    try {
      const messages = await openai.beta.threads.messages.list(threadId);
      return messages?.data || []
    } catch (error) {
      this.errors.handleError(`Failed to get messages in thread: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Retrieves all execution runs in a thread.
   * @param openai The OpenAI instance.
   * @param threadId The ID of the thread from which executions will be retrieved.
   * @returns An object containing the execution runs.
   */
  public getThreadRunExecutions = async (openai: OpenAI, threadId: string) => {
    try {
      const runs = await openai.beta.threads.runs.list(threadId)
      return runs
    } catch (error) {
      this.errors.handleError(`Failed to get thread executions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Cancels an execution run in a thread.
   * @param openai The OpenAI instance.
   * @param threadId The ID of the thread containing the run to cancel.
   * @param runId The ID of the run to cancel.
   */
  public cancelThreadRunExecution = async (openai: OpenAI, threadId: string, runId: string) => {
    try {
      await openai.beta.threads.runs.cancel(threadId, runId)
      return 
    } catch (error) {
      this.errors.handleError(`Failed to cancel thread execution: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Deletes a thread by its ID.
   * @param openai The OpenAI instance.
   * @param threadId The ID of the thread to delete.
   */
  public deleteThreadById = async (openai: OpenAI, threadId: string) => {
    try {
      await openai.beta.threads.del(threadId)
      return 
    } catch (error) {
      this.errors.handleError(`Failed to delete OpenAI thread: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /********************* **
   * ASSISTANT EXECUTION **
   ********************* **/

  private getAllDepartments = () => { // TEMPORAL function
    return [
      {
        "Link Visita": "https://century21colombia.com/propiedad/8295065",
        "Código Finca Raiz": "8295065",
        "Código Inmobiliaria": "122367",
        "Barrio / Vereda": "Belalcazar",
        "Descripción": "Hemosa casa en Portales de Comfandi, consta de tres niveles, primer piso local ideal para miscelánea o minimarket, apartamento de 2 habitaciones con closets, sala comedor, cocina, zona de oficios, 1 baño, segundo piso consta de dos habitaciones con closets, sala comedor, cocina, 1 baño, zona de oficios, tercer piso, consta de sala comedor, cocina, dos habitaciones con closets, 1 baño, zona de oficios y terraza balcón, la casa se encuentra en una zona muy cerca al Centro Comercial Único, y transporte público, no te pierdas esta oportunidad y agenda tu cita ya!",
        "Tipo de inmueble": "Casa",
        "Tipo de Oferta": "Venta",
        "Precio": "$ 390,000,000.00"
      },
      {
        "Link Visita": "https://century21colombia.com/propiedad/7955180",
        "Código Finca Raiz": "7955180",
        "Código Inmobiliaria": "117501",
        "Barrio / Vereda": "Rincon dapa",
        "Descripción": "En venta casa campestre  en condominio exclusivo de Dapa, construida sobre un lote de 5.312 M2 con 626 M2 construidos divididos de la siguiente manera. La casa ppal 370 M2, 186 M2 de terrazas y 70 M2 la casa del mayordomo. Tiene una construccion estilo mediterraneo.La casa ppal cuenta con 4 habitaciones, salones, salacomedor, cocina, 3 baños,  baño social y   zona de ropas.Posee una excelente vista y el lote esta cultivado con jardines de diferentes esepcies incluyendo arboles frutales y otros arboles ornamentales.",
        "Tipo de inmueble": "Casa",
        "Tipo de Oferta": "Venta",
        "Precio": "$ 2,400,000,000.00"
      },
      {
        "Link Visita": "https://century21colombia.com/propiedad/6201484",
        "Código Finca Raiz": "6201484",
        "Código Inmobiliaria": "104561",
        "Barrio / Vereda": "Porerito",
        "Descripción": "Excelente ubicación Lote de 8000mt2 en el Condominio Colinas de Miravalle I a 5 minutos de la 14 de Alfaguara. Tiene construido muro de contención en piedra, cerramiento perimetral en malla de alambre y concreto.  Tres áreas planas o terrazas ideales para construir su hogar sin perder la majestuosa vista a los farallones. Condominio cuenta con cancha múltiple, juegos para niños, salón social con cocineta y una hermosa capilla.",
        "Tipo de inmueble": "Lote",
        "Tipo de Oferta": "Venta",
        "Precio": "$ 560,000,000.00"
      },
      {
        "Link Visita": "https://century21colombia.com/propiedad/8022100",
        "Código Finca Raiz": "8022100",
        "Código Inmobiliaria": "119682",
        "Barrio / Vereda": "El gran limonar",
        "Descripción": "Apartamento ubicado en el sur de Cali, cerca a vías principales y cerca a diferentes comercios importantes de la ciudad. En un sector muy tranquilo y seguro de la ciudad; Este apartamento está ubicado en un primer piso y cuenta con una terraza ideal para pasar las tardes veteadas de la ciudad, ya que no le da sol de la tarde, la unidad cuenta con piscina, portería 24 horas, amplios espacios, jardines, y, dos porterías.",
        "Tipo de inmueble": "Apartamento",
        "Tipo de Oferta": "Venta",
        "Precio": "$ 343,000,000.00"
      },
      {
        "Link Visita": "https://century21colombia.com/propiedad/8197989",
        "Código Finca Raiz": "8197989",
        "Código Inmobiliaria": "123447",
        "Barrio / Vereda": "Flora Industrial",
        "Descripción": "Alquiler de edificio de 4 pisos,  dotado para sede Educativa,  cuenta con uso de Suelo,  nuevo,  se entrega semi amoblado,  dotado con cámaras de vigilancia en cada piso,  sistema contra incendio,  Luces Led,  puntos de conexión para computadores,  distribuido de la siguiente manera: 1er piso: gran recepción,  4 salones (enfermeria,  rectoria,  sala de profesores,  sala de reuniones),  salon de contabilidad,  oficina para pagos,  ventanilla con vidrio de seguridad y caja ,  cafeteria con cocineta,  deposito,  4 baños (2 hombre y 2 mujeres),  dos entradas (1 para estudiantes y otra para administración). 2do piso: 7 salones (4 salones de clases,  1 salon de profesores,  1 salon de reuniones,  biblioteca),  1 oficina,   baños para mujeres y hombres,  1 deposito. 3er piso: 6 salones (dos de informatica con puntos para 25 computadores),  3 salones de clases,  un salon de reuniones,  oficina) baños para hombre y mujeres,  deposito. 4to piso: 3 salones,  1 oficina,  habitación de simulación hospitalización,  gran sa",
        "Tipo de inmueble": "Edificio",
        "Tipo de Oferta": "Arriendo",
        "Precio": "$ 25,000,000.00"
      },
      {
        "Link Visita": "https://century21colombia.com/propiedad/7947659",
        "Código Finca Raiz": "7947659",
        "Código Inmobiliaria": "118647",
        "Barrio / Vereda": "San fernando viejo",
        "Descripción": "Descubre el lugar perfecto para vivir en San Fernando. Este hermoso apartaestudio tipo Loft te ofrece una distribución excepcional en dos espacios encantadores. En el primer piso, disfruta de una cocina completamente equipada, un baño para visitas, una acogedora sala y un amplio balcón que ofrece una vista impresionante del encantador barrio de San Fernando.Sube al segundo piso y encontrarás una espaciosa habitación principal con su propio baño privado y otro balcón para que disfrutes de momentos de relajación. El apartamento se encuentra en un cuarto piso sin ascensor, pero el edificio cuenta con un ascensor de carga para mercados y otras comodidades para hacer tu vida más fácil.Disfruta de la tranquilidad de tener todos los servicios incluidos en el alquiler, excepto el gas natural. Además, si deseas hacer uso del aire acondicionado, hay un costo adicional. No tendrás que preocuparte por el estacionamiento, ya que el apartaestudio cuenta con un parqueadero para carro.El edificio, moderno y atractivo, ofrece un ambiente cómodo y está estratégicamente ubicado en San Fernando, brindándote fácil acceso a todo lo que necesitas. Disfruta de la comodidad de tener controles de acceso para residentes y varias funciones remotas que facilitarán tus visitas.¡No dejes pasar esta oportunidad! Vive la experiencia única de habitar este espectacular apartaestudio tipo Loft en San Fernando. Contáctanos ahora para más información y agenda una visita.",
        "Tipo de inmueble": "Apartamento",
        "Tipo de Oferta": "Arriendo",
        "Precio": "$ 2,300,000.00"
      },
      {
        "Link Visita": "https://century21colombia.com/propiedad/8101982",
        "Código Finca Raiz": "8101982",
        "Código Inmobiliaria": "121762",
        "Barrio / Vereda": "Santa teresita",
        "Descripción": "Descubre una oportunidad excepcional para tu negocio en el corazón del Peñón. Te presentamos este impresionante Roof Top en una ubicación estratégica, en una zona de gran desarrollo comercial en la ciudad.El edificio Living in Peñon es un referente de rentas cortas con 20 apartasuites, que ha decidido potenciar el comercio en Cali al ofrecer el arriendo de su espectacular terraza para restaurantes, bares o discotecas.Acceder a esta maravillosa terraza es un deleite en sí mismo, gracias al ascensor panorámico que te lleva a este espacio único en ambos sentidos. La terraza cuenta con todos los servicios públicos, contadores independientes y se entrega con techo, listo para que lo adaptes según las necesidades de tu negocio.Con unas generosas dimensiones de 7,40 metros x 21,80 metros, tendrás un total de 161 metros cuadrados de espacio libre para materializar tus ideas y cautivar a tus clientes.No dejes pasar esta oportunidad de oro. Sé parte del auge comercial en Cali y lleva tu negocio a nuevas alturas. ¡Contáctanos hoy mismo para conocer más detalles y reservar tu lugar en esta espectacular terraza!",
        "Tipo de inmueble": "Local",
        "Tipo de Oferta": "Arriendo",
        "Precio": "$ 12,000,000.00"
      },
      {
        "Link Visita": "https://century21colombia.com/propiedad/8178305",
        "Código Finca Raiz": "8178305",
        "Código Inmobiliaria": "123111",
        "Barrio / Vereda": "Las Mercedes",
        "Descripción": "Se alquila hermosa casa campestre en el condominio Las Mercedes en Jamundí, distribuida en una sola planta con terraza en el segundo nivel, cuenta con 4 amplias habitaciones, la principal con vestier, baño y jacuzzi, sala comedor de espacios abiertos y amplios, cocina abierta, zona de oficios completamente separada de la cocina y cuarto de servicio con baño. La casa esta rodeada de zonas verdes propias, cuenta con árboles grandes y jardines. El condominio esta muy cerca al centro comercial Alfaguara, donde se puede encontrar comercio variado, estaciones de servicio, gimnasio, etc. El conjunto cuenta con piscina semi-olimpica, lagos con flora y fauna nativa, ciclo ruta, canchas de: tenis, futbol, básquet y vóley-playa. Sector muy tranquilo rodeado de zonas verdes y seguridad privada 24 horas.",
        "Tipo de inmueble": "Casa",
        "Tipo de Oferta": "Arriendo",
        "Precio": "$ 5,500,000.00"
    },
    ]
  }

  private assistantToolCall = async (openai: OpenAI, threadId: string, runId: string, toolCalls: any[]) => {
    
    let messages = []
    const toolOutputs: any[] = []

    console.info(`[${ this.dayjs.getCurrentDateTime() }] - Assistant has used a tool ${threadId}`)

    for (let index = 0; index < toolCalls.length; index++) {

      const toolCall = toolCalls[index];
      const toolCallFunctionName = toolCall?.function?.name
      let response
      
      switch (toolCallFunctionName) {
        case 'getAllDepartments':
          response = await this.getAllDepartments()
          break;
      
        default: 
          response = ''; 
          break;
      }

      toolOutputs.push({
        tool_call_id: toolCall?.id,
        output: JSON.stringify(response)
      })
    }

    const run = await openai.beta.threads.runs.submitToolOutputs(
      threadId,
      runId,
      { tool_outputs: toolOutputs }
    )

    let newToolCalls = []
    let complete = false
    let requiresAction = false
    
    while(!complete) {
      await this.utils.timer(app.execution.COMPLETION_CHECK_TIME)
      const response = await openai.beta.threads.runs.retrieve(
        threadId,
        run.id
      )
      if(response?.status === 'completed') {
        complete = true
      }

      if(response?.status === 'requires_action' && response?.required_action?.type === 'submit_tool_outputs') {
        complete = true
        requiresAction = true
        newToolCalls = response?.required_action?.submit_tool_outputs?.tool_calls || []
      }
    }

    if(
      complete && 
      requiresAction && 
      newToolCalls.length
    ) {
      return this.assistantToolCall(openai, threadId, runId, newToolCalls);
    }

    if(complete && !requiresAction) {
      messages = await this.getMessagesInThread(openai, threadId);
    }
    
    return messages
  }

  /**
   * Executes an assistant by its ID within a thread, optionally following given instructions.
   * @param openai The OpenAI instance.
   * @param assistantId The ID of the assistant to run.
   * @param threadId The ID of the thread where the assistant will be run.
   * @param instructions Optional instructions for the assistant execution.
   * @returns An array of messages resulting from the execution.
   */
  public runAssistantById = async (openai: OpenAI, assistantId: string, threadId: string, instructions: string = '') => {
    let messages = []
    let toolCalls = []
    let failed = false
    let complete = false
    let requiresAction = false

    try {
      const threadExecution = await openai.beta.threads.runs.create(
        threadId,
        {
          assistant_id: assistantId,
          instructions
        }
      )

      console.info(`[${ this.dayjs.getCurrentDateTime() }] - Created run execution for thread ${threadId}`)

      // Every 1.5 second check for completion of the execution
      while(!complete) {
        await this.utils.timer(app.execution.COMPLETION_CHECK_TIME)
        const threadRunsRetrieve = await openai.beta.threads.runs.retrieve(
          threadId,
          threadExecution.id
        )
        
        console.info(`[${ this.dayjs.getCurrentDateTime() }] - Thread run execution status ${threadRunsRetrieve?.status}`)
        
        if(threadRunsRetrieve?.status === app.execution.status.FAILED) {
          console.log(threadRunsRetrieve)
          failed = true
          complete = true
        }
        
        if(!complete && threadRunsRetrieve?.status === app.execution.status.COMPLETED) {
          complete = true
        }
  
        if(!complete && threadRunsRetrieve?.status === app.execution.status.REQUIRES_ACTION && 
          threadRunsRetrieve?.required_action?.type === app.execution.status.SUBMIT_TOOL_OUTPUTS
        ) {
          complete = true
          requiresAction = true
          toolCalls = threadRunsRetrieve?.required_action?.submit_tool_outputs?.tool_calls || []
        }
      }

      if(
        complete && 
        requiresAction && 
        toolCalls.length
      ) {
        console.info(`[${ this.dayjs.getCurrentDateTime() }] - Assistant required for tool ${threadId}`)
        return this.assistantToolCall(openai, threadId, threadExecution.id, toolCalls);
      }

      if(complete && !requiresAction && !failed) {
        console.info(`[${ this.dayjs.getCurrentDateTime() }] - Obtaining messages in thread ${threadId}`)
        messages = await this.getMessagesInThread(openai, threadId);
      }
      
      if(complete && failed) {
        console.info(`[${ this.dayjs.getCurrentDateTime() }] - Fail ${threadId}`)
        // TODO enviar mensaje de que está ocupado y encolar en un job
      }

      return messages
    } catch (error) {
      this.errors.handleError(`Failed to run OpenAI assistant: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}