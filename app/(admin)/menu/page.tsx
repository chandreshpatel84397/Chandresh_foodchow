"use client"

import { useEffect,useState } from "react"
import toast from "react-hot-toast"

export default function Page(){

const shop_id = 1

const [mounted,setMounted] = useState(false)

const [mode,setMode] = useState<"single"|"dual">("single")

const [edit,setEdit] = useState(false)

const [form,setForm] = useState({
 shop_id:shop_id,
 primary_language:"English",
 secondary_language:"",
 display_menu:3,
 menuDirection:1,
 type_of_menu:1
})

useEffect(()=>{

 setMounted(true)

 loadData()

},[])

const loadData = async()=>{

 try{

  const res = await fetch(
   `https://localhost:44376/api/MenuLanguage/get/${shop_id}`
  )

  if(res.status===204){

   setEdit(true)
   return

  }

  const data = await res.json()

  if(data){

   const updatedForm = {

    shop_id:data.shop_id,

    primary_language:data.primary_language ?? "English",

    secondary_language:data.secondary_language ?? "",

    display_menu:data.display_menu ?? 1,

    menuDirection:data.menuDirection ?? 1,

    type_of_menu:data.type_of_menu ?? 1

   }

   setForm(updatedForm)

   // only change mode if actually different
   setMode(prev => {

    if(updatedForm.type_of_menu === 2 && prev !== "dual"){
     return "dual"
    }

    if(updatedForm.type_of_menu !== 2 && prev !== "single"){
     return "single"
    }

    return prev

   })

   setEdit(false)

  }

 }
 catch{

  setEdit(true)

 }

}

const saveData = async()=>{

 try{

  const res = await fetch(

   "https://localhost:44376/api/MenuLanguage/update",

   {

    method:"POST",

    headers:{

     "Content-Type":"application/json"

    },

    body:JSON.stringify(form)

   }

  )

  if(res.ok){

   toast.success("Menu language saved successfully")

   // do not call loadData again to prevent flicker
   setEdit(false)

  }
  else{

   toast.error("Save failed")

  }

 }
 catch{

  toast.error("Server error")

 }

}

if(typeof window === "undefined") return null
if(!mounted) return null

return(

<div className="wrapper">

<div className="card">

<div className="header">

<div className="title">
Menu Language
</div>

<button className="help-btn">
HELP
</button>

</div>

{/* DISPLAY MODE */}

{!edit && mode==="single" && (

<>

<div className="section-title">
Single Menu Language
</div>

<div className="display-row">

<div className="display-box">

<div className="label">Primary Language</div>

<div className="value">
{form.primary_language}
</div>

</div>

<div className="display-box">

<div className="label">Menu Direction</div>

<div className="value">

{form.menuDirection==1?"Right To Left":"Left To Right"}

</div>

</div>

</div>

<button
 className="save-btn"
 onClick={()=>setEdit(true)}
>
EDIT
</button>

</>

)}

{!edit && mode==="dual" && (

<>

<div className="section-title">
Dual Menu Language
</div>

<div className="display-grid">

<div className="display-box">

<div className="label">Primary Language</div>

<div className="value">
{form.primary_language}
</div>

</div>

<div className="display-box">

<div className="label">Secondary Language</div>

<div className="value">
{form.secondary_language}
</div>

</div>

<div className="display-box">

<div className="label">Display Menu</div>

<div className="value">

{form.display_menu==1 && "Primary Language Only"}
{form.display_menu==2 && "Secondary Language Only"}
{form.display_menu==3 && "Display Both Language"}

</div>

</div>

<div className="display-box">

<div className="label">Menu Direction</div>

<div className="value">

{form.menuDirection==1?"Right To Left":"Left To Right"}

</div>

</div>

</div>

<button
 className="save-btn"
 onClick={()=>setEdit(true)}
>
EDIT
</button>

</>

)}

{/* EDIT MODE */}

{edit && (

<>

<div className="tab-row">

<button

 className={mode==="single"?"tab-active":"tab"}

 onClick={()=>{

  setMode("single")

  setForm({
   ...form,
   type_of_menu:1
  })

 }}

>
Single Language
</button>

<button

 className={mode==="dual"?"tab-active":"tab"}

 onClick={()=>{

  setMode("dual")

  setForm({
   ...form,
   type_of_menu:2
  })

 }}

>
Dual Language
</button>

</div>

{/* SINGLE EDIT */}

{mode==="single" && (

<>

<div className="form-group">

<label className="label">
Menu Language
</label>

<select
 className="select"
 value={form.primary_language}
 onChange={e=>setForm({
  ...form,
  primary_language:e.target.value
 })}
>

<option>English</option>
<option>French</option>
<option>Thai</option>

</select>

</div>

<div className="form-group">

<label className="label">
Menu Direction
</label>

<div className="radio-row">

<label>
<input
 type="radio"
 checked={form.menuDirection==1}
 onChange={()=>setForm({...form,menuDirection:1})}
/>
 Right to Left
</label>

<label>
<input
 type="radio"
 checked={form.menuDirection==2}
 onChange={()=>setForm({...form,menuDirection:2})}
/>
 Left to Right
</label>

</div>

</div>

</>

)}

{/* DUAL EDIT */}

{mode==="dual" && (

<>

<div className="row">

<div className="form-group">

<label className="label">
Primary Language
</label>

<input
 className="input"
 value={form.primary_language}
 disabled
/>

</div>

<div className="form-group">

<label className="label">
Secondary Language
</label>

<select
 className="select"
 value={form.secondary_language}
 onChange={e=>setForm({
  ...form,
  secondary_language:e.target.value
 })}
>

<option>English</option>
<option>French</option>
<option>Thai</option>

</select>

</div>

</div>

<div className="row">

<div className="form-group">

<label className="label">
Display Menu
</label>

<div className="radio-column">

<label>
<input
 type="radio"
 checked={form.display_menu==1}
 onChange={()=>setForm({...form,display_menu:1})}
/>
 Primary Language Only
</label>

<label>
<input
 type="radio"
 checked={form.display_menu==2}
 onChange={()=>setForm({...form,display_menu:2})}
/>
 Secondary Language Only
</label>

<label>
<input
 type="radio"
 checked={form.display_menu==3}
 onChange={()=>setForm({...form,display_menu:3})}
/>
 Both(Primary Language and Secondary Language)
</label>

</div>

</div>

<div className="form-group">

<label className="label">
Menu Direction
</label>

<div className="radio-column">

<label>
<input
 type="radio"
 checked={form.menuDirection==1}
 onChange={()=>setForm({...form,menuDirection:1})}
/>
 Right to Left
</label>

<label>
<input
 type="radio"
 checked={form.menuDirection==2}
 onChange={()=>setForm({...form,menuDirection:2})}
/>
 Left to Right
</label>

</div>

</div>

</div>

</>

)}

<div className="bottom-row">

<button
 className="save-btn"
 onClick={saveData}
>
SAVE
</button>

<button
 className="cancel-btn"
 onClick={()=>setEdit(false)}
>
CANCEL
</button>

</div>

</>

)}

</div>

</div>

)

}