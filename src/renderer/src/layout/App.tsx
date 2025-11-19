import { StyleProvider } from '@ant-design/cssinjs'
import { FeatureSection } from '@renderer/components/FeatureSection'
import { LoggerContext, loggerInitState, loggerReducer } from '@renderer/context/logger'
import { RuntimeContext, runtimeInitState, runtimeReducer } from '@renderer/context/runtime'
import { App, ConfigProvider, theme } from 'antd'
import { FC, useReducer } from 'react'
import { LogViewer } from './sections/LogViewer'
import { TimerDemo } from './sections/TimerDemo'

interface IProps {}

const Content: FC<IProps> = (props) => {
  // eslint-disable-next-line
  const {} = props

  const [state, dispatch] = useReducer(runtimeReducer, runtimeInitState)
  const [loggerState, loggerDispatch] = useReducer(loggerReducer, loggerInitState)

  return (
    <StyleProvider layer>
      <ConfigProvider
        theme={{ algorithm: theme.darkAlgorithm, components: { Table: { cellFontSizeSM: 12, headerBorderRadius: 0 } } }}
        componentSize='small'
        button={{ autoInsertSpace: false }}
      >
        <App message={{ maxCount: 3 }} notification={{ bottom: 6, duration: 0, placement: 'bottomRight' }} className='h-full w-full bg-neutral-950'>
          <LoggerContext.Provider value={{ state: loggerState, dispatch: loggerDispatch }}>
            <RuntimeContext.Provider value={{ state, dispatch }}>
              <div className='h-full w-full overflow-x-hidden overflow-y-auto bg-neutral-800 p-2 scheme-dark'>
                <FeatureSection title='Timer Demo'>
                  <TimerDemo />
                </FeatureSection>
                <FeatureSection title='日志查看'>
                  <LogViewer />
                </FeatureSection>
              </div>
            </RuntimeContext.Provider>
          </LoggerContext.Provider>
        </App>
      </ConfigProvider>
    </StyleProvider>
  )
}

Content.displayName = 'App'
export { Content as App }
export type { IProps as AppProps }
