interface IMailConfig {
  driver: 'ethereal' | 'ses'
  defaults: {
    from: {
      email: string
      name: string
    }
  }
}
export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',
  defaults: {
    from: {
      email: 'pauloclemente@snooze.dev',
      name: 'Paulo da Rocketseat'
    }
  }
} as IMailConfig
