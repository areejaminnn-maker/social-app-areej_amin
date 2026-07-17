import { useParams, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { usePosts } from '../hooks/usePosts'
import { storage } from '../utils/storage'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import ProfileHeader from '../components/profile/ProfileHeader'
import PostCard from '../components/post/PostCard'

export default function ProfilePage() {
  const { userId } = useParams()
  const { currentUser } = useAuth()
  const { getPostsByAuthor } = usePosts()

  const user = storage.getUsers().find((u) => u.id === userId)
  if (!user) return <Navigate to="/404" replace />

  const posts = getPostsByAuthor(userId, { publicOnly: true })
  const isOwner = currentUser?.id === userId

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <ProfileHeader user={user} isOwner={isOwner} />

        <h2 className="mb-4 mt-8 font-display text-lg font-semibold text-ink-900 dark:text-ink-100">Posts</h2>

        {posts.length === 0 ? (
          <div className="card p-10 text-center text-ink-500">No public posts yet</div>
        ) : (
          <div className="space-y-5">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
