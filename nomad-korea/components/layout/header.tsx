import Link from "next/link";
import { Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search/search-bar";
import { logout } from "@/app/login/actions";
import { createClient } from "@/lib/supabase/server";

export default async function Header() {
  // 세션 체크
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoggedIn = !!user;
  const userEmail = user?.email || '';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="w-full max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-primary">Nomad Korea</div>
        </Link>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <SearchBar placeholder="도시, 지역 검색..." className="w-full" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          <Link
            href="/community"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            커뮤니티
          </Link>
          <Link
            href="/stats"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            통계
          </Link>
          <Link
            href="/ranking"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            랭킹
          </Link>
          <Link href="/reviews/new">
            <Button variant="default" size="sm">
              리뷰 작성
            </Button>
          </Link>

          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="max-w-[150px] truncate">{userEmail}</span>
              </div>
              <form action={logout}>
                <Button variant="outline" size="sm" type="submit">
                  <LogOut className="h-4 w-4 mr-2" />
                  로그아웃
                </Button>
              </form>
            </>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm">
                로그인
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden border-t px-4 py-3">
        <SearchBar placeholder="도시, 지역 검색..." />
      </div>
    </header>
  );
}
