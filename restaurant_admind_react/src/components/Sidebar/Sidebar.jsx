import React, { useState,useEffect } from "react";
import styles from './Sidebar.module.css'
import logoimg from '/src/assets/logoimg.jpg'
import category from '/src/assets/category.png'
import { NavLink,useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation(); 

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, [location]);

  return (
    <div>
      <button className={styles.sidebar_button_responsive}onClick={toggleSidebar}> ☰ </button>

      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""}`}>
        <div className={styles.sidebar_content}>
          <div className={styles.main_sidebar}>
            <img src={logoimg} alt="" />
            <span>food</span>
          </div>
          <div className={styles.item_sidebar}>
            <NavLink to="/Categories" onClick={()=>setIsSidebarOpen(false)} className={({ isActive }) => isActive 
             ? `${styles.item_sidebar} ${styles.active_link}`
             : styles.item_sidebar }>
              <img src={category} alt="" />
              <span>Categories</span>
            </NavLink>
          </div>
          <div className={styles.item_sidebar}>
            <NavLink  to="/Foods" onClick={()=>setIsSidebarOpen(false)} className={({ isActive }) => isActive
                  ? `${styles.item_sidebar} ${styles.active_link}`
                  : styles.item_sidebar}>
              <img src={category} alt="" />
              <span>Foods</span>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar