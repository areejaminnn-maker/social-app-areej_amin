import { useParams, Link, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { usePosts } from '../hooks/usePosts'
import { storage } from '../utils/storage'
import { formatDate } from '../utils/helpers'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Avatar from '../components/ui/Avatar'
import PostActions from '../components/post/PostActions'
import CommentSection from '../components/post/CommentSection'

export default function PostDetailPage() {
  const { postId } = useParams()
  const { currentUser } = useAuth()
  const { getPostById } = usePosts()
  const post = getPostById(postId)

  if (!post) return <Navigate to="/404" replace />

  // Private posts and drafts are only visible to their own author — anyone
  // else following the direct link gets treated as if the post doesn't exist.
  const isOwner = currentUser?.id === post.authorId
  const isHiddenFromViewer = (!post.isPublic || post.isDraft) && !isOwner
  if (isHiddenFromViewer) return <Navigate to="/404" replace />

  const author = storage.getUsers().find((u) => u.id === post.authorId)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <article className="card overflow-hidden">
          <div className="flex items-center gap-3 p-5 pb-3">
            <Link to={`/profile/${author.id}`}>
              <Avatar src={author.avatar} name={author.name} size="md" />
            </Link>
            <div>
              <Link to={`/profile/${author.id}`} className="font-semibold text-ink-900 hover:underline dark:text-ink-100">
                {author.name}
              </Link>
              <p className="text-xs text-ink-500">{formatDate(post.createdAt)}</p>
            </div>
          </div>

          <p className="whitespace-pre-line px-5 pb-4 text-ink-800 dark:text-ink-200">{post.description}</p>
          {post.image && <img src={post.image} alt="" className="w-full object-cover" />}

          <div className="border-t border-ink-200 px-5 py-3 dark:border-ink-900">
            <PostActions post={post} variant="detail" />
          </div>
        </article>

        <div className="card mt-5 p-5">
          <CommentSection postId={post.id} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
