import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'

import FakeUserTokensRepository from '../repositories/fakes/FakeUsersTokensRepository'
import ResetPasswordService from './ResetPasswordService'

let fakeUsersRepository: FakeUsersRepository
let fakeUserTokensRepository: FakeUserTokensRepository
let resetPassword: ResetPasswordService
let fakeHashProvider: FakeHashProvider
describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeUserTokensRepository = new FakeUserTokensRepository()
    fakeHashProvider = new FakeHashProvider()
    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider
    )
  })
  it('should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123'
    })
    const { token } = await fakeUserTokensRepository.generate(user.id)

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')

    await resetPassword.execute({
      password: '123321',
      token
    })
    const updateUser = await fakeUsersRepository.findById(user.id)

    expect(generateHash).toHaveBeenCalledWith('123321')
    expect(updateUser?.password).toBe('123321')
  })
  it('should not be able to reset the password with non-existing token', async () => {
    expect(
      resetPassword.execute({
        token: 'non-existing-token',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
  it('should not be able to reset the password with non-existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'non-existiting-user'
    )
    expect(
      resetPassword.execute({
        token,
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
  it('should be able to reset password if passed more than 2 hours', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123'
    })
    const { token } = await fakeUserTokensRepository.generate(user.id)
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date()
      return customDate.setHours(customDate.getHours() + 4)
    })

    await expect(
      resetPassword.execute({
        password: '123321',
        token
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
