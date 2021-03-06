import { Request, Response } from 'express'
import { container } from 'tsyringe'

import CreateUserService from '@modules/users/services/CreateUserService'
import { classToClass } from 'class-transformer'
import UserMap from '../../typeorm/entities/mappers/UserMap'

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, password, email } = request.body

    const createUser = container.resolve(CreateUserService)
    const user = await createUser.execute({ name, password, email })
    const user_mapped = UserMap.toDTO(user)
    return response.json(classToClass(user_mapped))
  }
}
