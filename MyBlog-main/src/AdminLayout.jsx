import Sidebar from "./Components/admin/Sidebar";
import { Outlet } from "react-router-dom";
import Navbar from "./Components/admin/Navbar";

function Layout(){
    return (
        <div className="bg-gray-100">
            <Sidebar />
            <div className="relative min-h-screen ml-64 bg-gray-50">
        
                <div className="p-6">
                    <Navbar />
                    <div className="mt-10 ">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Layout