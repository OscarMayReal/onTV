export function returnAppsList(config: { jellyfinUrl: string | undefined }) {
    var apps = [
        {
            name: "YouTube",
            icon: "https://i.ibb.co/yB80JsQC/f7d5f5ff2646c63c5bd7d9ad9741bcda-fgraphic.png",
            url: "https://www.youtube.com/tv",
            company: "Google",
            description: "See what the world is watching -- from the hottest music videos to what’s popular in gaming, fitness, movies, shows, news, learning and more. Subscribe to channels you love, browse personal recommendations, and enjoy the largest library of 4K content.",
            userAgent: 'Mozilla/5.0 (PS4; Leanback Shell) Gecko/20100101 Firefox/65.0 LeanbackShell/01.00.01.75 Sony PS4/ (PS4, , no, CH)'
        },
        {
            name: "BBC iPlayer",
            icon: "https://i.ibb.co/BHn4hT2c/BBC-i-Player-Rectangle.jpg",
            url: "https://www.live.bbctvapps.co.uk/tap/iplayer",
            company: "BBC",
            description: "With the BBC iPlayer app you’ll never miss your favourite BBC TV programmes. Catch-up on the last 30 days and enjoy BBC iPlayer exclusive shows."
        },
        {
            name: "BBC Sounds",
            icon: "https://i.ibb.co/tTBBbYDn/BBC-Sounds-Rectangle.png",
            url: "https://www.live.bbctvapps.co.uk/tap/sounds",
            company: "BBC",
            description: "BBC Sounds is the way to listen to BBC audio – your favourite programmes, podcasts, radio stations and music all in one place. Explore a wide variety of new podcasts, music mixes and live sets. Listen live to BBC radio stations. Catch up or listen again to your favourite BBC radio shows."
        },
        {
            name: "Apple TV",
            icon: "https://i.ibb.co/SXXw1VNz/appletv.png",
            url: "https://atve.tv.apple.com/94819831-5404-4438-810e-afb648d6a826/tvw_1dc2aab0a313427dbc11818be8a18bd9/?deeplink=1",
            company: "Apple",
            description: "Stream free movies and TV shows, plus 600+ channels of live TV, instantly, without a subscription. With Plex you can also customize your preferences to include the streaming services you use most and we’ll keep your home screen updated with the freshest finds across the streaming universe.",
            width: 1920,
        },
        {
            name: "Amazon Music",
            icon: "https://i.ibb.co/tpm07Nrn/amazonmusic.png",
            url: "https://html5tv.music.amazon.dev/?deviceModel=A27F3L5WMHDOWD",
            company: "Amazon",
            description: "Stream free movies and TV shows, plus 600+ channels of live TV, instantly, without a subscription. With Plex you can also customize your preferences to include the streaming services you use most and we’ll keep your home screen updated with the freshest finds across the streaming universe."
        },
        {
            name: "Disney+",
            icon: "https://i.ibb.co/1fHBtj01/disney.png",
            url: "https://cd-dmgz.bamgrid.com/bbd/prod/25.26.0.taserface.02/hisense_tv.html?bbdpid=hisense&bounceStart=1769873296846#ot_consent_banner",
            company: "Disney",
            description: "Stream free movies and TV shows, plus 600+ channels of live TV, instantly, without a subscription. With Plex you can also customize your preferences to include the streaming services you use most and we’ll keep your home screen updated with the freshest finds across the streaming universe."
        },
        {
            name: "Paramount+",
            icon: "https://i.ibb.co/M5jSgS8d/Paramount.png",
            url: "https://www.intl.paramountplus.com/smart-console-apps/vidaa/",
            company: "Paramount",
            description: "Stream free movies and TV shows, plus 600+ channels of live TV, instantly, without a subscription. With Plex you can also customize your preferences to include the streaming services you use most and we’ll keep your home screen updated with the freshest finds across the streaming universe."
        },
        {
            name: "Plex",
            icon: "https://i.ibb.co/tTdc4WjT/plex.png",
            url: "https://app.plex.tv/tv-v5-generic",
            company: "Plex",
            description: "Stream free movies and TV shows, plus 600+ channels of live TV, instantly, without a subscription. With Plex you can also customize your preferences to include the streaming services you use most and we’ll keep your home screen updated with the freshest finds across the streaming universe."
        },
        {
            name: "Twitch",
            icon: "https://i.ibb.co/d08MsQmJ/image-2.png",
            url: "https://celadon-arztjmkowcbjjgq11.tv.twitch.tv/",
            company: "Amazon",
            description: "Watch livestream gaming videos, Esports and any IRL broadcast on your Android device! Stream your favorite MMO RPG, strategy and FPS games for PS4, PC, Xbox One and Nintendo Switch. Twitch gives you live streaming and gamer chat in the palm of your hand."
        },
        {
            name: "DAZN",
            icon: "https://i.ibb.co/MyLRtFgX/dazn.png",
            url: "https://tv.dazn.com/app/sky/en-GB/home",
            company: "DAZN",
            description: "The Ultimate Sports Entertainment Platform. DAZN is the only truly global pure-play sports entertainment platform. We uniquely integrate the entire fan experience for fans to watch, play, and socialize, all in one place."
        },
        {
            name: "ITVX",
            icon: "https://i.ibb.co/dwvj7vCP/itvx.png",
            url: "https://app.10ft.itv.com/3.681.0/androidtv/",
            company: "ITV",
            description: "Welcome to the ITVX, your home for everything ITV! Here, you can stream live telly, catch up on the programmes you’ve missed and binge on the box sets that everyone’s talking about."
        },
        {
            name: "Tubi",
            icon: "https://i.ibb.co/Q32Vttdg/tubi.png",
            url: "https://ott-androidtv.tubitv.com/",
            company: "Tubi",
            description: "Nice to meet you, we’re Tubi. We’re more than a completely free streamer with the largest library in the entire streaming universe. We’re entertainment fiends and collectors, and never judgers. So, get comfy and settle into whatever you’re feeling. It’s about to get good."
        },
        {
            name: "UKTV Play",
            icon: "https://i.ibb.co/VFVX74k/uktvplay.png",
            url: "https://tvapp.uktv.co.uk/?brand=default&amp;model=fvp&amp;house_num=None",
            company: "UKTV",
            description: "TV Shows and Programmes: Catch up on all your favourite TV series, entertainment shows, on-demand television episodes, and streaming programmes with UKTV Play – the ultimate online video streaming destination for British television!"
        },
        {
            name: "5 on Demand",
            icon: "https://i.ibb.co/39GJCVrS/5od-2.png",
            url: "https://c5apps.channel5.com/my5hbbtv/index.html#/",
            company: "Channel 5",
            description: "5 brings you your favourite shows from 5, 5STAR, 5USA, 5ACTION, 5SELECT, Milkshake! and more, with extra live channels not available anywhere else."
        },
        {
            name: "STV Player",
            icon: "https://i.ibb.co/XxKv4vZb/stvplayer.png",
            url: "http://youview.player.stv.tv/?#/",
            company: "STV",
            description: "Whether you're into Drama, True Crime, Sports, Documentaries, Films or Soaps, STV Player has you covered. Enjoy thousands of hours of your STV favourites and UK & international hits - all for free."
        },
        {
            name: "Deezer",
            icon: "https://i.ibb.co/gLc5G25W/deezer.png",
            url: "https://tv2.deezer.com/foxxum",
            company: "Deezer",
            description: "Music lover? Stream and listen to top radio hits or discover new songs with the Deezer music player on your OnTV Play Streaming device."
        }
    ]
    if (config?.jellyfinUrl) {
        apps.push(
            {
                name: "Jellyfin",
                icon: "https://i.ibb.co/wrpTd4QD/51i0m01-RSx-L.png",
                url: config.jellyfinUrl,
                company: "Jellyfin",
                description: "Watch back media stored on your Jellyfin server, using the built in Jellyfin UI instead of the OnTV UI"
            }
        )
    }
    return apps
}