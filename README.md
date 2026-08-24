# ProfileRender

### Правила

#### [ТЕКСТ] Как пишется текст?
Текст пишется просто, за исключением:
* "nbsp" - превращается в пробел

### Применяется ко всем типам (только для текста simple)

| Параметр | Информация                              | Дефолт |
|:--------:|:----------------------------------------|:------:|
|   t_bg   | Цвет заднего фона                       | 555555 |
|   t_c    | Цвет текста                             | FFFFFF |
|   t_w    | Ширина (в пикселях)                     |        |
|   t_h    | Высота (в пикселях)                     |        |
|   t_lh   | Растояние между строками (в пикселях)   |        |
|  t_pad   | Растояние между содержимым (в пикселях) |   30   |
|   t_ml   | Сколько максимум отображать линий?      |  100   |
|   t_fs   | Размер шрифта (в пикселях)              |   12   |

``https://profile-render-fawn.vercel.app/``

![](https://profile-render-fawn.vercel.app/)

``https://profile-render-fawn.vercel.app/?type=simple``

![](https://profile-render-fawn.vercel.app/?type=simple)

``https://profile-render-fawn.vercel.app/?t_bg=FF0000&type=simple``

![](https://profile-render-fawn.vercel.app/?t_bg=FF0000&type=simple)

``https://profile-render-fawn.vercel.app/?t_c=000000&type=simple``

![](https://profile-render-fawn.vercel.app/?t_c=000000&type=simple)

``https://profile-render-fawn.vercel.app/?t_pad=0&type=simple``

![](https://profile-render-fawn.vercel.app/?t_pad=0&type=simple)

``https://profile-render-fawn.vercel.app/?t_pad=100&type=simple``

![](https://profile-render-fawn.vercel.app/?t_pad=100&type=simple)

``https://profile-render-fawn.vercel.app/?t_w=150&t_h=150&type=simple``

![](https://profile-render-fawn.vercel.app/?t_w=150&t_h=150&type=simple)

``https://profile-render-fawn.vercel.app/?t_fs=50&type=simple``

![](https://profile-render-fawn.vercel.app/?t_fs=50&type=simple)

``https://profile-render-fawn.vercel.app/?t_lh=5&type=simple&text=1\n2\n3\n4\n5``

![](https://profile-render-fawn.vercel.app/?t_lh=5&type=simple&text=1\n2\n3\n4\n5)

``https://profile-render-fawn.vercel.app/?t_lh=50&type=simple&text=1\n2\n3\n4\n5``

![](https://profile-render-fawn.vercel.app/?t_lh=50&type=simple&text=1\n2\n3\n4\n5)

``https://profile-render-fawn.vercel.app/?t_ml=2&type=simple&text=1\n2\n3\n4\n5``

![](https://profile-render-fawn.vercel.app/?t_ml=2&type=simple&text=1\n2\n3\n4\n5)

# Типы

## notype

``https://profile-render-fawn.vercel.app/?type=notype``

![](https://profile-render-fawn.vercel.app/?type=notype)

## simple

| Параметр | Информация                           |      Дефолт      |
|:--------:|:-------------------------------------|:----------------:|
|   text   | Текст (используется правило [ТЕКСТ]) | Не указан "text" |

``https://profile-render-fawn.vercel.app/?type=simple&text=Hellonbspworld!``

![](https://profile-render-fawn.vercel.app/?type=simple&text=Hellonbspworld!)

``https://profile-render-fawn.vercel.app/?type=simple&text=New\nLine``

![](https://profile-render-fawn.vercel.app/?type=simple&text=New\nLine)

``https://profile-render-fawn.vercel.app/?type=simple&text=1\n2\n3\n4\n5\n6\n7\n8\n9``

![](https://profile-render-fawn.vercel.app/?type=simple&text=1\n2\n3\n4\n5\n6\n7\n8\n9)

``https://profile-render-fawn.vercel.app/?type=simple&text=Приветnbspмир!``

![](https://profile-render-fawn.vercel.app/?type=simple&text=%D0%9F%D1%80%D0%B8%D0%B2%D0%B5%D1%82nbsp%D0%BC%D0%B8%D1%80!)

``https://profile-render-fawn.vercel.app/?type=simple&text=Эмодзиnbsp->nbsp🙄``

![](https://profile-render-fawn.vercel.app/?type=simple&text=%D0%AD%D0%BC%D0%BE%D0%B4%D0%B7%D0%B8nbsp-%3Enbsp%F0%9F%99%84)

## js

| Параметр | Информация                                                                                     |                        Дефолт                        |
|:--------:|:-----------------------------------------------------------------------------------------------|:----------------------------------------------------:|
|   code   | JS код в формате Base64, что-бы вернуть результат нужно писать "Result = ..." (строка или svg) | UmVzdWx0ID0gItCd0LUg0YPQutCw0LfQsNC9IFwiY29kZVwiIg== |

``https://profile-render-fawn.vercel.app/?type=js``

![](https://profile-render-fawn.vercel.app/?type=js)

``https://profile-render-fawn.vercel.app/?type=js&code=UmVzdWx0ID0gItCS0YDQtdC80Y8gVVRDOiAiICsgbmV3IERhdGUoKS50b0lTT1N0cmluZygpOw==``

![](https://profile-render-fawn.vercel.app/?type=js&code=UmVzdWx0ID0gItCS0YDQtdC80Y8gVVRDOiAiICsgbmV3IERhdGUoKS50b0lTT1N0cmluZygpOw==)

``https://profile-render-fawn.vercel.app/?type=js&code=UmVzdWx0ID0gYDxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDUwMCAxMjAiPg0KICA8ZGVmcz4NCiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImNvb2xHcmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIwJSI+DQogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMDBkMmZmOyI+DQogICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InN0b3AtY29sb3IiIHZhbHVlcz0iIzAwZDJmZjsjOTI4ZGFiOyNlZTA5Nzk7IzAwZDJmZiIgZHVyPSI1cyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIC8+DQogICAgICA8L3N0b3A+DQogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNlZTA5Nzk7Ij4NCiAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ic3RvcC1jb2xvciIgdmFsdWVzPSIjZWUwOTc5OyMwMGQyZmY7IzkyOGRhYjsjZWUwOTc5IiBkdXI9IjVzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz4NCiAgICAgIDwvc3RvcD4NCiAgICA8L2xpbmVhckdyYWRpZW50Pg0KICA8L2RlZnM+DQoNCiAgPGc+DQogICAgPGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJ0cmFuc2xhdGUiIHZhbHVlcz0iMCA1OyAwIC01OyAwIDUiIGR1cj0iM3MiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiAvPg0KDQogICAgPHRleHQgeD0iNTAlIiB5PSI3NCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIEJsYWNrLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjUwIiBmaWxsPSIjMDAwIiBvcGFjaXR5PSIwLjMiPg0KICAgICAgUHJvZmlsZSBSZW5kZXINCiAgICA8L3RleHQ+DQogICAgDQogICAgPHRleHQgeD0iNTAlIiB5PSI3MiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIEJsYWNrLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjUwIiBmaWxsPSIjNDQ0Ij4NCiAgICAgIFByb2ZpbGUgUmVuZGVyDQogICAgPC90ZXh0Pg0KDQogICAgPHRleHQgeD0iNTAlIiB5PSI3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIEJsYWNrLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjUwIiBmaWxsPSJ1cmwoI2Nvb2xHcmFkKSI+DQogICAgICBQcm9maWxlIFJlbmRlcg0KICAgIDwvdGV4dD4NCiAgPC9nPg0KPC9zdmc+YA==``

![](https://profile-render-fawn.vercel.app/?type=js&code=UmVzdWx0ID0gYDxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDUwMCAxMjAiPg0KICA8ZGVmcz4NCiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImNvb2xHcmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIwJSI+DQogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMDBkMmZmOyI+DQogICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InN0b3AtY29sb3IiIHZhbHVlcz0iIzAwZDJmZjsjOTI4ZGFiOyNlZTA5Nzk7IzAwZDJmZiIgZHVyPSI1cyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIC8+DQogICAgICA8L3N0b3A+DQogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNlZTA5Nzk7Ij4NCiAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ic3RvcC1jb2xvciIgdmFsdWVzPSIjZWUwOTc5OyMwMGQyZmY7IzkyOGRhYjsjZWUwOTc5IiBkdXI9IjVzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz4NCiAgICAgIDwvc3RvcD4NCiAgICA8L2xpbmVhckdyYWRpZW50Pg0KICA8L2RlZnM+DQoNCiAgPGc+DQogICAgPGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJ0cmFuc2xhdGUiIHZhbHVlcz0iMCA1OyAwIC01OyAwIDUiIGR1cj0iM3MiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiAvPg0KDQogICAgPHRleHQgeD0iNTAlIiB5PSI3NCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIEJsYWNrLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjUwIiBmaWxsPSIjMDAwIiBvcGFjaXR5PSIwLjMiPg0KICAgICAgUHJvZmlsZSBSZW5kZXINCiAgICA8L3RleHQ+DQogICAgDQogICAgPHRleHQgeD0iNTAlIiB5PSI3MiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIEJsYWNrLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjUwIiBmaWxsPSIjNDQ0Ij4NCiAgICAgIFByb2ZpbGUgUmVuZGVyDQogICAgPC90ZXh0Pg0KDQogICAgPHRleHQgeD0iNTAlIiB5PSI3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIEJsYWNrLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjUwIiBmaWxsPSJ1cmwoI2Nvb2xHcmFkKSI+DQogICAgICBQcm9maWxlIFJlbmRlcg0KICAgIDwvdGV4dD4NCiAgPC9nPg0KPC9zdmc+YA==)

``https://profile-render-fawn.vercel.app/?type=js&code=dGhyb3cgbmV3IEVycm9yKCLQn9GA0LjQvNC10YAg0L7RiNC40LHQutC4Iik=``

![](https://profile-render-fawn.vercel.app/?type=js&code=dGhyb3cgbmV3IEVycm9yKCLQn9GA0LjQvNC10YAg0L7RiNC40LHQutC4Iik=)

## icon, icons

|  Параметр   | Информация                                                                     | Дефолт  |
|:-----------:|:-------------------------------------------------------------------------------|:-------:|
| icon, icons | Список иконок (использует локальные переменные, см. таблицу ниже)              |         |
|    size     | Размер иконок в пикселях                                                       |   75    |
|     bg      | Цвет заднего фона (если default, то будет цвет заднего фона под иконку)        | default |
|     rad     | Радиус закругления в процентах (50 это круг)                                   |   25    |
|     gap     | Отступы между иконками в пикселях                                              |    5    |
|   max_row   | Максимальное кол-во иконок по горизонтале, потом переходит на следующую строку |    0    |
|     rot     | Поворот иконки в градусах                                                      |    0    |
|     sat     | Насыщеность иконки (0 она серая)                                               |    1    |
|     inv     | Инверсия иконки (1 она инвертированная)                                        |    0    |
|     hue     | Поворот HUE в градусах (180 она инвертированная)                               |    0    |
|    blur     | Блюр иконки в пикселях                                                         |    0    |
|    tran     | Трансформация (как в CSS)                                                      |         |

| Параметр | Информация                                       |      Дефолт       |
|:--------:|:-------------------------------------------------|:-----------------:|
|   icon   | Иконка                                           |       error       |
|   size   | См. size                                         | Из параметра size |
|    bg    | См. bg                                           |  Из параметра bg  |
|   rad    | См. rad                                          | Из параметра rad  |
|   tip    | Текст под иконкой (используется правило [ТЕКСТ]) |                   |
|   rot    | См. rot                                          | Из параметра rot  |
|   sat    | См. sat                                          | Из параметра sat  |
|   inv    | См. inv                                          | Из параметра inv  |
|   hue    | См. hue                                          | Из параметра hue  |
|   blur   | См. blur                                         | Из параметра blur |
|   tran   | См. tran                                         | Из параметра tran |

![](https://profile-render-fawn.vercel.app/?type=debug&debug=icons)

``https://profile-render-fawn.vercel.app/?type=icon``

![](https://profile-render-fawn.vercel.app/?type=icon)

``https://profile-render-fawn.vercel.app/?type=icons``

![](https://profile-render-fawn.vercel.app/?type=icons)

``https://profile-render-fawn.vercel.app/?type=icon&icon=winxp``

![](https://profile-render-fawn.vercel.app/?type=icon&icon=winxp)

``https://profile-render-fawn.vercel.app/?type=icon&icon=not_existing_icon``

![](https://profile-render-fawn.vercel.app/?type=icon&icon=not_existing_icon)

``https://profile-render-fawn.vercel.app/?type=icon&icon=win7&size=200``

![](https://profile-render-fawn.vercel.app/?type=icon&icon=win7&size=200)

``https://profile-render-fawn.vercel.app/?type=icon&icon=git&bg=red``

![](https://profile-render-fawn.vercel.app/?type=icon&icon=git&bg=red)

``https://profile-render-fawn.vercel.app/?type=icon&icon=android&bg=transparent``

![](https://profile-render-fawn.vercel.app/?type=icon&icon=android&bg=transparent)

``https://profile-render-fawn.vercel.app/?type=icon&icon=swift&rad=50``

![](https://profile-render-fawn.vercel.app/?type=icon&icon=swift&rad=50)

``https://profile-render-fawn.vercel.app/?type=icon&icon=ue&rot=180``

![](https://profile-render-fawn.vercel.app/?type=icon&icon=ue&rot=180)

``https://profile-render-fawn.vercel.app/?type=icon&icon=creeper&rot=-90``

![](https://profile-render-fawn.vercel.app/?type=icon&icon=creeper&rot=-90)

``https://profile-render-fawn.vercel.app/?type=icon&icon=cobol&blur=10``

![](https://profile-render-fawn.vercel.app/?type=icon&icon=cobol&blur=10)

``https://profile-render-fawn.vercel.app/?type=icon&icon=lua&hue=90``

![](https://profile-render-fawn.vercel.app/?type=icon&icon=lua&hue=90)

``https://profile-render-fawn.vercel.app/?type=icon&icon=matlab&sat=100``

![](https://profile-render-fawn.vercel.app/?type=icon&icon=matlab&sat=100)

``https://profile-render-fawn.vercel.app/?type=icon&icon=matlab&sat=0``

![](https://profile-render-fawn.vercel.app/?type=icon&icon=matlab&sat=0)

``https://profile-render-fawn.vercel.app/?type=icon&icon=rust&inv=1``

![](https://profile-render-fawn.vercel.app/?type=icon&icon=rust&inv=1)

``https://profile-render-fawn.vercel.app/?type=icon&icon=ruby&tran=translateX(-35px)``

![](https://profile-render-fawn.vercel.app/?type=icon&icon=ruby&tran=translateX(-35px))

``https://profile-render-fawn.vercel.app/?type=icon&icon=ruby&tran=translateY(-35px)``

![](https://profile-render-fawn.vercel.app/?type=icon&icon=ruby&tran=translateY(-35px))

``https://profile-render-fawn.vercel.app/?type=icon&icon=ruby&tran=scale(0.5,0.5)``

![](https://profile-render-fawn.vercel.app/?type=icon&icon=ruby&tran=scale(0.5,0.5))

``https://profile-render-fawn.vercel.app/?type=icon&icon=ruby&tran=scale(2,2)``

![](https://profile-render-fawn.vercel.app/?type=icon&icon=ruby&tran=scale(2,2))

``https://profile-render-fawn.vercel.app/?type=icon&icon=svg&tran=scale(-1,1)``

![](https://profile-render-fawn.vercel.app/?type=icon&icon=svg&tran=scale(-1,1))

``https://profile-render-fawn.vercel.app/?type=icon&icon=ruby&tran=rotate(90deg)``

![](https://profile-render-fawn.vercel.app/?type=icon&icon=ruby&tran=rotate(90deg))

``https://profile-render-fawn.vercel.app/?type=icon&icon=ruby&tran=skew(-20deg,25deg)``

![](https://profile-render-fawn.vercel.app/?type=icon&icon=ruby&tran=skew(-20deg,25deg))

``https://profile-render-fawn.vercel.app/?type=icons&icons=c,cpp,cs``

![](https://profile-render-fawn.vercel.app/?type=icons&icons=c,cpp,cs)

``https://profile-render-fawn.vercel.app/?type=icons&icons=python,not_existing_icon,js``

![](https://profile-render-fawn.vercel.app/?type=icons&icons=python,not_existing_icon,js)

``https://profile-render-fawn.vercel.app/?type=icons&icons={yt,tt,github,blender}``

![](https://profile-render-fawn.vercel.app/?type=icons&icons={yt,tt,github,blender})

``https://profile-render-fawn.vercel.app/?type=icons&icons={yt,tt,github,blender}&gap=50``

![](https://profile-render-fawn.vercel.app/?type=icons&icons={vercel,kt,scala,vkontakte}&gap=50)

``https://profile-render-fawn.vercel.app/?type=icons&icons={src,go,obs,minecraft}&rad=50``

![](https://profile-render-fawn.vercel.app/?type=icons&icons={src,go,obs,minecraft}&rad=50)

``https://profile-render-fawn.vercel.app/?type=icons&icons={sfd,tg,gl,vk}&max_row=2``

![](https://profile-render-fawn.vercel.app/?type=icons&icons={sfd,tg,gl,vk}&max_row=2)

``https://profile-render-fawn.vercel.app/?type=icons&icons={microsoft,{icon=google,rad=50},directx,twitch}``

![](https://profile-render-fawn.vercel.app/?type=icons&icons={microsoft,{icon=google,rad=50},directx,twitch})

``https://profile-render-fawn.vercel.app/?type=icons&icons={microsoft,{icon=google,bg=red},directx,twitch}``

![](https://profile-render-fawn.vercel.app/?type=icons&icons={microsoft,{icon=google,bg=red},directx,twitch})

``https://profile-render-fawn.vercel.app/?type=icons&icons={microsoft,{icon=google,size=150},directx,twitch}``

![](https://profile-render-fawn.vercel.app/?type=icons&icons={microsoft,{icon=google,size=150},directx,twitch})

``https://profile-render-fawn.vercel.app/?type=icons&icons={microsoft,{icon=google,sat=0},directx,twitch}``

![](https://profile-render-fawn.vercel.app/?type=icons&icons={microsoft,{icon=google,sat=0},directx,twitch})

``https://profile-render-fawn.vercel.app/?type=icons&icons={microsoft,{icon=google,sat=10000},directx,twitch}``

![](https://profile-render-fawn.vercel.app/?type=icons&icons={microsoft,{icon=google,sat=10000},directx,twitch})

``https://profile-render-fawn.vercel.app/?type=icons&icons={microsoft,{icon=google,hue=180},directx,twitch}``

![](https://profile-render-fawn.vercel.app/?type=icons&icons={microsoft,{icon=google,hue=180},directx,twitch})

``https://profile-render-fawn.vercel.app/?type=icons&icons={microsoft,{icon=google,inv=1},directx,twitch}``

![](https://profile-render-fawn.vercel.app/?type=icons&icons={microsoft,{icon=google,inv=1},directx,twitch})

``https://profile-render-fawn.vercel.app/?type=icons&icons={microsoft,{icon=google,blur=5},directx,twitch}``

![](https://profile-render-fawn.vercel.app/?type=icons&icons={microsoft,{icon=google,blur=5},directx,twitch})

``https://profile-render-fawn.vercel.app/?type=icons&icons={microsoft,{icon=google,tran="translateX(40px)"},directx,twitch}``

![](https://profile-render-fawn.vercel.app/?type=icons&icons={microsoft,{icon=google,tran=translateX(40px)},directx,twitch})

``https://profile-render-fawn.vercel.app/?type=icons&icons={microsoft,{icon=google,tran="scale(0.5,0.5)"},directx,twitch}``

![](https://profile-render-fawn.vercel.app/?type=icons&icons={microsoft,{icon=google,tran=scale(0.5,0.5)},directx,twitch})

``https://profile-render-fawn.vercel.app/?type=icons&icons={microsoft,{icon=google,tran="skew(20deg,30deg)"},directx,twitch}``

![](https://profile-render-fawn.vercel.app/?type=icons&icons={microsoft,{icon=google,tran=skew(20deg,30deg)},directx,twitch})

``https://profile-render-fawn.vercel.app/?type=icons&icons={{icon=njs,tip=TIPnbsp1},{icon=python,tip=TIPnbsp2}}``

![](https://profile-render-fawn.vercel.app/?type=icons&icons={{icon=njs,tip=TIPnbsp1},{icon=python,tip=TIPnbsp2}})

``https://profile-render-fawn.vercel.app/?type=icons&icons={{icon=troll},{icon=troll,rot=90},{icon=troll,rot=180},{icon=troll,rot=-90}}&bg=transparent``

![](https://profile-render-fawn.vercel.app/?type=icons&icons={{icon=troll},{icon=troll,rot=90},{icon=troll,rot=180},{icon=troll,rot=-90}}&bg=transparent)


## debug

| Параметр | Информация    | Дефолт |
|:--------:|:--------------|:------:|
|  debug   | Что дебажить? |        |

``https://profile-render-fawn.vercel.app/?type=debug``

![](https://profile-render-fawn.vercel.app/?type=debug)

### debug=icons

``https://profile-render-fawn.vercel.app/?type=debug&debug=icons``

![](https://profile-render-fawn.vercel.app/?type=debug&debug=icons)
