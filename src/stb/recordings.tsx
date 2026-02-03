import { ListColumn, MenuListItem, STBHeader, STBRootLayout } from "../components/stbkit/stb";
import { RowLayout } from "../components/stbkit";
import { FolderIcon, Tv2Icon, TvIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../main";
import type { ItemsApi } from "@jellyfin/sdk/lib/generated-client/api/items-api";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import type { UserViewsApi } from "@jellyfin/sdk/lib/generated-client/api/user-views-api";
import { getUserViewsApi } from "@jellyfin/sdk/lib/utils/api/user-views-api";
import { BaseItemKind, type BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";

function formatMicroseconds(us: number): string {
    const totalSeconds = Math.floor(us / 1_000_000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, "0");

    if (hours > 0) {
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }

    return `${pad(minutes)}:${pad(seconds)}`;
}



export default function Recordings() {
    const { view, setView, jellyfinClient } = useContext(GlobalContext);
    const [itemsApi, setItemsApi] = useState<ItemsApi | null>(null);
    const [UserViewsApi, setUserViewsApi] = useState<UserViewsApi | null>(null);
    const [recId, setRecId] = useState<string | null>(null);
    const [recordings, setRecordings] = useState<{ items: BaseItemDto[], loaded: boolean }>({ items: [], loaded: false })
    useEffect(() => {
        if (!jellyfinClient) return;
        const liveTvApi = getItemsApi(jellyfinClient);
        setItemsApi(liveTvApi);
        const uvapi = getUserViewsApi(jellyfinClient);
        setUserViewsApi(uvapi);
    }, [jellyfinClient]);
    useEffect(() => {
        if (!UserViewsApi) return
        UserViewsApi.getUserViews().then(items => {
            setRecId(items.data.Items?.find(item => item.SortName == "recordings")?.Id)
        })
    })
    useEffect(() => {
        if (!itemsApi || !recId) return
        itemsApi?.getItems({
            parentId: recId,
            fields: [
                "ProviderIds",
                "ChildCount",
                "Overview",
                "RecursiveItemCount"
            ]
        }).then(res => {
            setRecordings({ loaded: true, items: res.data.Items })
        })
    }, [itemsApi, recId])
    return (
        <STBRootLayout onBack={() => { setView("home") }}>
            <STBHeader title="Recordings" subtitle="Storage 30% full" />
            <RowLayout className="flex-1">
                {recordings.loaded && <ListColumn larger>
                    {recordings.items.map(item => (<MenuListItem larger text={item.Name + (item.Type == BaseItemKind.Movie ? "" : " (" + item.RecursiveItemCount + ")")} Icon={item.Type == BaseItemKind.Movie ? TvIcon : FolderIcon} extraInfo={{ title: item.Name, subtitle: item.Type == BaseItemKind.Movie ? formatMicroseconds(item.RunTimeTicks) : (item.RecursiveItemCount + " Episodes • " + item.OfficialRating), description: item.Overview }} />))}
                </ListColumn>}
            </RowLayout>
        </STBRootLayout>
    );
}