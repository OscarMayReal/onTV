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
import StbApp from './stb/stb.tsx'
import StbSettings from './stb/settings.tsx'
import Recordings from './stb/recordings.tsx'
import TvGuide from './stb/tvguide.tsx'
import { Setup } from './stb/setup.tsx'
import Search from './stb/search.tsx'

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
  const [view, setView] = useState("home")
  useEffect(() => {
    if (!window.goHome) {
      window.goHome = () => {
        // if (JSON.parse(window.localStorage.getItem("config") ?? "null").isSetupCompleted) {
        if (true) {
          setView("home");
        } else {
          setView("setup");
        }
      }
    }
    function PlayDirectionSound() {
      // document.body.requestFullscreen();
      const audio = new Audio(click);
      audio.play();
    }
    function KeyListener(e: KeyboardEvent) {
      // if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        PlayDirectionSound();
      }
      // if (e.key === 's' && JSON.parse(window.localStorage.getItem("config") ?? "null").isSetupCompleted) {
      if (e.key === 's') {
        setView("settings");
      }
      // if (e.key === 'h' && JSON.parse(window.localStorage.getItem("config") ?? "null").isSetupCompleted) {
      if (e.key === 'h') {
        setView("home");
      }
      // if (e.key === 'l' && JSON.parse(window.localStorage.getItem("config") ?? "null").isSetupCompleted) {
      if (e.key === 'l') {
        setView("livetv");
      }
      if (e.key === 'f') {
        setView("search");
      }
      // if (e.key === 'u' && JSON.parse(window.localStorage.getItem("config") ?? "null").isSetupCompleted) {
      if (e.key === 'u') {
        window.localStorage.removeItem("user");
        setCurrentUser(null);
        setView("home");
      }
    }
    window.addEventListener('keydown', KeyListener);
    return () => {
      window.removeEventListener('keydown', KeyListener);
    }
  }, []);
  const [jellyfinClient, setJellyfinClient] = useState<Api | null>(null)
  const [config, setConfig] = useState(JSON.parse(window.localStorage.getItem("config") ?? "null"))
  useEffect(() => {
    // if (!config.isSetupCompleted) {
    //   setView("setup");
    // }
    window.localStorage.setItem("config", JSON.stringify(config))
  }, [config])
  const [currentUser, setCurrentUser] = useState<UserDto | null>(JSON.parse(window.localStorage.getItem("user") ?? "null"))
  return (
    <GlobalContext.Provider value={{ view, setView, config, setConfig, currentUser, setCurrentUser, jellyfinClient, setJellyfinClient }}>
      {view.split("?")[0].split("/")[0] === "home" && (OnTVConfig.serviceInfo.mode == "stb" ? <StbApp /> : <App />)}
      {view.split("?")[0].split("/")[0] === "livetv" && <LiveTV />}
      {view.split("?")[0].split("/")[0] === "keyboarddemo" && <KeyboardDemo />}
      {view.split("?")[0].split("/")[0] === "settings" && (OnTVConfig.serviceInfo.mode == "stb" ? <StbSettings /> : <Settings />)}
      {view.split("?")[0].split("/")[0] === "hdmi" && <HDMIViewer />}
      {view.split("?")[0].split("/")[0] === "recordings" && <Recordings />}
      {view.split("?")[0].split("/")[0] === "setup" && <Setup />}
      {view.split("?")[0].split("/")[0] === "tvguide" && <TvGuide />}
      {view.split("?")[0].split("/")[0] === "search" && <Search />}
    </GlobalContext.Provider>
  )
}