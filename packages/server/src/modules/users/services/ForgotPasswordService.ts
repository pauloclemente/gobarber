import { injectable, inject } from 'tsyringe'
import path from 'path'
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider'
import AppError from '@shared/errors/AppError'
import IUsersRepository from '../repositories/IUsersRepository'
import IUserTokensRepository from '../repositories/IUserTokensRepository'

interface IRequestDTO {
  email: string
}
@injectable()
export default class ForgotPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('MailProvider')
    private mailProvider: IMailProvider,
    @inject('UserTokensRepository')
    private userTokensRepositoroy: IUserTokensRepository
  ) {}

  public async execute({ email }: IRequestDTO): Promise<void> {
    const user = await this.usersRepository.findByEmail(email)
    // verifica o email
    if (!user) {
      throw new AppError('This email was not found')
    }
    // gera token
    const { token } = await this.userTokensRepositoroy.generate(user.id)
    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs'
    )

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email
      },
      subject: '[myGoBarber] Recuperação de senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset-password?token=${token}`
        }
      }
    })
  }
}
