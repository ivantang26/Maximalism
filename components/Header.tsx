"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CalmToggle from "./CalmToggle";
import { site } from "@/lib/content/site";
import { primaryNav, secondaryNav } from "@/lib/nav";

const isCurrent = (pathname: string, href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="Loud House, home">
      <span className="logo__loud" aria-hidden="true">
        Loud
      </span>
      <span className="logo__house" aria-hidden="true">
        House
      </span>
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    menuRef.current?.close();
  }, [pathname]);

  const openMenu = () => menuRef.current?.showModal();

  return (
    <header className="site-header">
      <div className="site-header__bar">
        <Logo />
        <nav className="site-nav" aria-label="Main">
          <ul>
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isCurrent(pathname, item.href) ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={site.shopUrl} target="_blank" rel="noopener">
                Shop<span aria-hidden="true"> ↗</span>
                <span className="sr-only"> (opens our online shop in a new tab)</span>
              </a>
            </li>
          </ul>
        </nav>
        <div className="site-header__actions">
          <CalmToggle />
          <Link href="/tickets" className="btn btn--yellow btn--header" aria-current={pathname === "/tickets" ? "page" : undefined}>
            Tickets
          </Link>
          <button type="button" className="menu-button" aria-haspopup="dialog" aria-expanded={open} onClick={openMenu}>
            <span className="menu-button__icon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span className="sr-only">Menu</span>
          </button>
        </div>
      </div>
      <div className="site-header__edge" data-decor aria-hidden="true" />

      <dialog
        ref={menuRef}
        className="menu"
        aria-label="Menu"
        onClose={() => setOpen(false)}
        onToggle={(e) => setOpen((e.currentTarget as HTMLDialogElement).open)}
      >
        <div className="menu__top">
          <Logo />
          <button type="button" className="menu__close" onClick={() => menuRef.current?.close()}>
            Close<span aria-hidden="true"> ✕</span>
          </button>
        </div>
        <nav aria-label="Menu">
          <ul className="menu__primary">
            {primaryNav.map((item, i) => (
              <li key={item.href} style={{ ["--i" as string]: i }}>
                <Link href={item.href} aria-current={isCurrent(pathname, item.href) ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li style={{ ["--i" as string]: primaryNav.length }}>
              <a href={site.shopUrl} target="_blank" rel="noopener">
                Shop<span aria-hidden="true"> ↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
          <ul className="menu__secondary">
            {secondaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="menu__foot">
          <Link href="/tickets" className="btn btn--yellow">
            Book MORE tickets
          </Link>
          <CalmToggle variant="inline" />
        </div>
      </dialog>
    </header>
  );
}
