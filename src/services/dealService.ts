import { FinancialDeal, Comparison } from '../types';
import { FINANCIAL_DEALS, COMPARISONS } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../integrations/supabase/client';

const DEALS_STORAGE_KEY = 'aifinancedeals_deals_store';

function getLocalDeals(): FinancialDeal[] {
  try {
    const raw = localStorage.getItem(DEALS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const parsedIds = new Set(parsed.map((d: FinancialDeal) => d.id));
        const missing = FINANCIAL_DEALS.filter((d) => !parsedIds.has(d.id));
        if (missing.length > 0) {
          const merged = [...parsed, ...missing];
          saveLocalDeals(merged);
          return merged;
        }
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read deals from localStorage', e);
  }
  return FINANCIAL_DEALS;
}

function saveLocalDeals(deals: FinancialDeal[]) {
  try {
    localStorage.setItem(DEALS_STORAGE_KEY, JSON.stringify(deals));
  } catch (e) {
    console.warn('Could not save deals to localStorage', e);
  }
}

export const dealService = {
  async getVerifiedDeals(): Promise<FinancialDeal[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('deals')
          .select('*')
          .eq('verification_status', 'verified')
          .order('created_at', { ascending: false });
        if (!error && data) return data as FinancialDeal[];
      } catch (err) {
        console.warn('Supabase deals query failed', err);
      }
    }
    return getLocalDeals().filter((d) => d.verification_status === 'verified');
  },

  async getAllDealsForAdmin(): Promise<FinancialDeal[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('deals').select('*');
        if (!error && data) return data as FinancialDeal[];
      } catch (err) {
        console.warn('Supabase deals admin query failed', err);
      }
    }
    return getLocalDeals();
  },

  async saveDeal(deal: Partial<FinancialDeal>): Promise<FinancialDeal> {
    const local = getLocalDeals();
    let updated: FinancialDeal;

    if (deal.id) {
      const idx = local.findIndex((d) => d.id === deal.id);
      if (idx >= 0) {
        updated = { ...local[idx], ...deal, updated_at: new Date().toISOString() } as FinancialDeal;
        local[idx] = updated;
      } else {
        throw new Error('Deal not found');
      }
    } else {
      updated = {
        id: `deal-${Date.now()}`,
        title: deal.title || 'Promotional Financial Offer',
        provider: deal.provider || 'Verified Financial Partner',
        category_id: deal.category_id || 'cat-bank',
        description: deal.description || '',
        offer_details: deal.offer_details || {},
        terms_url: deal.terms_url || 'https://aifinancedeals.com/terms-and-conditions',
        official_url: deal.official_url || 'https://aifinancedeals.com',
        country: deal.country || 'US',
        currency: deal.currency || 'USD',
        valid_from: deal.valid_from || new Date().toISOString().split('T')[0],
        valid_until: deal.valid_until || '2026-12-31',
        verification_status: deal.verification_status || 'verified',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      local.unshift(updated);
    }

    saveLocalDeals(local);
    return updated;
  },

  async getComparisons(): Promise<Comparison[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('comparisons').select('*');
        if (!error && data) return data as Comparison[];
      } catch (err) {
        console.warn('Supabase comparisons query failed', err);
      }
    }
    return COMPARISONS;
  },
};
