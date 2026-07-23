import React from 'react'

export function DocToc({ headings, locale, onAnchorNavigate }) {
  if (!headings.length) return null

  return (
    <aside className="doc-toc" aria-label="On this page">
      <p>{locale === 'en' ? 'On this page' : '本页内容'}</p>
      <ol>
        {headings.map((heading) => (
          <li className={`doc-toc__depth-${heading.depth}`} key={heading.id}>
            <a
              href={`#${heading.id}`}
              onClick={(event) => onAnchorNavigate?.(event, heading.id)}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </aside>
  )
}
