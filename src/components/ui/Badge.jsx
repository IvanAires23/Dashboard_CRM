import clsx from 'clsx'
import './ui.css'

function Badge({ children, className, variant = 'default' }) {
  return <span className={clsx('ui-badge', `ui-badge--${variant}`, className)}>{children}</span>
}

export default Badge
