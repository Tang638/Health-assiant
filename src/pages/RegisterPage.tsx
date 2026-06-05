import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Eye, EyeOff, Heart, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const register = useStore((state) => state.register);
  const isLoading = useStore((state) => state.isLoading);
  const error = useStore((state) => state.error);
  const clearError = useStore((state) => state.clearError);
  
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return;
    }
    
    const success = await register(formData.username, formData.email, formData.password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      
      <div className="w-full max-w-md">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white hover:shadow-md rounded-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">智能健康助手</h1>
            <p className="text-gray-500">创建新账户</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">用户名</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="请输入用户名（至少3个字符）"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                  formData.username && formData.username.length < 3
                    ? 'border-red-200 focus:ring-red-500'
                    : 'border-gray-200 focus:ring-purple-500'
                }`}
              />
              {formData.username && formData.username.length < 3 && (
                <p className="text-red-500 text-sm mt-1">用户名至少需要3个字符</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="请输入邮箱"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">密码</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="请输入密码（至少6个字符）"
                  className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 ${
                    formData.password && formData.password.length < 6
                      ? 'border-red-200 focus:ring-red-500'
                      : 'border-gray-200 focus:ring-purple-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.password && formData.password.length < 6 && (
                <p className="text-red-500 text-sm mt-1">密码至少需要6个字符</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">确认密码</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="请再次输入密码"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                  formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword
                    ? 'border-red-200 focus:ring-red-500'
                    : 'border-gray-200 focus:ring-purple-500'
                }`}
              />
              {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">两次输入的密码不一致</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !formData.username || !formData.email || !formData.password || formData.password !== formData.confirmPassword}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '注册中...' : '注册'}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-4">
            已有账户？{' '}
            <button
              onClick={() => navigate('/')}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              立即登录
            </button>
          </p>
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          注册即表示您同意我们的服务条款和隐私政策
        </p>
      </div>
    </div>
  );
}
