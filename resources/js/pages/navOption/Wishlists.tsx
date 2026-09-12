import Navbar from '@/components/myProduct/Navbar'
import React from 'react'

function Wishlists({auth}:{auth?: any}) {
  return (
    <div>
        <Navbar auth={auth} />
    </div>
  )
}

export default Wishlists
