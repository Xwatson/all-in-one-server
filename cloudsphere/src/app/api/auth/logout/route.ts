import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST() {
  try {
    const headersList = headers();
    const cookieStore = cookies();
    
    // 验证请求来源
    const origin = headersList.get('origin');
    const referer = headersList.get('referer');
    if (!origin || !referer) {
      return NextResponse.json(
        { success: false, error: 'Invalid request origin' },
        { status: 403 }
      );
    }

    // 验证用户是否已登录（通过检查必要的 cookie）
    const sessionCookie = cookieStore.get('session');
    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: 'No active session' },
        { status: 401 }
      );
    }

    // 清除所有相关的 cookies
    const cookiesToClear = ['token', 'session', 'refresh_token', 'user_id'];
    cookiesToClear.forEach(cookieName => {
      cookieStore.delete(cookieName);
    });

    // 设置安全相关的响应头
    const response = NextResponse.json({ success: true });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error during logout'
      },
      { status: 500 }
    );
  }
}
