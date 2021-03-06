import { Request, Response } from 'express'
import { container } from 'tsyringe'
import UpdateProfileService from '@modules/users/services/UpdateProfileService'
import ShowProfileService from '@modules/users/services/ShowProfileService'
import { classToClass } from 'class-transformer'
import UserMap from '../../typeorm/entities/mappers/UserMap'

export default class ProfileController {
  /**
   * name
   */
  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id

    const showProfile = container.resolve(ShowProfileService)

    const user = await showProfile.execute({ user_id })

    return response.json({ user: classToClass(user) })
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id

    const { name, email, old_password, password } = request.body

    const updateProfile = container.resolve(UpdateProfileService)

    const user = await updateProfile.execute({
      user_id,
      name,
      email,
      old_password,
      password
    })

    const user_mapped = UserMap.toDTO(user)
    return response.json(classToClass(user_mapped))
  }
}
