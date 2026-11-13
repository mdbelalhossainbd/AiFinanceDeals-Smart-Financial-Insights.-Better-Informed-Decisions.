import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BrandLogo } from '../../components/common/BrandLogo';
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Tag,
  Scale,
  Mail,
  Megaphone,
  Network,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  PlusCircle,
  Image as ImageIcon,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, isLoading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white border border-[#E2E8F0] rounded-2xl p-8 text-center space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-[#0D1F3C] text-white mx-auto flex items-center justify-center animate-pulse">
            <Shield className="w-5 h-5 text-[#00B894]" />
          </div>
          <p className="text-xs font-medium text-[#6B7280]">Verifying editorial CMS session...</p>
        </div>
      </div>
    );
  }

  // If not logged in, prompt login
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-[#E2E8F0] rounded-2xl p-8 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#163A5F] text-white mx-auto flex items-center justify-center font-bold">
            <Shield className="w-6 h-6 text-[#00B894]" />
          </div>
          <h2 className="font-heading text-xl font-bold text-[#0D1F3C]">
            Admin Authentication Required
          </h2>
          <p className="text-xs text-[#6B7280]">
            Please sign in to your editorial account to access the AI Finance Deals publication management system.
          </p>
          <Link
            to="/admin/login"
            className="block w-full py-2.5 bg-[#0D1F3C] text-white rounded-lg text-xs font-semibold hover:bg-[#163A5F] transition-colors"
          >
            Go to Editor Login
          </Link>
        </div>
      </div>
    );
  }

  // Strictly enforce Administrator or Managing Editor role for /admin/*
  const isEditorialStaff = user.role === 'administrator' || user.role === 'editor';
  if (!isEditorialStaff) {
    return (
      <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-rose-200 rounded-2xl p-8 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-700 mx-auto flex items-center justify-center font-bold">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="font-heading text-xl font-bold text-[#0D1F3C]">
            Editorial Staff Role Required
          </h2>
          <p className="text-xs text-[#6B7280]">
            Your account ({user.email}) is not assigned an active Administrator or Managing Editor role in <code className="font-mono">public.admin_profiles</code>.
          </p>
          <div className="flex gap-2 justify-center pt-1">
            <Link
              to="/"
              className="px-4 py-2 border border-[#CBD5E1] text-[#303846] rounded-lg text-xs font-semibold hover:bg-[#F8FAFC]"
            >
              Return to Site
            </Link>
            <button
              onClick={async () => {
                await logout();
                navigate('/admin/login');
              }}
              className="px-4 py-2 bg-[#0D1F3C] text-white rounded-lg text-xs font-semibold hover:bg-[#163A5F] cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Articles & Guides', path: '/admin/articles', icon: FileText },
    { label: 'Featured Images', path: '/admin/featured-images', icon: ImageIcon },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Finance Deals', path: '/admin/deals', icon: Tag },
    { label: 'Comparisons', path: '/admin/comparisons', icon: Scale },
    { label: 'Newsletter', path: '/admin/newsletter', icon: Mail },
    { label: 'Google AdSense', path: '/admin/adsense', icon: Megaphone },
    { label: 'Integration Stack', path: '/admin/integrations', icon: Network },
    { label: 'Site Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#303846]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0D1F3C] text-white flex flex-col justify-between shrink-0 hidden md:flex border-r border-[#163A5F]">
        <div>
          {/* Brand Logo in Admin */}
          <div className="p-6 border-b border-[#163A5F] flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#163A5F] flex items-center justify-center">
                <span className="font-heading font-extrabold text-sm text-[#00B894]">AI</span>
              </div>
              <span className="font-heading font-extrabold text-base tracking-tight text-white">
                CMS PANEL
              </span>
            </Link>
          </div>

          {/* User Profile Tag */}
          <div className="px-6 py-4 bg-[#163A5F]/40 border-b border-[#163A5F] flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white truncate max-w-[140px]">
                {user.fullName}
              </div>
              <div className="text-[10px] font-mono text-[#00B894] uppercase tracking-wider">
                Role: {user.role}
              </div>
            </div>
            <Link
              to="/admin/articles/new"
              className="p-1.5 bg-[#00B894] hover:bg-[#009b7c] text-[#0D1F3C] rounded-md transition-colors"
              title="New Article"
            >
              <PlusCircle className="w-4 h-4" />
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1 text-xs font-medium">
            {navItems.map((item) => {
              const active = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    active
                      ? 'bg-[#163A5F] text-[#00C2E0] font-semibold'
                      : 'text-stone-300 hover:bg-[#163A5F]/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#163A5F] space-y-2 text-xs">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-stone-300 hover:text-white hover:bg-[#163A5F]/50 rounded-lg transition-colors"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Header Mobile Ribbon */}
        <header className="h-16 bg-white border-b border-[#E2E8F0] px-4 sm:px-6 flex items-center justify-between md:justify-end gap-3">
          <div className="md:hidden flex items-center gap-2">
            <Link to="/admin/dashboard" className="font-heading font-bold text-sm text-[#0D1F3C]">
              AI Finance Deals CMS
            </Link>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              to="/admin/articles/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00B894] hover:bg-[#009b7c] text-[#0D1F3C] font-heading font-bold rounded-lg transition-colors shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Article</span>
            </Link>

            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1 text-[#6B7280] hover:text-[#0D1F3C]"
            >
              <span>View Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
