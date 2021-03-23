// import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe'
import { differenceInHours } from 'date-fns'
import AppError from '@shared/errors/AppError'
import IUsersRepository from '../repositories/IUsersRepository'
import IUserTokensRepository from '../repositories/IUserTokensRepository'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'

interface IRequestDTO {
  password: string
  token: string
}
@injectable()
export default class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UserTokensRepository')
    private userTokensRepositoroy: IUserTokensRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({ password, token }: IRequestDTO): Promise<void> {
    const userToken = await this.userTokensRepositoroy.findByToken(token)
    if (!userToken) {
      throw new AppError('User tokens does not exists')
    }
    const user = await this.usersRepository.findById(userToken.user_id)
    if (!user) {
      throw new AppError('User does not exists')
    }

    const tokenCreatedAt = userToken.created_at
    const passwordUpdateAt = new Date(Date.now())

    if (differenceInHours(passwordUpdateAt, tokenCreatedAt) > 2) {
      throw new AppError('Token expired')
    }
    user.password = await this.hashProvider.generateHash(password)

    await this.usersRepository.save(user)
  }
}
