import Link from "next/link";
import { Home, Search, Star, MessageCircle, User } from "lucide-react";

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t md:hidden">
      <div className="grid grid-cols-5 h-16">
        <Link
          href="/"
          className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Home className="h-5 w-5" />
          <span className="text-xs">홈</span>
        </Link>

        <Link
          href="/cities"
          className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Search className="h-5 w-5" />
          <span className="text-xs">탐색</span>
        </Link>

        <Link
          href="/reviews/new"
          className="flex flex-col items-center justify-center gap-1 text-primary hover:text-primary/80 transition-colors"
        >
          <div className="flex items-center justify-center w-12 h-12 -mt-6 bg-primary rounded-full shadow-lg">
            <Star className="h-6 w-6 text-white" fill="currentColor" />
          </div>
          <span className="text-xs">평가</span>
        </Link>

        <Link
          href="/community"
          className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-xs">채팅</span>
        </Link>

        <Link
          href="/profile"
          className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <User className="h-5 w-5" />
          <span className="text-xs">마이</span>
        </Link>
      </div>
    </nav>
  );
}
