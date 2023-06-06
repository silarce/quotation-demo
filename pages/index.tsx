import { useEffect } from 'react'


import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import styles from '../styles/index.module.scss'

// import Home from './home'


const Home: NextPage = () => {
  const router = useRouter()


  useEffect(() => {
    router.push("/home/dailyReport?isMine=true")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
    </>
  )
}

export default Home
