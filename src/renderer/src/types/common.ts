/**
 * 日志等级
 */
export type LogLevel = 'info' | 'warn' | 'error'

/**
 * 日志事件
 */
export interface LogEvent {
  timestamp: number
  level: LogLevel
  title: string
  content: string
}
