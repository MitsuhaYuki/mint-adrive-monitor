import { useLoggerContext } from '@renderer/context/logger'
import { Button, InputNumber, Space } from 'antd'
import { FC, useCallback, useState } from 'react'
import { useTimer } from '../../hooks/timer'

interface IProps {}

const Content: FC<IProps> = (props) => {
  // eslint-disable-next-line
  const {} = props

  const [interval, setInterval] = useState<number>(5)
  const [executionCount, setExecutionCount] = useState<number>(0)
  const { logger: ctxLogger } = useLoggerContext()

  // 模拟异步任务
  const asyncTask = useCallback(async () => {
    setExecutionCount((prev) => prev + 1)
    // 模拟随机延迟
    const delay = Math.floor(Math.random() * 3000) + 1000
    await new Promise((resolve) => setTimeout(resolve, delay))
  }, [])

  // 使用计时器 hook
  useTimer(
    asyncTask,
    {
      interval,
      identifier: 'demo-timer'
    },
    (event) => {
      ctxLogger.warn(event.title, event.content)
    }
  )

  // 清空日志
  const handleClearLogs = (): void => {
    setExecutionCount(0)
  }

  return (
    <div className='p-1'>
      <Space>
        <span>{`执行次数: ${executionCount}`}</span>
        <span>时间间隔（秒）:</span>
        <InputNumber min={0} max={60} value={interval} onChange={(value) => setInterval(value || 0)} />
        <Button onClick={handleClearLogs}>重置运行次数</Button>
      </Space>
      <div className='mt-4 text-neutral-300'>
        <p>• 当间隔为 0 时，计时器停止</p>
        <p>• 异步任务会模拟 1-4 秒的随机延迟</p>
        <p>• 当执行时长超过间隔时，会触发警告日志</p>
      </div>
    </div>
  )
}

Content.displayName = 'TimerDemo'
export { Content as TimerDemo }
export type { IProps as TimerDemoProps }
