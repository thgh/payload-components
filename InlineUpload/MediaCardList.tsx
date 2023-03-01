import React from 'react'
import { SWRResponse } from 'swr'
import MediaCard from './MediaCard'
import { MediaCardItem } from './types'

export default function MediaCardList<Media extends MediaCardItem>({
  items,
  empty,
  onClear,
}: {
  items: SWRResponse<{ docs: Media[] }>
  empty?: string
  /** If not empty, this will render a "Clear" button */
  onClear?: (index: number) => void
}) {
  return (
    <div className="bijlage-list">
      {items.data?.docs.length ? (
        items.data.docs.map((item) => <MediaCard item={item} key={item.id} />)
      ) : items.data?.docs.length === 0 ? (
        <span style={{ fontSize: 16, opacity: 0.5 }}>{empty}</span>
      ) : items.error ? (
        <span style={{ color: 'red' }}>{items.error.message}</span>
      ) : items.isLoading ? null : (
        JSON.stringify(items, null, 2)
      )}
    </div>
  )
}
