import { createContext, StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import type { Api } from '@jellyfin/sdk'
import type { UserDto } from '@jellyfin/sdk/lib/generated-client/models'
import LiveTV from './livetv.tsx'
import click from "./public/click.mp3"
import KeyboardDemo from './keyboarddemo.tsx'
import { Settings } from './settings.tsx'
import HDMIViewer from './hdmi.tsx'
import { OnTVConfig } from './info.tsx'
import StbApp from './stb.tsx'

export const GlobalContext = createContext({
  view: "home",
  setView: (view: string) => { },
  config: null as any,
  setConfig: (config: any) => { },
  currentUser: null as UserDto | null,
  setCurrentUser: (user: UserDto | null) => { },
  jellyfinClient: null as Api | null,
  setJellyfinClient: (client: Api | null) => { },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>,
)

function AppWrapper() {
  useEffect(() => {
    function PlayDirectionSound() {
      // document.body.requestFullscreen();
      const audio = new Audio(click);
      audio.play();
    }
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        PlayDirectionSound();
      }
    });
    return () => {
      window.removeEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          PlayDirectionSound();
        }
      });
    };
  }, []);
  const [view, setView] = useState("home")
  const [jellyfinClient, setJellyfinClient] = useState<Api | null>(null)
  const [config, setConfig] = useState(JSON.parse(window.localStorage.getItem("config") ?? "null"))
  const [currentUser, setCurrentUser] = useState<UserDto | null>(JSON.parse(window.localStorage.getItem("user") ?? "null"))
  return (
    <GlobalContext.Provider value={{ view, setView, config, setConfig, currentUser, setCurrentUser, jellyfinClient, setJellyfinClient }}>
      {view.split("?")[0].split("/")[0] === "home" && OnTVConfig.serviceInfo.mode == "stb" ? <StbApp /> : <App />}
      {view.split("?")[0].split("/")[0] === "livetv" && <LiveTV />}
      {view.split("?")[0].split("/")[0] === "keyboarddemo" && <KeyboardDemo />}
      {view.split("?")[0].split("/")[0] === "settings" && <Settings />}
      {view.split("?")[0].split("/")[0] === "hdmi" && <HDMIViewer />}
    </GlobalContext.Provider>
  )
}