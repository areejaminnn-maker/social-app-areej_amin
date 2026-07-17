import { usePosts } from '../../hooks/usePosts'
import { useBookmarks } from '../../hooks/useBookmarks'
import PostCard from '../../components/post/PostCard'

export default function SavedPosts() {
  const { getAllPosts } = usePosts()
  const { bookmarks } = useBookmarks()

  const posts = getAllPosts().filter((p) => bookmarks.includes(p.id))

  return (
    <div>
      <h1 className="mb-5 font-display text-xl font-bold text-ink-900 dark:text-ink-100">Saved Posts</h1>

      {posts.length === 0 ? (
        <div className="card p-10 text-center text-ink-500">
          You haven't saved any posts yet. Tap the bookmark icon on a post to save it here.
        </div>
      ) : (
        <div className="space-y-5">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
