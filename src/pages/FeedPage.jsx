import { useState } from 'react'
import { usePosts } from '../hooks/usePosts'
import PostCard from '../components/post/PostCard'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function FeedPage() {
  const { getPublicFeed } = usePosts()
  const [search, setSearch] = useState('')

  const posts = getPublicFeed()
  const filtered = search.trim()
    ? posts.filter((p) => p.description.toLowerCase().includes(search.trim().toLowerCase()))
    : posts

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar search={search} onSearchChange={setSearch} />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <div className="mb-6 sm:hidden">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts…"
            className="input-base"
            aria-label="Search posts"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="card p-10 text-center text-ink-500">
            {search.trim() ? `No results found for "${search.trim()}"` : 'No posts yet — be the first to share!'}
          </div>
        ) : (
          <div className="space-y-5">
            {filtered.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
