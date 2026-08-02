import type { Session, User } from '@supabase/supabase-js'

export type Salary = {
  id: string
  user_id: string
  valor: number
  created_at: string | null
}

export type Category = {
  id: string
  user_id: string
  nome: string
  cor: string | null
  created_at: string | null
}

export type Expense = {
  id: string
  user_id: string
  categoria_id: string | null
  nome: string
  descricao: string | null
  valor: number
  data_gasto: string
  status_pagamento: string
  created_at: string | null
}

export type FinancialStore = {
  salary: Salary | null
  categories: Category[]
  expenses: Expense[]
  selectedMonth: number
  selectedYear: number
  isLoading: boolean
  error: string | null
  setPeriod: (
    month: number,
    year: number
  ) => void
  loadExpenses: (
    userId: string
  ) => Promise<void>
  loadSalary: (
    userId: string
  ) => Promise<void>
  saveSalary: (
    userId: string,
    valor: number
  ) => Promise<void>
  loadCategories: (
    userId: string
  ) => Promise<void>
  createCategory: (
    userId: string,
    nome: string,
    cor: string
  ) => Promise<boolean>
  updateCategory: (
    id: string,
    nome: string,
    cor: string
  ) => Promise<boolean>
  deleteCategory: (
    id: string
  ) => Promise<boolean>
}

export type Profile = {
  id: string
  nome: string
  created_at: string | null
}

export type AuthStore = {
  session: Session | null
  user: User | null
  profile: Profile | null
  isLoading: boolean
  error: string | null

  initialize: () => Promise<() => void>
  signIn: (
    email: string,
    password: string
  ) => Promise<boolean>
  signUp: (
    email: string,
    password: string,
    nome: string
  ) => Promise<boolean>
  signOut: () => Promise<void>
  setProfile: (
    profile: Profile | null
  ) => void
}