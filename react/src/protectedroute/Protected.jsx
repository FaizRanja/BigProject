// ProtectedRoute.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { loadUserFromCookies } from 'store/reducers/User';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.authReducier);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserFromCookies());
  }, [dispatch]);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
