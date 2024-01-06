# [4.3.0](https://github.com/popstas/chords-viewer/compare/v4.2.0...v4.3.0) (2024-01-06)


### Bug Fixes

* change default font size 1 -> 2 ([205cf23](https://github.com/popstas/chords-viewer/commit/205cf237cc2abdc104433694722188a4d584f8b3))
* first play issues with audioContext ([87f0b06](https://github.com/popstas/chords-viewer/commit/87f0b0644805955063b9d7b90651342f0edc285c))
* hide ChordsFloating when no chords ([8c5c17b](https://github.com/popstas/chords-viewer/commit/8c5c17bb25bda8f2a28742de55f0b256f840bd04))
* rearrange BeatPlayer controls, highlight error text, fix mobile horizontal scroll ([32f0bca](https://github.com/popstas/chords-viewer/commit/32f0bca94153ff74218202fb1d70d6bec1ee5fbf))
* remove double sustain for some piano styles ([9e61c46](https://github.com/popstas/chords-viewer/commit/9e61c463238bff411d2d6e45d917085f3095f075))
* revert addShow ([2a3e0fe](https://github.com/popstas/chords-viewer/commit/2a3e0fefe6baac123c3dfd4d6ec5845180371708))
* scroll to song on first page load on mobile ([bec3a3c](https://github.com/popstas/chords-viewer/commit/bec3a3c9c152d71533d575ab5692f75b7f621db0))
* smaller floating chords ([8d08d71](https://github.com/popstas/chords-viewer/commit/8d08d7166b5024442e6720f7d0ef35f1f625c0b3))
* sustain default enabled, affects to piano in drums ([84da02f](https://github.com/popstas/chords-viewer/commit/84da02f3a5444e1c1b544a3769d3c52ee7d868c2))


### Features

* BPMMeter, tune BPM with taps ([ac6ca88](https://github.com/popstas/chords-viewer/commit/ac6ca889429881036a10470f80457bafe8985c27))
* reader mode, hide all except text ([9ede90a](https://github.com/popstas/chords-viewer/commit/9ede90a63be46df51c05e2030c45c64f3d28f9d7))



# [4.2.0](https://github.com/popstas/chords-viewer/compare/v4.1.0...v4.2.0) (2024-01-05)


### Bug Fixes

* bpm change without replay ([1029918](https://github.com/popstas/chords-viewer/commit/102991814aaf0f9e189bc39091cd86992d7a2784))
* change url on song change ([240c13b](https://github.com/popstas/chords-viewer/commit/240c13bf1025992aee9bb597b7f1d30d45840a71))
* hide BeatPlayerAll under details ([15eca4a](https://github.com/popstas/chords-viewer/commit/15eca4a71ee5c8fc17764727d505d41134dea224))
* move chapters like [chorus] to another line ([01735d8](https://github.com/popstas/chords-viewer/commit/01735d862e959a3c49d91d2346907f38313d79bc))
* replace song url to song_num, for better qr code reading ([685fd45](https://github.com/popstas/chords-viewer/commit/685fd45f3839155a0db4f3ff813df325ce7ce988))
* scrolling to song on page load on mobile ([cd54d06](https://github.com/popstas/chords-viewer/commit/cd54d060c0c622863331fc9a6aff205d49545fec))


### Features

* beat hotkeys, immediate beat mode, piano octave shift, attach piano while drums, preload drums ([8a85db8](https://github.com/popstas/chords-viewer/commit/8a85db88e2d267d58727ebff599aad2b1df27fb2))
* BeatPlayerAll (for test) ([73fd86a](https://github.com/popstas/chords-viewer/commit/73fd86ae920ef39682afe24464630d4720fce49c))
* new instruments: accordion, vocal. Fix song text output. Allow piano for all songs (first 4 chords) ([56769fc](https://github.com/popstas/chords-viewer/commit/56769fcd4be3e5f20a29499a84a854b48c075b8d))
* new piano styles, working midi styles ([ca8a223](https://github.com/popstas/chords-viewer/commit/ca8a2237d91bbe596b80fb29f85cb6dd8628b5d9))
* piano sustain, volume down for piano, change octave shift ([9841323](https://github.com/popstas/chords-viewer/commit/9841323daa47aec0d5e5f6a898dbe27d1ffdfd13))
* pianoStyles (just 1 style now), octave shift for piano in drums song, try to fix offset from bpm to 0.1 sec per 2 min ([940cdaf](https://github.com/popstas/chords-viewer/commit/940cdaf836677ad8d2c7bed4e465ad629dcfaeb0))
* show drum and piano icons in list, show beat title on hover ([7612efb](https://github.com/popstas/chords-viewer/commit/7612efb2d47aefd41b11feb5b6663068b256c759))
* untranspose chords for piano ([97e59fd](https://github.com/popstas/chords-viewer/commit/97e59fde6e9ca00b002b24fbbcc4b8f2333aac24))
* url arguments for piano config ([0c64617](https://github.com/popstas/chords-viewer/commit/0c64617dfad5007809aed392c2a7f7b3b4c22db9))



# [4.1.0](https://github.com/popstas/chords-viewer/compare/v4.0.0...v4.1.0) (2023-12-17)


### Bug Fixes

* preload all beat notes ([97f2216](https://github.com/popstas/chords-viewer/commit/97f2216c2d55dfcd88d34e1c24aaafca2acee9fa))


### Features

* beat rever and bpm tune ([4365272](https://github.com/popstas/chords-viewer/commit/4365272696c1353c0e2ce7fd986054d48eb1fda9))
* new beats, drums0.sf2 ([6abe6d7](https://github.com/popstas/chords-viewer/commit/6abe6d7591ec02b847e00989ca50cb2b81f07066))
* piano player for 2-4-chords songs, change rever on the fly ([e3028d4](https://github.com/popstas/chords-viewer/commit/e3028d4057b82223019dee5f02289d0b34f01e56))
* play drums and piano at the same time ([952b7ff](https://github.com/popstas/chords-viewer/commit/952b7ffc113c00d93ec4f2103fa0e90711a67b1c))
* support song custom bpm, beat intro ([cc5e50c](https://github.com/popstas/chords-viewer/commit/cc5e50c80cc479ae3d68ca8efdf6a47bad98475d))



# [4.0.0](https://github.com/popstas/chords-viewer/compare/v3.0.0...v4.0.0) (2023-12-12)


### Features

* beats midi player ([b26e8c0](https://github.com/popstas/chords-viewer/commit/b26e8c0ef093af584fd913a6f04659a2aaffdb8d))



# [3.0.0](https://github.com/popstas/chords-viewer/compare/v2.9.0...v3.0.0) (2023-12-01)


### Features

* virtual scroll for mobile, allow unlimited song collection (1000+) ([32b3ef1](https://github.com/popstas/chords-viewer/commit/32b3ef1b86c28725d8d4f1793f88a5e511b84138))



# [2.9.0](https://github.com/popstas/chords-viewer/compare/v2.8.1...v2.9.0) (2023-09-18)


### Features

* sort artists by rate shows/songs ([b49144f](https://github.com/popstas/chords-viewer/commit/b49144f5b437fae5bdc0c4e68344c499f8828bd7))
* xl screen size (2000+ px) ([3422436](https://github.com/popstas/chords-viewer/commit/3422436a281b3fd865fe80ec88a420ee8f7ba790))



## [2.8.1](https://github.com/popstas/chords-viewer/compare/v2.8.0...v2.8.1) (2023-08-21)


### Bug Fixes

* display improvements: semi-opacity toolbar, song padding, overflow hidden ([a9e5849](https://github.com/popstas/chords-viewer/commit/a9e58498b5064fa2d4d6e40fe0090fce6d983a9f))
* don't hide toolbar spacer ([21ffe5b](https://github.com/popstas/chords-viewer/commit/21ffe5bd832c8ed07c943a35d961b27236d4720a))
* remove console.log ([3eecbb3](https://github.com/popstas/chords-viewer/commit/3eecbb3665492f6d72d190da1b188216c709320c))
* remove toolbar layout shift, highlight active artist's sort number ([6566217](https://github.com/popstas/chords-viewer/commit/656621775b12b8e489c58c2b85036972be3f9685))


### Features

* add hide button to toolbar ([868cc01](https://github.com/popstas/chords-viewer/commit/868cc011a0e5e1318f4fb94567ac622bafcbb841))
* shows by artists ([3aaf46c](https://github.com/popstas/chords-viewer/commit/3aaf46c806c35f5a4fe33646d0aee0ac705204ed))



# [2.8.0](https://github.com/popstas/chords-viewer/compare/v2.7.0...v2.8.0) (2023-06-04)


### Bug Fixes

* Display of chord "H7" ([61aa1c1](https://github.com/popstas/chords-viewer/commit/61aa1c1a0f8642cc564361959f6adbfc82fe5289))
* multiline chords overlaps with text ([cd0ea4f](https://github.com/popstas/chords-viewer/commit/cd0ea4ff7aea93a112b343bf2ad136d277feaa8c))


### Features

* customizable show shows ([b03a972](https://github.com/popstas/chords-viewer/commit/b03a9724cb5e0b37449e8236e456acc497e3edd9))
* remove filter "popular", it replaced by genre filters ([29489a0](https://github.com/popstas/chords-viewer/commit/29489a0c4faf202207f612d2a2f8f042c977fdd7))



# [2.7.0](https://github.com/popstas/chords-viewer/compare/v2.6.2...v2.7.0) (2023-03-21)


### Bug Fixes

* better chords glue to text ([c1a7b25](https://github.com/popstas/chords-viewer/commit/c1a7b25b64ca6b5bb96825ead334d8f9b47135da))
* remove margin between two text lines ([335a20b](https://github.com/popstas/chords-viewer/commit/335a20b31ec79b0aff00287b2e2c45b32d9231c6))
* replace chord H to B ([190a22f](https://github.com/popstas/chords-viewer/commit/190a22ffcb0fbd3de6cdec10d7dcaf2c7e647553))


### Features

* copy song text to clipboard ([7820eb0](https://github.com/popstas/chords-viewer/commit/7820eb06724b42e59c5717759340acd6fc012de4))



## [2.6.2](https://github.com/popstas/chords-viewer/compare/v2.6.1...v2.6.2) (2023-02-03)


### Bug Fixes

* remove debug background ([f6a8563](https://github.com/popstas/chords-viewer/commit/f6a85639cb1076d67af7147ea178aeb44c579cfb))


### Features

* get url with filtered songs, read from get query ?q=... ([1fdc42a](https://github.com/popstas/chords-viewer/commit/1fdc42a3ab220cf757d7684a8aaaf8f1879b8b60))



## [2.6.1](https://github.com/popstas/chords-viewer/compare/v2.6.0...v2.6.1) (2023-01-01)


### Bug Fixes

* better detect of chords line for english songs ([fc0223f](https://github.com/popstas/chords-viewer/commit/fc0223f0d0a2a14f57eac227402d9b371ede99c4))



# [2.6.0](https://github.com/popstas/chords-viewer/compare/v2.5.0...v2.6.0) (2022-08-06)


### Bug Fixes

* более аккуратная синхронизация просмотров (никогда все просмотры не попадают разом в firebase) ([25b30b3](https://github.com/popstas/chords-viewer/commit/25b30b3a370c901343f01bd9a3cd45e463c8400b))


### Features

* выбор размера добавлен в песню ([fe87cbe](https://github.com/popstas/chords-viewer/commit/fe87cbe0c1a5bb23ab4e7c5d06b88df4d1dfb6af))
* comments for song ([3f78cb2](https://github.com/popstas/chords-viewer/commit/3f78cb2a09e7c934df841e9c834676f4b28dca6f))
* filter by comment ([54dd814](https://github.com/popstas/chords-viewer/commit/54dd81430eacf938652dd8dbc742ac775b7839af))



# [2.5.0](https://github.com/popstas/chords-viewer/compare/v2.4.7...v2.5.0) (2021-12-05)


### Bug Fixes

* нечёткий поиск заменён чётким ([57bcf88](https://github.com/popstas/chords-viewer/commit/57bcf88aa2ceac01a22319ed5271774cb9e15cab))
* плюс-минус не были видны на тёмной теме ([88ec2b0](https://github.com/popstas/chords-viewer/commit/88ec2b0e49432b3fff6ff5a58db6137e92cc68ef))


### Features

* выбор тёмной темы при первом открытии, если в системе установлена тёмная тема по умолчанию ([af85869](https://github.com/popstas/chords-viewer/commit/af858695ee780283a945d5be599881628099c4ae))



## [2.4.7](https://github.com/popstas/chords-viewer/compare/v2.4.6...v2.4.7) (2021-09-05)



## [2.4.6](https://github.com/popstas/chords-viewer/compare/v2.4.5...v2.4.6) (2021-09-05)


### Features

* hr as text separator ([7ea7bb3](https://github.com/popstas/chords-viewer/commit/7ea7bb3f98f72dbb727375d21c8e701939844026))



## [2.4.5](https://github.com/popstas/chords-viewer/compare/v2.4.4...v2.4.5) (2021-08-29)


### Bug Fixes

* уменьшено расстояние между аккордами с точкой ([eff9769](https://github.com/popstas/chords-viewer/commit/eff97694a63851fd54a67509ff91a6636dc4d021))
* add app name to title ([81a1999](https://github.com/popstas/chords-viewer/commit/81a1999a03b1bf1f70d932331edbe5bed427cf48))
* amdm chords images url fix ([5c649de](https://github.com/popstas/chords-viewer/commit/5c649def562ce8f80c3558a2ae61d9dbee1409b4))
* try to fix autoscroll freeze on mobile ([80fad9f](https://github.com/popstas/chords-viewer/commit/80fad9f41b1986491bb6ca985a009ef1b5782375))



## [2.4.4](https://github.com/popstas/chords-viewer/compare/v2.4.3...v2.4.4) (2021-01-13)


### Bug Fixes

* fix qrcod ([9877246](https://github.com/popstas/chords-viewer/commit/9877246ba00e108bb0b2635f94dce80731715569))



## [2.4.3](https://github.com/popstas/chords-viewer/compare/v2.4.2...v2.4.3) (2021-01-13)


### Bug Fixes

* fix empty song addShow error ([9e9de60](https://github.com/popstas/chords-viewer/commit/9e9de60c65b3779aca3e2910fc370c6b501b1aeb))
* stop autoscroll when scroll to top ([9834f3d](https://github.com/popstas/chords-viewer/commit/9834f3d233334a0a6ede63548068c0fbe54d3ec2))



## [2.4.2](https://github.com/popstas/chords-viewer/compare/v2.4.1...v2.4.2) (2021-01-13)


### Bug Fixes

* always show scroll, for avoid interface jumps while filter ([e2cd5be](https://github.com/popstas/chords-viewer/commit/e2cd5be1862ff72d857a93f9a0488a422c217496))
* faster startup, change filter, songs loading indicator ([eab755b](https://github.com/popstas/chords-viewer/commit/eab755bb2afa88b4aa444eb4bfeca2ff34cac0b6))
* group controls in sidebar ([4e3d0ba](https://github.com/popstas/chords-viewer/commit/4e3d0ba77969122496ce57c85f5c27a2a35cb7ec))



## [2.4.1](https://github.com/popstas/chords-viewer/compare/v2.4.0...v2.4.1) (2021-01-12)


### Bug Fixes

* increase sidebar width ([8d47a32](https://github.com/popstas/chords-viewer/commit/8d47a32db7bb00caf0a443cdb8c31f2970b9509d))
* less saruration for primary color in dark mode ([f072eb9](https://github.com/popstas/chords-viewer/commit/f072eb970c78be32c18bbe4c410c0432ce8fcd31))
* qr code in dark mode ([aabee6c](https://github.com/popstas/chords-viewer/commit/aabee6c9f00117c1b18c207264a1c646e42a11b3))



# [2.4.0](https://github.com/popstas/chords-viewer/compare/v2.3.0...v2.4.0) (2021-01-12)


### Features

* dark mode ([14030a7](https://github.com/popstas/chords-viewer/commit/14030a73a2a38d3f09becd307fa0bdca179ad131))



# [2.3.0](https://github.com/popstas/chords-viewer/compare/v2.2.1...v2.3.0) (2021-01-10)


### Bug Fixes

* try to downgrade nosleep.js (freezes while autoscroll) ([a850fc7](https://github.com/popstas/chords-viewer/commit/a850fc74f44a046696c25d7d638de10154c5f3f1))


### Features

* qr code generate, go to song on qrcode read ([630c6e8](https://github.com/popstas/chords-viewer/commit/630c6e8bd7d6eb42e7fda7a397a82a431a2c0a5c))
* qr code scanner ([c8d7a6c](https://github.com/popstas/chords-viewer/commit/c8d7a6c79ffbf3e6876404a2551c7f385fc4610a))



## [2.2.1](https://github.com/popstas/chords-viewer/compare/v2.2.0...v2.2.1) (2020-12-17)



# [2.2.0](https://github.com/popstas/chords-viewer/compare/v2.1.0...v2.2.0) (2020-10-16)


### Features

* webhookShow, send http request on song view ([0b6d328](https://github.com/popstas/chords-viewer/commit/0b6d328e03a5a475f612772b78d9b2c3b3cb8ed3))



# [2.1.0](https://github.com/popstas/chords-viewer/compare/v2.0.0...v2.1.0) (2020-07-14)


### Bug Fixes

* картинки для аккордов укулеле и пианино типа G#, G#m ([b45b85a](https://github.com/popstas/chords-viewer/commit/b45b85a6c34b198072e6d0e66037b4dbfc8a4e98))
* при открытии песни по урлу просмотр не учитывается ([a32d88e](https://github.com/popstas/chords-viewer/commit/a32d88e07f1b17e180555a3a3e458651bec5094a))
* Bb -> A#, Eb -> F# ([fba5dea](https://github.com/popstas/chords-viewer/commit/fba5deac3ce2d9816fd2589b14506e411d92612c))


### Features

* возможность менять просмотры ([2749415](https://github.com/popstas/chords-viewer/commit/2749415c46fb55b643bc23b3ee0d355d284896fa))



# [2.0.0](https://github.com/popstas/chords-viewer/compare/v1.22.0...v2.0.0) (2020-07-12)


### Bug Fixes

* аккорды в тексте в скобках теперь распознаются ([ab08033](https://github.com/popstas/chords-viewer/commit/ab0803367090f3443f3a1d176a509db84418310e))
* выбор исполнителя на 1 строку на мобильном ([0ecb405](https://github.com/popstas/chords-viewer/commit/0ecb4050f007c7c07a81dd3d63e0c02bc19d29b5))
* поправлены стили: красивые отступы, цвета ([29c0796](https://github.com/popstas/chords-viewer/commit/29c07966d3cb8d0f2f87fd2924b0288e922b14bd))
* скобки больше не прилипают к аккордам, добавлены аккорды Dsus4, Dm/C, Am6, C6 ([d98f792](https://github.com/popstas/chords-viewer/commit/d98f792cfb1cd6fdc36aa14a04e078091f03ebee))
* сортировка по просмотрам, потом по дате ([2832e40](https://github.com/popstas/chords-viewer/commit/2832e408148184ba3cd81ffe1d368cd2888a2c87))
* убрана горизонтальная прокрутка на больших экранах ([2402d0d](https://github.com/popstas/chords-viewer/commit/2402d0dd3eb829fee375da2efc64e46b4a7a8b01))
* улучшены стили соединённых аккордов ([1e30e13](https://github.com/popstas/chords-viewer/commit/1e30e136e3643f4b7cf497a4f9ef31edd8ed7694))


### Features

* авторизация Google для хранения счётчика просмотров ([ddb1150](https://github.com/popstas/chords-viewer/commit/ddb1150ac506c9c5c164bf6e1e0f548add899356))
* сортировка по популярности ([150ab88](https://github.com/popstas/chords-viewer/commit/150ab881befe459a6ce89513fb0c9c3dda2b9b3d))
* сортировка по просмотрам ([477f61f](https://github.com/popstas/chords-viewer/commit/477f61fb3619ad11800ca010f6092a677f7ef4fc))
* ctrl+up/down - транспонирование ([6e18ee5](https://github.com/popstas/chords-viewer/commit/6e18ee5580b305d85706cc2349f09128f28347eb))



# [1.22.0](https://github.com/popstas/chords-viewer/compare/v1.21.0...v1.22.0) (2020-07-09)


### Features

* по умолчанию иконки в списке скрыты, включается через настройку ([99e7c63](https://github.com/popstas/chords-viewer/commit/99e7c637c8048015e0b0bc300ad581b939242977))



# [1.21.0](https://github.com/popstas/chords-viewer/compare/v1.20.0...v1.21.0) (2020-07-05)


### Features

* счётчик просмотров в localStorage ([76ad9c0](https://github.com/popstas/chords-viewer/commit/76ad9c0744004eecf3e55e8ea3684e289381ed6f))



# [1.20.0](https://github.com/popstas/chords-viewer/compare/v1.19.0...v1.20.0) (2020-06-14)


### Features

* фильтр по жанру или исполнителю из песни ([5c3ac12](https://github.com/popstas/chords-viewer/commit/5c3ac1211a4dce807b4a0f4945724b9376deec38))



# [1.19.0](https://github.com/popstas/chords-viewer/compare/v1.18.1...v1.19.0) (2020-05-02)


### Bug Fixes

* ukulele and piano chords from chordify.net ([51a408c](https://github.com/popstas/chords-viewer/commit/51a408cc8a2fbec3fa494cab8829224f4ad62806))


### Features

* show images inline ([82a9dca](https://github.com/popstas/chords-viewer/commit/82a9dcac4153c834a3d197bbcf82f207df8c8981))



## [1.18.1](https://github.com/popstas/chords-viewer/compare/v1.18.0...v1.18.1) (2020-01-03)


### Bug Fixes

* correct container width on medium screens (1200-1599) ([c93e689](https://github.com/popstas/chords-viewer/commit/c93e6893683b752462179fca319fb9c77a5011aa))



# [1.18.0](https://github.com/popstas/chords-viewer/compare/v1.17.2...v1.18.0) (2019-12-19)


### Bug Fixes

* genre filter not work after page reload ([5f00777](https://github.com/popstas/chords-viewer/commit/5f007773f60645e7018e554c63626229561014b3))
* remove input autofocus ([b850e93](https://github.com/popstas/chords-viewer/commit/b850e93242a2021ac53d9808335f5cf8621c6489))


### Features

* 3-4 columns for wide screens ([5e23042](https://github.com/popstas/chords-viewer/commit/5e230421fdb6eebd02df800652c88ea5100555db))
* filter input clear button ([b5f0ca6](https://github.com/popstas/chords-viewer/commit/b5f0ca6300381f6ffc503a6c210aead1400ebe83))
* stop autoscroll when 2+ columns ([9ee0f59](https://github.com/popstas/chords-viewer/commit/9ee0f59d5a4f7d86c4570481e5c53664408d40a3))



## [1.17.2](https://github.com/popstas/chords-viewer/compare/v1.17.1...v1.17.2) (2019-12-19)


### Bug Fixes

* allow caps in genre ([5043ae4](https://github.com/popstas/chords-viewer/commit/5043ae4f64b26b269f6d37f23869dc4e4966a508))



## [1.17.1](https://github.com/popstas/chords-viewer/compare/v1.17.0...v1.17.1) (2019-12-15)


### Bug Fixes

* move popular icon after title ([b8bfc5a](https://github.com/popstas/chords-viewer/commit/b8bfc5a7846aa9b01d9586b28be7e1dd5c7b42dd))



# [1.17.0](https://github.com/popstas/chords-viewer/compare/v1.16.2...v1.17.0) (2019-12-15)


### Bug Fixes

* remind autoscroll speed ([23f7ac6](https://github.com/popstas/chords-viewer/commit/23f7ac6a2698441316bc7322f483e6e5b6cb0484))


### Features

* filter by genre ([2a48055](https://github.com/popstas/chords-viewer/commit/2a48055e00efcd40c0c126525a8f89105efeccaf))



## [1.16.2](https://github.com/popstas/chords-viewer/compare/v1.16.1...v1.16.2) (2019-11-30)


### Bug Fixes

* add quint chords A5 etc ([8d8425b](https://github.com/popstas/chords-viewer/commit/8d8425b4bc82664a9720c52e91fc505a2d1002d5))



## [1.16.1](https://github.com/popstas/chords-viewer/compare/v1.16.0...v1.16.1) (2019-09-14)


### Bug Fixes

* sort by date by default ([22f7b6a](https://github.com/popstas/chords-viewer/commit/22f7b6ab979ede0168bd670ad9cd180e396c9d2e))



# [1.16.0](https://github.com/popstas/chords-viewer/compare/v1.15.0...v1.16.0) (2019-07-16)


### Features

* display song created date when sort by date ([c67a056](https://github.com/popstas/chords-viewer/commit/c67a056a5df03f0f85a2f989e1569e3447ed08bb))



# [1.15.0](https://github.com/popstas/chords-viewer/compare/v1.14.1...v1.15.0) (2019-06-19)


### Bug Fixes

* move footer content to sidebar ([3b73f41](https://github.com/popstas/chords-viewer/commit/3b73f41c694d0f82a9e92fba7efb92009460b7be))


### Features

* scroll to top button in toolbar ([f403de7](https://github.com/popstas/chords-viewer/commit/f403de74cc872ce1655c7df9ee083b8e4d33b618))



## [1.14.1](https://github.com/popstas/chords-viewer/compare/v1.14.0...v1.14.1) (2019-06-19)


### Features

* filter for chords and popular: any/yes/no ([a5ecc34](https://github.com/popstas/chords-viewer/commit/a5ecc346790fdd7941fde135fee8cd0bfcf93c7b))



# [1.14.0](https://github.com/popstas/chords-viewer/compare/v1.13.1...v1.14.0) (2019-06-19)


### Features

* text filter any/yes/no ([3e1b8e7](https://github.com/popstas/chords-viewer/commit/3e1b8e74b049c28b4f9dc3269a67edd8ad341581))



## [1.13.1](https://github.com/popstas/chords-viewer/compare/v1.13.0...v1.13.1) (2019-06-19)



# [1.13.0](https://github.com/popstas/chords-viewer/compare/v1.12.1...v1.13.0) (2019-06-15)


### Features

* artists select sort by count ([3df44d1](https://github.com/popstas/chords-viewer/commit/3df44d17673450a4f2eb2152b6be7715790c0ce6))



## [1.12.1](https://github.com/popstas/chords-viewer/compare/v1.12.0...v1.12.1) (2019-06-12)


### Bug Fixes

* +7, /, +5 chords support ([7500c09](https://github.com/popstas/chords-viewer/commit/7500c09303552ac1eb7ad28f11e9a7cc0be5a22e))
* sus2 chords support ([247368c](https://github.com/popstas/chords-viewer/commit/247368cfb1df1079ef35696b3feabcc781c19b41))



# [1.12.0](https://github.com/popstas/chords-viewer/compare/v1.11.1...v1.12.0) (2019-06-12)


### Bug Fixes

* H7 -> B7 ([79d998d](https://github.com/popstas/chords-viewer/commit/79d998d5b358c48bfdbd7250b623980f09844710))
* store selected instrument ([33b9da3](https://github.com/popstas/chords-viewer/commit/33b9da391bcf9ed490eec30edd60e08816658252))


### Features

* artists list with songs count ([3fce113](https://github.com/popstas/chords-viewer/commit/3fce1137399ee123ff9f5fd2c94b011f2b85bb47))



## [1.11.1](https://github.com/popstas/chords-viewer/compare/v1.11.0...v1.11.1) (2019-06-12)


### Bug Fixes

* transpose was inverted on songs with "capo" in title ([134c569](https://github.com/popstas/chords-viewer/commit/134c569e572bc5dc8d1efa35058e1dd4e05427ca))



# [1.11.0](https://github.com/popstas/chords-viewer/compare/v1.10.3...v1.11.0) (2019-06-07)


### Bug Fixes

* el-input -> input, for avoid shortkey ([23772e0](https://github.com/popstas/chords-viewer/commit/23772e02ca110d6e0d3c4a01f4ff19a083e17563))
* move font-size controls to sidebar ([7083efd](https://github.com/popstas/chords-viewer/commit/7083efdb603a15dde9182bee4b2608698d75d5d3))


### Features

* ukulele and piano chords, replace H to B ([8679b3d](https://github.com/popstas/chords-viewer/commit/8679b3d02f511dc06900d4604572626339a56196))



## [1.10.3](https://github.com/popstas/chords-viewer/compare/v1.10.2...v1.10.3) (2019-02-04)


### Bug Fixes

* remove playlist duplicates ([203074f](https://github.com/popstas/chords-viewer/commit/203074fe821d755f9cbdbbde8247ca325e301da6))



## [1.10.2](https://github.com/popstas/chords-viewer/compare/v1.10.1...v1.10.2) (2018-12-22)


### Features

* popular icon in list, song title improvements ([0ada81f](https://github.com/popstas/chords-viewer/commit/0ada81f83cd320031e5dbaf6804a6dc8d7b7302b))
* share button for pwa ([6d47aa7](https://github.com/popstas/chords-viewer/commit/6d47aa7fa3a8481b33ff078f41d7cb2abf2ae47c))



## [1.10.1](https://github.com/popstas/chords-viewer/compare/v1.10.0...v1.10.1) (2018-12-22)


### Bug Fixes

* chords overflowed top of song and top of page ([afb519e](https://github.com/popstas/chords-viewer/commit/afb519e2ccb0e89b35faffbce9e018f721f3dc4e))


### Features

* chords now fixed at top right on mobile, not all width ([7f66c09](https://github.com/popstas/chords-viewer/commit/7f66c09cbc378cb75d44df9d3225df82e7c5f023))



# [1.10.0](https://github.com/popstas/chords-viewer/compare/v1.9.0...v1.10.0) (2018-12-22)


### Features

* change fontSize, refactorings, reformat ([d5a7a9d](https://github.com/popstas/chords-viewer/commit/d5a7a9d6b17b4273080a779c74fbb73a3ef35be1))
* current song title on mobile ([93daf1a](https://github.com/popstas/chords-viewer/commit/93daf1aac87969cdd5d77f36860edf2222504c1d))
* store current song in browser history ([0be6f65](https://github.com/popstas/chords-viewer/commit/0be6f65a08da5e179d4ba7fc58b00e30372cb695))



# [1.9.0](https://github.com/popstas/chords-viewer/compare/v1.8.0...v1.9.0) (2018-12-15)


### Bug Fixes

* default transpose level fix ([733e84c](https://github.com/popstas/chords-viewer/commit/733e84c50ff47d21f8a28442b88e4d3567e35653))


### Features

* 2 column song text on desktops ([a60fc33](https://github.com/popstas/chords-viewer/commit/a60fc33e75067c72c387160f104760addec571ef))
* default transpose level from title (cap 4) ([54c5680](https://github.com/popstas/chords-viewer/commit/54c5680cbcf7a773ac05898c12460cb3db504cee))



# [1.8.0](https://github.com/popstas/chords-viewer/compare/v1.7.1...v1.8.0) (2018-12-15)


### Bug Fixes

* always open menu on wide screens ([565ea49](https://github.com/popstas/chords-viewer/commit/565ea49702b1b783096e280f9e2dd924d303fe98))
* j/k hotkeys working in russian keymap ([a0acf80](https://github.com/popstas/chords-viewer/commit/a0acf800ef9055ad5293bbcb3110e73f729f76dc))


### Features

* always chow current song chords, on right for desktops ([9a24be2](https://github.com/popstas/chords-viewer/commit/9a24be2edd575d323c0dbe130a79d5c421d55c6c))
* show current song on desktops ([3f35eb8](https://github.com/popstas/chords-viewer/commit/3f35eb81eb7eaf41d9c905a11a8a4aadac5d75ba))
* song complexity ([d77737f](https://github.com/popstas/chords-viewer/commit/d77737f0706e191d368b87970a8ca5cf18975a00))



## [1.7.1](https://github.com/popstas/chords-viewer/compare/v1.7.0...v1.7.1) (2018-11-22)


### Bug Fixes

* wrap .chord__sequence ([74290a2](https://github.com/popstas/chords-viewer/commit/74290a271181950d05183d64f183a81cb8cdf1ac))


### Features

* highlight even sequence different ([63c9f69](https://github.com/popstas/chords-viewer/commit/63c9f692bbbb8169c3a2c566dff293c01e6e5a77))
* hotkeys j/k, arrows, space for song navigation ([8dd9ea1](https://github.com/popstas/chords-viewer/commit/8dd9ea1cb4f19e48e511d2d063e86c10bd28b196))



# [1.7.0](https://github.com/popstas/chords-viewer/compare/v1.6.0...v1.7.0) (2018-11-22)


### Features

* playlist, prev/next song, toolbar moved bottom ([a8b21d7](https://github.com/popstas/chords-viewer/commit/a8b21d7ec3fcef16fb7fceb3d69eef2396c0e3f3))



# [1.6.0](https://github.com/popstas/chords-viewer/compare/v1.5.0...v1.6.0) (2018-09-14)


### Features

* popular chords filter ([181b1bd](https://github.com/popstas/chords-viewer/commit/181b1bd40357dbfb36f2c503bda1af1c2b0a75d8))



# [1.5.0](https://github.com/popstas/chords-viewer/compare/v1.4.3...v1.5.0) (2018-09-13)


### Features

* persistent app state (filters and noSleep) ([7a236e6](https://github.com/popstas/chords-viewer/commit/7a236e64f999b4833eb6a956e3a403f91327b7f2))



## [1.4.3](https://github.com/popstas/chords-viewer/compare/v1.4.2...v1.4.3) (2018-09-12)


### Bug Fixes

* incorrect offset bug on change random song ([7a79783](https://github.com/popstas/chords-viewer/commit/7a797838f8d5ecc5a90bd8205e44bba6a396bfcf))
* toolbar overflow issue ([d1858d3](https://github.com/popstas/chords-viewer/commit/d1858d34189930c82e192593d32b6ab5ef3f0f84))



## [1.4.2](https://github.com/popstas/chords-viewer/compare/v1.4.1...v1.4.2) (2018-07-15)


### Bug Fixes

* random only for filtered songs ([9360d60](https://github.com/popstas/chords-viewer/commit/9360d6051c141f077b494ef73f9df5efeabbd82f))



## [1.4.1](https://github.com/popstas/chords-viewer/compare/v1.4.0...v1.4.1) (2018-07-09)


### Features

* скрытие тулбара при начале автоскролла ([a2839e4](https://github.com/popstas/chords-viewer/commit/a2839e46f0983534a9d84d6b9cd8c39352afabb3))



# [1.4.0](https://github.com/popstas/chords-viewer/compare/v1.3.0...v1.4.0) (2018-06-30)


### Bug Fixes

* app was not 100% on screens with 640+ px ([59ca835](https://github.com/popstas/chords-viewer/commit/59ca835e8398499f70167d132eb02f9ad3cf8db6))
* enable icon in @nuxtjs/pwa ([f109abb](https://github.com/popstas/chords-viewer/commit/f109abb401d086913c47cbb5381ac7f52b1eea4e))
* hide floating chords while floating toolbar ([f135058](https://github.com/popstas/chords-viewer/commit/f135058362415ec57ab2b0a6b88774b5b59542c8))
* was 5px horizontal scroll ([145b65d](https://github.com/popstas/chords-viewer/commit/145b65dc2ede89dec14af69fc48f9264c7e7429d))


### Features

* add app icon ([248f5a7](https://github.com/popstas/chords-viewer/commit/248f5a7eb2075b128d4ffa72e52970dd66572005))
* random song ([5819bc2](https://github.com/popstas/chords-viewer/commit/5819bc2777ee24f6f3b69dab403502c893324e3f))
* replace icon, change site.webmanifest for PWA criteria ([2ea8ac4](https://github.com/popstas/chords-viewer/commit/2ea8ac43adad32f0ce572c86fb7903ae8cfea5b6))
* search on amdm.ru ([59e8e7f](https://github.com/popstas/chords-viewer/commit/59e8e7feb86a8f3679df03e4cdae21070910413c))



# [1.3.0](https://github.com/popstas/chords-viewer/compare/v1.2.0...v1.3.0) (2018-06-08)


### Features

* add sidebar with filters ([dc4b28a](https://github.com/popstas/chords-viewer/commit/dc4b28a102a87f350ce0517712b213f5f7b23b45))



# [1.2.0](https://github.com/popstas/chords-viewer/compare/v1.1.0...v1.2.0) (2018-06-04)


### Bug Fixes

* render song on openIt decreased rendered page size from 3.5M to 0.8Mand dramatically decreased cpu time on app create ([6723392](https://github.com/popstas/chords-viewer/commit/6723392287a70116ee5a1e7aaa24b6a02abb88c0))


### Features

* display current song in page title ([797b09a](https://github.com/popstas/chords-viewer/commit/797b09a943abd5bd0d805fcbd90014a6da102955))
* fuzzy search ([d6fd6c7](https://github.com/popstas/chords-viewer/commit/d6fd6c7eba59b97071c76a0dbc6feb16296b67ed))
* interactive chords in text ([d230af2](https://github.com/popstas/chords-viewer/commit/d230af24d6c2359e36acf816729258e4355099c7))
* open single filtered song ([846e6da](https://github.com/popstas/chords-viewer/commit/846e6daf3b7c6e64862725da0a7d85d430a4d207))
* voice search with SpeechRecognition ([3bbc990](https://github.com/popstas/chords-viewer/commit/3bbc990cd0242c67472f0a6aefed451dcec2a71a))



# [1.1.0](https://github.com/popstas/chords-viewer/compare/v1.0.0...v1.1.0) (2018-06-02)


### Bug Fixes

* hide letters filter while toolbar is fixed ([05edfd0](https://github.com/popstas/chords-viewer/commit/05edfd0a747fdf10d47f1c017a70bbed034574f5))
* increase default autoscroll speed ([dbf977a](https://github.com/popstas/chords-viewer/commit/dbf977acf8088d45c2cd1d8036f7b6131750d61e))


### Features

* chords images popover ([ba4a1c0](https://github.com/popstas/chords-viewer/commit/ba4a1c0c0dd7dae2c803f060359244ab5a7b437b))
* clearable search input ([f95abfc](https://github.com/popstas/chords-viewer/commit/f95abfcd73083d64f59832336194a3a00f372540))
* footer ([87ef159](https://github.com/popstas/chords-viewer/commit/87ef159c96082c53e98c96c4d7d92f479c4d03b6))
* sort by created date ([3ca1a20](https://github.com/popstas/chords-viewer/commit/3ca1a20e9bd78ed5fa16648d5b5d872b47ce6fb0))
* update data from popstas/chords-data before deploy ([c7eb984](https://github.com/popstas/chords-viewer/commit/c7eb984436ea7321a5675e1156e05431cb5c0a38))



# [1.0.0](https://github.com/popstas/chords-viewer/compare/a31280212dc037698f3538c3f25e90cd643995b1...v1.0.0) (2018-06-02)


### Bug Fixes

* accordion mode for correct fixed chords ([c7eaba9](https://github.com/popstas/chords-viewer/commit/c7eaba93f0926ba357ecaaa673846c55e74b4884))
* autoscroll speed tune (logarhythm scale) ([7d29056](https://github.com/popstas/chords-viewer/commit/7d2905659ac4a8bf7540db99892ff10b054473c5))
* correct stop autoscroll on hot reload ([7088368](https://github.com/popstas/chords-viewer/commit/70883688909f813b3c8e0ca6f415374ab0c9347f))
* css, max-width, toolbar center, hide close on mobile ([668e645](https://github.com/popstas/chords-viewer/commit/668e64599f578e09d3fd6f4c2f218a2408ffd8fa))
* expose nuxt dev to 0.0.0.0 ([7987961](https://github.com/popstas/chords-viewer/commit/798796190f3d55ee499d51aac55832d3e2cdde17))
* highlight chords (only in russian songs), wrap texts ([74a5be8](https://github.com/popstas/chords-viewer/commit/74a5be8f62cabd68224bea0aef766108bb5ca0b4))
* nuxt spa mode for client side only build ([e2e47e5](https://github.com/popstas/chords-viewer/commit/e2e47e503dd8a2c690c05fa88bb26f33f9b31246))
* overflow song title on tab ([d147b73](https://github.com/popstas/chords-viewer/commit/d147b731fe60bbcabcbde5fe22248c9a0c4efee0))
* tab name overlayed next tab name ([7ed9beb](https://github.com/popstas/chords-viewer/commit/7ed9beb5b77be16c7e86a9ab2023e88c811ca46b))
* transponse bug ([06cc031](https://github.com/popstas/chords-viewer/commit/06cc031baee91b1b8602a5974b9774a5e5b53244))


### Features

* @nuxtjs/pwa ([98fe753](https://github.com/popstas/chords-viewer/commit/98fe753a1078136a8c4a5063214fe4e19af8d6e7))
* add icons and fixed chords to SongItem ([6fe9314](https://github.com/popstas/chords-viewer/commit/6fe9314c446d13cba59f55598107d9ebf13a2e89))
* autoscroll ([8232cf2](https://github.com/popstas/chords-viewer/commit/8232cf246b35bf6cd976cf7b40bccd4e6aef869a))
* autoscroll speed ([1065b24](https://github.com/popstas/chords-viewer/commit/1065b247090565d1969259a1ae3f0e42968df719))
* chords and texts switch filters ([9dc6d9e](https://github.com/popstas/chords-viewer/commit/9dc6d9e80f6db1002dbabf028e06bf063441baba))
* first prototype with element-ui ([a312802](https://github.com/popstas/chords-viewer/commit/a31280212dc037698f3538c3f25e90cd643995b1))
* links to chord images, beauty chords panel ([17f3c37](https://github.com/popstas/chords-viewer/commit/17f3c3760d63065c595d6ce12d415834a0afd275))
* no sleep mode for phones ([a7f4e70](https://github.com/popstas/chords-viewer/commit/a7f4e704f6633d20f235ff3d5da6e588dee9941f))
* quick search by first letter ([0834c73](https://github.com/popstas/chords-viewer/commit/0834c73a0db9b7be0be8f76ab29498a56e47dba3))
* search songs ([a0a9f20](https://github.com/popstas/chords-viewer/commit/a0a9f20bbc608bfe6a542a54163fe0c5e81bc725))
* show toolbar on scroll up ([039d9a4](https://github.com/popstas/chords-viewer/commit/039d9a4f4059a1c7918c67b0b3a800f82c350613))
* toolbar autoscroll row ([de868cd](https://github.com/popstas/chords-viewer/commit/de868cd513978d2d3f68286920d2da2ae30f2357))
* toolbar close button ([d4de99f](https://github.com/popstas/chords-viewer/commit/d4de99f6c49c1fc6dcf8e0b02cbd183c842a3f36))



