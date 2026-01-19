'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { MessageSquare } from 'lucide-react';

export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass-card border-t-0 border-x-0 rounded-none px-6 py-4">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(265,90%,70%)] to-[hsl(340,82%,60%)] flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-semibold bg-gradient-to-r from-[hsl(265,90%,75%)] to-[hsl(340,82%,65%)] bg-clip-text text-transparent">
                        Chain Board
                    </span>
                </div>
                <ConnectButton />
            </div>
        </header>
    );
}
