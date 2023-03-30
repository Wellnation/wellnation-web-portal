import React from "react"
import Navbar from "./Navbar"
import { useAuthStore } from "@/lib/zustand.config"
import { Loader } from "./utils"
import { db } from '@/lib/firebase.config';
import { collection, query, getDocs, doc as firestoreDoc, getDoc, where } from "firebase/firestore";


const Layout = ({ children }) => {
  const { user, loading } = useAuthStore()
  const [isLoading, setIsLoading] = React.useState(true)
  function handleredirect() {
    router.push("/login")
  }
  React.useEffect(() => {
    if (loading) {
      setIsLoading(true)
    } else {
      async function setId() {
        const querySnap = await getDocs(query(collection(db, 'users'), where('email', '==', user.email)));
        const hospitalId = querySnap.docs[0].id;
        // save to localestorage
        localStorage.setItem('hId', hospitalId); 
        console.log(hospitalId);
      }
      user && setId()
      setIsLoading(false)
    }
  }, [loading])
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Navbar />
          <main>{children}</main>
        </>
      )}
    </>
  )
}
export default Layout
