import { FC, ReactNode } from 'react'

interface IProps {
  title: string
  children: ReactNode
}

const Content: FC<IProps> = (props) => {
  const { title, children } = props

  return <div className="relative mb-4 w-full rounded-sm border border-dashed border-neutral-400 p-2">
    <div className="absolute -top-3 left-2 bg-neutral-800 px-1 text-xs font-medium text-neutral-400">
      {title}
    </div>
    <div>{children}</div>
  </div>
}

Content.displayName = 'FeatureSection'
export { Content as FeatureSection }
export type { IProps as FeatureSectionProps }
