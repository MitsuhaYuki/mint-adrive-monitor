import { LogEvent, LogLevel } from '@renderer/types/common'
import { createContext, Reducer, useCallback, useContext, useMemo } from 'react'

interface IState {
  logs: LogEvent[]
  maxLogs: number
}
interface IOptionalState extends Partial<IState> {}

// State初始值
const initState: IState = {
  logs: [],
  maxLogs: 30 // 0表示无限制
}

type IReducerActionType = 'internal' | 'reset' | 'addLog' | 'clearLogs' | 'setMaxLogs'
interface IReducerAction {
  type: string
  payload: any
}

const reducer: Reducer<IState, IReducerAction> = (state, action) => {
  if (action.type !== 'internal') {
    switch (action.type) {
      // 添加日志
      case 'addLog': {
        const newLog: LogEvent = action.payload
        let newLogs = [newLog, ...state.logs]

        // 如果设置了最大日志数量，则裁剪
        if (state.maxLogs > 0 && newLogs.length > state.maxLogs) {
          newLogs = newLogs.slice(0, state.maxLogs)
        }

        return { ...state, logs: newLogs }
      }
      // 清空日志
      case 'clearLogs':
        return { ...state, logs: [] }
      // 设置最大日志数量
      case 'setMaxLogs': {
        const maxLogs = action.payload
        let newLogs = state.logs

        // 如果新的最大值小于当前日志数量，则裁剪
        if (maxLogs > 0 && newLogs.length > maxLogs) {
          newLogs = newLogs.slice(0, maxLogs)
        }

        return { ...state, maxLogs, logs: newLogs }
      }
      // 重置到初始状态
      case 'reset':
        return { ...initState }
    }
  } else {
    return { ...state, ...action.payload }
  }
  console.error(`LoggerContext: '${action.type}' is not a valid reducer action!`)
  return state
}

const Context = createContext<{
  state: IState
  dispatch: (value: any) => void
}>({
  state: initState,
  dispatch: () => ({ error: 'Reducer is not defined' })
})

// Logger对象类型
interface ILogger {
  info: (title: string, content: string) => void
  warn: (title: string, content: string) => void
  error: (title: string, content: string) => void
}

// wrap current context to provide a simple use method
interface ILoggerContextReturn {
  logs: LogEvent[]
  logger: ILogger
  clearLogs: () => void
  setMaxLogs: (max: number) => void
}

const useWrappedContext = (): ILoggerContextReturn => {
  const { state, dispatch } = useContext(Context)

  // 通用日志添加函数
  const addLog = useCallback(
    (level: LogLevel, title: string, content: string) => {
      const logEvent: LogEvent = {
        timestamp: Date.now(),
        level,
        title,
        content
      }
      dispatch({ type: 'addLog', payload: logEvent })
    },
    [dispatch]
  )

  // Logger对象
  const logger: ILogger = useMemo(
    () => ({
      info: (title: string, content: string) => addLog('info', title, content),
      warn: (title: string, content: string) => addLog('warn', title, content),
      error: (title: string, content: string) => addLog('error', title, content)
    }),
    [addLog]
  )

  // 清空日志
  const clearLogs = useCallback(() => {
    dispatch({ type: 'clearLogs', payload: null })
  }, [dispatch])

  // 设置最大日志数量
  const setMaxLogs = useCallback(
    (max: number) => {
      dispatch({ type: 'setMaxLogs', payload: max })
    },
    [dispatch]
  )

  return {
    logs: state.logs,
    logger,
    clearLogs,
    setMaxLogs
  }
}

export { Context as LoggerContext, initState as loggerInitState, reducer as loggerReducer, useWrappedContext as useLoggerContext }

export type { ILogger, ILoggerContextReturn, IReducerActionType as ILoggerReducerActionType, IState as ILoggerState, IOptionalState as IOptionalLoggerState }
