import { Link } from 'react-router-dom'
import { storage } from '../../utils/storage'
import { timeAgo } from '../../utils/helpers'
import Avatar from '../ui/Avatar'
import PostActions from './PostActions'

export default function PostCard({ post }) {
  const author = storage.getUsers().find((u) => u.id === post.authorId)
  if (!author) return null

  return (
    <article className="card overflow-hidden">
      <div className="flex items-start gap-3 p-4 pb-3">
        <Link to={`/profile/${author.id}`} onClick={(e) => e.stopPropagation()}>
          <Avatar src={author.avatar} name={author.name} size="md" />
        </Link>
        <div>
          <Link
            to={`/profile/${author.id}`}
            onClick={(e) => e.stopPropagation()}
            className="font-semibold text-ink-900 hover:underline dark:text-ink-100"
          >
            {author.name}
          </Link>
          <p className="text-xs text-ink-500">{timeAgo(post.createdAt)}</p>
        </div>
      </div>

      <Link to={`/posts/${post.id}`} className="block">
        <p className="line-clamp-3 whitespace-pre-line px-4 pb-3 text-sm text-ink-700 dark:text-ink-300">
          {post.description}
        </p>
        {post.image && (
          <img src={post.image} alt="" className="max-h-96 w-full object-cover" />
        )}
      </Link>

      <div className="px-4 py-3">
        <PostActions post={post} />
      </div>
    </article>
  )
}
