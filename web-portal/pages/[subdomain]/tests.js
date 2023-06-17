import TestHistory from '@/components/TestHistory'
import React from 'react'
import { useAdminMode } from '@/lib/zustand.config'

const AdminTests = () => {
  const { adminMode, setAdminMode } = useAdminMode();
  React.useEffect(() => {
    if (localStorage.getItem("aId")) {
      setAdminMode(true);
    }
  }, []);
  return (
    <div>
      <TestHistory />
    </div>
  )
}

export default AdminTests