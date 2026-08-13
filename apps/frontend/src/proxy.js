import { NextResponse } from 'next/server';

const protectedRoutes = ['/lobby', '/profile', '/room', '/game'];
const authRoutes = ['/sign-in', '/sign-up'];

export default function proxy(request) {
  const { pathname } = request.nextUrl;
  
  const accessToken = request.cookies.get('accessToken')?.value;

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Se não estiver logado e tentar acessar rota protegida, manda pro login
  if (!accessToken && isProtectedRoute) {
    const signInUrl = new URL('/sign-in', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // Se já estiver logado e tentar acessar sign-in ou sign-up, manda pro lobby
  if (accessToken && isAuthRoute) {
    const lobbyUrl = new URL('/lobby', request.url);
    return NextResponse.redirect(lobbyUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
