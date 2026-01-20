import { ListColumn, MenuListItem, STBHeader, STBRootLayout } from "../components/stbkit/stb";
import { RowLayout } from "../components/stbkit";
import { Tv2Icon } from "lucide-react";

export default function Recordings() {
    return (
        <STBRootLayout>
            <STBHeader title="Recordings" subtitle="Storage 30% full" />
            <RowLayout className="flex-1">
                <ListColumn larger>
                    <MenuListItem larger text="Recording name" Icon={Tv2Icon} extraInfo={{ title: "Recording name", subtitle: "Channel name • 1h 30m", description: "Show description" }} />
                    <MenuListItem larger text="Recording name" Icon={Tv2Icon} extraInfo={{ title: "Recording name", subtitle: "Channel name • 1h 30m", description: "Show description" }} />
                    <MenuListItem larger text="Recording name" Icon={Tv2Icon} extraInfo={{ title: "Recording name", subtitle: "Channel name • 1h 30m", description: "Show description" }} />
                    <MenuListItem larger text="Recording name" Icon={Tv2Icon} extraInfo={{ title: "Recording name", subtitle: "Channel name • 1h 30m", description: "Show description" }} />
                    <MenuListItem larger text="Recording name" Icon={Tv2Icon} extraInfo={{ title: "Recording name", subtitle: "Channel name • 1h 30m", description: "Show description" }} />
                    <MenuListItem larger text="Recording name" Icon={Tv2Icon} extraInfo={{ title: "Recording name", subtitle: "Channel name • 1h 30m", description: "Show description" }} />
                    <MenuListItem larger text="Recording name" Icon={Tv2Icon} extraInfo={{ title: "Recording name", subtitle: "Channel name • 1h 30m", description: "Show description" }} />
                    <MenuListItem larger text="Recording name" Icon={Tv2Icon} extraInfo={{ title: "Recording name", subtitle: "Channel name • 1h 30m", description: "Show description" }} />
                    <MenuListItem larger text="Recording name" Icon={Tv2Icon} extraInfo={{ title: "Recording name", subtitle: "Channel name • 1h 30m", description: "Show description" }} />
                    <MenuListItem larger text="Recording name" Icon={Tv2Icon} extraInfo={{ title: "Recording name", subtitle: "Channel name • 1h 30m", description: "Show description" }} />
                    <MenuListItem larger text="Recording name" Icon={Tv2Icon} extraInfo={{ title: "Recording name", subtitle: "Channel name • 1h 30m", description: "Show description" }} />
                    <MenuListItem larger text="Recording name" Icon={Tv2Icon} extraInfo={{ title: "Recording name", subtitle: "Channel name • 1h 30m", description: "Show description" }} />
                    <MenuListItem larger text="Recording name" Icon={Tv2Icon} extraInfo={{ title: "Recording name", subtitle: "Channel name • 1h 30m", description: "Show description" }} />
                    <MenuListItem larger text="Recording name" Icon={Tv2Icon} extraInfo={{ title: "Recording name", subtitle: "Channel name • 1h 30m", description: "Show description" }} />
                    <MenuListItem larger text="Recording name" Icon={Tv2Icon} extraInfo={{ title: "Recording name", subtitle: "Channel name • 1h 30m", description: "Show description" }} />
                    <MenuListItem larger text="Recording name" Icon={Tv2Icon} extraInfo={{ title: "Recording name", subtitle: "Channel name • 1h 30m", description: "Show description" }} />
                    <MenuListItem larger text="Recording name" Icon={Tv2Icon} extraInfo={{ title: "Recording name", subtitle: "Channel name • 1h 30m", description: "Show description" }} />
                    <MenuListItem larger text="Recording name" Icon={Tv2Icon} extraInfo={{ title: "Recording name", subtitle: "Channel name • 1h 30m", description: "Show description" }} />
                    <MenuListItem larger text="Recording name" Icon={Tv2Icon} extraInfo={{ title: "Recording name", subtitle: "Channel name • 1h 30m", description: "Show description" }} />
                </ListColumn>
            </RowLayout>
        </STBRootLayout>
    );
}