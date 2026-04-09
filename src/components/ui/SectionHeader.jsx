import clsx from 'clsx'
import './ui.css'

function SectionHeader({ eyebrow, title, meta, className }) {
  return (
    <div className={clsx('section-header', className)}>
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        {title ? <h3>{title}</h3> : null}
      </div>
      {meta ? <span>{meta}</span> : null}
    </div>
  )
}

export default SectionHeader
