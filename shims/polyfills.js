/** @format */

import { ReadableStream } from 'web-streams-polyfill'

if (!global.ReadableStream) {
  global.ReadableStream = ReadableStream
}
