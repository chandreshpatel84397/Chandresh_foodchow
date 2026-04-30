"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";


export default function CategoryMapper() {

  const [categories,setCategories] = useState<any[]>([]);
  const [sections,setSections] = useState<any[]>([]);
  const [sectionCategories,setSectionCategories] = useState<any>({});
  const [search,setSearch] = useState(""); // ✅ search
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);
  useEffect(()=>{
    loadCategories();
    loadSections();
  },[]);

  async function loadCategories(){
    const res = await fetch(`https://localhost:44376/api/CategoryMapper/categories`);
        

    const data = await res.json();
    setCategories(data);
  }

  async function loadSections(){
     const res = await fetch(`https://localhost:44376/api/CategoryMapper/sections`);

    
    const data = await res.json();
    setSections(data);

    data.forEach((s:any)=>{
      loadSectionCategories(s.section_id);
    });
  }

  async function loadSectionCategories(sectionId:number){
    const res = await fetch(`https://localhost:44376/api/CategoryMapper/sectioncategories/${sectionId}`);
    const data = await res.json();

    setSectionCategories((prev:any)=>({
      ...prev,
      [sectionId]:data
    }));
  }

  function dragStart(e:any,category:any){
    e.dataTransfer.setData("categoryId",category.id);
  }

  function allowDrop(e:any){
    e.preventDefault();
  }

  async function dropCategory(e:any,sectionId:number){
    e.preventDefault();

    const categoryId = e.dataTransfer.getData("categoryId");

    if(sectionCategories[sectionId]?.some((c:any)=>c.cate_id == categoryId)){
      Swal.fire({
        icon:"warning",
        title:"Already Added",
        text:"Category already exists in this section"
      });
      return;
    }

    await fetch(`https://localhost:44376/api/CategoryMapper/mapcategory`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        sectionId: sectionId,
        categoryId: Number(categoryId),
         
      })
    });

    Swal.fire({
      icon:"success",
      title:"Added",
      timer:1000,
      showConfirmButton:false
    });

    loadSectionCategories(sectionId);
  }

  async function addSection(){
    await fetch(`https://localhost:44376/api/CategoryMapper/addsection`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        sectionName:"NEW SECTION",
        
      })
    });

    Swal.fire({
      icon:"success",
      title:"Section Added"
    });

    loadSections();
  }

  async function deleteCategory(sectionId:number,categoryId:number){

    await fetch(`https://localhost:44376/api/CategoryMapper/deletecategory/${sectionId}/${categoryId}`,{
      method:"DELETE"
    });

    loadSectionCategories(sectionId);
  }

  async function editSection(sectionId:number,oldName:string){

    const { value:newName } = await Swal.fire({
      title:"Edit Section Name",
      input:"text",
      inputValue:oldName,
      showCancelButton:true
    });

    if(!newName) return;

    await fetch(`https://localhost:44376/api/CategoryMapper/updatesection`,{
      method:"PUT",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        sectionId:sectionId,
        sectionName:newName
      })
    });

    loadSections();
  }

  async function deleteSection(sectionId:number){

    const result = await Swal.fire({
      title: "Delete Section?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete"
    });

    if(result.isConfirmed){

      await fetch(`https://localhost:44376/api/CategoryMapper/deletesection/${sectionId}`,{
        method:"DELETE"
      });

      Swal.fire("Deleted!", "", "success");

      loadSections();
    }
  }

  return (
  <>
    <div className={styles.pageWrapper}>
      <div className={styles.container}>

      {/* LEFT SIDE */}
      <div className={styles.leftPanel}>

        <div className={styles.searchHeader}>
          <h3>Categories List</h3>

          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              className={styles.searchInput}
            />
            <button className={styles.searchBtn}>🔍</button>
          </div>
        </div>

        {categories
          .filter((c:any)=>
            c.cate_name.toLowerCase().includes(search.toLowerCase())
          )
          .map((c:any)=>(

          <div
            key={c.id}
            draggable
            onDragStart={(e)=>dragStart(e,c)}
            className={styles.categoryItem}
          >
            <span className={styles.dragIcon}>☰</span> {c.cate_name}
          </div>
        ))}

      </div>


      {/* RIGHT SIDE */}
      <div className={styles.rightPanel}>

        <div className={styles.topActions}>
  <button
    className={styles.addSectionBtn}
    onClick={addSection}
  >
    Add Section
  </button>

  <button
    className={styles.helpBtn}
    onClick={() => setShowHelp(true)}
  >
    ❤️ HELP
  </button>
</div>

        {sections.map((section:any)=>(

          <div
            key={section.section_id}
            className={styles.sectionBox}
          >

            <div className={styles.sectionHeader}>

              <span>{section.section_name}</span>

              <div className={styles.sectionActions}>

                <button
                  className={styles.editBtn}
                  onClick={()=>editSection(section.section_id,section.section_name)}
                >
                  Edit
                </button>

                <button
                  className={styles.deleteSectionBtn}
                  onClick={()=>deleteSection(section.section_id)}
                >
                  🗑
                </button>

              </div>

            </div>

            <div
              className={styles.dropArea}
              onDragOver={allowDrop}
              onDrop={(e)=>dropCategory(e,section.section_id)}
            >

              {Array.from(
  new Map(
    (sectionCategories[section.section_id] || [])
      .filter((c:any) => c && c.cate_id && c.cate_name)  // ✅ ADD THIS
      .map((c:any)=>[c.cate_id,c])
  ).values()
).map((cat:any,index:number)=>(

                <div
                  key={cat.cate_id + "-" + index}
                  className={styles.mappedCategory}
                >
                  <span>{cat.cate_name}</span>

                  <button
                    className={styles.deleteBtn}
                    onClick={()=>deleteCategory(section.section_id,cat.cate_id)}
                  >
                    🗑
                  </button>
                </div>

              ))}

              {(sectionCategories[section.section_id] || [])
  .filter((c:any) => c && c.cate_id && c.cate_name).length === 0 && (
  <p>Drag Items Here</p>
)}

            </div>

          </div>

        ))}

      </div>

    </div>

    {/* ✅ MOVE HERE (OUTSIDE CONTAINER) */}
    
{showHelp && (
  <div className={styles.modalOverlay}>
    <div className={styles.modal}>
      <button
        className={styles.closeBtn}
        onClick={() => setShowHelp(false)}
      >
        Close
      </button>

      <iframe
        src="https://player.vimeo.com/video/1075945448"
        width="100%"
        height="400"
        frameBorder="0"
        allow="autoplay; fullscreen"
        allowFullScreen
      ></iframe>
    </div>
  </div>
)}
<div className={styles.bottomNav}>
  <button
    className={styles.prevBtn}
    onClick={() => router.push("/additional_menu/display")}
  >
    PREVIOUS
  </button>

  <button
    className={styles.nextBtn}
    onClick={() => router.push("")}
  >
    NEXT
  </button>
</div>
</div>
  </>
);
}