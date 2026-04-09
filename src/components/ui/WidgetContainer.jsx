import clsx from 'clsx'
import Card from './Card.jsx'
import SectionHeader from './SectionHeader.jsx'

function WidgetContainer({
  as = 'section',
  children,
  className,
  eyebrow,
  id,
  meta,
  title,
}) {
  return (
    <Card as={as} className={clsx('widget-container', className)} id={id}>
      {title ? <SectionHeader eyebrow={eyebrow} title={title} meta={meta} /> : null}
      {children}
    </Card>
  )
}

export default WidgetContainer
