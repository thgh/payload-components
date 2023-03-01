// import { FileSize } from 'payload/dist/uploads/types'

export interface MediaCardItem {
  createdAt: string
  filename: string
  filesize: number
  id: string
  mimeType: string
  url: string

  // Custom field
  alt: string
}
