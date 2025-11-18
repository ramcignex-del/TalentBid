'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signup(formData: {
  email: string
  password: string
  role: 'candidate' | 'employer'
}) {
  try {
    const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                         process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
                         !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-ref')

    if (!isConfigured) {
      return { error: 'Supabase is not configured. Please check SUPABASE_SETUP.md for instructions.' }
    }

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
        data: {
          role: formData.role,
        },
      },
    })

    if (error) {
      return { error: error.message }
    }

    // Create profile record
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        email: formData.email,
        role: formData.role,
      })

      if (profileError) {
        return { error: profileError.message }
      }
    }

    return { success: true, userId: data.user?.id }
  } catch (error: any) {
    console.error('Signup error:', error)
    return { error: 'Signup failed. Please check your Supabase configuration.' }
  }
}

export async function signin(formData: { email: string; password: string }) {
  try {
    const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                         process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
                         !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-ref')

    if (!isConfigured) {
      return { error: 'Supabase is not configured. Please check SUPABASE_SETUP.md for instructions.' }
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
  } catch (error: any) {
    console.error('Signin error:', error)
    return { error: 'Sign in failed. Please check your Supabase configuration.' }
  }
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function getUserProfile() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return { user, profile }
}
