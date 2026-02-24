import { test as base, Page } from '@playwright/test';

export type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // 로그인 상태로 페이지 설정
    // 실제 구현 시 Supabase 세션 설정 필요
    await page.goto('/login');

    // 여기에 로그인 로직 추가
    // await page.getByLabel('이메일').fill('test@example.com');
    // await page.getByLabel('비밀번호').fill('password123');
    // await page.getByRole('button', { name: '로그인' }).click();
    // await page.waitForURL('/');

    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(page);
  },
});

export { expect } from '@playwright/test';
