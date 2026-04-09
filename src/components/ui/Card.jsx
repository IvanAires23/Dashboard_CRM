import { createElement } from 'react'
import clsx from 'clsx'
import './ui.css'

function Card({ as = 'div', className, children, ...props }) {
  return createElement(
    as,
    {
      className: clsx('ui-card', className),
      ...props,
    },
    children,
  )
}

export default Card
