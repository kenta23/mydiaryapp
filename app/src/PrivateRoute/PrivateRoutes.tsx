import { Outlet, Navigate } from 'react-router-dom'
import { auth } from '@/Firebase/firebase'

const PrivateRoutes = () => {
    const existedUser = auth.currentUser?.uid
  return (
        existedUser ? <Outlet /> : <Navigate to='/login'/>
  )
}

export default PrivateRoutes