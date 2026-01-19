import { useReadContract, useWriteContract, useWatchContractEvent } from 'wagmi';
import { messageBoardAbi, messageBoardAddress } from './abi';
import { type Address, type Log } from 'viem';

// Type for the NewMessage event args
interface NewMessageEventArgs {
    sender: Address;
    message: string;
}

// Read Hooks
export function useGetMessageCount(user: Address | undefined) {
    const result = useReadContract({
        abi: messageBoardAbi,
        address: messageBoardAddress,
        functionName: 'getMessageCount',
        args: user ? [user] : undefined,
        query: {
            enabled: !!user,
        }
    });

    return {
        ...result,
        count: result.data ? Number(result.data) : 0,
    };
}

export function useGetMessage(user: Address | undefined, index: number) {
    return useReadContract({
        abi: messageBoardAbi,
        address: messageBoardAddress,
        functionName: 'getMessage',
        args: user ? [user, BigInt(index)] : undefined,
        query: {
            enabled: !!user && index >= 0,
        }
    });
}

// Write Hook
export function useLeaveMessage() {
    const { writeContract, ...rest } = useWriteContract();

    const leaveMessage = (message: string) => {
        writeContract({
            abi: messageBoardAbi,
            address: messageBoardAddress,
            functionName: 'leaveMessage',
            args: [message],
        });
    };

    return {
        leaveMessage,
        ...rest,
    };
}

// Event Hook - properly typed
export function useOnNewMessage(onMessage: (sender: Address, message: string) => void) {
    useWatchContractEvent({
        address: messageBoardAddress,
        abi: messageBoardAbi,
        eventName: 'NewMessage',
        poll: true,
        pollingInterval: 2_000,
        onLogs(logs: Log<bigint, number, false, typeof messageBoardAbi[1], undefined, [typeof messageBoardAbi[1]], 'NewMessage'>[]) {
            logs.forEach((log) => {
                const args = log.args as unknown as NewMessageEventArgs;
                if (args.sender && args.message) {
                    onMessage(args.sender, args.message);
                }
            });
        },
    });
}
