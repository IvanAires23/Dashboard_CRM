import { createElement } from 'react'
import clsx from 'clsx'
import './ui.css'

function Skeleton({
  as = 'span',
  className,
  ...props
}) {
  return createElement(as, {
    className: clsx('ui-skeleton', className),
    'aria-hidden': 'true',
    ...props,
  })
}

export default Skeleton
