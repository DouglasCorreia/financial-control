import { create } from 'zustand'
import { supabase } from '@/services/supabase'
import type { AuthStore } from '@/types'

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  error: null,

  initialize: async () => {
    const { data: { session }} = await supabase.auth.getSession()

    let profile = null

    if (session?.user) {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, nome, created_at')
            .eq('id', session.user.id)
            .single()

        if (error) {
            set({ error: error.message })
        }

        profile = data
     }

    set({
      session,
      user: session?.user ?? null,
      profile,
      isLoading: false,
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      set({
        session: nextSession,
        user: nextSession?.user ?? null,
      })
    })

    return () => {
      subscription.unsubscribe()
    }
  },

  signIn: async (email, password) => {
    set({ isLoading: true, error: null })

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      set({
        isLoading: false,
        error: error.message,
      })

      return false
    }

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, nome, created_at')
      .eq('id', data.user.id)
      .single()

    if (profileError) {
      set({
        isLoading: false,
        error: profileError.message,
      })

      return false
    }

    set({
      session: data.session,
      user: data.user,
      profile: profileData,
      isLoading: false,
    })

    return true
  },

  signUp: async (nome, email, password) => {
    set({ isLoading: true, error: null })

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome
        },
      },
    })

    if (error) {
      set({
        isLoading: false,
        error: error.message,
      })

      return false
    }

    if (data.user && data.session) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .upsert(
          {
            id: data.user.id,
            nome,
          },
          {
            onConflict: 'id',
          },
        )
        .select()
        .single()

      if (profileError) {
        set({
          isLoading: false,
          error: profileError.message,
        })

        return false
      }

      set({
        session: data.session,
        user: data.user,
        profile: profileData,
        isLoading: false,
      })
    }

    return true
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      set({ error: error.message })
      return
    }

    set({
      session: null,
      user: null,
      error: null,
    })
  },

  setProfile: (profile) => {
    set({ profile })
  },
}))
