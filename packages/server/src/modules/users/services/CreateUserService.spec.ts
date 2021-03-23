import AppError from '@shared/errors/AppError'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProviders'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import CreateUserService from './CreateUserService'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let fakeCacheProvider: FakeCacheProvider

let createUser: CreateUserService
describe('CreateUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()
    fakeCacheProvider = new FakeCacheProvider()

    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider
    )
  })
  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'amsdi2'
    })
    expect(user).toHaveProperty('id')
  })
  it('should not be able to create a new user with same email from', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'amsdi2'
    })
    await expect(
      createUser.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'amsdi2'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
