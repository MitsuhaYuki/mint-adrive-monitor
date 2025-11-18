import { FC } from 'react'
import { StyleProvider } from '@ant-design/cssinjs'

interface IProps {}

const Content: FC<IProps> = (props) => {
  // eslint-disable-next-line
  const {} = props
  console.log('I: props:', props)
  return (
    <StyleProvider layer>
      <div className='w-full h-full'>App</div>
    </StyleProvider>
  )
}

Content.displayName = 'App'
export { Content as App }
export type { IProps as AppProps }
