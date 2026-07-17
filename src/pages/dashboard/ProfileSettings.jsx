import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../hooks/useAuth'
import { fileToBase64 } from '../../utils/helpers'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'

const BIO_MAX = 150

export default function ProfileSettings() {
  const { currentUser, updateCurrentUser } = useAuth()
  const [avatarPreview, setAvatarPreview] = useState(currentUser.avatar)
  const [saved, setSaved] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: currentUser.name,
      bio: currentUser.bio || '',
      location: currentUser.location || '',
    },
  })

  const bio = watch('bio') || ''

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarPreview(await fileToBase64(file))
  }

  function onSubmit(values) {
    updateCurrentUser({ ...values, avatar: avatarPreview })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-xl">
      <h1 className="mb-5 font-display text-xl font-bold text-ink-900 dark:text-ink-100">Profile Settings</h1>

      {saved && (
        <p className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-accent-public">
          Profile updated successfully
        </p>
      )}

      <div className="card p-6">
        <div className="mb-5 flex items-center gap-4">
          <Avatar src={avatarPreview} name={currentUser.name} size="lg" />
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="block text-sm text-ink-700 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-700 dark:text-ink-300"
            />
            <p className="mt-1 text-xs text-ink-500">JPG or PNG, shown across your posts and comments.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full name"
            error={errors.name?.message}
            {...register('name', { required: 'Full name is required' })}
          />

          <div>
            <Input
              as="textarea"
              rows={3}
              label="Bio"
              placeholder="Tell people a bit about yourself"
              error={errors.bio?.message}
              {...register('bio', {
                maxLength: { value: BIO_MAX, message: `Keep it under ${BIO_MAX} characters` },
              })}
            />
            <p className="mt-1 text-right text-xs text-ink-500">
              {bio.length} / {BIO_MAX} characters
            </p>
          </div>

          <Input label="Location" placeholder="City, Country" {...register('location')} />

          <Button type="submit" isLoading={isSubmitting}>
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  )
}
