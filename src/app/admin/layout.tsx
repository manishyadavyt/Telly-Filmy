'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  PenSquare,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Home,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'All Articles', href: '/admin/articles', icon: FileText },
  { name: 'Create New', href: '/admin/create', icon: PenSquare },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    document.title = 'Admin Panel | TellyFilmy';
    const isAuth =
      typeof window !== 'undefined' &&
      (localStorage.getItem('tf_admin_auth') === 'true' ||
        sessionStorage.getItem('tf_admin_auth') === 'true');
    
    setIsAuthenticated(isAuth);
    if (!isAuth && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [pathname, router]);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (pathname === '/admin/login' || isAuthenticated === false) {
    return <div className="min-h-screen bg-[#0B1120] text-slate-50">{children}</div>;
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#e11d48] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-xs font-mono">Authenticating admin...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('tf_admin_auth');
    sessionStorage.removeItem('tf_admin_auth');
    setIsAuthenticated(false);
    window.location.href = '/admin/login';
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname?.startsWith(href);

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className={cn(
        'flex h-16 items-center border-b border-white/10 px-4',
        isCollapsed && !mobile ? 'justify-center' : 'justify-between'
      )}>
        {(!isCollapsed || mobile) && (
          <Link href="/admin" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Telly Filmy"
              width={140}
              height={36}
              className="h-7 w-auto object-contain"
            />
          </Link>
        )}
        {isCollapsed && !mobile && (
          <Link href="/admin" className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center p-1">
            <Image
              src="/logo.png"
              alt="Telly Filmy"
              width={32}
              height={32}
              className="h-6 w-auto object-contain"
            />
          </Link>
        )}
        {!mobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex text-slate-400 hover:text-white transition-colors p-1 rounded"
          >
            <ChevronLeft className={cn('h-5 w-5 transition-transform duration-300', isCollapsed && 'rotate-180')} />
          </button>
        )}
        {mobile && (
          <button onClick={() => setMobileOpen(false)} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV_LINKS.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href, link.exact);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center rounded-xl px-3 py-2.5 transition-all duration-200 group relative',
                active
                  ? 'bg-gradient-to-r from-orange-500/20 to-rose-500/20 text-white border border-orange-500/30'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200',
                isCollapsed && !mobile ? 'justify-center' : 'gap-3'
              )}
              title={isCollapsed && !mobile ? link.name : undefined}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-orange-500 to-rose-500 rounded-r-full" />
              )}
              <Icon className={cn('h-5 w-5 shrink-0', active ? 'text-orange-400' : 'text-slate-400 group-hover:text-slate-200')} />
              {(!isCollapsed || mobile) && (
                <span className="font-semibold text-sm">{link.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: View site + logout */}
      <div className="p-3 space-y-1 border-t border-white/10">
        <Link
          href="/"
          target="_blank"
          className={cn(
            'flex items-center rounded-xl px-3 py-2.5 text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors group',
            isCollapsed && !mobile ? 'justify-center' : 'gap-3'
          )}
          title={isCollapsed && !mobile ? 'View Site' : undefined}
        >
          <Home className="h-5 w-5 shrink-0 text-slate-500 group-hover:text-slate-300" />
          {(!isCollapsed || mobile) && <span className="font-semibold text-sm">View Website</span>}
        </Link>
        <button
          onClick={handleLogout}
          className={cn(
            'flex w-full items-center rounded-xl px-3 py-2.5 text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-400 group',
            isCollapsed && !mobile ? 'justify-center' : 'gap-3'
          )}
          title={isCollapsed && !mobile ? 'Logout' : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0 text-slate-500 group-hover:text-rose-400" />
          {(!isCollapsed || mobile) && <span className="font-semibold text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#0B1120] text-slate-50">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden md:block fixed inset-y-0 left-0 z-50 border-r border-white/10 bg-[#0f172a]/90 backdrop-blur-xl transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-[72px]' : 'w-60'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay drawer */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-[#0f172a] border-r border-white/10">
            <SidebarContent mobile />
          </aside>
        </>
      )}

      {/* Main content */}
      <div className={cn('flex flex-1 flex-col transition-all duration-300', isCollapsed ? 'md:ml-[72px]' : 'md:ml-60')}>
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-white/10 bg-[#0f172a]/90 px-4 backdrop-blur-xl">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm min-w-0">
            <span className="text-slate-500 hidden sm:block">Admin</span>
            <span className="text-slate-700 hidden sm:block">/</span>
            <span className="text-slate-200 font-semibold truncate">
              {pathname === '/admin'
                ? 'Dashboard'
                : pathname === '/admin/articles'
                ? 'All Articles'
                : pathname === '/admin/create'
                ? 'New Article'
                : pathname?.includes('/admin/edit')
                ? 'Edit Article'
                : 'Admin'}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Link href="/admin/create">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold rounded-lg text-xs transition-all">
                <PenSquare className="w-3.5 h-3.5" />
                <span className="hidden sm:block">Write Article</span>
                <span className="sm:hidden">Write</span>
              </button>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0f172a]/95 backdrop-blur-xl border-t border-white/10 flex items-center">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href, link.exact);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors',
                  active ? 'text-orange-400' : 'text-slate-500'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-semibold">{link.name}</span>
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-slate-500 hover:text-rose-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Logout</span>
          </button>
        </nav>

        {/* Bottom spacer for mobile nav */}
        <div className="md:hidden h-16" />
      </div>
    </div>
  );
}
