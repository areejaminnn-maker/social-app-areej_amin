import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { usePosts } from '../../hooks/usePosts'
import { formatDate } from '../../utils/helpers'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'

function statusOf(post) {
  if (post.isDraft) return 'draft'
  return post.isPublic ? 'public' : 'private'
}

export default function PostsDashboard() {
  const { currentUser } = useAuth()
  const { getPostsByAuthor, getLikesForPost, getCommentsForPost, updatePost, deletePost } = usePosts()
  const [pendingDeleteId, setPendingDeleteId] = useState(null)

  const posts = getPostsByAuthor(currentUser.id)

  function togglePrivacy(post) {
    updatePost(post.id, { isPublic: !post.isPublic })
  }

  function publish(post) {
    updatePost(post.id, { isDraft: false, isPublic: true })
  }

  function confirmDelete() {
    deletePost(pendingDeleteId)
    setPendingDeleteId(null)
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-ink-900 dark:text-ink-100">My Posts</h1>
        <Link to="/dashboard/create">
          <Button size="sm">Create Post</Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="card p-10 text-center text-ink-500">
          You haven't created any posts yet. Create your first post!
        </div>
      ) : (
        <ul className="space-y-3">
          {posts.map((post) => (
            <li key={post.id} className="card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <Badge variant={statusOf(post)} />
                    <span className="text-xs text-ink-500">{formatDate(post.createdAt)}</span>
                  </div>
                  <p className="line-clamp-3 whitespace-pre-line text-sm text-ink-800 dark:text-ink-200">
                    {post.description}
                  </p>
                  <p className="mt-1 text-xs text-ink-500">
                    {getLikesForPost(post.id).length} likes · {getCommentsForPost(post.id).length} comments
                  </p>
                </div>

                <div className="flex flex-shrink-0 flex-wrap gap-2">
                  {post.isDraft && (
                    <Button size="sm" variant="primary" onClick={() => publish(post)}>
                      Publish
                    </Button>
                  )}
                  {!post.isDraft && (
                    <Button size="sm" variant="secondary" onClick={() => togglePrivacy(post)}>
                      Make {post.isPublic ? 'Private' : 'Public'}
                    </Button>
                  )}
                  <Link to={`/dashboard/edit/${post.id}`}>
                    <Button size="sm" variant="ghost">Edit</Button>
                  </Link>
                  <Button size="sm" variant="danger" onClick={() => setPendingDeleteId(post.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        isOpen={!!pendingDeleteId}
        onClose={() => setPendingDeleteId(null)}
        title="Delete this post?"
      >
        <p className="mb-5 text-sm text-ink-500">
          This will permanently remove the post along with its likes and comments.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setPendingDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
