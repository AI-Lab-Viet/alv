'use client';

import { usePathname } from 'next/navigation';
import NavBar from './nav-bar';

interface NavBarWrapperProps {
  children: React.ReactNode;
}

export default function NavBarWrapper({ children }: NavBarWrapperProps) {
  const pathname = usePathname();

  const hideNavBarPaths = ['/login', '/register', '/auth'];
  const shouldShowNavBar = !hideNavBarPaths.includes(pathname);

  return (
    <div className='h-full flex flex-col'>
      {shouldShowNavBar && <NavBar currentPath={pathname} />}
      <main className='flex-1 overflow-auto'>{children}</main>
    </div>
  );
}
