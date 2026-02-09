'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Check, Copy } from 'lucide-react';
import { generateShareUrl } from '@/lib/city-utils';

interface ShareButtonProps {
  cityName: string;
  citySlug: string;
}

/**
 * 공유 버튼 컴포넌트 (클라이언트 컴포넌트)
 */
export function ShareButton({ cityName, citySlug }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showUrl, setShowUrl] = useState(false);

  const handleShare = async () => {
    const url = generateShareUrl(citySlug);
    const shareData = {
      title: `${cityName} - Nomad Korea`,
      text: `${cityName}에서의 노마드 생활 정보를 확인해보세요!`,
      url,
    };

    try {
      // Web Share API 지원 여부 확인
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        // 공유 성공 후 URL 표시
        setShowUrl(true);
        setTimeout(() => setShowUrl(false), 5000);
      } else {
        // 지원하지 않는 경우 클립보드에 복사
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setShowUrl(true);
        setTimeout(() => {
          setCopied(false);
          setShowUrl(false);
        }, 5000);
      }
    } catch (error) {
      // 사용자가 공유를 취소한 경우 무시
      if ((error as Error).name !== 'AbortError') {
        console.error('공유 중 오류 발생:', error);
      }
    }
  };

  const handleCopyUrl = async () => {
    const url = generateShareUrl(citySlug);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setShowUrl(true);
      setTimeout(() => {
        setCopied(false);
        setShowUrl(false);
      }, 5000);
    } catch (error) {
      console.error('URL 복사 중 오류 발생:', error);
    }
  };

  const url = typeof window !== 'undefined' ? generateShareUrl(citySlug) : '';

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="gap-2 bg-white/90 backdrop-blur-sm"
        >
          <Share2 className="h-4 w-4" />
          공유하기
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyUrl}
          className="gap-2 bg-white/90 backdrop-blur-sm"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              복사됨
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              URL 복사
            </>
          )}
        </Button>
      </div>
      {showUrl && (
        <div className="bg-white/95 backdrop-blur-sm border rounded-md px-3 py-2 text-xs text-muted-foreground max-w-[300px] truncate shadow-lg">
          {url}
        </div>
      )}
    </div>
  );
}
