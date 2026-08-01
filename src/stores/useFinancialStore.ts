import { create } from "zustand";
import { supabase } from "@/services/supabase";
import type { FinancialStore } from '@/types'

export const useFinancialStore = create<FinancialStore>((set) => ({
    salaries: [],
    categories: [],
    expenses: [],

    selectedMonth: new Date().getMonth() + 1,
    selectedYear: new Date().getFullYear(),

    isLoading: false,
    error: null,

    setPeriod: (month, year) => {
        set({
            selectedMonth: month,
            selectedYear: year,
        })
    },

    loadExpenses: async (userId) => {
        set({
            isLoading: true,
            error: null
        });

        try {
            const { data, error } = await supabase
            .from('expenses')
            .select('*')
            .eq('user_id', userId)
            .order('data_gasto', { ascending: false });

            if (error) {
                throw error
            }

            set({
                expenses: data ?? [],
                isLoading: false,
            })
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Erro ao carregar despesas.',
                isLoading: false,
            })
        }
    }
}));