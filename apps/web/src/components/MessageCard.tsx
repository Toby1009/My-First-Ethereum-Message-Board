'use client';

import { formatAddress } from '@/lib/utils';
import { type Address } from 'viem';
import { motion } from 'framer-motion';

interface MessageCardProps {
    sender: Address;
    message: string;
    index: number;
}

export function MessageCard({ sender, message, index }: MessageCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="glass-card p-4 hover:border-[hsla(265,90%,70%,0.3)] transition-colors duration-300"
        >
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(265,90%,70%)] to-[hsl(230,80%,60%)] flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-white">
                        {sender.slice(2, 4).toUpperCase()}
                    </span>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-[hsl(var(--muted-foreground))] font-mono mb-1">
                        {formatAddress(sender)}
                    </p>
                    <p className="text-[hsl(var(--foreground))] break-words">{message}</p>
                </div>
            </div>
        </motion.div>
    );
}
