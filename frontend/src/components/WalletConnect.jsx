// src/components/WalletConnectButton.jsx
// In any component (App.jsx, TokenCard.jsx, LaunchModal.jsx, etc.)
import { useAccount, useDisconnect } from 'wagmi'
import { modal } from '@/lib/walletConfig'

function WalletButton() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  return (
    <div>
      {isConnected ? (
        <>
          <span>{address?.slice(0,6)}...{address?.slice(-4)}</span>
          <button onClick={() => disconnect()}>Disconnect</button>
        </>
      ) : (
        <button onClick={() => modal.open()}>Connect Wallet</button>
      )}
    </div>
  )
}
