import { useState, useMemo } from "react"
import { useRouter } from "next/router"
import { NextRouter } from "next/router"




export default function Contract() {
  const router = useRouter()
  const isReady = router.isReady

  if (!isReady) return null

  return <TheContract router={router} />
}


function TheContract({ router }: { router: NextRouter }) {


  return (
    <div>
      contractId
      contractId
      contractId
      contractId
      contractId
    </div>
  )
}










