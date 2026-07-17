import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import { formatDate } from '../../utils/helpers'
import { Link } from 'react-router-dom'
import { MapPinIcon, CalendarIcon } from '../ui/Icons'

export default function ProfileHeader({ user, isOwner }) {
  return (
    <div className="card overflow-hidden">
      <div
        className="h-40 w-full sm:h-52"
        style={
          user.coverImage
            ? { backgroundImage: `url(${user.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { background: 'linear-gradient(135deg, #2557D6 0%, #7C3AED 100%)' }
        }
      />
      <div className="relative px-6 pb-6">
        <div className="-mt-10 mb-3 flex items-end justify-between">
          <Avatar src={user.avatar} name={user.name} size="lg" className="ring-4 ring-white dark:ring-ink-900" />
          {isOwner && (
            <Link to="/dashboard/settings">
              <Button variant="secondary" size="sm">Edit Profile</Button>
            </Link>
          )}
        </div>
        <h1 className="font-display text-xl font-bold text-ink-900 dark:text-ink-100">{user.name}</h1>
        {user.bio && <p className="mt-1 text-sm text-ink-700 dark:text-ink-300">{user.bio}</p>}
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-500">
          {user.location && (
            <span className="flex items-center gap-1">
              <MapPinIcon size={14} /> {user.location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <CalendarIcon size={14} /> Joined {formatDate(user.joinedAt)}
          </span>
        </div>
      </div>
    </div>
  )
}
