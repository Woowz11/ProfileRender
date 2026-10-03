const VM = require("vm");

const { EscapeXML, WrapInSVG, GetIconSVG, IconsInfo, SplitParams, ParseLocalParams, FixColor, EscapeText, Redis_URL, Redis_Token } = require("./global.js");

// ----------------------------------------------------------------------

module.exports = async (Request, Result) => {
	const DefaultOptions = {
		Background: "#555555",
		Color     : "#FFFFFF",
		Width     : null,
		Height    : null,
		LineHeight: null,
		Padding   : 30,
		MaxLines  : 100,
		FontSize  : 12
	};

	try{
		Result.statusCode = 200;

        const Protocol = Request.headers["x-forwarded-proto"] || "http";
        const FullURL = new URL(Request.url, `${Protocol}://${Request.headers.host}`);
		const QueryObject = Object.fromEntries(FullURL.searchParams);
        
		const Type = QueryObject.type || "notype";
        
		Result.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
        Result.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, proxy-revalidate");
        Result.setHeader("Pragma", "no-cache");
        Result.setHeader("Expires", "0");
        
		let Options = { ...DefaultOptions };

		Options.Background = QueryObject.t_bg  || Options.Background;
		Options.Color      = QueryObject.t_c   || Options.Color     ;
		Options.Width      = QueryObject.t_w   || Options.Width     ;
		Options.Height     = QueryObject.t_h   || Options.Height    ;
		Options.LineHeight = QueryObject.t_lh  || Options.LineHeight;
		Options.Padding    = QueryObject.t_pad || Options.Padding   ;
		Options.MaxLines   = QueryObject.t_ml  || Options.MaxLines  ;
		Options.FontSize   = QueryObject.t_fs  || Options.FontSize  ;

        async function Run(){
			if(Type === "notype"){
				return "Не указан \"type\"";
			}

			if(Type === "simple"){
				return EscapeText(QueryObject.text || "Не указан \"text\"");
			}

			if(Type === "js"){
				const Base64Code = QueryObject.code || "UmVzdWx0ID0gItCd0LUg0YPQutCw0LfQsNC9IFwiY29kZVwiIg==";

				const Code = Buffer.from(Base64Code.replace(/ /g, "+"), "base64").toString("utf8");

				const Sandbox = {
					console,
					Result: null,
					Request,
					process: { env: {} }
				};

				VM.createContext(Sandbox);
				VM.runInContext(Code, Sandbox);

				return String(Sandbox.Result || "Код был успешно вызван, используйте \"Result = ...\" в вашем коде что-бы вывести результат!");
			}

			if(Type === "icon" || Type === "icons"){
				const RawInput = QueryObject.icons || QueryObject.icon || "";
				if(!RawInput){ return "Не указаны \"icon\" или \"icons\""; }

				const Size = parseInt(QueryObject.size) || 75;
				const Background = QueryObject.bg || "default";
				const Rotate = parseInt(QueryObject.rot) || 0;
				const Gap = parseInt(QueryObject.gap) || 5;
				const MaxRow = parseInt(QueryObject.max_row) || 0;
				const Transform = QueryObject.tran || "";
				const Blur = parseFloat(QueryObject.blur) || 0;
				const Invert = parseFloat(QueryObject.inv) || 0;
				const RotateHUE = parseInt(QueryObject.hue) || 0;
				const Radius = (QueryObject.rad !== undefined) ? parseInt(QueryObject.rad) : 25;
				const Saturation = (QueryObject.sat !== undefined) ? parseFloat(QueryObject.sat) : 1;

				const IconItems = SplitParams(RawInput).map((Item, Idx) => {
					const Local = ParseLocalParams(Item, {
						size: Size,
						bg: Background,
						rad: Radius,
						rot: Rotate,
						tran: Transform,
						blur: Blur,
						inv: Invert,
						sat: Saturation,
						hue: RotateHUE,
						tip: ""
					}, "icon");

					const IconID = IconsInfo["Names"][Local.icon] || "error";

					Local["tip"] = EscapeText(Local["tip"]);

					if(Local.bg === "default"){
						Local.bg = IconsInfo["Backgrounds"][IconID] || "white";
					}

					const SVGData = GetIconSVG(IconID, `idx${Idx}`);
					return { ...Local, SVGData, id: Idx };
				});

				let Rows = [];
				if(MaxRow > 0){
					for(let i = 0; i < IconItems.length; i += MaxRow){ Rows.push(IconItems.slice(i, i + MaxRow)); }
				}else{
					Rows.push(IconItems);
				}

				const LabelFontSize = 11;
				const LabelGap = 4;

				let CanvasWidth = 0;
				const RowMetrics = Rows.map(Row => {
					const RowW = Row.reduce((Sum, Icon) => Sum + Icon.size, 0) + (Row.length - 1) * Gap;
					const HasAnyTip = Row.some(i => i.tip);
					const RowH = Math.max(...Row.map(i => i.size)) + (HasAnyTip ? (LabelFontSize + LabelGap) : 0);
					if(RowW > CanvasWidth){ CanvasWidth = RowW; }
					return { W: RowW, H: RowH };
				});
				const CanvasHeight = RowMetrics.reduce((Sum, M) => Sum + M.H, 0) + (Rows.length - 1) * Gap;

				let CurrentY = 0;
				let SVGContent = "";
				let Defs = "";

				Rows.forEach((Row, RIdx) => {
					const Metrics = RowMetrics[RIdx];
					let CurrentX = 0;

					Row.forEach(Icon => {
						const BGColor = FixColor(Icon.bg);

						const RX = (Icon.size * Icon.rad) / 100;

						const BGRect = (BGColor && BGColor !== "transparent") ? `<rect width="${Icon.size}" height="${Icon.size}" fill="${BGColor}" rx="${RX}" />` : "";

						const Filters = [];
						if(Icon.blur  > 0){ Filters.push(`blur(${Icon.blur}px)`); }
						if(Icon.inv   > 0){ Filters.push(`invert(${Icon.inv})`); }
						if(Icon.sat !== 1){ Filters.push(`saturate(${Icon.sat})`); }
						if(Icon.hue !== 0){ Filters.push(`hue-rotate(${Icon.hue}deg)`); }

						const Transforms = [];
						if(Icon.rot){ Transforms.push(`rotate(${Icon.rot}deg)`); }
						if(Icon.tran){ Transforms.push(Icon.tran); }

						const CombinedStyle = [
							Filters.length > 0 ? `filter: ${Filters.join(" ")}` : "",
							Transforms.length > 0 ? `transform: ${Transforms.join(" ")}` : "",
							Transforms.length > 0 ? `transform-box: fill-box` : "",
							Transforms.length > 0 ? `transform-origin: center` : ""
						].filter(Boolean).join("; ");
						const StyleAttribute = CombinedStyle ? `style="${CombinedStyle}"` : "";

						let ClipAttribute = "";
						if(Icon.rad > 0){
							const ClipID = `round_${Icon.id}`;
							Defs += `<clipPath id="${ClipID}"><rect width="${Icon.size}" height="${Icon.size}" rx="${RX}" /></clipPath>`;
							ClipAttribute = `clip-path="url(#${ClipID})"`;
						}

						SVGContent += `
<svg x="${CurrentX}" y="${CurrentY}" width="${Icon.size}" height="${Icon.size}">
	<g ${ClipAttribute}>
		${BGRect}
		<g ${StyleAttribute}>
			${Icon.SVGData || ""}
		</g>
	</g>
</svg>`;

						if(Icon.tip){
							const TextX = CurrentX + (Icon.size / 2);
							const TextY = CurrentY + Icon.size + LabelGap + (LabelFontSize * 0.8);
							SVGContent += `<text x="${TextX}" y="${TextY}" fill="${Options.Color}" font-family="monospace" font-size="${LabelFontSize}" text-anchor="middle" xml:space="preserve">${EscapeXML(Icon.tip)}</text>`;
						}

						CurrentX += Icon.size + Gap;
					});
					CurrentY += Metrics.H + Gap;
				});

				return `<svg xmlns="http://www.w3.org/2000/svg" width="${CanvasWidth}" height="${CanvasHeight}">
					<defs>${Defs}</defs>
					${SVGContent}
				</svg>`;
			}else if (Type === "timer") {
				let targetRaw = (QueryObject.target || "").replace(/\s/g, "+");
				if (!targetRaw) return "Укажите target=YYYY-MM-DDTHH:mm:ssZ";

				const TargetDate = new Date(targetRaw);
				const Now = new Date();
				const Diff = TargetDate.getTime() - Now.getTime();

				if (isNaN(TargetDate.getTime())) return "Неверный формат даты";

				// Если время вышло
				const IsExpired = Diff <= 0;
				const TotalSeconds = IsExpired ? 0 : Math.floor(Diff / 1000);

				const d = Math.floor(TotalSeconds / 86400);
				const h = Math.floor((TotalSeconds % 86400) / 3600);
				const m = Math.floor((TotalSeconds % 3600) / 60);
				const s = TotalSeconds % 60;

				const BG = FixColor(Options.Background);
				const Color = FixColor(Options.Color);
				const Title = QueryObject.desc || "ДО СОБЫТИЯ ОСТАЛОСЬ";

				// Анимация цифр (секунды и минуты)
				let secKeyframes = "";
				for (let i = 0; i <= 60; i++) {
					let val = s - i;
					while (val < 0) val += 60;
					secKeyframes += `${(i * (100 / 60)).toFixed(2)}% { content: "${String(val).padStart(2, '0')}" }\n`;
				}

				// Расчет углов для часов (текущее время сервера)
				const serverTime = new Date();
				const sDeg = serverTime.getSeconds() * 6;
				const mDeg = serverTime.getMinutes() * 6 + sDeg / 60;
				const hDeg = (serverTime.getHours() % 12) * 30 + mDeg / 12;

				return `
			<svg width="500" height="160" viewBox="0 0 500 160" fill="none" xmlns="http://www.w3.org/2000/svg">
				<style>
					@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&family=Inter:wght@400;800&display=swap');
					
					.bg { fill: ${BG}; rx: 16; }
					.title { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 400; letter-spacing: 2px; fill: ${Color}; opacity: 0.6; }
					.digits { font-family: 'JetBrains Mono', monospace; font-size: 42px; font-weight: 700; fill: ${Color}; }
					.labels { font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 800; fill: ${Color}; opacity: 0.4; text-transform: uppercase; }
					
					.sec-anim::after { content: "${String(s).padStart(2, '0')}"; animation: step-sec 60s step-end infinite; }
					@keyframes step-sec { ${secKeyframes} }
					
					/* Анимация часов справа */
					.hand { transform-origin: 400px 80px; stroke: ${Color}; stroke-linecap: round; }
					.hand-sec { stroke: #FF4B4B; stroke-width: 1.5; animation: rotate-s 60s linear infinite; }
					.hand-min { stroke-width: 3; opacity: 0.8; animation: rotate-m 3600s linear infinite; }
					.hand-hour { stroke-width: 4; animation: rotate-h 43200s linear infinite; }
					
					@keyframes rotate-s { from { transform: rotate(${sDeg}deg); } to { transform: rotate(${sDeg + 360}deg); } }
					@keyframes rotate-m { from { transform: rotate(${mDeg}deg); } to { transform: rotate(${mDeg + 360}deg); } }
					@keyframes rotate-h { from { transform: rotate(${hDeg}deg); } to { transform: rotate(${hDeg + 360}deg); } }
				</style>

				<rect class="bg" width="500" height="160" />
				
				<!-- Текст и таймер -->
				<text x="30" y="45" class="title">${EscapeXML(Title)}</text>
				
				<g class="digits">
					<text x="30" y="100">${d}<tspan class="labels" dy="-20">d</tspan></text>
					<text x="100" y="100">${String(h).padStart(2, '0')}<tspan class="labels" dy="-20">h</tspan></text>
					<text x="170" y="100">${String(m).padStart(2, '0')}<tspan class="labels" dy="-20">m</tspan></text>
					<foreignObject x="240" y="58" width="100" height="60">
						<div xmlns="http://www.w3.org/1999/xhtml" class="digits sec-anim" style="color:${Color}"></div>
						<div xmlns="http://www.w3.org/1999/xhtml" class="labels" style="color:${Color}; margin-top:-10px; margin-left:55px">s</div>
					</foreignObject>
				</g>

				<!-- Циферблат часов -->
				<g transform="translate(400, 80)">
					<circle r="55" stroke="${Color}" stroke-width="2" opacity="0.1" fill="white" fill-opacity="0.05" />
					<circle r="2" fill="${Color}" />
					<!-- Деления -->
					${[0, 90, 180, 270].map(deg => `<line x1="0" y1="-50" x2="0" y2="-45" stroke="${Color}" transform="rotate(${deg})" opacity="0.5"/>`).join('')}
				</g>
				
				<!-- Стрелки -->
				<line class="hand hand-hour" x1="400" y1="80" x2="400" y2="55" />
				<line class="hand hand-min" x1="400" y1="80" x2="400" y2="45" />
				<line class="hand hand-sec" x1="400" y1="80" x2="400" y2="40" />
				
				<!-- Стеклянный блик -->
				<rect width="500" height="160" rx="16" fill="url(#grad)" opacity="0.1" pointer-events="none" />
				<defs>
					<linearGradient id="grad" x1="0" y1="0" x2="500" y2="160" gradientUnits="userSpaceOnUse">
						<stop stop-color="white" />
						<stop offset="1" stop-color="white" stop-opacity="0" />
					</linearGradient>
				</defs>
			</svg>`.trim();
			}
            
			if(Type === "debug"){
				if(!QueryObject.debug || QueryObject.debug === ""){ return "Не указан \"debug\""; }
				const Debug = QueryObject.debug;

				if(Debug === "icons"){
					const Names = IconsInfo["Names"] || {};
					const Categories = IconsInfo["Categories"] || {};
					const Bgs = IconsInfo["Backgrounds"] || {};

					const IdToAliases = {};
					const AllUniqueIdsInOrder = [];

					for(const [alias, id] of Object.entries(Names)){
						if (!IdToAliases[id]) {
							IdToAliases[id] = [];
							AllUniqueIdsInOrder.push(id);
						}
						IdToAliases[id].push(alias);
					}

					const CategorizedIds = new Set();
					const CategoryKeys = Object.keys(Categories);

					CategoryKeys.forEach(name => {
						Categories[name].forEach(id => CategorizedIds.add(id));
					});

					const UncategorizedIds = AllUniqueIdsInOrder.filter(id => !CategorizedIds.has(id));

					const Sections = [];
					Sections.push({ type: "header" });
					Sections.push({ type: "footer" });
					Sections.push({ type: "category", name: "Без категории", ids: UncategorizedIds });

					CategoryKeys.forEach(name => {
						Sections.push({ type: "category", name: name, ids: Categories[name] });
					});

					const TargetIdx = parseInt(QueryObject.cat);
					if(isNaN(TargetIdx) || !Sections[TargetIdx]){
						const available = Sections.map((s, i) => `${i}: ${s.name || s.type}`).join(",\n");
						return `Не указан \"cat\", или некорректный индекс категории. Доступно:\n${available}`;
					}

					const Section = Sections[TargetIdx];

					if (TargetIdx === 2 && (!Section.ids || Section.ids.length === 0)) {
						return `<svg xmlns="http://www.w3.org/2000/svg" width="780" height="1" style="opacity:0"></svg>`;
					}

					const CanvasWidth = 780;
					const IconSize = 75;
					const RowH = 90;
					const ColId = 20;
					const ColAliases = 150;
					const ColIconDef = 550;
					const ColIconClean = 660;

					if(Section.type === "header"){
						return `<svg xmlns="http://www.w3.org/2000/svg" width="${CanvasWidth}" height="60">
							<rect width="100%" height="100%" fill="#0f0f0f" />
							<text x="${ColId}" y="40" fill="#666" font-family="monospace" font-size="11" font-weight="bold">НАЗВАНИЕ ФАЙЛА SVG</text>
							<text x="${ColAliases}" y="40" fill="#666" font-family="monospace" font-size="11" font-weight="bold">АЛИАСЫ / ИМЕНА ДЛЯ ВВОДА</text>
							<text x="${ColIconDef}" y="40" fill="#666" font-family="monospace" font-size="11" font-weight="bold">bg=default</text>
							<text x="${ColIconClean}" y="40" fill="#666" font-family="monospace" font-size="11" font-weight="bold">bg=transparent</text>
							<line x1="0" y1="59" x2="${CanvasWidth}" y2="59" stroke="#ffffff" stroke-opacity="0.1" />
						</svg>`;
					}

					if(Section.type === "footer"){
						return `<svg xmlns="http://www.w3.org/2000/svg" width="${CanvasWidth}" height="50">
							<rect width="100%" height="100%" fill="#0f0f0f" />
							<line x1="0" y1="0" x2="${CanvasWidth}" y2="0" stroke="#4fc3f7" stroke-opacity="0.3" />
							<text x="${ColId}" y="30" fill="#4fc3f7" font-family="monospace" font-size="12">Всего уникальных иконок: ${AllUniqueIdsInOrder.length}</text>
						</svg>`;
					}

					if(Section.type === "category"){
						let Y = 40;
						let SVGContent = "";
						let Defs = "";

						SVGContent += `<text x="${ColId}" y="${Y}" fill="#4fc3f7" font-family="monospace" font-size="20" font-weight="bold">${Section.name.toUpperCase()}</text>`;
						SVGContent += `<line x1="${ColId}" y1="${Y + 12}" x2="${CanvasWidth - 20}" y2="${Y + 12}" stroke="#4fc3f7" stroke-opacity="0.3" stroke-width="2" />`;
						Y += 30;

						Section.ids.forEach(id => {
							const aliases = (IdToAliases[id] || []).join(", ");
							const bgColor = FixColor(Bgs[id] || "white");
							const rawSVG_def = GetIconSVG(id, `db_d_${id}`);
							const rawSVG_cln = GetIconSVG(id, `db_c_${id}`);
							const clipId = `c_${id}`;

							Defs += `<clipPath id="${clipId}"><rect width="${IconSize}" height="${IconSize}" /></clipPath>`;

							SVGContent += `<g transform="translate(0, ${Y})">
								<text x="${ColId}" y="52" fill="#ffffff" font-family="monospace" font-size="16" font-weight="bold">${id}.svg</text>
								<text x="${ColAliases}" y="52" fill="#888" font-family="monospace" font-size="16">${aliases}</text>
								<svg x="${ColIconDef}" y="10" width="${IconSize}" height="${IconSize}">
									<rect width="100%" height="100%" fill="${bgColor}" />
									<g clip-path="url(#${clipId})">${rawSVG_def || ""}</g>
								</svg>
								<svg x="${ColIconClean}" y="10" width="${IconSize}" height="${IconSize}">${rawSVG_cln || ""}</svg>
								<line x1="${ColId}" y1="95" x2="${CanvasWidth - 20}" y2="95" stroke="#ffffff" stroke-opacity="0.05" />
							</g>`;
							Y += RowH + 10;
						});

						return `<svg xmlns="http://www.w3.org/2000/svg" width="${CanvasWidth}" height="${Y + 20}">
							<defs>${Defs}</defs>
							<rect width="100%" height="100%" fill="#0f0f0f" />
							${SVGContent}
						</svg>`;
					}
				}else if(Debug === "trace"){
                    const CanvasWidth = 800;
                    const Headers = Request.headers;
                    let Y = 70;
                    let HeadersContent = "";

                    Object.entries(Headers).forEach(([key, value]) => {
                        HeadersContent += `
                        <g transform="translate(0, ${Y})">
                            <text x="20" y="0" fill="#4fc3f7" font-family="monospace" font-size="10">${key.toUpperCase()}:</text>
                            <text x="180" y="0" fill="#aaa" font-family="monospace" font-size="10">${EscapeXML(value).substring(0, 90)}</text>
                        </g>`;
                        Y += 15;
                    });

                    return `
                    <svg xmlns="http://www.w3.org/2000/svg" width="${CanvasWidth}" height="${Y + 40}">
                        <rect width="100%" height="100%" fill="#0f0f0f" rx="10"/>
                        <text x="20" y="35" fill="#fff" font-family="monospace" font-size="20" font-weight="bold">HTTP HEADERS TRACE</text>
                        <text x="20" y="55" fill="#666" font-family="monospace" font-size="10">Этот список показывает всё, что ваш браузер/сайт сообщил серверу:</text>
                        <line x1="20" y1="60" x2="${CanvasWidth-20}" y2="60" stroke="#333" />
                        
                        ${HeadersContent}
                        
                        <line x1="20" y1="${Y+10}" x2="${CanvasWidth-20}" y2="${Y+10}" stroke="#333" />
                        <text x="20" y="${Y+25}" fill="#ffeb3b" font-family="monospace" font-size="10" font-weight="bold">
                            СОВЕТ: Если тут нет ссылки на сайт, значит сайт (например GitHub) намеренно её скрывает.
                        </text>
                    </svg>`;
                }
			}

			return undefined;
		}

		let Result__ = await Run();
		if(Result__ === undefined){ throw new Error("Неизвестный \"type\"!"); }

		Result.end(WrapInSVG(Result__, Options));
	}catch(e){
		let Options = { ...DefaultOptions };

		Options.Background = "#411";
		Options.Color      = "#FF7878";

		Result.end(WrapInSVG("Ошибка скрипта: " + e.stack, Options));
	}
};