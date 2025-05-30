import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalLayout } from './components/layout/GlobalLayout';
import { ScrollToTop } from './components/ScrollToTop';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Works } from './pages/Works';
import { Gallery } from './pages/Gallery';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { Contact } from './pages/Contact';
import { Appointment } from './pages/Appointment';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminAppointments } from './pages/admin/AdminAppointments';
import { AdminBlog } from './pages/admin/AdminBlog';
import { AdminGallery } from './pages/admin/AdminGallery';
import { AdminServices } from './pages/admin/AdminServices';
import { AdminWorks } from './pages/admin/AdminWorks';
import { AdminContact } from './pages/admin/AdminContact';
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminRoute } from './components/auth/AdminRoute';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<GlobalLayout><Home /></GlobalLayout>} />
        <Route path="/about" element={<GlobalLayout><About /></GlobalLayout>} />
        <Route path="/services" element={<GlobalLayout><Works /></GlobalLayout>} />
        <Route path="/gallery" element={<GlobalLayout><Gallery /></GlobalLayout>} />
        <Route path="/blog" element={<GlobalLayout><Blog /></GlobalLayout>} />
        <Route path="/blog/:id" element={<GlobalLayout><BlogPost /></GlobalLayout>} />
        <Route path="/contact" element={<GlobalLayout><Contact /></GlobalLayout>} />
        <Route path="/appointment" element={<GlobalLayout><Appointment /></GlobalLayout>} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
        <Route path="/admin/appointments" element={<AdminRoute><AdminLayout><AdminAppointments /></AdminLayout></AdminRoute>} />
        <Route path="/admin/blog" element={<AdminRoute><AdminLayout><AdminBlog /></AdminLayout></AdminRoute>} />
        <Route path="/admin/gallery" element={<AdminRoute><AdminLayout><AdminGallery /></AdminLayout></AdminRoute>} />
        <Route path="/admin/services" element={<AdminRoute><AdminLayout><AdminServices /></AdminLayout></AdminRoute>} />
        <Route path="/admin/works" element={<AdminRoute><AdminLayout><AdminWorks /></AdminLayout></AdminRoute>} />
        <Route path="/admin/contact" element={<AdminRoute><AdminLayout><AdminContact /></AdminLayout></AdminRoute>} />
      </Routes>
    </Router>
  );
}

export default App;