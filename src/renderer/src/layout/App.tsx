import { FC } from 'react'
import { StyleProvider } from '@ant-design/cssinjs'
import { App, ConfigProvider, theme } from 'antd'

interface IProps {}

const Content: FC<IProps> = (props) => {
  // eslint-disable-next-line
  const {} = props

  return (
    <StyleProvider layer>
      <ConfigProvider
        theme={{ algorithm: theme.darkAlgorithm }}
        componentSize="small"
        button={{ autoInsertSpace: false }}
      >
        <App
          message={{ maxCount: 3 }}
          notification={{ bottom: 6, duration: 0, placement: 'bottomRight' }}
          className='w-full h-full bg-neutral-950'
        >
          <div className='w-full h-full bg-neutral-800'>App</div>
        </App>
      </ConfigProvider>
    </StyleProvider>
  )
}

Content.displayName = 'App'
export { Content as App }
export type { IProps as AppProps }
