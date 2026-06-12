import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../guards/ProtectedRoute';
import { PrivateAppPage } from '../pages/PrivateAppPage';

export const PrivateRoutes = (
  <Route
    path="/app/*"
    element={
      <ProtectedRoute>
        <PrivateAppPage />
      </ProtectedRoute>
    }
  />
);
export default PrivateRoutes;
