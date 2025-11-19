import { createContext, useCallback, useContext, Reducer } from 'react'

interface IState {
  timer: number
}
interface IOptionalState extends Partial<IState> {}

// State初始值
const initState: IState = {
  timer: 2
}

type IReducerActionType = 'internal' | 'reset' | 'tick'
interface IReducerAction { type: string; payload: any }

const reducer: Reducer<IState, IReducerAction> = (state, action) => {
  if (action.type !== 'internal') {
    switch (action.type) {
      // 更新tick时间
      case 'timer':
        return Object.assign({}, state, { timer: action.payload })
      // 重置到初始状态
      case 'reset':
        return Object.assign({}, state, { ...initState })
    }
  } else {
    return Object.assign({}, state, action.payload)
  }
  console.error(`RuntimeContext: '${action.type}' is not a valid reducer action!`)
  return state
}

const Context = createContext<{
  state: IState
  dispatch: (value: any) => void
}>({
  state: initState,
  dispatch: () => ({ error: 'Reducer is not defined' })
})

// wrap current context to provide a simple use method
type ISetter = (type: Exclude<IReducerActionType, 'internal'> | IOptionalState, payload?: any) => void

const useWrappedContext = (): [state: IState, setState: ISetter] => {
  const { state, dispatch } = useContext(Context)

  const setState = useCallback(
    (arg1: Exclude<IReducerActionType, 'internal'> | IOptionalState, arg2?: IOptionalState) => {
      if (typeof arg1 === 'string') {
        dispatch({ type: arg1, payload: arg2 })
      } else {
        if (arg2) {
          console.error('ConfigContext: arg2 is not allowed when arg1 is not a valid reducer action type')
        } else {
          dispatch({ type: 'internal', payload: arg1 })
        }
      }
    },
    [dispatch]
  )

  return [state, setState]
}

export {
  Context as RuntimeContext,
  reducer as runtimeReducer,
  initState as runtimeInitState,
  useWrappedContext as useRuntimeContext,
}

export type {
  IState as IRuntimeState,
  ISetter as IRuntimeSetter,
  IOptionalState as IOptionalRuntimeState,
  IReducerActionType as IRuntimeReducerActionType,
}
