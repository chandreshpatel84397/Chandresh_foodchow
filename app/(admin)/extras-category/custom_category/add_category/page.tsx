"use client";   // runs for client side(browser)
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function page()
{

const [name,setname] = useState("");   //name=store name enter by user , setname=function to set or updatename
const [isActive, setIsActive] = useState<number>(1); // 1 = Active, 0 = Deactive
const router = useRouter();

  // runs asyncroniuosly when user submit form
  async function submitform(e:any) {
    
   e.preventDefault();
   const result1 = await Swal.fire({
       title: "Are you sure?",
       text: "You won't be able to undo this!",
       icon: "warning",
       showCancelButton: true,
       confirmButtonColor: "#0aa89e",
       cancelButtonColor: "#d33",
       confirmButtonText: "Yes, Insert it!"
     });
   
   //url: api url  / api / api name / api type("httppost["insert"]")
    const response = await fetch("https://localhost:44376/api/FoodItemCustomCategory/insert",
      {
        method : "POST",
        headers :{
          "Content-Type" : "application/json",
        },
        body : JSON.stringify({
          //convert js object to json
          
          //Send category name entered by user
        
        shop_id:1,  
        custom_cat_name: name,
        status: isActive ? 1 : 0        
      }),

     });

     
  if (!response.ok) {
  Swal.fire("Error!", "Insert failed.", "error");
    return;
  }

  const result = await response.text();
  
    //  alert("category added successfully");
     setname(""); //clear text after insert
     setIsActive(1); 
    router.push("/extras-category/custom_category/show_category"); // go back to list
 Swal.fire(
          "Inserted!",
          "Category has been Inserted.",
          "success"
        );
  }
  return(
    <div  className="card" style={{padding:30}}>
      <h2>Add new Extra Category</h2>
      <form onSubmit={submitform}>
        <div>
          <label className="label">
          Extra Category Name <span style={{ color: "red" }}>*</span>
        </label>
         <input type="text"  className="input" value={name}  onChange={(e)=>setname(e.target.value)}  required/> <br/><br/>

   <label className="label">Status</label>

        <div className="status-group">
          <label>
            <input
              type="radio"
              checked={isActive === 1}
              onChange={()=>setIsActive(1)}
            />{" "}
            Active
          </label>

          <label>
            <input
              type="radio"
              checked={isActive === 0}
              onChange={()=>setIsActive(0)}
            />{" "}
            Deactive
          </label>
        </div>
        {/* <input type="checkbox" checked={isActive} onChange={(e)=>setIsActive(e.target.checked)}/> <br/><br/> */}

          <div className="btn-group">
          <button type="submit" className="btn-add">
            ADD
          </button>

             <button
            type="button"
            className="btn-cancel"
            onClick={() => router.back()}
          >
            CANCEL
          </button>
</div>

        </div>   
      </form>

    </div>
  )

}
