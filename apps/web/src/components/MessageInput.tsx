'use client';

import { useState, useEffect } from 'react';
import { useLeaveMessage } from '@my-first-dapp/chain-board-sdk';
import { useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { useQueryClient } from '@tanstack/react-query';
import { Send, Loader2, ExternalLink, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function MessageInput() {
    const [message, setMessage] = useState('');
    const { leaveMessage, isPending: isSigning, data: hash } = useLeaveMessage();
    const { isConnected } = useAccount();

    const { isLoading: isMining, isSuccess } = useWaitForTransactionReceipt({
        hash
    });

    const isPending = isSigning || isMining;
    const queryClient = useQueryClient();

    useEffect(() => {
        if (isSuccess) {
            setMessage('');
            // Force refresh of the message list
            queryClient.invalidateQueries({ queryKey: ['messages'] });
        }
    }, [isSuccess, queryClient]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !isConnected) return;

        leaveMessage(message.trim());
    };

    return (
        <div className="space-y-4">
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-4"
                onSubmit={handleSubmit}
            >
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={isConnected ? "Write your message..." : "Connect wallet to write..."}
                        disabled={!isConnected || isPending}
                        className="flex-1 bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-lg px-4 py-3 text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                        type="submit"
                        disabled={!isConnected || !message.trim() || isPending}
                        className="px-5 py-3 bg-gradient-to-r from-[hsl(265,90%,65%)] to-[hsl(340,82%,55%)] text-white font-medium rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px] justify-center"
                    >
                        {isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                        <span className="hidden sm:inline">
                            {isSigning ? 'Sign' : isMining ? 'Mining' : 'Send'}
                        </span>
                    </button>
                </div>
            </motion.form>

            <AnimatePresence>
                {hash && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex justify-end"
                    >
                        <a
                            href={`https://sepolia.etherscan.io/tx/${hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 text-xs px-3 py-2 rounded-full border transition-colors ${isSuccess
                                ? 'bg-green-500/10 border-green-500/20 text-green-500'
                                : 'bg-[hsl(var(--muted))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                                }`}
                        >
                            {isSuccess ? (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            )}
                            <span>
                                {isSuccess ? 'Message sent!' : 'Transaction submitted'}
                            </span>
                            <span className="font-mono opacity-70">
                                {hash.slice(0, 6)}...{hash.slice(-4)}
                            </span>
                            <ExternalLink className="w-3 h-3 ml-0.5" />
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
