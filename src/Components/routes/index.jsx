// import { Login } from "@mui/icons-material";
import Login from "../Login/Login";
import Register from "../Register/Register";
import Dashboard from "../Dashboard/Dashboard"
// import ProtectedRoute from "../ProtectedRoutes/ProtectedRoute";

export const routes =[
    {
        path:"/",
        element:<Register/>
    },
    {
        path:"/SignUp",
        element:<Register/>
    },
    {
        path:"/Login",
        element:<Login/>
    },
    {
        path: "/dashboard",
        element: <Dashboard />,
      }
]