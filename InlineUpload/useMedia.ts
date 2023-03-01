import { useField } from 'payload/components/forms'
import useSWR from 'swr'
import { MediaCardItem } from './types'

// My Media collection is named "media"
export function useMedia<Media extends MediaCardItem>(path: string) {
  const { value } = useField<string[]>({ path })

  const mediaIds = [value].flat().filter(Boolean)
  return useSWR<{ docs: Media[] }>(
    [`/api/media`, mediaIds],
    ([key, ids]: [key: string, ids: string[]]) => {
      if (!ids.length) return { docs: [] }
      const entries = ids.map((id, i) => ['where[id][in][' + i + ']', id])
      const params = new URLSearchParams(Object.fromEntries(entries))
      return fetch(key + '?' + params.toString()).then((r) => r.json())
    }
  )
}
