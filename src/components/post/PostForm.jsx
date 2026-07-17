import { useState } from 'react'
import { useForm } from 'react-hook-form'
import clsx from 'clsx'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { XIcon } from '../ui/Icons'
import { fileToBase64 } from '../../utils/helpers'

const MAX_CHARS = 500

/**
 * Shared by CreatePost and EditPost. Two submit paths: "Save as Draft" and
 * "Publish" set isDraft differently — the parent decides what happens next.
 */
export default function PostForm({ initialValues, onSubmit, submitting }) {
  const [imagePreview, setImagePreview] = useState(initialValues?.image || null)
  const [isPublic, setIsPublic] = useState(initialValues?.isPublic ?? true)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { description: initialValues?.description || '' },
  })

  const description = watch('description') || ''
  const charCount = description.length
  const counterColor =
    charCount >= 480 ? 'text-accent-danger' : charCount >= 400 ? 'text-accent-private' : 'text-ink-500'

  async function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const base64 = await fileToBase64(file)
    setImagePreview(base64)
  }

  function clearImage() {
    setImagePreview(null)
  }

  function submitAs(isDraft) {
    return handleSubmit((values) => {
      onSubmit({
        description: values.description,
        image: imagePreview,
        isPublic,
        isDraft,
      })
    })
  }

  return (
    <form className="space-y-5">
      <div>
        <Input
          as="textarea"
          rows={5}
          label="Description"
          placeholder="What's on your mind?"
          error={errors.description?.message}
          {...register('description', {
            required: 'Description is required',
            minLength: { value: 10, message: 'Write at least 10 characters' },
            maxLength: { value: MAX_CHARS, message: `Keep it under ${MAX_CHARS} characters` },
          })}
        />
        <p className={clsx('mt-1 text-right text-xs', counterColor)}>
          {charCount} / {MAX_CHARS} characters
        </p>
      </div>

      <div>
        <span className="mb-1 block text-sm font-medium text-ink-700 dark:text-ink-300">Image</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-ink-700 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-700 dark:text-ink-300"
        />
        {imagePreview && (
          <div className="relative mt-3 inline-block">
            <img src={imagePreview} alt="Preview" className="max-h-64 rounded-lg" />
            <button
              type="button"
              onClick={clearImage}
              className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-ink-900 text-white shadow-pop"
              aria-label="Remove image"
            >
              <XIcon size={14} />
            </button>
          </div>
        )}
      </div>

      <div>
        <span className="mb-1 block text-sm font-medium text-ink-700 dark:text-ink-300">Visibility</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsPublic(true)}
            className={clsx(
              'rounded-lg border px-3 py-1.5 text-sm font-medium',
              isPublic
                ? 'border-brand-600 bg-brand-100 text-brand-700'
                : 'border-ink-200 text-ink-500 dark:border-ink-700'
            )}
          >
            Public
          </button>
          <button
            type="button"
            onClick={() => setIsPublic(false)}
            className={clsx(
              'rounded-lg border px-3 py-1.5 text-sm font-medium',
              !isPublic
                ? 'border-accent-private bg-amber-50 text-accent-private'
                : 'border-ink-200 text-ink-500 dark:border-ink-700'
            )}
          >
            Private
          </button>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          isLoading={submitting === 'draft'}
          disabled={charCount >= MAX_CHARS}
          onClick={submitAs(true)}
        >
          Save as Draft
        </Button>
        <Button
          type="button"
          variant="primary"
          isLoading={submitting === 'publish'}
          disabled={charCount >= MAX_CHARS}
          onClick={submitAs(false)}
        >
          Publish
        </Button>
      </div>
    </form>
  )
}
