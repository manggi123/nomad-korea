// Mock Authentication System for Development
// 개발 중 Supabase 없이 테스트 가능

export interface MockUser {
  id: string
  email: string
  created_at: string
}

export interface MockSession {
  user: MockUser
  access_token: string
}

// In-memory storage for demo (실제로는 cookie나 localStorage 사용)
const users = new Map<string, { email: string; password: string; id: string }>()
const sessions = new Map<string, MockSession>()

export class MockAuth {
  // 회원가입
  static async signUp(email: string, password: string): Promise<{ error: Error | null; session: MockSession | null }> {
    // 이미 존재하는 사용자 확인
    if (Array.from(users.values()).some(u => u.email === email)) {
      return {
        error: new Error('이미 등록된 이메일입니다'),
        session: null
      }
    }

    // 새 사용자 생성
    const userId = `mock_${Date.now()}_${Math.random()}`
    users.set(userId, { email, password, id: userId })

    const session: MockSession = {
      user: {
        id: userId,
        email,
        created_at: new Date().toISOString()
      },
      access_token: `mock_token_${userId}`
    }

    sessions.set(userId, session)

    return { error: null, session }
  }

  // 로그인
  static async signIn(email: string, password: string): Promise<{ error: Error | null; session: MockSession | null }> {
    const user = Array.from(users.entries()).find(([_, u]) => u.email === email)

    if (!user) {
      return {
        error: new Error('등록되지 않은 이메일입니다'),
        session: null
      }
    }

    const [userId, userData] = user

    if (userData.password !== password) {
      return {
        error: new Error('비밀번호가 일치하지 않습니다'),
        session: null
      }
    }

    const session: MockSession = {
      user: {
        id: userId,
        email: userData.email,
        created_at: new Date().toISOString()
      },
      access_token: `mock_token_${userId}`
    }

    sessions.set(userId, session)

    return { error: null, session }
  }

  // 로그아웃
  static async signOut(userId: string): Promise<{ error: Error | null }> {
    sessions.delete(userId)
    return { error: null }
  }

  // 세션 조회
  static async getSession(userId?: string): Promise<{ session: MockSession | null }> {
    if (!userId) {
      return { session: null }
    }

    const session = sessions.get(userId) || null
    return { session }
  }

  // 모든 세션 초기화 (개발용)
  static clearAll() {
    users.clear()
    sessions.clear()
  }
}
