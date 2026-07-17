import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { usePosts } from '../../hooks/usePosts'
import { storage } from '../../utils/storage'
import { timeAgo } from '../../utils/helpers'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'

export default function CommentSection({ postId }) {
  const { currentUser, isAuthenticated } = useAuth()
  const { getCommentsForPost, addComment, deleteComment } = usePosts()
  const [text, setText] = useState('')
  const [confirmingId, setConfirmingId] = useState(null)

  const comments = getCommentsForPost(postId)
  const users = storage.getUsers()

  function handleAdd(e) {
    e.preventDefault()
    if (!text.trim()) return
    addComment(postId, currentUser.id, text.trim())
    setText('')
  }

  function handleDelete(commentId) {
    deleteComment(commentId)
    setConfirmingId(null)
  }

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold text-ink-700 dark:text-ink-300">
        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
      </h2>

      {isAuthenticated ? (
        <form onSubmit={handleAdd} className="mb-5 flex gap-2">
          <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment…"
            className="input-base flex-1"
          />
          <Button type="submit" size="sm">Post</Button>
        </form>
      ) : (
        <p className="mb-5 text-sm text-ink-500">
          <Link to="/login" className="link-quiet">Login to comment</Link>
        </p>
      )}

      <ul className="space-y-4">
        {comments.map((comment) => {
          const author = users.find((u) => u.id === comment.authorId)
          if (!author) return null
          const isOwn = isAuthenticated && comment.authorId === currentUser.id

          return (
            <li key={comment.id} className="flex gap-3">
              <Avatar src={author.avatar} name={author.name} size="sm" />
              <div className="flex-1 rounded-lg bg-ink-100 px-3 py-2 dark:bg-ink-900">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-ink-900 dark:text-ink-100">
                    {author.name}
                  </span>
                  <span className="text-xs text-ink-500">{timeAgo(comment.createdAt)}</span>
                </div>
                <p className="mt-0.5 text-sm text-ink-700 dark:text-ink-300">{comment.text}</p>

                {isOwn && (
                  confirmingId === comment.id ? (
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <span className="text-ink-500">Are you sure?</span>
                      <button onClick={() => handleDelete(comment.id)} className="font-semibold text-accent-danger hover:underline">
                        Yes
                      </button>
                      <button onClick={() => setConfirmingId(null)} className="font-semibold text-ink-500 hover:underline">
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmingId(comment.id)}
                      className="mt-1 text-xs text-ink-500 hover:text-accent-danger"
                    >
                      Delete
                    </button>
                  )
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
