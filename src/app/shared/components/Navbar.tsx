import Link from 'next/link';
import MaxWidthWrapper from './MaxWidthWrapper';
import { buttonVariants } from './ui/button';
import { ArrowRight } from 'lucide-react';
import NavbarUserAccount from './NavbarUserAccount';
import NavbarMobile from './NavbarMobile';

const Navbar = () => {
  // const user = getKindeUser();

  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold">
            dododocs
          </Link>

          {/* <NavbarMobile isAuth={Boolean(user)} /> */}

          <div className="hidden items-center space-x-4 sm:flex">
              <>
                <Link
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}
                  href="/pricing"
                >
                  Pricing
                </Link>
                <Link
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}
                  href="/sign-in"
                >
                  Sign in
                </Link>
                <Link
                  className={buttonVariants({
                    size: 'sm',
                  })}
                  href="/sign-up"
                >
                  Get started <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
              </>
            {/* {user && (
              <>
                <Link
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}
                  href="/dashboard"
                >
                  Dashboard
                </Link>
                <NavbarUserAccount
                  name={
                    user.given_name && user.family_name
                      ? `${user.given_name} ${user.family_name}`
                      : 'Your account'
                  }
                  email={user.email ?? undefined}
                  imageUrl={user.picture ?? ''}
                />
              </>
            )} */}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
