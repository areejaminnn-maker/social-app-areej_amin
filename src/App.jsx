import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import RequireAuth from './components/RequireAuth'

const FeedPage = lazy(() => import('./pages/FeedPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const SignupPage = lazy(() => import('./pages/SignupPage'))
const PostDetailPage = lazy(() => import('./pages/PostDetailPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

const DashboardLayout = lazy(() => import('./pages/dashboard/DashboardLayout'))
const PostsDashboard = lazy(() => import('./pages/dashboard/PostsDashboard'))
const CreatePost = lazy(() => import('./pages/dashboard/CreatePost'))
const EditPost = lazy(() => import('./pages/dashboard/EditPost'))
const ProfileSettings = lazy(() => import('./pages/dashboard/ProfileSettings'))
const SavedPosts = lazy(() => import('./pages/dashboard/SavedPosts'))

function PageSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <svg className="h-8 w-8 animate-spin text-brand-600" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <Routes>
        <Route path="/" element={<FeedPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/posts/:postId" element={<PostDetailPage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />

        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="posts" replace />} />
          <Route path="posts" element={<PostsDashboard />} />
          <Route path="create" element={<CreatePost />} />
          <Route path="edit/:postId" element={<EditPost />} />
          <Route path="saved" element={<SavedPosts />} />
          <Route path="settings" element={<ProfileSettings />} />
        </Route>

        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
