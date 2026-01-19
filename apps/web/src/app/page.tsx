'use client';

import { Header, MessageBoard, MessageInput } from '@/components';

export const dynamic = 'force-dynamic';

export default function Home() {
    return (
        <main className="min-h-screen">
            <Header />
            <div className="max-w-2xl mx-auto pt-28 pb-8 px-4">
                <div className="mb-6 text-center">
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[hsl(265,90%,75%)] via-[hsl(300,85%,70%)] to-[hsl(340,82%,65%)] bg-clip-text text-transparent">
                        Chain Message Board
                    </h1>
                    <p className="text-[hsl(var(--muted-foreground))]">
                        Leave your mark on the blockchain forever
                    </p>
                </div>

                <div className="mb-6">
                    <MessageInput />
                </div>

                <div className="mb-4 flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">Messages</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-[hsl(var(--border))] to-transparent" />
                </div>

                <MessageBoard />
            </div>
        </main>
    );
}
