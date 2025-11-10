import { pub } from './orpc'
import { me, signin, signup } from './routers/auth'

export * from './utils'

export const router = pub.router({
  auth: {
    signup,
    signin,
    me,
  },
})
