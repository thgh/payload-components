import React from 'react'
import { formatDate } from 'payload/dist/admin/utilities/formatDate'
import { MediaCardItem } from './types'

export default function MediaCard<Media extends MediaCardItem>({
  item,
  onClear,
}: {
  item: Media
  onClear?: () => void
}) {
  return (
    <a className="media-card" href={item.url} download>
      {item.mimeType.startsWith('image') && (
        <img className="media-card__thumbnail" src={item.url} loading="lazy" />
      )}
      <div className="media-card__body">
        <div className="media-card__alt" style={{ fontSize: 16 }}>
          {item.alt}
        </div>
        <div style={{ opacity: 0.6 }}>
          {item.filesize > 990000
            ? (item.filesize / 2 ** 20).toFixed(2) + ' Mb'
            : (item.filesize / 2 ** 10).toFixed(0) + ' Kb'}{' '}
          &middot; {item.filename} &middot;{' '}
          {formatDate(new Date(item.createdAt), "d MMM Y 'om' HH:mm", 'nl')}
        </div>
      </div>
      {onClear && (
        <button className="bijlage-clear">
          <span className="hidden">Clear</span>
        </button>
      )}
    </a>
  )
}
