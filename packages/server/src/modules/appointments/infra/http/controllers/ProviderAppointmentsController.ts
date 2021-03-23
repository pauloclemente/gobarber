import { Request, Response } from 'express'
import { container } from 'tsyringe'
import ListAppoinmentsService from '@modules/appointments/services/ListAppointmentsService'
import { classToClass } from 'class-transformer'

export default class ProviderAppointmentsController {
  /**
   * index
   */
  public async index(request: Request, response: Response): Promise<Response> {
    const provider_id = request.user.id
    const { day, month, year } = request.query

    const listProviderAppointments = container.resolve(ListAppoinmentsService)

    const appointments = await listProviderAppointments.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year)
    })
    return response.json(classToClass(appointments))
  }
}
