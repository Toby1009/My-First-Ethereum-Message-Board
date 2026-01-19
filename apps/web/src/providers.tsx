'use client';

import { RainbowKitProvider, getDefaultConfig, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider, cookieStorage, createStorage, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const config = getDefaultConfig({
    appName: 'Chain Message Board',
    projectId: 'c4f79cc821944d9680842e34466bfb',
    chains: [sepolia],
    transports: {
        [sepolia.id]: http(),
    },
    ssr: true,
    storage: createStorage({
        storage: cookieStorage,
    }),
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider theme={darkTheme({
                    accentColor: 'hsl(265, 90%, 70%)',
                    accentColorForeground: 'white',
                    borderRadius: 'medium',
                    fontStack: 'system',
                })}>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
