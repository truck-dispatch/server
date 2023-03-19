interface Message {
  msg: string
  userEmail?: string
}
export default class Logger {
  error(data: Message) {}
}
