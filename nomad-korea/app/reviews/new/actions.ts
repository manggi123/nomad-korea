'use server';

import { createClient } from '@/lib/supabase/server';
import { createReview } from '@/lib/supabase/mutations/reviews';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export interface CreateReviewState {
  success: boolean;
  error?: string;
  message?: string;
}

export async function createReviewAction(
  _prevState: CreateReviewState,
  formData: FormData
): Promise<CreateReviewState> {
  const supabase = await createClient();

  // 현재 사용자 확인
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: '로그인이 필요합니다. 로그인 후 다시 시도해주세요.',
    };
  }

  // 폼 데이터 추출
  const cityId = formData.get('cityId') as string;
  const rating = parseInt(formData.get('rating') as string, 10);
  const comment = formData.get('comment') as string;

  // 유효성 검사
  if (!cityId) {
    return {
      success: false,
      error: '도시를 선택해주세요.',
    };
  }

  if (!rating || rating < 1 || rating > 5) {
    return {
      success: false,
      error: '평점을 선택해주세요 (1-5점).',
    };
  }

  if (!comment || comment.trim().length < 10) {
    return {
      success: false,
      error: '리뷰 내용을 10자 이상 작성해주세요.',
    };
  }

  if (comment.length > 1000) {
    return {
      success: false,
      error: '리뷰 내용은 1000자 이내로 작성해주세요.',
    };
  }

  try {
    // 리뷰 생성
    await createReview(supabase, {
      city_id: cityId,
      user_id: user.id,
      rating,
      comment: comment.trim(),
    });

    // 캐시 무효화
    revalidatePath('/');
    revalidatePath(`/cities/${cityId}`);
    revalidatePath('/reviews');

  } catch (error) {
    console.error('리뷰 생성 오류:', error);
    return {
      success: false,
      error: '리뷰 작성 중 오류가 발생했습니다. 다시 시도해주세요.',
    };
  }

  // 성공 후 리다이렉트
  redirect('/reviews?success=true');
}
