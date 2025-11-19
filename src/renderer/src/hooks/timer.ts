import { LogEvent, LogLevel } from '@renderer/types/common'
import { useCallback, useEffect, useRef } from 'react'

/**
 * 计时器选项
 */
export interface TimerOptions {
  /** 时间间隔（秒） */
  interval: number
  /** 唯一标识 */
  identifier: string
}

/**
 * Logger 函数类型
 */
export type Logger = (event: LogEvent) => void

/**
 * 计时器 Hook
 *
 * @param asyncMethod - 需要定时执行的异步方法
 * @param options - 计时器选项
 * @param logger - 日志记录函数
 */
export function useTimer(asyncMethod: () => Promise<void>, options: TimerOptions, logger: Logger): void {
  const { interval, identifier } = options

  // 用于存储定时器ID
  const timerIdRef = useRef<NodeJS.Timeout | null>(null)

  // 用于存储正在执行的任务
  const runningTasksRef = useRef<Set<number>>(new Set())

  // 用于存储 Logger 引用，避免由 logger 变化引起的副作用
  const loggerRef = useRef<Logger>(logger)

  /**
   * 发送日志事件
   */
  const emitLog = useCallback((level: LogLevel, title: string, content: string) => {
    const event: LogEvent = {
      timestamp: Date.now(),
      level,
      title,
      content
    }
    loggerRef.current(event)
  }, [])

  /**
   * 执行异步方法并监测执行时长
   */
  const executeAsyncMethod = useCallback(async () => {
    const startTime = Date.now()
    const taskId = startTime

    // 记录任务开始
    runningTasksRef.current.add(taskId)

    try {
      // 不等待异步方法完成，立即返回
      asyncMethod()
        .then(() => {
          const endTime = Date.now()
          const duration = endTime - startTime
          const intervalMs = interval * 1000

          // 检查执行时长是否超过间隔
          if (duration > intervalMs) {
            emitLog('warn', `[${identifier}] 执行时长超时`, `异步方法执行时长 ${duration}ms 超过了计时器间隔 ${intervalMs}ms`)
          }

          // 任务完成，从集合中移除
          runningTasksRef.current.delete(taskId)
        })
        .catch((error) => {
          const endTime = Date.now()
          const duration = endTime - startTime

          // 即使出错也检查执行时长
          const intervalMs = interval * 1000
          if (duration > intervalMs) {
            emitLog('warn', `[${identifier}] 执行时长超时`, `异步方法执行时长 ${duration}ms 超过了计时器间隔 ${intervalMs}ms（执行过程中出错）`)
          }

          // 任务完成，从集合中移除
          runningTasksRef.current.delete(taskId)

          // 可以选择抛出错误日志
          console.error(`[${identifier}] 异步方法执行出错:`, error)
        })
    } catch (error) {
      // 同步错误处理
      runningTasksRef.current.delete(taskId)
      console.error(`[${identifier}] 异步方法执行出错:`, error)
    }
  }, [asyncMethod, interval, identifier, emitLog])

  // 设置和清理定时器
  useEffect(() => {
    // 当时间间隔为 0 时，停止计时器
    if (interval === 0) {
      // 清理定时器
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current)
        timerIdRef.current = null
      }
      return
    }

    // 立即执行一次
    executeAsyncMethod()

    // 设置定时器
    timerIdRef.current = setInterval(() => {
      executeAsyncMethod()
    }, interval * 1000)

    // 清理函数
    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current)
        timerIdRef.current = null
      }

      // 清理运行中的任务记录
      runningTasksRef.current.clear()
    }
  }, [interval, executeAsyncMethod])
}
