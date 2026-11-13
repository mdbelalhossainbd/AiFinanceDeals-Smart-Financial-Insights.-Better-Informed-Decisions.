import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../integrations/supabase/client';

export interface UserSession {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_STORAGE_KEY = 'aifinancedeals_admin_user';
const ALLOW_LOCAL_DEV_PREVIEW = import.meta.env.DEV && !isSupabaseConfigured;

const normalizeRole = (rawRole?: string | null): UserRole => {
  const normalized = (rawRole || '').trim().toLowerCase();
  if (normalized === 'administrator') return 'administrator';
  if (normalized === 'managing editor' || normalized === 'editor') return 'editor';
  if (normalized === 'author') return 'author';
  return 'none';
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const resolveSupabaseUser = async (supaUser: {
      id: string;
      email?: string;
      app_metadata?: Record<string, any>;
      user_metadata?: Record<string, any>;
    }): Promise<UserSession> => {
      let rawRole: string | undefined = supaUser.app_metadata?.role;
      try {
        const { data: rpcRole, error: rpcError } = await supabase.rpc('get_my_cms_role');
        if (!rpcError && typeof rpcRole === 'string') {
          rawRole = rpcRole;
        }
      } catch {
        // Fall back strictly to server-signed app_metadata; never trust user_metadata
      }

      return {
        id: supaUser.id,
        email: supaUser.email || '',
        fullName: supaUser.user_metadata?.full_name || 'CMS Staff User',
        role: normalizeRole(rawRole),
      };
    };

    if (isSupabaseConfigured && supabase) {
      // Clear any stale local demo storage once live Supabase Auth is enabled
      localStorage.removeItem(ADMIN_STORAGE_KEY);

      supabase.auth
        .getSession()
        .then(async ({ data }: { data: { session: any } }) => {
          if (!active) return;
          if (data?.session?.user) {
            const sessionUser = await resolveSupabaseUser(data.session.user);
            if (active) setUser(sessionUser);
          } else {
            setUser(null);
          }
          setIsLoading(false);
        })
        .catch(() => {
          if (active) {
            setUser(null);
            setIsLoading(false);
          }
        });

      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (_event: string, session: any) => {
          if (!active) return;
          if (session?.user) {
            const sessionUser = await resolveSupabaseUser(session.user);
            if (active) setUser(sessionUser);
          } else {
            setUser(null);
          }
        }
      );

      return () => {
        active = false;
        authListener?.subscription?.unsubscribe();
      };
    }

    // Unconfigured local development preview only
    if (ALLOW_LOCAL_DEV_PREVIEW) {
      try {
        const saved = localStorage.getItem(ADMIN_STORAGE_KEY);
        if (saved) {
          setUser(JSON.parse(saved));
        }
      } catch {
        localStorage.removeItem(ADMIN_STORAGE_KEY);
      }
    } else {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
      setUser(null);
    }

    setIsLoading(false);
    return () => {
      active = false;
    };
  }, []);

  const login = async (emailInput: string, passInput: string) => {
    const email = emailInput.trim().toLowerCase();
    const pass = passInput.trim();

    // Production / Configured mode: strictly authenticate against Supabase Auth
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) throw error;
        if (data.user) {
          let rawRole: string | undefined = data.user.app_metadata?.role;
          try {
            const { data: rpcRole, error: rpcError } = await supabase.rpc('get_my_cms_role');
            if (!rpcError && typeof rpcRole === 'string') {
              rawRole = rpcRole;
            }
          } catch {
            // Fall back to server-signed app_metadata only; never escalate from user_metadata
          }

          const sessionUser: UserSession = {
            id: data.user.id,
            email: data.user.email || email,
            fullName: data.user.user_metadata?.full_name || 'CMS Staff User',
            role: normalizeRole(rawRole),
          };
          setUser(sessionUser);
          return { success: true };
        }
      } catch (err: any) {
        const errMsg = err?.message || String(err);
        if (errMsg.toLowerCase().includes('failed to fetch') || errMsg.toLowerCase().includes('network')) {
          return {
            success: false,
            error: 'Authentication service is temporarily unreachable. Please verify Supabase availability and try again.',
          };
        }
        if (errMsg.toLowerCase().includes('invalid login credentials')) {
          return {
            success: false,
            error:
              'Invalid email or password for your connected Supabase project. Ensure this staff account exists in Supabase Auth → Users.',
          };
        }
        return { success: false, error: errMsg || 'Invalid email or password.' };
      }

      return { success: false, error: 'Authentication failed.' };
    }

    // Local development preview fallback ONLY when Supabase env vars are absent in dev
    if (ALLOW_LOCAL_DEV_PREVIEW) {
      if (email === 'admin@aifinancedeals.com' && pass === 'admin123') {
        const adminSession: UserSession = {
          id: 'usr-admin-1',
          email: 'admin@aifinancedeals.com',
          fullName: 'Marcus Vance, CFA',
          role: 'administrator',
        };
        setUser(adminSession);
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminSession));
        return { success: true };
      }

      if (email === 'editor@aifinancedeals.com' && pass === 'editor123') {
        const editorSession: UserSession = {
          id: 'usr-editor-1',
          email: 'editor@aifinancedeals.com',
          fullName: 'Sarah Jenkins, CFP®',
          role: 'editor',
        };
        setUser(editorSession);
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(editorSession));
        return { success: true };
      }

      return {
        success: false,
        error: 'Invalid local preview credentials.',
      };
    }

    return {
      success: false,
      error: 'Editorial CMS authentication requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to be configured.',
    };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  };

  const hasRole = (roles: UserRole[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
