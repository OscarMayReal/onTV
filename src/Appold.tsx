import { FocusNode, FocusRoot } from '@please/lrud';
import { ArrowLeftRightIcon, MenuIcon, PlayIcon, SearchIcon, Settings2Icon, SettingsIcon, Tv2Icon } from 'lucide-react';
import { useEffect, useRef, useState, type JSX } from 'react';
import { ListItem, MenuTile, SearchBox, TabsMenuItem, TabsMenuRow } from './components/stbkit';

export default function App() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="p-10 h-[100dvh] w-[100dvw]">
      <FocusRoot>
        <FocusNode className="flex flex-col" orientation="vertical">
          {/* <FocusNode className="flex flex-row" orientation="horizontal">
            <SearchBox />
          </FocusNode>
          <FocusNode isGrid defaultFocusColumn={0} defaultFocusRow={0}>
            <FocusNode className="flex flex-row pt-10 gap-4" orientation="horizontal">
              <MenuTile />
              <MenuTile />
              <MenuTile />
            </FocusNode>
            <FocusNode className="flex flex-row pt-4 gap-4" orientation="horizontal">
              <MenuTile />
              <MenuTile />
              <MenuTile />
            </FocusNode>
          </FocusNode> */}
          {/* <TabsMenuRow defaultFocusChild={activeTab}>
            <TabsMenuItem Icon={Tv2Icon} onActive={() => { setActiveTab(0) }} active={activeTab === 0} Text="TV Guide" />
            <TabsMenuItem Icon={PlayIcon} onActive={() => { setActiveTab(1) }} active={activeTab === 1} Text="Recordings" />
            <TabsMenuItem Icon={MenuIcon} onActive={() => { setActiveTab(2) }} active={activeTab === 2} Text="Menu" />
            <TabsMenuItem Icon={ArrowLeftRightIcon} onActive={() => { setActiveTab(3) }} active={activeTab === 3} Text="Interactive" />
            <TabsMenuItem Icon={SettingsIcon} onActive={() => { setActiveTab(4) }} active={activeTab === 4} Text="Settings" />
          </TabsMenuRow>
          <FocusNode orientation="vertical" className="stbkit-list pt-10">
            <ListItem Text="Catagory 1" />
            <ListItem Text="Catagory 2" />
            <ListItem Text="Catagory 3" />
            <ListItem Text="Catagory 4" />
            <ListItem Text="Catagory 5" />
          </FocusNode> */}
        </FocusNode>
      </FocusRoot>
    </div>
  );
}

