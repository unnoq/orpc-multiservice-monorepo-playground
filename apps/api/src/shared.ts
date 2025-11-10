import { CORSPlugin } from '@orpc/server/plugins'
import pino from 'pino'

export const logger = pino()

export const corsPlugin = new CORSPlugin()
