'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    redirect('/login?error=' + encodeURIComponent('이메일과 비밀번호를 입력해주세요'))
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect('/login?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    redirect('/login?error=' + encodeURIComponent('이메일과 비밀번호를 입력해주세요'))
  }

  if (password.length < 8) {
    redirect('/login?error=' + encodeURIComponent('비밀번호는 최소 8자 이상이어야 합니다'))
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    redirect('/login?error=' + encodeURIComponent(error.message))
  }

  // 프로필 생성 (사용자가 생성된 경우)
  if (data.user) {
    const username = email.split('@')[0] // 이메일 앞부분을 기본 사용자명으로

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        username: username,
        avatar_url: null,
        job_category: null,
      })

    if (profileError) {
      console.error('프로필 생성 실패:', profileError)
      // 프로필 생성 실패해도 회원가입은 성공으로 처리
    }
  }

  revalidatePath('/', 'layout')
  redirect('/login?message=' + encodeURIComponent('회원가입이 완료되었습니다! 이메일을 확인하여 인증해주세요.'))
}

export async function logout() {
  const supabase = await createClient()

  await supabase.auth.signOut()

  revalidatePath('/', 'layout')
  redirect('/login')
}
