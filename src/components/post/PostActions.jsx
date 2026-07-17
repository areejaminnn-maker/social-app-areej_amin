import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { usePosts } from '../../hooks/usePosts'
import { useBookmarks } from '../../hooks/useBookmarks'
import { HeartIcon, CommentIcon, BookmarkIcon } from '../ui/Icons'

export default function PostActions({ post, variant = 'card' }) {
  const { currentUser, isAuthenticated } = useAuth()
  const { getLikesForPost, hasUserLiked, toggleLike, getCommentsForPost } = usePosts()
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const navigate = useNavigate()

  const likeCount = getLikesForPost(post.id).length
  const commentCount = getCommentsForPost(post.id).length
  const liked = isAuthenticated && hasUserLiked(post.id, currentUser.id)
  const saved = isAuthenticated && isBookmarked(post.id)

  function requireLogin(e) {
    e.preventDefault()
    e.stopPropagation()
    navigate('/login', { state: { message: 'Please login to interact' } })
  }

  function handleLike(e) {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) return requireLogin(e)
    toggleLike(post.id, currentUser.id)
  }

  function handleBookmark(e) {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) return requireLogin(e)
    toggleBookmark(post.id)
  }

  return (
    <div className="flex items-center gap-4 text-sm text-ink-500 dark:text-ink-400">
      <button
        onClick={handleLike}
        className={liked ? 'flex items-center gap-1.5 font-medium text-brand-600' : 'flex items-center gap-1.5 hover:text-brand-600'}
      >
        <HeartIcon size={17} filled={liked} />
        {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
      </button>

      {variant === 'detail' ? (
        <span className="flex items-center gap-1.5">
          <CommentIcon size={17} />
          {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
        </span>
      ) : (
        <Link
          to={isAuthenticated ? `/posts/${post.id}` : '#'}
          onClick={!isAuthenticated ? requireLogin : (e) => e.stopPropagation()}
          className="flex items-center gap-1.5 hover:text-brand-600"
        >
          <CommentIcon size={17} />
          {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
        </Link>
      )}

      <button
        onClick={handleBookmark}
        className={saved ? 'ml-auto text-brand-600' : 'ml-auto hover:text-brand-600'}
        aria-label={saved ? 'Remove bookmark' : 'Save post'}
      >
        <BookmarkIcon size={17} filled={saved} />
      </button>
    </div>
  )
}
