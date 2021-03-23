import AppError from '@shared/errors/AppError'

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeUserTokensRepository from '../repositories/fakes/FakeUsersTokensRepository'
import ForgotPasswordService from './ForgotPasswordService'

let fakeUsersRepository: FakeUsersRepository
let fakeUserTokensRepository: FakeUserTokensRepository
let fakeMailProvider: FakeMailProvider
let forgotPassword: ForgotPasswordService
describe('ForgotPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeMailProvider = new FakeMailProvider()
    fakeUserTokensRepository = new FakeUserTokensRepository()

    forgotPassword = new ForgotPasswordService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository
    )
  })
  it('should be able to recovery the password using email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail')

    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123'
    })

    await forgotPassword.execute({
      email: 'johndoe@example.com'
    })
    expect(sendMail).toHaveBeenCalled()
  })
  it('should not be able to recover a non-existing user password', async () => {
    await expect(
      forgotPassword.execute({
        email: 'johndoe@example.com'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
  it('should be able to recovery the password using email', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate')

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123'
    })
    await forgotPassword.execute({
      email: 'johndoe@example.com'
    })
    expect(generateToken).toHaveBeenCalledWith(user.id)
  })
})
