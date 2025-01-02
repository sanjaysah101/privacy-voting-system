'use client';

import { useAccount, useConnect, useDisconnect } from '@starknet-react/core';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';

export function WalletConnect() {
  const { address } = useAccount();
  const { connect, error: connectError, connectors } = useConnect();
  const { disconnect, error: disconnectError } = useDisconnect();
  const [availableConnectors, setAvailableConnectors] = useState<
    typeof connectors
  >([]);

  useEffect(() => {
    setAvailableConnectors(connectors.filter((c) => c.available()));
  }, [connectors]);

  if (address) {
    return (
      <div className="flex items-center justify-center space-x-4">
        <div className="flex items-center space-x-2">
          <Wallet className="w-5 h-5" />
          <span className="text-sm">
            Connected: {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={() => disconnect()}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <h3 className="text-xl font-semibold">Connect Your Wallet</h3>
      <div className="flex space-x-4">
        {availableConnectors.map((connector) => (
          <Button
            key={connector.id}
            onClick={() => connect({ connector })}
            variant="outline"
          >
            Connect{' '}
            {connector.id.charAt(0).toUpperCase() + connector.id.slice(1)}
          </Button>
        ))}
        {connectError && (
          <p className="text-sm text-red-500">{connectError.message}</p>
        )}
        {disconnectError && (
          <p className="text-sm text-red-500">{disconnectError.message}</p>
        )}
      </div>
      <p className="text-sm text-gray-400">
        Please install Argent X or Braavos wallet if not already installed
      </p>
    </div>
  );
}
