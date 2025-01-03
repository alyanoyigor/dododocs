'use client';

import { ArrowRight, MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';

type NavbarMobileProps = {
  isAuth: boolean;
};

const NavbarMobile = ({ isAuth }: NavbarMobileProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      toggleOpen();
    }
  };

  useEffect(() => {
    if (isOpen) {
      toggleOpen();
    }
  }, [pathname]);

  return (
    <div className="sm:hidden">
      <MenuIcon
        onClick={toggleOpen}
        className="relative z-50 h-5 w-5 text-zinc-700"
      />

      {isOpen && (
        <div className="fixed animate-in slide-in-from-top-5 fade-in-20 inset-0 z-0 w-full">
          <ul className="absolute bg-white border-b border-zinc-200 shadow-xl grid w-full gap-3 px-10 pt-20 pb-8">
            {!isAuth && (
              <>
                <li>
                  <Button className="flex items-center w-full font-semibold text-green-600">
                    Get started <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                <li>
                  <Button className="flex items-center w-full font-semibold">
                    Sign in
                  </Button>
                </li>
              </>
            )}
            {isAuth && (
              <>
                <li>
                  <Link
                    onClick={() => closeOnCurrent('/dashboard')}
                    className="flex items-center w-full font-semibold"
                    href="/dashboard"
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                <li>
                  <Button className="flex items-center w-full font-semibold">
                    Sign out
                  </Button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NavbarMobile;
