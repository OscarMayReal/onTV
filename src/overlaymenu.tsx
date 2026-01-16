import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { RootLayout, RowLayout } from './components/stbkit'
import { HomeIcon, XIcon } from 'lucide-react'
import { ModernIconButton } from './components/stbkit/modern'
import './index.css'
function OverlayMenu() {
    return (
        <>
            <div className='z-40' style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '300px', background: 'linear-gradient(to top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%)' }} />
            <RootLayout className='z-50 fixed top-0 left-0 w-full h-full p-10'>
                <RowLayout className='gap-4'>
                    <ModernIconButton Icon={XIcon} onSelected={() => { close() }} />
                    <ModernIconButton Icon={HomeIcon} />
                    {/* <ModernIconButton Icon={HomeIcon} />
                    <ModernIconButton Icon={HomeIcon} /> */}
                </RowLayout>
            </RootLayout>
        </>
    )
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <OverlayMenu />
    </StrictMode>,
)