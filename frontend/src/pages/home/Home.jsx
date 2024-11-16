import React from 'react'
import Logout from '../../components/Logout';
import NodeEditor from '../../components/NodeEditor';

function Home() {
  return (
    <div className='flex flex-col min-w-full min-h-screen'>
      <header className='p-4 flex justify-end text-2xl'>
        <Logout />
      </header>
      <main className='flex-grow flex flex-col lg:flex-row p-4 gap-8'>
        <NodeEditor />
      </main>
    </div>
  )
}

export default Home;