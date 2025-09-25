import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.password?.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors)?.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await login(formData?.email, formData?.password);

      if (result?.success) {
        // Navigation will be handled by the redirect effect above
        const { user } = result;

        // Role-based navigation
        if (user?.role === 'driver') {
          navigate('/smartwatch-view', { replace: true });
        } else if (user?.role === 'supervisor') {
          navigate('/supervisor-dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      } else {
        setErrors({ form: result?.error || 'Login failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ form: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoCredentials = (type) => {
    if (type === 'driver') {
      setFormData({
        email: 'dSamir@guardian.ae',
        password: '123456789'
      });
    } else if (type === 'supervisor') {
      setFormData({
        email: 'sAmna@guardian.ae',
        password: '123456789'
      });
    }
    setErrors({});
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center">

          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </motion.div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center p-4">
      {/* Optimized for iPhone screen sizes */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23334155%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-sm mx-auto">

        {/* iPhone-optimized Login Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 mx-4">
          {/* Header with AI Guardian branding */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">

              <Icon name="Shield" size={32} className="text-white" />
            </motion.div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to AI Guardian
            </h1>
            <p className="text-sm text-gray-600">
              Advanced AI-powered driver monitoring
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Form Error */}
            {errors?.form &&
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center space-x-3">

                <Icon name="AlertCircle" size={18} className="text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{errors?.form}</p>
              </motion.div>
            }

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData?.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className={`pl-10 text-sm ${errors?.email ? 'border-red-300 ring-red-500' : ''}`} />

                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon name="Mail" size={18} className="text-gray-400" />
                </div>
              </div>
              {errors?.email &&
              <p className="text-xs text-red-600 flex items-center space-x-1">
                  <Icon name="AlertCircle" size={14} />
                  <span>{errors?.email}</span>
                </p>
              }
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData?.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={`pl-10 pr-10 text-sm ${errors?.password ? 'border-red-300 ring-red-500' : ''}`} />

                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon name="Lock" size={18} className="text-gray-400" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center">

                  <Icon
                    name={showPassword ? "EyeOff" : "Eye"}
                    size={18}
                    className="text-gray-400 hover:text-gray-600" />

                </button>
              </div>
              {errors?.password &&
              <p className="text-xs text-red-600 flex items-center space-x-1">
                  <Icon name="AlertCircle" size={14} />
                  <span>{errors?.password}</span>
                </p>
              }
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 text-sm">

              {isSubmitting ?
              <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Signing In...</span>
                </div> :

              <div className="flex items-center justify-center space-x-2">
                  <Icon name="LogIn" size={18} />
                  <span>Sign In</span>
                </div>
              }
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">© 2025 AI Guardian. Advanced health monitoring for professional drivers.

            </p>
          </div>
        </div>

        {/* Security Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center space-x-2 mt-6 text-sm text-gray-300">

          <Icon name="Shield" size={16} className="text-green-400" />
          <span>Secure SSL Encrypted Connection</span>
        </motion.div>
      </motion.div>
    </div>);

};

export default Login;