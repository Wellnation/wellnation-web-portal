import * as React from 'react';
import { useRouter } from 'next/router'
import Image from 'next/image';

function Loader() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Image
        src="/web-loader.gif"
        alt="Loader"
        width={100}
        height={100}
      />
    </div>
  );
}

function NotUser() {
  const router = useRouter()
  function handleredirect() {
    router.push("/login")
  }
  return (
    <>
      {handleredirect()}
    </>
  );
}

export { Loader, NotUser }