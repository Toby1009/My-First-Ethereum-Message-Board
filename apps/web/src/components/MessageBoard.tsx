'use client';

import { useCallback } from 'react';
import { usePublicClient, useBlockNumber, useAccount } from 'wagmi';
import { type Address, parseAbiItem } from 'viem';
import { messageBoardAddress, useOnNewMessage } from '@my-first-dapp/chain-board-sdk';
import { MessageCard } from './MessageCard';
import { Loader2, MessageSquare, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface Message {
    sender: Address;
    message: string;
    blockNumber: bigint;
}

export function MessageBoard() {
    const publicClient = usePublicClient();
    const { chain } = useAccount();

    const fetchMessages = async () => {
        if (!publicClient) return [];

        try {
            const currentBlock = await publicClient.getBlockNumber();
            const bucketSize = BigInt(800);
            const fromBlock = currentBlock > bucketSize
                ? currentBlock - bucketSize
                : BigInt(0);

            const logs = await publicClient.getLogs({
                address: messageBoardAddress,
                event: parseAbiItem('event NewMessage(address indexed sender, string message)'),
                fromBlock,
                toBlock: 'latest',
            });

            const parsedMessages: Message[] = logs.map((log) => ({
                sender: log.args.sender as Address,
                message: log.args.message as string,
                blockNumber: log.blockNumber,
            }));

            // Most recent first
            return parsedMessages.reverse();
        } catch (err: any) {
            console.error('Failed to fetch messages:', err);
            throw new Error(err?.message || 'Failed to fetch messages');
        }
    };

    const {
        data: messages = [],
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['messages', chain?.id],
        queryFn: fetchMessages,
        refetchInterval: 10000, // Fallback polling every 10s
    });

    // Listen for new messages in real-time
    const handleNewMessage = useCallback((sender: Address, message: string) => {
        // Optimistic update or just refetch
        refetch();
    }, [refetch]);

    useOnNewMessage(handleNewMessage);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-[hsl(var(--primary))] animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-[hsl(var(--muted-foreground))]">
                <p className="text-sm text-red-400 mb-4">{(error as Error).message}</p>
                <button
                    onClick={() => refetch()}
                    className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--muted))] rounded-lg hover:bg-[hsl(var(--border))] transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Retry
                </button>
            </div>
        );
    }

    if (messages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-[hsl(var(--muted-foreground))]">
                <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-lg">No messages yet</p>
                <p className="text-sm">Be the first to leave a message!</p>
                <button
                    onClick={() => refetch()}
                    className="mt-4 flex items-center gap-2 px-4 py-2 bg-[hsl(var(--muted))] rounded-lg hover:bg-[hsl(var(--border))] transition-colors text-sm"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <button
                    onClick={() => refetch()}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[hsl(var(--muted))] rounded-lg hover:bg-[hsl(var(--border))] transition-colors text-sm text-[hsl(var(--muted-foreground))]"
                >
                    <RefreshCw className="w-3 h-3" />
                    Refresh
                </button>
            </div>
            {messages.map((msg, index) => (
                <MessageCard
                    key={`${msg.sender}-${msg.blockNumber}-${index}`}
                    sender={msg.sender}
                    message={msg.message}
                    index={index}
                />
            ))}
        </div>
    );
}
