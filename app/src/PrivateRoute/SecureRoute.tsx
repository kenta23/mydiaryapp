import { auth } from '@/Firebase/firebase'
import { Outlet, Navigate } from 'react-router-dom';
const SecureRoute = () => {
    const user = auth.currentUser?.uid;

  return (
     user ? <Outlet /> : <Navigate to='/login' />
  )
}

export default SecureRoute