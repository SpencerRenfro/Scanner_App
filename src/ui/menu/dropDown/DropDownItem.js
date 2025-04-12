import { useState } from "react"

export default function DropDownItem({item}) {

    const [open, setOpen] = useState(false);

    if(item.children) {
        return (
            <div className={open ? "sidebar-item open" : "sidebar-item"}>
            <div className="sidebar-title">
                <span>
                    { item.icon && <i className={item.icon}></i> }
                    {item.title}    
                </span> 
                <i className="bi-chevron-down toggle-btn" onClick={() => setOpen(!open)}></i>
            </div>
            <div className="sidebar-content">
                { item.childrens.map((child, index) => <DropDownItem key={index} item={child} />) }
            </div>
        </div>
        )
    }
  return (
    <div>
        <div className="gap-2">
           {/* {item.icon && <i className={item.icon}></i>} */}
           {item.label}
        </div>
    </div>
  )
}
