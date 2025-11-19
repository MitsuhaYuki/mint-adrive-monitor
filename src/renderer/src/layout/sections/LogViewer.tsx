import { DeleteOutlined } from '@ant-design/icons'
import { DebounceInputNumber } from '@renderer/components/DebounceInputNumber'
import { useLoggerContext } from '@renderer/context/logger'
import { LogEvent, LogLevel } from '@renderer/types/common'
import { Button, Collapse, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { FC } from 'react'

interface IProps {}

const LogLevelTag: FC<{ level: LogLevel }> = ({ level }) => {
  const colorMap: Record<LogLevel, string> = {
    info: 'blue',
    warn: 'orange',
    error: 'red'
  }

  function getLevelName(level: LogLevel): string {
    switch (level) {
      case 'info':
        return '信息'
      case 'warn':
        return '警告'
      case 'error':
        return '错误'
      default:
        return level
    }
  }

  return <Tag color={colorMap[level]}>{getLevelName(level)}</Tag>
}

const Content: FC<IProps> = (props) => {
  // eslint-disable-next-line
  const {} = props

  const { logs, clearLogs, setMaxLogs } = useLoggerContext()

  const formatTimestamp = (timestamp: number | string): string => {
    const d = new Date(Number(timestamp))
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const hh = String(d.getHours()).padStart(2, '0')
    const min = String(d.getMinutes()).padStart(2, '0')
    const ss = String(d.getSeconds()).padStart(2, '0')
    return `${mm}/${dd} ${hh}:${min}:${ss}`
  }

  const columns: ColumnsType<LogEvent> = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 100,
      render: (timestamp: number) => <div className='text-xs'>{formatTimestamp(timestamp)}</div>
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      width: 60,
      render: (level: LogLevel) => <LogLevelTag level={level} />
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 160,
      ellipsis: true
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true
    }
  ]

  const items = [
    {
      key: '1',
      label: `日志管理 (当前 ${logs.length} 条)`,
      classNames: { body: 'p-0' },
      children: (
        <Table
          columns={columns}
          dataSource={logs}
          size='small'
          rowKey='timestamp'
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
        />
      ),
      extra: (
        <div
          className='flex items-center gap-2'
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          <span>最大保留数量:</span>
          <DebounceInputNumber
            min={0}
            max={1000}
            defaultValue={30}
            onChange={(value) => setMaxLogs(value || 0)}
            placeholder='0表示无限制'
            changeOnWheel
            className='w-12'
            controls={false}
          />
          <Button size='small' danger icon={<DeleteOutlined />} onClick={clearLogs} disabled={logs.length === 0}>
            清空日志
          </Button>
        </div>
      )
    }
  ]

  return <Collapse items={items} bordered={false} defaultActiveKey={[]} />
}

Content.displayName = 'LogViewer'
export { Content as LogViewer }
export type { IProps as LogViewerProps }
