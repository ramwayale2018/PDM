import React, { useState, ReactNode, useEffect  } from 'react';
import Header from '../components/Header/index';
import AdminSidebar from '../components/Sidebar/AdminSidebar';
import PMsidebar from '../components/Sidebar/PMsidebar';
import TLsidebar from '../components/Sidebar/TLsidebar';
import UserSidebar from '../components/Sidebar/UserSidebar';
import LaserSidebar from '../components/Sidebar/LaserSidebar';
import ViewerSidebar from '../components/Sidebar/ViewerSidebar';
import axios from 'axios';
import { BASE_URL } from '../../public/config.js';
import SalesSidebar from '../components/Sidebar/SalesSidebar';


const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);


    // Fetch user role from the backend
    useEffect(() => {
      const fetchUserRole = async () => {
        try {
          const response = await axios.get(BASE_URL + 'auth/get-role', { withCredentials: true });
          setUserRole(response.data.role); 
        } catch (error) {
          console.error('Error fetching role:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUserRole();
    }, []);


  if (loading) {
    return <div>Loading...</div>;
  }

  let SidebarComponent;
  switch (userRole) {
    case 'admin':
      SidebarComponent = AdminSidebar;
      break;
    case 'project manager':
      SidebarComponent = PMsidebar;
      break;
    case 'sales':
      SidebarComponent = SalesSidebar;
      break;
    case 'team lead':
      SidebarComponent = TLsidebar;
      break;
    case 'designer':
      SidebarComponent = UserSidebar;
      break;
    case 'laser designer':
      SidebarComponent = LaserSidebar;
      break;
    case 'viewer':
      SidebarComponent = ViewerSidebar;
      break;
    default:
      SidebarComponent = UserSidebar; 
      break;
  }


  return (

    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar: Dynamically render the sidebar based on the role */}
        {SidebarComponent && <SidebarComponent sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
        
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>

    
  );
};

export default DefaultLayout;




