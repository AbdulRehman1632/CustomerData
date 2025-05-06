import { Routes, Route } from 'react-router-dom';
import { routes } from './Components/routes';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './Components/ProtectedRoutes/ProtectedRoute';

const App = () => {
  return (
    <>
      <Routes>
        {routes.map((items, index) => {
          const isDashboard = items?.path === '/Dashboard'; 

          return (
            <Route
              key={index}
              path={items.path}
              element={
                isDashboard ? (
                  <ProtectedRoute>{items.element}</ProtectedRoute>
                ) : (
                  items.element
                )
              }
            />
          );
        })}
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;
