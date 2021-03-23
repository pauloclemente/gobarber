import User from '../User'

export default class UserMap {
  public static toDTO(user: User): any {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      avatar_url: user.getAvatarUrl,
      created_at: user.created_at,
      updated_at: user.updated_at
    }
  }
}
