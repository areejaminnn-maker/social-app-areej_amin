import { useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { usePosts } from '../../hooks/usePosts'
import PostForm from '../../components/post/PostForm'

export default function EditPost() {
  const { postId } = useParams()
  const { currentUser } = useAuth()
  const { getPostById, updatePost } = usePosts()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(null)

  const post = getPostById(postId)

  // A post that doesn't exist, or doesn't belong to this user, bounces back.
  if (!post || post.authorId !== currentUser.id) {
    return <Navigate to="/dashboard/posts" replace />
  }

  function handleSubmit({ description, image, isPublic, isDraft }) {
    setSubmitting(isDraft ? 'draft' : 'publish')
    updatePost(post.id, { description, image, isPublic, isDraft })
    setSubmitting(null)
    navigate(isDraft ? '/dashboard/posts' : '/')
  }

  return (
    <div className="max-w-xl">
      <h1 className="mb-5 font-display text-xl font-bold text-ink-900 dark:text-ink-100">Edit Post</h1>
      <div className="card p-6">
        <PostForm initialValues={post} onSubmit={handleSubmit} submitting={submitting} />
      </div>
    </div>
  )
}
