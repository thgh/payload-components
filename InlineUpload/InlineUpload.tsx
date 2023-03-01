import { Props } from 'payload/components/fields/Upload'
import { Label, useField } from 'payload/components/forms'
import { useConfig } from 'payload/components/utilities'
import Error from 'payload/dist/admin/components/forms/Error'
import FieldDescription from 'payload/dist/admin/components/forms/FieldDescription'
import { formatDate } from 'payload/dist/admin/utilities/formatDate'
import React from 'react'
import { useDropzone } from 'react-dropzone'
import MediaCardList from './MediaCardList'

import { useMedia } from './useMedia'

const baseClass = 'upload'

export default function InlineUpload(props: Props) {
  // Global info
  const {
    serverURL,
    routes: { api },
  } = useConfig()

  // Field info
  const { value, showError, errorMessage, setValue } = useField({
    path: props.path!,
  })
  // Resolve field value to actual media items
  const media = useMedia(props.path!)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles: File[]) => {
      // Ignore empty drop events
      if (!acceptedFiles.length) return
      const file = acceptedFiles[0]

      try {
        // Customize the media document, this is probably custom for your project
        const modified = file.lastModified
          ? formatDate(new Date(file.lastModified), 'yyyy-MM-dd-HH-mm', 'nl') +
            ' '
          : ''
        const doc = { alt: modified + file.name }

        // Add the metadata to the file
        const body = new FormData()
        body.set('_payload', JSON.stringify(doc))
        body.set('file', file)

        // Upload the file
        const ok: { doc: { id: string }; message?: string } = await fetch(
          `${serverURL}${api}/${props.relationTo}?locale=en&depth=0&fallback-locale=null`,
          { method: 'POST', body }
        ).then((r) => r.json())

        // It worked
        if (ok.doc?.id) {
          console.log('ok', ok.doc)
          setValue(ok.doc.id)
        } else {
          alert('Something went wrong while uploading the file')
        }
      } catch (error: any) {
        alert('Something went wrong while uploading the file: ' + error.message)
      }
    },
  })

  return (
    <div
      className={[
        'inline-upload',
        showError && 'error',
        props.admin?.readOnly && `${baseClass}--read-only`,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={`${baseClass}__error-wrap`}>
        <Error showError={showError} message={errorMessage!} />
      </div>
      <Label label={props.label} required={props.required} />

      <div
        {...getRootProps({
          className:
            (isDragActive ? 'file-field--dragging ' : '') +
            'file-field file-field--inline field-type',
        })}
      >
        <div className="file-field__upload">
          <div className="file-field__drop-zone">
            <button
              type="button"
              className="btn file-field__file-button btn--style-secondary btn--icon-style-without-border btn--size-small btn--icon-position-right"
            >
              <aside className="tooltip btn__tooltip"></aside>
              <span className="btn__content">
                <span className="btn__label">Select a file</span>
              </span>
            </button>
            <p className="file-field__drag-label">
              or drag and drop a file here
            </p>
          </div>
        </div>
        <input type="file" {...getInputProps()} />
      </div>

      <MediaCardList items={media} />
      <FieldDescription value={value} description={props.admin?.description} />
    </div>
  )
}
