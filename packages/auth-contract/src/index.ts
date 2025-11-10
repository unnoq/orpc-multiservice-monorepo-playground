import { me, signin, signup } from './contract/auth'

export * from './schemas/auth'
export * from './schemas/user'
export * from './types'

export const contract = {
  auth: {
    signup,
    signin,
    me,
  },
}
