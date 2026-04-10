import { createElement } from 'react'
import clsx from 'clsx'
import './ui.css'

function PageContainer({ as = 'section', className, children, ...props }) {
  return createElement(
    as,
    {
      className: clsx('page-container', className),
      ...props,
    },
    children,
  )
}

export default PageContainer
