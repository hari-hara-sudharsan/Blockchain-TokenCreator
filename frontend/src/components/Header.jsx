import React from 'react'


export default function Header({ address, onConnect }) {
return (
<header className="flex items-center justify-between mb-8">
<div>
<h2 className="text-2xl font-bold">SafeMint</h2>
<div className="text-sm text-gray-300">Rug-proof token launcher</div>
</div>


<div>
{!address ? (
<button onClick={onConnect} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">Connect</button>
) : (
<div className="font-mono bg-white/6 px-3 py-2 rounded">{address.slice(0,6)}...{address.slice(-4)}</div>
)}
</div>
</header>
)
}