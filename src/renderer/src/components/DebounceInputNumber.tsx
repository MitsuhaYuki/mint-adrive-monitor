import { FC } from 'react'
import { InputNumber } from 'antd'
import { useDebounceFn } from 'ahooks'
import type { InputNumberProps } from 'antd'

interface IProps extends Omit<InputNumberProps, 'onChange'> {
  value?: number
  onChange?: (value: number) => void
  debounceMs?: number
}

const Content: FC<IProps> = (props) => {
  const { value, onChange, debounceMs = 300, ...restProps } = props

  const { run: debouncedOnChange } = useDebounceFn(
    (val: number) => {
      onChange?.(val)
    },
    { wait: debounceMs }
  )

  return (
    <InputNumber
      {...restProps}
      value={value}
      onChange={(val) => debouncedOnChange(val ? Number(val) : 0)}
    />
  )
}

Content.displayName = 'DebounceInputNumber'
export { Content as DebounceInputNumber }
export type { IProps as DebounceInputNumberProps }
