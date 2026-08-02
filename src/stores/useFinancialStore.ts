import { create } from "zustand";
import { supabase } from "@/services/supabase";
import type { FinancialStore } from '@/types'

export const useFinancialStore = create<FinancialStore>((set) => ({
    salary: null,
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
    },

    loadSalary: async (userId) => {
        set({
            isLoading: true,
            error: null,
        })

        const { data, error } = await supabase
            .from('salaries')
            .select('id, user_id, valor, created_at')
            .eq('user_id', userId)
            .maybeSingle()

        if (error) {
            set({
                isLoading: false,
                error: error.message,
            })

            return
        }

        set({
            salary: data,
            isLoading: false,
        })
    },

    saveSalary: async (userId, valor) => {
        set({
            isLoading: true,
            error: null,
        })

        const { data, error } = await supabase
            .from('salaries')
            .upsert(
            {
                user_id: userId,
                valor,
            },
            {
                onConflict: 'user_id',
            },
            )
            .select('id, user_id, valor, created_at')
            .single()

        if (error) {
            set({
            isLoading: false,
            error: error.message,
            })

            return
        }

        set({
            salary: data,
            isLoading: false,
        })
    },

    loadCategories: async (userId) => {
        set({ isLoading: true, error: null })

        const { data, error } = await supabase
            .from('categories')
            .select('id, user_id, nome, cor, created_at')
            .eq('user_id', userId)
            .order('nome')

        if (error) {
            set({ isLoading: false, error: error.message })
            
            return
        }

        set({
            categories: data ?? [],
            isLoading: false,
        })
    },

    createCategory: async (userId, nome, cor) => {
        const { data, error } = await supabase
            .from('categories')
            .insert({
                user_id: userId,
                nome,
                cor,
            })
            .select()
            .single()

        if (error) {
            set({ error: error.message })
            return false
        }

        set((state) => ({
            categories: [...state.categories, data],
        }))

        return true
     },

    updateCategory: async (id, nome, cor) => {
        const { data, error } = await supabase
            .from('categories')
            .update({ nome, cor })
            .eq('id', id)
            .select()
            .single()

        if (error) {
            set({ error: error.message })
            return false
        }

        set((state) => ({
            categories: state.categories.map((category) =>
            category.id === id ? data : category,
            ),
        }))

        return true
    },

    deleteCategory: async (id) => {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id)

        if (error) {
            set({ error: error.message })
            
            return false
        }

        set((state) => ({
            categories: state.categories.filter((category) => category.id !== id)
        }))

        return true
    },
}));