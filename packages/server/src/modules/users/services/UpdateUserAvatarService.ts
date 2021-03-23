import AppError from '@shared/errors/AppError'
import 'reflect-metadata'
import { inject, injectable } from 'tsyringe'
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider'
import User from '../infra/typeorm/entities/User'
import IUsersRepository from '../repositories/IUsersRepository'

interface IRequestDTO {
  user_id: string
  avatar_filename: string
}
@injectable()
export default class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  public async execute({
    user_id,
    avatar_filename
  }: IRequestDTO): Promise<User> {
    const user = await this.usersRepository.findById(user_id)

    if (!user) {
      throw new AppError('Only  authenticated users can change avatar', 401)
    }
    if (user.avatar) {
      this.storageProvider.deleteFile(user.avatar)
    }

    const filename = await this.storageProvider.saveFile(avatar_filename)
    user.avatar = filename
    await this.usersRepository.save(user)
    return user
  }
}
