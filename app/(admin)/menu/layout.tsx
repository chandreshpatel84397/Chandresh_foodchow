"use client"

import './page.css'
import { Toaster } from "react-hot-toast"

export default function MenuLayout({
 children,
}:{
 children:React.ReactNode
}){

 return(

  <>

   {children}

   <Toaster
    position="top-right"
    toastOptions={{
     style:{
      background:"#1aa39a",
      color:"#fff",
      fontSize:"14px",
      borderRadius:"8px",
      padding:"12px 16px"
     }
    }}
   />

  </>

 )

}