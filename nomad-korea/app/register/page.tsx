import { redirect } from 'next/navigation'
import Link from "next/link"
import { Mail, Lock, User, ArrowRight, Github, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { signup } from '../login/actions'
import { createClient } from '@/lib/supabase/server'

export default async function RegisterPage(props: {
  searchParams: Promise<{ message?: string; error?: string }>
}) {
  const searchParams = await props.searchParams

  // 세션 체크
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 이미 로그인된 경우 홈으로 리다이렉트
  if (user) {
    redirect('/')
  }

  const benefits = [
    "전국 노마드 도시 정보 무제한 열람",
    "나만의 리뷰 작성 및 공유",
    "다른 노마드들과 소통",
    "맞춤형 도시 추천 받기",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-primary/10 to-purple-50 py-8 px-4">
      <div className="container max-w-6xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex justify-center mb-8">
          <div className="text-3xl font-bold text-primary">Nomad Korea</div>
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Benefits */}
          <div className="hidden lg:flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">
                디지털 노마드 라이프를
                <br />
                시작하세요
              </h1>
              <p className="text-lg text-muted-foreground">
                한국 전역의 노마드 친화 도시 정보와 커뮤니티를 만나보세요
              </p>
            </div>

            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-muted-foreground">{benefit}</p>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                🎉 현재 2,500+ 노마드가 함께하고 있어요!
              </Badge>
            </div>
          </div>

          {/* Right Side - Form */}
          <div>
            <Card className="border-2">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">회원가입</CardTitle>
                <CardDescription className="text-center">
                  몇 분만에 가입하고 시작하세요
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* 메시지 표시 */}
                {searchParams?.message && (
                  <div className="rounded-md bg-green-50 p-4">
                    <p className="text-sm text-green-800">{searchParams.message}</p>
                  </div>
                )}

                {searchParams?.error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <p className="text-sm text-red-800">{searchParams.error}</p>
                  </div>
                )}

                {/* Social Login */}
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" type="button" disabled>
                    <Github className="mr-2 h-4 w-4" />
                    Github으로 계속하기
                  </Button>
                  <Button variant="outline" className="w-full" type="button" disabled>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google로 계속하기
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">또는 이메일로</span>
                  </div>
                </div>

                {/* Email/Password Form */}
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      이메일
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      비밀번호
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="8자 이상"
                        className="pl-10"
                        minLength={8}
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      최소 8자 이상, 영문/숫자 조합을 권장합니다
                    </p>
                  </div>

                  <Button formAction={signup} className="w-full" size="lg">
                    회원가입 완료
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <div className="text-sm text-center text-muted-foreground">
                  이미 계정이 있으신가요?{" "}
                  <Link href="/login" className="text-primary font-medium hover:underline">
                    로그인
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
