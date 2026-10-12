import { create } from "zustand";
import { supabase } from "@/services/supabase";
import type { ExpenseInput, FinancialStore } from '@/types'

let activeUserId: string | null = null

export const useFinancialStore = create<FinancialStore>((set) => ({
    setActiveUserId: (userId) => {
        if (activeUserId === userId) return

        activeUserId = userId
        set({ salary: null, categories: [], expenses: [], isLoading: false, error: null })
    },
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
        if (activeUserId !== userId) return

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

            if (activeUserId !== userId) return

            if (error) {
                throw error
            }

            set({
                expenses: data ?? [],
                isLoading: false,
            })
        } catch (error) {
            if (activeUserId !== userId) return

            set({
                error: error instanceof Error ? error.message : 'Erro ao carregar despesas.',
                isLoading: false,
            })
        }
    },

    loadSalary: async (userId) => {
        if (activeUserId !== userId) return

        set({
            isLoading: true,
            error: null,
        })

        const { data, error } = await supabase
            .from('salaries')
            .select('id, user_id, valor, created_at')
            .eq('user_id', userId)
            .maybeSingle()

        if (activeUserId !== userId) return

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
        if (activeUserId !== userId) return

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

        if (activeUserId !== userId) return

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
        if (activeUserId !== userId) return

        set({ isLoading: true, error: null })

        const { data, error } = await supabase
            .from('categories')
            .select('id, user_id, nome, cor, created_at')
            .eq('user_id', userId)
            .order('nome')

        if (activeUserId !== userId) return

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
        if (activeUserId !== userId) return false

        const { data, error } = await supabase
            .from('categories')
            .insert({
                user_id: userId,
                nome,
                cor,
            })
            .select()
            .single()

        if (activeUserId !== userId) return false

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
        const requestUserId = activeUserId
        if (!requestUserId) return false

        const { data, error } = await supabase
            .from('categories')
            .update({ nome, cor })
            .eq('id', id)
            .select()
            .single()

        if (activeUserId !== requestUserId) return false

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
        const requestUserId = activeUserId
        if (!requestUserId) return false

        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id)

        if (activeUserId !== requestUserId) return false

        if (error) {
            set({ error: error.message })
            
            return false
        }

        set((state) => ({
            categories: state.categories.filter((category) => category.id !== id)
        }))

        return true
    },

    createExpense: async (userId, expense: ExpenseInput) => {
        if (activeUserId !== userId) return false

        const { data, error } = await supabase
            .from('expenses')
            .insert({
                user_id: userId,
                ...expense,
            })
            .select()
            .single()

        if (activeUserId !== userId) return false

        if (error) {
            set({ error: error.message })
            return false
        }

        set((state) => ({
            expenses: [data, ...state.expenses],
            error: null,
        }))

        return true
    },

    updateExpense: async (id, expense: ExpenseInput) => {
        const requestUserId = activeUserId
        if (!requestUserId) return false

        const { data, error } = await supabase
            .from('expenses')
            .update(expense)
            .eq('id', id)
            .select()
            .single()

        if (activeUserId !== requestUserId) return false

        if (error) {
            set({ error: error.message })
            return false
        }

        set((state) => ({
            expenses: state.expenses.map((item) =>
                item.id === id ? data : item,
            ),
            error: null,
        }))

        return true
    },

    deleteExpense: async (id) => {
        const requestUserId = activeUserId
        if (!requestUserId) return false

        const { error } = await supabase
            .from('expenses')
            .delete()
            .eq('id', id)

        if (activeUserId !== requestUserId) return false

        if (error) {
            set({ error: error.message })
            return false
        }

        set((state) => ({
            expenses: state.expenses.filter((item) => item.id !== id),
            error: null,
        }))

        return true
    },

    deleteAllExpenses: async (userId) => {
        if (activeUserId !== userId) return false

        const { error } = await supabase
            .from('expenses')
            .delete()
            .eq('user_id', userId)

        if (activeUserId !== userId) return false

        if (error) {
            set({ error: error.message })
            return false
        }

        set({
            expenses: [],
            error: null,
        })

        return true
    },
}));
