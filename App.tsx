import React, { useEffect, useState } from 'react';
import {
  Route,
  Routes,
  useLocation,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import axios from 'axios';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import ECommerce from './pages/Dashboard/ECommerce';
import DefaultLayout from './layout/DefaultLayout';
import ProjectForm from './pages/Project/Create_project';
import ShowProject from './pages/Project/Project_list';
import Add_vendor from './pages/Vendor/Add_vendor';
import Vendor_list from './pages/Vendor/Vendor_list';
import Add_user from './pages/User/Add_user';
import User_list from './pages/User/User_list';
import TaskForm from './pages/Task/Create_task';
// import View_task from './pages/Task/View_task';
import Task_list from './pages/Task/Task_list';
import Pending_task from './pages/Task/Pending_task';
import Inprogress_task from './pages/Task/Inprogress_task';
import Onhold_task from './pages/Task/Onhold_task';
import Completed_task from './pages/Task/Completed_task';
import UnderReview_task from './pages/Task/UnderReview_task';
import MyBucket from './pages/Task/MyBucket';
import PmMyBucket from './pages/Task/PmMyBucket';
import ProductFilesPage  from './pages/Task/ProductFilesPage';
import LaserDesignsPage  from './pages/Task/LaserDesignsPage';
import All_design_files  from './pages/Task/All_design_files';
import Latest_design_files  from './pages/Task/Latest_design_files';
import ProductDocuments from './pages/Task/ProductDocuments';
import PdfDocuments from './pages/Task/PdfDocuments';
import AddPath from './components/AddLocationPath/AddPath';
import AddDfxPath from './components/AddLocationPath/AddDfxPath';
import AddLibraryPath from './components/AddLocationPath/AddLibraryPath';
import ChangePassword from './pages/User/ChangePassword';
import LibraryFiles from './pages/LibraryFiles/LibraryFiles';
import Parts from './pages/DFX/Parts';
import Parts_Viewer from './pages/Viewer/Parts_Viewer';
import DfxFiles from './pages/DFX/DfxFiles';
import PartTypePage from './pages/PartType/PartTypePage';
import EcnForm from './pages/ECN/EcnForm';
import { BASE_URL } from '../public/config.js';
import ViewEcnForm from './pages/ECN/ViewEcnForm';
import EcnPartsList from './pages/ECN/EcnPartsList';
import RequestedEcnList from './pages/ECN/RequestedEcnList';
import ApprovedEcnList from './pages/ECN/ApprovedEcnList';
import RejectedEcnList from './pages/ECN/RejectedEcnList';
import AddOldDfxPath from './components/AddLocationPath/AddOldDfxPath';
import PdfViewer from './PdfViewer';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>('');
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Scroll to the top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Simulate loading effect
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Check session-based authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(BASE_URL + 'auth/check-session', {
          withCredentials: true,
        });
        if (response.data.isAuthenticated) {
          setIsAuthenticated(true);
          setUserRole(response.data.role);
        } else {
          setIsAuthenticated(false);
          navigate('/signin');
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setIsAuthenticated(false);
        navigate('/signin');
      }
    };

    checkAuth();
  }, [navigate]);

  // Handle login
  const handleLogin = (auth: boolean, role: string) => {
    setIsAuthenticated(auth);
    setUserRole(role);
    if (auth) {
      navigate('/dashboard');
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <Routes>
      <Route path="/signin" element={<SignIn handleLogin={handleLogin} />} />
      {isAuthenticated ? (
        <>
          <Route
            path="/dashboard"
            element={
              <DefaultLayout>
                <PageTitle title="Dashboard" />
                <ECommerce />
              </DefaultLayout>
            }
          />

          <Route
            path="/path/addpath"
            element={
              <DefaultLayout>
                <PageTitle title="Add Project Path" />
                <AddPath />
              </DefaultLayout>
            }
          />

          <Route
            path="/path/add_dfx_path"
            element={
              <DefaultLayout>
                <PageTitle title="Add DFX Path" />
                <AddDfxPath />
              </DefaultLayout>
            }
          />

          <Route
            path="/path/add_library_path"
            element={
              <DefaultLayout>
                <PageTitle title="Add Library Path" />
                <AddLibraryPath />
              </DefaultLayout>
            }
          />

          <Route
            path="/path/add_old_dfx_path"
            element={
              <DefaultLayout>
                <PageTitle title="Add Old DFX Path" />
                <AddOldDfxPath />
              </DefaultLayout>
            }
          />

          <Route
            path="/project/create-project"
            element={
              <DefaultLayout>
                <PageTitle title="Create Project" />
                <ProjectForm />
              </DefaultLayout>
            }
          />

          <Route
            path="/project/project-list"
            element={
              <DefaultLayout>
                <PageTitle title="Project List" />
                <ShowProject />
              </DefaultLayout>
            }
          />
          <Route
            path="/user/add-user"
            element={
              <DefaultLayout>
                <PageTitle title="Add user" />
                <Add_user />
              </DefaultLayout>
            }
          />
          <Route
            path="/user/user-list"
            element={
              <DefaultLayout>
                <PageTitle title="User List" />
                <User_list />
              </DefaultLayout>
            }
          />
          <Route
            path="/vendor/add-vendor"
            element={
              <DefaultLayout>
                <PageTitle title="Add Client" />
                <Add_vendor />
              </DefaultLayout>
            }
          />
          <Route
            path="/vendor/vendor-list"
            element={
              <DefaultLayout>
                <PageTitle title="Client List" />
                <Vendor_list />
              </DefaultLayout>
            }
          />
          <Route
            path="/task/create-task"
            element={
              <DefaultLayout>
                <PageTitle title="Create Parts" />
                <TaskForm />
              </DefaultLayout>
            }
          />
          <Route
            path="/task/task-list"
            element={
              <DefaultLayout>
                <PageTitle title="View Parts" />
                <Task_list />
              </DefaultLayout>
            }
          />
          <Route
            path="/product/:productId/files"
            element={
              <DefaultLayout>
                <PageTitle title="Design Files" />
                <ProductFilesPage />
              </DefaultLayout>
            }
          />
          <Route
            path="/product/:productId/laser-designs"
            element={
              <DefaultLayout>
                <PageTitle title="Laser Design Files" />
                <LaserDesignsPage />
              </DefaultLayout>
            }
          />
          <Route
            path="/files/all-design-files"
            element={
              <DefaultLayout>
                <PageTitle title="All Design Files" />
                <All_design_files />
              </DefaultLayout>
            }
          />
          <Route
            path="/files/latest-design-files"
            element={
              <DefaultLayout>
                <PageTitle title="Latest Design Files" />
                <Latest_design_files />
              </DefaultLayout>
            }
          />
          <Route
            path="/part/pending-task"
            element={
              <DefaultLayout>
                <PageTitle title="Pending Parts" />
                <Pending_task />
              </DefaultLayout>
            }
          />
          <Route
            path="/part/inProgress-task"
            element={
              <DefaultLayout>
                <PageTitle title="InProgress Parts" />
                <Inprogress_task />
              </DefaultLayout>
            }
          />
          <Route
            path="/part/onHold-task"
            element={
              <DefaultLayout>
                <PageTitle title="On Hold Parts" />
                <Onhold_task />
              </DefaultLayout>
            }
          />
          <Route
            path="/part/completed-task"
            element={
              <DefaultLayout>
                <PageTitle title="Completed Parts" />
                <Completed_task />
              </DefaultLayout>
            }
          />
          <Route
            path="/part/underReview-task"
            element={
              <DefaultLayout>
                <PageTitle title="Under Review Parts" />
                <UnderReview_task />
              </DefaultLayout>
            }
          />

          <Route
            path="myBucket/bucket-list"
            element={
              <DefaultLayout>
                <PageTitle title="My Bucket" />
                <MyBucket />
              </DefaultLayout>
            }
          />

          <Route
            path="myBucket/ur-bucket-list"
            element={
              <DefaultLayout>
                <PageTitle title="My Bucket" />
                <PmMyBucket />
              </DefaultLayout>
            }
          />

          <Route
            path="/library-files"
            element={
              <DefaultLayout>
                <PageTitle title="Library Files" />
                <LibraryFiles />
              </DefaultLayout>
            }
          />

          <Route
            path="/ecn-form"
            element={
              <DefaultLayout>
                <PageTitle title="ECN Form" />
                <EcnForm />
              </DefaultLayout>
            }
          />
          <Route
            path="/view-ecn-form"
            element={
              <DefaultLayout>
                <PageTitle title="View ECN Form" />
                <ViewEcnForm />
              </DefaultLayout>
            }
          />
          <Route
            path="/ecnPart"
            element={
              <DefaultLayout>
                <PageTitle title="ECN PARTS" />
                <EcnPartsList />
              </DefaultLayout>
            }
          />
          <Route
            path="/requestedEcn"
            element={
              <DefaultLayout>
                <PageTitle title="Requested ECN PARTS" />
                <RequestedEcnList />
              </DefaultLayout>
            }
          />
          <Route
            path="/approvedEcn"
            element={
              <DefaultLayout>
                <PageTitle title="Approved ECN PARTS" />
                <ApprovedEcnList />
              </DefaultLayout>
            }
          />
          <Route
            path="/rejectedEcn"
            element={
              <DefaultLayout>
                <PageTitle title="Rejected ECN PARTS" />
                <RejectedEcnList />
              </DefaultLayout>
            }
          />

          <Route
            path="/parts"
            element={
              <DefaultLayout>
                <PageTitle title="Parts" />
                <Parts />
              </DefaultLayout>
            }
          />

          <Route
            path="/parts_viewer"
            element={
              <DefaultLayout>
                <PageTitle title="Parts" />
                <Parts_Viewer />
              </DefaultLayout>
            }
          />
          <Route
            path="/dfx-files/:productId"
            element={
              <DefaultLayout>
                <PageTitle title="DFX Files" />
                <DfxFiles />
              </DefaultLayout>
            }
          />
          <Route
            path="/part-type"
            element={
              <DefaultLayout>
                <PageTitle title="Part Type" />
                <PartTypePage />
              </DefaultLayout>
            }
          />
          <Route
            path="/products/:productId/documents"
            element={
              <DefaultLayout>
                <PageTitle title="Documents" />
                <ProductDocuments />
              </DefaultLayout>
            }
          />

          <Route
            path="/products/:productId/pdf-documents"
            element={
              <DefaultLayout>
                <PageTitle title="Documents" />
                <PdfDocuments />
              </DefaultLayout>
            }
          />

<Route
  path="/pdf-viewer/:pdId"
  element={
    <DefaultLayout>
      <PageTitle title="PDF Viewer" />
      <PdfViewer />
    </DefaultLayout>
  }
/>

          {/* Part list  */}
          <Route
            path="part/part-list"
            element={
              <>
                <PageTitle title="PDM" />
                <Task_list />
              </>
            }
          />

          <Route
            path="/change-password"
            element={
              <>
                <PageTitle title="PDM" />
                <ChangePassword />
              </>
            }
          />

          {/* <Route
            path="/task/view-task"
            element={
              <DefaultLayout>
                <PageTitle title="View Task" />
              </DefaultLayout>
            }
          /> */}
        </>
      ) : (
        <Route path="/signin" element={<Navigate to="/signin" />} />
      )}
    </Routes>
    
  );
}

export default App;
