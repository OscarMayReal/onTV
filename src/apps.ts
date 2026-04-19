import { Tags } from "lucide-react"

export function returnAppsList(config: { jellyfinUrl: string | undefined }) {
    var apps = [
        {
            name: "YouTube",
            icon: "https://i.ibb.co/yB80JsQC/f7d5f5ff2646c63c5bd7d9ad9741bcda-fgraphic.png",
            url: "https://www.youtube.com/tv",
            company: "Google",
            description: "See what the world is watching -- from the hottest music videos to what’s popular in gaming, fitness, movies, shows, news, learning and more. Subscribe to channels you love, browse personal recommendations, and enjoy the largest library of 4K content.",
            // userAgent: 'Mozilla/5.0 (PS4; Leanback Shell) Gecko/20100101 Firefox/65.0 LeanbackShell/01.00.01.75 Sony PS4/ (PS4, , no, CH)',
            category: "Web Video",
            // userAgent: "Roku/DVP-15.0 (15.0.4.5531-AY)"
            userAgent: 'Mozilla/5.0 (Linux; Tizen 5.0) AppleWebKit/538.1 (KHTML, like Gecko) Version/5.0 TV Safari/538.1'
        },
        {
            name: "BBC iPlayer",
            icon: "https://i.ibb.co/BHn4hT2c/BBC-i-Player-Rectangle.jpg",
            url: "https://www.live.bbctvapps.co.uk/tap/iplayer",
            company: "BBC",
            description: "With the BBC iPlayer app you’ll never miss your favourite BBC TV programmes. Catch-up on the last 30 days and enjoy BBC iPlayer exclusive shows.",
            category: "UK Free to Air",
            tags: ["sport", "entertainment", "british", "freetoair", "news", "kids"]
        },
        {
            name: "BBC Sounds",
            icon: "https://i.ibb.co/tTBBbYDn/BBC-Sounds-Rectangle.png",
            url: "https://www.live.bbctvapps.co.uk/tap/sounds",
            company: "BBC",
            description: "BBC Sounds is the way to listen to BBC audio – your favourite programmes, podcasts, radio stations and music all in one place. Explore a wide variety of new podcasts, music mixes and live sets. Listen live to BBC radio stations. Catch up or listen again to your favourite BBC radio shows.",
            category: "UK Free to Air",
            tags: ["audio", "entertainment", "british", "freetoair", "news"]
        },
        {
            name: "Apple TV",
            icon: "https://i.ibb.co/SXXw1VNz/appletv.png",
            url: "https://atve.tv.apple.com/94819831-5404-4438-810e-afb648d6a826/tvw_1dc2aab0a313427dbc11818be8a18bd9/?deeplink=1",
            company: "Apple",
            description: "Apple TV is the home of exclusive Apple Original shows and movies, Friday Night Baseball, MLS Season Pass, thousands of movies to buy or rent, and all the best programming from your favorite streaming services — all in one place.",
            width: 1280,
            category: "Premium"
        },
        {
            name: "Amazon Music",
            icon: "https://i.ibb.co/tpm07Nrn/amazonmusic.png",
            url: "https://html5tv.music.amazon.dev/?deviceModel=A27F3L5WMHDOWD",
            company: "Amazon",
            description: "We're changing the way you discover and play the music you love. Listen free to music and podcasts with ads – no credit card required. Want more benefits? Get 100 million songs on demand, ad-free top podcasts and audiobooks from Audible with Amazon Music Unlimited.",
            category: "Music"
        },
        {
            name: "Radioplayer",
            icon: "https://i.ibb.co/fzm9K5Yf/Radio-Player.png",
            url: "https://vidaa.prod.tv.radioplayer.org/#/",
            company: "Radioplayer Worldwide",
            description: "Radioplayer brings you all your favourite national and local radio stations with the official app released and owned by radio stations worldwide. Unleash the power of audio entertainment with Radioplayer.",
            category: "Music"
        },
        {
            name: "Disney+",
            icon: "https://i.ibb.co/1fHBtj01/disney.png",
            url: "https://cd-dmgz.bamgrid.com/bbd/prod/25.26.0.taserface.02/hisense_tv.html?bbdpid=hisense&bounceStart=1769873296846#ot_consent_banner",
            company: "Disney",
            description: "Disney+ is your go-to streaming destination of blockbuster movies, brand new originals and exclusive hit shows from Disney, Pixar, Star Wars, Marvel, Hulu",
            category: "Premium"
        },
        {
            name: "Paramount+",
            icon: "https://i.ibb.co/M5jSgS8d/Paramount.png",
            url: "https://www.intl.paramountplus.com/smart-console-apps/vidaa/",
            company: "Paramount",
            description: "Stream blockbusters, new originals, exclusive series and hit shows across drama, action, reality, comedy and family favourites. Paramount+ offers a mountain of entertainment that’s captivating in every way.",
            category: "Premium"
        },
        {
            name: "Hayu",
            icon: "https://i.ibb.co/67PzHqfd/hayu.png",
            company: "NBC Universal International",
            url: "https://mytv.hayu.com/home",
            description: "Hayu is THE home of reality TV – Sign up today and start your free trial!. Step into a world of endless reality TV with over 9000 episodes, All the drama the same day as the USA, Every episode, every season, every spin-off, ever!",
            category: "Premium"
        },
        {
            name: "Plex",
            icon: "https://i.ibb.co/tTdc4WjT/plex.png",
            url: "https://app.plex.tv/tv-v5-generic",
            company: "Plex",
            description: "Stream free movies and TV shows, plus 600+ channels of live TV, instantly, without a subscription. With Plex you can also customize your preferences to include the streaming services you use most and we’ll keep your home screen updated with the freshest finds across the streaming universe.",
            category: "Free Ad Supported"
        },
        {
            name: "Twitch",
            icon: "https://i.ibb.co/d08MsQmJ/image-2.png",
            url: "https://celadon-arztjmkowcbjjgq11.tv.twitch.tv/",
            company: "Amazon",
            description: "Watch livestream gaming videos, Esports and any IRL broadcast on your Android device! Stream your favorite MMO RPG, strategy and FPS games for PS4, PC, Xbox One and Nintendo Switch. Twitch gives you live streaming and gamer chat in the palm of your hand.",
            category: "Web Video"
        },
        {
            name: "DAZN",
            icon: "https://i.ibb.co/MyLRtFgX/dazn.png",
            url: "https://tv.dazn.com/app/sky/en-GB/home",
            company: "DAZN",
            description: "The Ultimate Sports Entertainment Platform. DAZN is the only truly global pure-play sports entertainment platform. We uniquely integrate the entire fan experience for fans to watch, play, and socialize, all in one place.",
            category: "Premium",
            tags: ["sport"]
        },
        {
            name: "ITVX",
            icon: "https://i.ibb.co/dwvj7vCP/itvx.png",
            url: "https://app.10ft.itv.com/3.681.0/androidtv/",
            company: "ITV",
            description: "Welcome to the ITVX, your home for everything ITV! Here, you can stream live telly, catch up on the programmes you’ve missed and binge on the box sets that everyone’s talking about.",
            category: "UK Free to Air",
            tags: ["sport", "entertainment", "british", "freetoair"]
        },
        {
            name: "Tubi",
            icon: "https://i.ibb.co/Q32Vttdg/tubi.png",
            url: "https://ott-androidtv.tubitv.com/",
            company: "Tubi",
            description: "Nice to meet you, we’re Tubi. We’re more than a completely free streamer with the largest library in the entire streaming universe. We’re entertainment fiends and collectors, and never judgers. So, get comfy and settle into whatever you’re feeling. It’s about to get good.",
            category: "Free Ad Supported"
        },
        {
            name: "UKTV Play",
            icon: "https://i.ibb.co/VFVX74k/uktvplay.png",
            url: "https://ctv-primary.ppdevuktv.co.uk",
            // url: "https://tvapp.uktv.co.uk/?brand=default&amp;model=fvp&amp;house_num=None",
            company: "UKTV",
            description: "TV Shows and Programmes: Catch up on all your favourite TV series, entertainment shows, on-demand television episodes, and streaming programmes with UKTV Play – the ultimate online video streaming destination for British television!",
            category: "UK Free to Air",
            width: 1920,
        },
        {
            name: "5 on Demand",
            icon: "https://i.ibb.co/39GJCVrS/5od-2.png",
            url: "https://c5apps.channel5.com/my5hbbtv/index.html#/",
            company: "Channel 5",
            description: "5 brings you your favourite shows from 5, 5STAR, 5USA, 5ACTION, 5SELECT, Milkshake! and more, with extra live channels not available anywhere else.",
            category: "UK Free to Air"
        },
        {
            name: "STV Player",
            icon: "https://i.ibb.co/XxKv4vZb/stvplayer.png",
            url: "http://youview.player.stv.tv/?#/",
            company: "STV",
            description: "Whether you're into Drama, True Crime, Sports, Documentaries, Films or Soaps, STV Player has you covered. Enjoy thousands of hours of your STV favourites and UK & international hits - all for free.",
            category: "UK Free to Air"
        },
        {
            name: "Deezer",
            icon: "https://i.ibb.co/gLc5G25W/deezer.png",
            url: "https://tv2.deezer.com/foxxum",
            company: "Deezer",
            description: "Music lover? Stream and listen to top radio hits or discover new songs with the Deezer music player on your OnTV Play Streaming device.",
            category: "Music"
        },
        {
            name: "Euronews",
            icon: "https://eu.app.titanos.tv/img/width/362/height/204/quality/80/kwlbeepu0zw1i8q5kt8d9sz8woa4",
            url: "https://whalelive.zeasn.tv/whalelive_web/?productId=MbobFBw41DxO1Ka82rzlOg%3D%3D&vodLang=en",
            company: "Euronews",
            description: "Latest breaking news available as free video on demand. Stay informed on European and world news about economy, politics, diplomacy… with Euronews.",
            category: "News",
            Tags: ["news"]
        },
    ]
    if (config?.jellyfinUrl) {
        apps.push(
            {
                name: "Jellyfin",
                icon: "https://i.ibb.co/wrpTd4QD/51i0m01-RSx-L.png",
                url: config.jellyfinUrl,
                company: "Jellyfin",
                description: "Watch back media stored on your Jellyfin server, using the built in Jellyfin UI instead of the OnTV UI",
                category: "Personal Media"
            }
        )
    }
    return apps
}