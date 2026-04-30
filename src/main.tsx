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
import StreamTvGuide from './tvguide.tsx'
import { Setup } from './stb/setup.tsx'
import Search from './stb/search.tsx'
import AllApps from './allapps.tsx'
import HandTrackDemo from './handtrackdemo.tsx'
import Bookmarks from './Bookmarks.tsx'
import StreamTV from "./streamtv.tsx"

export const GlobalContext = createContext({
  view: "home",
  setView: (view: string) => { },
  config: null as any,
  setConfig: (config: any) => { },
  currentUser: null as UserDto | null,
  setCurrentUser: (user: UserDto | null) => { },
  jellyfinClient: null as Api | null,
  setJellyfinClient: (client: Api | null) => { },
  hosts: null as any,
  setHosts: (hosts: any) => { },
  tvClient: null as any,
  setTvClient: (client: any) => { },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>,
)

function AppWrapper() {
  const [view, setView] = useState("home")
  const [tvClient, setTvClient] = useState(null)
  useEffect(() => {
    window.goHome = () => {
      console.log(tvClient)
      if (typeof tvClient?.stop == 'function') {
        console.log(tvClient)
        tvClient.stop()
        // setTvClient(null)
      } else if (tvClient == null) {
        setView("home");
      } else {
        setView("setup");
      }
    };
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
        if (view == "livetv") {
          setView("tvguide");
        } else {
          setView("livetv");
        }
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
  }, [view, tvClient]);
  const [jellyfinClient, setJellyfinClient] = useState<Api | null>(null)
  const [config, setConfig] = useState(JSON.parse(window.localStorage.getItem("config") ?? "null"))
  useEffect(() => {
    // if (!config.isSetupCompleted) {
    //   setView("setup");
    // }
    window.localStorage.setItem("config", JSON.stringify(config))
  }, [config])
  const [currentUser, setCurrentUser] = useState<UserDto | null>(JSON.parse(window.localStorage.getItem("user") ?? "null"))
  const [hosts, setHosts] = useState({ loaded: false, items: [] })
  useEffect(() => {
    if (hosts.loaded) return
    scanMdns({ timeOut: 3000 }).then(items => {
      setHosts({ loaded: true, items })
    }).catch(() => {
      console.log("2nd")
    })
  }, [hosts])
  return (
    <GlobalContext.Provider value={{
      view, setView, config, setConfig, currentUser, setCurrentUser, jellyfinClient, setJellyfinClient, hosts, setHosts, tvClient, setTvClient: (inp) => {
        console.log(inp)
        setTvClient(inp)
      }
    }}>
      {view.split("?")[0].split("/")[0] === "home" && (OnTVConfig.serviceInfo.mode == "stb" ? <StbApp /> : <App />)}
      {view.split("?")[0].split("/")[0] === "livetv" && (OnTVConfig.serviceInfo.mode == "stb" ? <LiveTV /> : <StreamTV />)}
      {view.split("?")[0].split("/")[0] === "keyboarddemo" && <KeyboardDemo />}
      {/* {view.split("?")[0].split("/")[0] === "settings" && (OnTVConfig.serviceInfo.mode == "stb" ? <StbSettings /> : <Settings />)} */}
      {view.split("?")[0].split("/")[0] === "settings" && <StbSettings />}
      {view.split("?")[0].split("/")[0] === "hdmi" && <HDMIViewer />}
      {view.split("?")[0].split("/")[0] === "recordings" && <Recordings />}
      {view.split("?")[0].split("/")[0] === "setup" && <Setup />}
      {view.split("?")[0].split("/")[0] === "tvguide" && (OnTVConfig.serviceInfo.mode == "stb" ? <TvGuide /> : <StreamTvGuide />)}
      {view.split("?")[0].split("/")[0] === "search" && <Search />}
      {view.split("?")[0].split("/")[0] === "allapps" && <AllApps />}
      {view.split("?")[0].split("/")[0] === "bookmarks" && <Bookmarks />}
      {config?.smartFeatures?.camera?.autoPower == true && <HandTrackDemo hideinfo={true} />}
    </GlobalContext.Provider>
  )
}