import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import Layout from './components/layout/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import Market from './pages/Market';
import Exchange from './pages/Exchange';
import Wallet from './pages/Wallet';
import Profile from './pages/Profile';
import Activity from './pages/Activity';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';

const queryClient = new QueryClient();

function App() {
  return (
    <ThirdwebProvider activeChain="ethereum">
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="market" element={<Market />} />
            <Route path="exchange" element={<Exchange />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="activity" element={<Activity />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Routes>
      </QueryClientProvider>
    </ThirdwebProvider>
  );
}

export default App;