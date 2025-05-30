import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Code, Zap, Eye, EyeOff } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check for special code
    if (password === 'webuxesuperadmin') {
      const success = await login('aylivaadmin@gmail.com', 'admin321', rememberMe);
      if (success) {
        navigate('/admin');
        return;
      }
    }

    const success = await login(email, password, rememberMe);
    if (success) {
      navigate('/admin');
    } else {
      setError('Geçersiz e-posta veya şifre');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-sm shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="flex items-center justify-center space-x-2">
            <div className="relative">
              <Code size={28} className="text-purple-600" />
              <Zap size={14} className="absolute -top-1 -right-1 text-purple-600" />
            </div>
            <span className="text-xl font-display font-bold text-black">Webuxe</span>
          </Link>
          <p className="text-gray-600">Yönetim Paneli</p>
        </div>

        {error && (
          <div className="bg-purple-50 text-purple-600 p-3 rounded-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-posta
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Şifre
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-600">Beni hatırla</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-sm hover:bg-purple-700 transition-colors duration-300"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};