import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="text-2xl font-bold text-primary">
              Nomad Korea
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              한국 최고의 노마드 워커를 위한 도시 정보 플랫폼
            </p>
            <div className="flex space-x-4 mt-6">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">둘러보기</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/cities"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  도시 탐색
                </Link>
              </li>
              <li>
                <Link
                  href="/ranking"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  인기 랭킹
                </Link>
              </li>
              <li>
                <Link
                  href="/reviews"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  리뷰 보기
                </Link>
              </li>
              <li>
                <Link
                  href="/stats"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  실시간 통계
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold mb-4">커뮤니티</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/community"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  모임 찾기
                </Link>
              </li>
              <li>
                <Link
                  href="/community/events"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  이벤트
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  블로그
                </Link>
              </li>
              <li>
                <Link
                  href="/guides"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  가이드
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">고객지원</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  문의하기
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  이용약관
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
          <p className="text-center text-sm text-muted-foreground">
            &copy; 2025 Nomad Korea. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
