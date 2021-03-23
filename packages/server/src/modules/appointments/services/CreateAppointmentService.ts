import { startOfHour, isBefore, getHours, format } from 'date-fns'
import { injectable, inject } from 'tsyringe'
import AppError from '@shared/errors/AppError'
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'
import Appointment from '../infra/typeorm/entities/Appointment'
import IAppointmentsRepository from '../repositories/IAppointmentsRepository'

interface IRequestDTO {
  provider_id: string
  user_id: string
  date: Date
}
@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
    @inject('NotificationsRepository')
    private notificationRepository: INotificationsRepository,
    @inject('CacheProvider')
    private cacheRepository: ICacheProvider
  ) {}

  public async execute({
    provider_id,
    user_id,
    date
  }: IRequestDTO): Promise<Appointment> {
    const appointmentDate = startOfHour(date)
    const cacheKey = `provider-appointments:${provider_id}:${format(
      appointmentDate,
      'yyyy-M-d'
    )}`

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't create an appointment on past date")
    }
    if (user_id === provider_id) {
      throw new AppError("You can't create an appointment for yourself")
    }
    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError('You can only create appointment between 8am and 5pm')
    }
    const findInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
      provider_id
    )

    if (findInSameDate) {
      throw new AppError('This Appointment is already booked')
    }

    const appointment = this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate
    })
    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'")
    await this.notificationRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para dia ${dateFormatted} `
    })

    await this.cacheRepository.invalidade(cacheKey)

    return appointment
  }
}

export default CreateAppointmentService
