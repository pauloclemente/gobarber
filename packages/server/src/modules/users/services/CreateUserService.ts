import AppError from '@shared/errors/AppError'
import { injectable, inject } from 'tsyringe'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'
import User from '../infra/typeorm/entities/User'
import IUsersRepository from '../repositories/IUsersRepository'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'

interface IRequestDTO {
  name: string
  email: string
  password: string
}
@injectable()
export default class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({ name, password, email }: IRequestDTO): Promise<User> {
    const checkUserExists = await this.usersRepository.findByEmail(email)

    if (checkUserExists) {
      throw new AppError('Email adress already used!')
    }
    const hashPassword = await this.hashProvider.generateHash(password)

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashPassword
    })

    await this.cacheProvider.invalidadePrefix('providers-list')

    return user
  }
}
