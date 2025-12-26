import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

function getReturnTo(pathname: string, search: string) {
  return encodeURIComponent(pathname + search)
}

export function SiteAuthCtaButton({
  className,
  loggedOutLabel = 'Entrar',
  loggedInLabel = 'Ir para o app',
  loggedInTo = '/app',
}: {
  className: string
  loggedOutLabel?: string
  loggedInLabel?: string
  loggedInTo?: string
}) {
  const { user } = useAuth()
  const location = useLocation()

  if (user) {
    return (
      <Link to={loggedInTo} className={className}>
        {loggedInLabel}
      </Link>
    )
  }

  const returnTo = getReturnTo(location.pathname, location.search)
  return (
    <Link to={`/login?returnTo=${returnTo}`} className={className}>
      {loggedOutLabel}
    </Link>
  )
}

