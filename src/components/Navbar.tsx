"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart, Heart, Menu, Search, User } from "lucide-react";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface NavbarProps {
    onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = "/";
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-black bg-white text-black">
            <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between gap-8">
                    {/* Left: Menu & Logo */}
                    <div className="flex items-center gap-6">
                        <button
                            onClick={onMenuClick}
                            className="group rounded-md p-1.5 hover:bg-black hover:text-white lg:hidden transition-all duration-200"
                            aria-label="Open menu"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <Link href="/" className="flex items-center">
                            <span className="text-2xl font-black tracking-tighter uppercase italic">
                                Tokyo <span className="opacity-50 font-light">Phashion</span>
                            </span>
                        </Link>
                    </div>

                    {/* Center: Search */}
                    <div className="hidden max-w-xl flex-1 lg:block">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search products, collections, styles..."
                                className="w-full rounded-none border border-black/10 bg-zinc-50 py-2.5 pl-12 pr-4 text-sm text-black placeholder-zinc-400 focus:border-black focus:bg-white focus:outline-none transition-all duration-300"
                            />
                            <Search className="absolute left-4 top-3 h-4 w-4 text-black/40 group-focus-within:text-black transition-colors" />
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1 sm:gap-4">
                        <button className="rounded-md p-2 hover:bg-zinc-100 lg:hidden" aria-label="Search">
                            <Search className="h-5 w-5" />
                        </button>

                        <Link
                            href="/wishlist"
                            className="group relative rounded-md p-2 hover:bg-zinc-100 transition-all"
                            aria-label="Wishlist"
                        >
                            <Heart className="h-5 w-5" />
                            <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white ring-2 ring-white">
                                0
                            </span>
                        </Link>

                        <Link
                            href="/cart"
                            className="group relative rounded-md p-2 hover:bg-zinc-100 transition-all"
                            aria-label="Cart"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white ring-2 ring-white">
                                0
                            </span>
                        </Link>

                        <div className="h-6 w-px bg-zinc-200 hidden sm:block mx-1" />

                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/account"
                                    className="hidden items-center gap-2 rounded-none bg-black px-6 py-2.5 text-[11px] font-black uppercase tracking-widest text-white hover:bg-zinc-800 sm:flex transition-colors"
                                >
                                    <User className="h-3.5 w-3.5" />
                                    Account
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="hidden text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black sm:block transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="hidden items-center gap-2 rounded-none bg-black px-8 py-2.5 text-[11px] font-black uppercase tracking-widest text-white hover:bg-zinc-800 sm:flex transition-colors"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
