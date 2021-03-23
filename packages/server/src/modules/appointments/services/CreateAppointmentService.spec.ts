import AppError from '@shared/errors/AppError'
import FakeNotificationsRepository from '@modules/notifications/services/fakes/FakeNotificationsRepository'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProviders'
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository'
import CreateAppointmentService from './CreateAppointmentService'

let fakeAppointmentRepository: FakeAppointmentRepository
let createAppointment: CreateAppointmentService
let fakeNotificationsRepository: FakeNotificationsRepository
let fakeCacheProvider: FakeCacheProvider

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository()
    fakeNotificationsRepository = new FakeNotificationsRepository()
    fakeCacheProvider = new FakeCacheProvider()
    createAppointment = new CreateAppointmentService(
      fakeAppointmentRepository,
      fakeNotificationsRepository,
      fakeCacheProvider
    )
  })

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })
    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      provider_id: 'provider_id',
      user_id: 'user_id'
    })
    expect(appointment).toHaveProperty('id')
    expect(appointment.provider_id).toBe('provider_id')
  })
  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2020, 10, 10, 11)
    await createAppointment.execute({
      date: appointmentDate,
      provider_id: 'provider_id',
      user_id: 'user_id'
    })
    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: 'provider_id',
        user_id: 'user_id'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
  it('should not be able to create an appointments on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })
    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        user_id: 'user_id',
        provider_id: 'provider_id'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 10, 10, 12).getTime()
    })

    await expect(
      createAppointment.execute({
        date: new Date(2020, 10, 10, 13),
        user_id: 'user_id',
        provider_id: 'user_id'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
  it('should not be able to create an appointment before 8am or after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 10, 10, 12).getTime()
    })

    await expect(
      createAppointment.execute({
        date: new Date(2020, 10, 11, 7),
        user_id: 'user_id',
        provider_id: 'user_id'
      })
    ).rejects.toBeInstanceOf(AppError)
    await expect(
      createAppointment.execute({
        date: new Date(2020, 10, 11, 18),
        user_id: 'user_id',
        provider_id: 'user_id'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
