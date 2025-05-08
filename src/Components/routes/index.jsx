import Login from "../Login/Login";
import Register from "../Register/Register";
import Dashboard from "../Dashboard/Dashboard"


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
        path: "/Dashboard",
        element: <Dashboard />,
      }
]