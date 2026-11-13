import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Layout Components
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { DisclaimerNotice } from './components/common/DisclaimerNotice';
import { CookieConsentBanner } from './components/common/CookieConsentBanner';
import { GoogleServicesScript } from './components/seo/GoogleServicesScript';

// Public Pages
import { HomePage } from './pages/Home/HomePage';
import { CategoryHubPage } from './pages/Categories/CategoryHubPage';
import { ArticleDetailPage } from './pages/Articles/ArticleDetailPage';
import { ArticlesIndexPage } from './pages/Articles/ArticlesIndexPage';
import { FinanceDealsPage } from './pages/FinanceDeals/FinanceDealsPage';
import { ComparisonsPage } from './pages/Comparisons/ComparisonsPage';
import { SearchPage } from './pages/Search/SearchPage';

// Trust & Legal Pages
import { AboutPage } from './pages/About/AboutPage';
import { EditorialTeamPage } from './pages/About/EditorialTeamPage';
import { AuthorProfilePage } from './pages/About/AuthorProfilePage';
import { ContactPage } from './pages/Contact/ContactPage';
import { EditorialPolicyPage } from './pages/Legal/EditorialPolicyPage';
import { AffiliateDisclosurePage } from './pages/Legal/AffiliateDisclosurePage';
import { AdvertisingDisclosurePage } from './pages/Legal/AdvertisingDisclosurePage';
import { FactCheckingPolicyPage } from './pages/Legal/FactCheckingPolicyPage';
import { CorrectionsPolicyPage } from './pages/Legal/CorrectionsPolicyPage';
import { CookiePolicyPage } from './pages/Legal/CookiePolicyPage';
import { DisclaimerPage } from './pages/Legal/DisclaimerPage';
import { PrivacyPolicyPage } from './pages/Legal/PrivacyPolicyPage';
import { TermsConditionsPage } from './pages/Legal/TermsConditionsPage';
import { NotFoundPage } from './pages/NotFound/NotFoundPage';

// Admin CMS Pages
import { AdminLayout } from './pages/Admin/AdminLayout';
import { AdminLoginPage } from './pages/Admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/Admin/AdminDashboardPage';
import { AdminArticlesPage } from './pages/Admin/AdminArticlesPage';
import { AdminArticleEditorPage } from './pages/Admin/AdminArticleEditorPage';
import { AdminFeaturedImagesPage } from './pages/Admin/AdminFeaturedImagesPage';
import { AdminCategoriesPage } from './pages/Admin/AdminCategoriesPage';
import { AdminDealsPage } from './pages/Admin/AdminDealsPage';
import { AdminComparisonsPage } from './pages/Admin/AdminComparisonsPage';
import { AdminNewsletterPage } from './pages/Admin/AdminNewsletterPage';
import { AdminAdSensePage } from './pages/Admin/AdminAdSensePage';
import { AdminIntegrationsPage } from './pages/Admin/AdminIntegrationsPage';
import { AdminSettingsPage } from './pages/Admin/AdminSettingsPage';

import { AdSenseScript } from './components/ads/AdSenseScript';
import { AdBanner } from './components/ads/AdBanner';

// Public Shell with standard header and footer
const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#303846] overflow-x-clip">
      {/* Global Google AdSense & Analytics Scripts (Strictly env-and-consent-gated) */}
      <AdSenseScript />
      <GoogleServicesScript />
      <AnnouncementBar />
      <Header />
      {/* Header Horizontal Display Banner */}
      <AdBanner position="header" />
      <DisclaimerNotice variant="banner" />
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
      {/* Footer Horizontal Display Banner */}
      <AdBanner position="footer" />
      <Footer />
      <CookieConsentBanner />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />

            {/* Articles Archive & Detail */}
            <Route path="/articles/" element={<ArticlesIndexPage />} />
            <Route path="/articles/:slug" element={<ArticleDetailPage />} />

            {/* Category Hubs and Subcategories */}
            <Route path="/personal-finance/" element={<CategoryHubPage categorySlug="personal-finance" />} />
            <Route path="/personal-finance/budgeting/" element={<CategoryHubPage categorySlug="personal-finance" subCategorySlug="budgeting" />} />
            <Route path="/personal-finance/saving/" element={<CategoryHubPage categorySlug="personal-finance" subCategorySlug="saving" />} />

            <Route path="/insurance/" element={<CategoryHubPage categorySlug="insurance" />} />
            <Route path="/insurance/life-insurance/" element={<CategoryHubPage categorySlug="insurance" subCategorySlug="life-insurance" />} />
            <Route path="/insurance/health-insurance/" element={<CategoryHubPage categorySlug="insurance" subCategorySlug="health-insurance" />} />
            <Route path="/insurance/auto-insurance/" element={<CategoryHubPage categorySlug="insurance" subCategorySlug="auto-insurance" />} />

            <Route path="/banking/" element={<CategoryHubPage categorySlug="banking" />} />
            <Route path="/banking/bank-accounts/" element={<CategoryHubPage categorySlug="banking" subCategorySlug="bank-accounts" />} />

            <Route path="/credit-loans/" element={<CategoryHubPage categorySlug="credit-loans" />} />
            <Route path="/financial-technology/" element={<CategoryHubPage categorySlug="financial-technology" />} />

            {/* Deals, Comparisons & Search */}
            <Route path="/finance-deals/" element={<FinanceDealsPage />} />
            <Route path="/comparisons/" element={<ComparisonsPage />} />
            <Route path="/search" element={<SearchPage />} />

            {/* Trust, About, Authors & Legal */}
            <Route path="/about-us/" element={<AboutPage />} />
            <Route path="/about/" element={<Navigate to="/about-us/" replace />} />
            <Route path="/editorial-team/" element={<EditorialTeamPage />} />
            <Route path="/authors/" element={<AuthorProfilePage />} />
            <Route path="/authors/:slug" element={<AuthorProfilePage />} />
            <Route path="/contact/" element={<ContactPage />} />
            <Route path="/editorial-policy/" element={<EditorialPolicyPage />} />
            <Route path="/editorial-standards/" element={<Navigate to="/editorial-policy/" replace />} />
            <Route path="/affiliate-disclosure/" element={<AffiliateDisclosurePage />} />
            <Route path="/advertising-disclosure/" element={<AdvertisingDisclosurePage />} />
            <Route path="/fact-checking-policy/" element={<FactCheckingPolicyPage />} />
            <Route path="/corrections-policy/" element={<CorrectionsPolicyPage />} />
            <Route path="/cookie-policy/" element={<CookiePolicyPage />} />
            <Route path="/disclaimer/" element={<DisclaimerPage />} />
            <Route path="/privacy-policy/" element={<PrivacyPolicyPage />} />
            <Route path="/privacy/" element={<Navigate to="/privacy-policy/" replace />} />
            <Route path="/terms-and-conditions/" element={<TermsConditionsPage />} />
            <Route path="/terms/" element={<Navigate to="/terms-and-conditions/" replace />} />

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Admin CMS Authentication */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin CMS Protected Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="articles" element={<AdminArticlesPage />} />
            <Route path="articles/new" element={<AdminArticleEditorPage />} />
            <Route path="articles/edit/:id" element={<AdminArticleEditorPage />} />
            <Route path="featured-images" element={<AdminFeaturedImagesPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="deals" element={<AdminDealsPage />} />
            <Route path="comparisons" element={<AdminComparisonsPage />} />
            <Route path="newsletter" element={<AdminNewsletterPage />} />
            <Route path="adsense" element={<AdminAdSensePage />} />
            <Route path="integrations" element={<AdminIntegrationsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
