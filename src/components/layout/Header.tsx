import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BrandLogo } from '../common/BrandLogo';
import { Search, Menu, X, ChevronDown, Shield, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const navItems = [
    { label: 'HOME', path: '/' },
    {
      label: 'PERSONAL FINANCE',
      path: '/personal-finance/',
      dropdown: [
        { label: 'Personal Finance Overview', path: '/personal-finance/' },
        { label: 'Budgeting Guides', path: '/personal-finance/budgeting/' },
        { label: 'Saving Strategies', path: '/personal-finance/saving/' },
      ],
    },
    {
      label: 'INSURANCE',
      path: '/insurance/',
      dropdown: [
        { label: 'Insurance Overview', path: '/insurance/' },
        { label: 'Life Insurance', path: '/insurance/life-insurance/' },
        { label: 'Health Insurance', path: '/insurance/health-insurance/' },
        { label: 'Auto Insurance', path: '/insurance/auto-insurance/' },
      ],
    },
    {
      label: 'BANKING',
      path: '/banking/',
      dropdown: [
        { label: 'Banking Overview', path: '/banking/' },
        { label: 'Bank Accounts & HYSA', path: '/banking/bank-accounts/' },
      ],
    },
    { label: 'CREDIT & LOANS', path: '/credit-loans/' },
    { label: 'FINANCE DEALS', path: '/finance-deals/' },
    { label: 'COMPARISONS', path: '/comparisons/' },
    { label: 'FINANCIAL TECHNOLOGY', path: '/financial-technology/' },
  ];

  const isActivePath = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] shadow-sm">
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="shrink-0">
          <BrandLogo showTagline={true} />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 2xl:gap-2 text-[12px] font-heading font-semibold text-[#303846]">
          {navItems.map((item) => {
            const hasDropdown = Boolean(item.dropdown);
            const active = isActivePath(item.path);

            if (hasDropdown) {
              return (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={item.path}
                    className={`flex items-center gap-1 px-2.5 py-2 rounded-md transition-colors ${
                      active
                        ? 'text-[#0D1F3C] font-bold bg-[#F5F8FC]'
                        : 'hover:text-[#0D1F3C] hover:bg-[#F5F8FC]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className="w-3 h-3 text-[#6B7280] group-hover:rotate-180 transition-transform" />
                  </Link>

                  {/* Dropdown Menu */}
                  {activeDropdown === item.label && (
                    <div className="absolute top-full left-0 w-56 bg-white border border-[#E2E8F0] rounded-lg shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      {item.dropdown?.map((sub) => (
                        <Link
                          key={sub.label}
                          to={sub.path}
                          onClick={() => setActiveDropdown(null)}
                          className="block px-4 py-2 text-xs text-[#303846] hover:bg-[#F5F8FC] hover:text-[#0D1F3C] transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`px-2.5 py-2 rounded-md transition-colors whitespace-nowrap ${
                  active
                    ? 'text-[#0D1F3C] font-bold bg-[#F5F8FC]'
                    : 'hover:text-[#0D1F3C] hover:bg-[#F5F8FC]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Zone */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search Bar */}
          <div className="relative hidden md:block">
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guides, deals, banks..."
                className="w-48 lg:w-56 pl-8 pr-3 py-1.5 text-xs bg-[#F5F8FC] border border-[#E2E8F0] rounded-full focus:outline-none focus:ring-1 focus:ring-[#00B894] focus:bg-white text-[#303846]"
              />
              <Search className="w-3.5 h-3.5 text-[#6B7280] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </form>
          </div>

          {/* Search Trigger for Mobile/Tablet */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden p-2 text-[#303846] hover:bg-[#F5F8FC] rounded-md transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-[#6B7280]" />
          </button>

          {/* Admin CMS Badge / Link */}
          <Link
            to={user ? '/admin/dashboard' : '/admin/login'}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-md border border-[#E2E8F0] text-[#0D1F3C] hover:bg-[#F5F8FC] transition-colors"
            title="Editorial CMS"
          >
            <User className="w-3.5 h-3.5 text-[#163A5F]" />
            <span className="hidden sm:inline">{user ? 'CMS Panel' : 'Editor Login'}</span>
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-[#303846] hover:bg-[#F5F8FC] rounded-md transition-colors"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Dropdown Bar */}
      {isSearchOpen && (
        <div className="md:hidden border-t border-[#E2E8F0] p-3 bg-[#F5F8FC]">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search financial guides, deals, banks..."
              className="flex-1 px-3 py-2 text-xs bg-white border border-[#E2E8F0] rounded-md text-[#303846] focus:outline-none focus:ring-1 focus:ring-[#00B894]"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0D1F3C] rounded-md hover:bg-[#163A5F]"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[#E2E8F0] bg-white px-4 py-6 space-y-3 max-h-[85vh] overflow-y-auto">
          <div className="text-xs font-mono uppercase tracking-wider text-[#9CA3AF] px-2 font-semibold">
            Explore AI Finance Deals
          </div>
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const active = isActivePath(item.path);
              return (
                <div key={item.label} className="border-b border-stone-100 pb-1">
                  <Link
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 text-sm font-heading font-semibold rounded-md ${
                      active ? 'bg-[#F5F8FC] text-[#0D1F3C] font-bold' : 'text-[#303846] hover:bg-[#F5F8FC]'
                    }`}
                  >
                    {item.label}
                  </Link>
                  {item.dropdown && (
                    <div className="pl-6 space-y-1 py-1">
                      {item.dropdown.slice(1).map((sub) => (
                        <Link
                          key={sub.label}
                          to={sub.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-1 text-xs text-[#6B7280] hover:text-[#0D1F3C]"
                        >
                          → {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] flex flex-col gap-2">
            <Link
              to="/editorial-team/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-[#6B7280] hover:text-[#0D1F3C] px-3 py-1"
            >
              Editorial Board & Analysts
            </Link>
            <Link
              to="/about-us/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-[#6B7280] hover:text-[#0D1F3C] px-3 py-1"
            >
              About AI Finance Deals
            </Link>
            <Link
              to="/editorial-policy/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-[#6B7280] hover:text-[#0D1F3C] px-3 py-1"
            >
              Editorial & Fact-Checking Policy
            </Link>
            <Link
              to="/contact/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-[#6B7280] hover:text-[#0D1F3C] px-3 py-1"
            >
              Contact & Inquiries
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
