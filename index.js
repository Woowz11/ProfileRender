const URL = require("url");
const VM = require("vm");

const { EscapeXML, WrapInSVG, GetIconSVG, IconsInfo, SplitParams, ParseLocalParams, FixColor, EscapeText } = require("./global.js");

// ----------------------------------------------------------------------

module.exports = (Request, Result) => {
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

		const QueryObject = URL.parse(Request.url, true).query || {};
		const Type = QueryObject.type || "notype";

		Result.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
		Result.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

		let Options = { ...DefaultOptions };

		Options.Background = QueryObject.t_bg  || Options.Background;
		Options.Color      = QueryObject.t_c   || Options.Color     ;
		Options.Width      = QueryObject.t_w   || Options.Width     ;
		Options.Height     = QueryObject.t_h   || Options.Height    ;
		Options.LineHeight = QueryObject.t_lh  || Options.LineHeight;
		Options.Padding    = QueryObject.t_pad || Options.Padding   ;
		Options.MaxLines   = QueryObject.t_ml  || Options.MaxLines  ;
		Options.FontSize   = QueryObject.t_fs  || Options.FontSize  ;

		function Run(){
			if(Type === "notype"){
				return "Не указан тип";
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
				const Radius = parseInt(QueryObject.rad) || 25;
				const Rotate = parseInt(QueryObject.rot) || 0;
				const Gap = parseInt(QueryObject.gap) || 5;
				const MaxRow = parseInt(QueryObject.max_row) || 0;
				const Transform = QueryObject.tran || "";
				const Blur = parseFloat(QueryObject.blur) || 0;
				const Invert = parseFloat(QueryObject.inv) || 0;
				const Saturation = parseFloat(QueryObject.sat) || 1;
				const RotateHUE = parseInt(QueryObject.hue) || 0;

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
							Transforms.length > 0 ? `transform-origin: center}` : ""
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
			}

			if(Type === "debug"){
				if(!QueryObject.debug || QueryObject.debug === ""){ return "Не указан \"debug\""; }
				const Debug = QueryObject.debug;

				if(Debug === "icons"){
					const Names = IconsInfo.Names || {};
					const Categories = IconsInfo.Categories || {};
					const Bgs = IconsInfo.Backgrounds || {};

					const IdToAliases = {};
					for (const [alias, id] of Object.entries(Names)) {
						if (!IdToAliases[id]) IdToAliases[id] = [];
						IdToAliases[id].push(alias);
					}

					const RenderGroups = [];
					const CategorizedIds = new Set();
					for (const [catName, ids] of Object.entries(Categories)) {
						RenderGroups.push({ name: catName, ids: ids.sort() });
						ids.forEach(id => CategorizedIds.add(id));
					}

					const Uncategorized = Object.keys(IdToAliases)
						.filter(id => !CategorizedIds.has(id))
						.sort();
					if (Uncategorized.length > 0) RenderGroups.push({ name: "Прочие / Без категории", ids: Uncategorized });

					const RowH = 90;
					const IconSize = 75;
					const ColId = 20;
					const ColAliases = 150;
					const ColIconDef = 550;
					const ColIconClean = 660;
					const CanvasWidth = 780;

					let Y = 70;
					let SVGContent = "";
					let Defs = "";

					RenderGroups.forEach(group => {
						SVGContent += `<text x="${ColId}" y="${Y}" fill="#4fc3f7" font-family="monospace" font-size="20" font-weight="bold">${group.name.toUpperCase()}</text>`;
						SVGContent += `<line x1="${ColId}" y1="${Y + 12}" x2="${CanvasWidth - 20}" y2="${Y + 12}" stroke="#4fc3f7" stroke-opacity="0.3" stroke-width="2" />`;
						Y += 50;

						group.ids.forEach(id => {
							const aliases = (IdToAliases[id] || []).join(", ");
							const bgColor = FixColor(Bgs[id] || "white");

							const rawSVG_def = GetIconSVG(id, `db_d_${id}`);
							const rawSVG_cln = GetIconSVG(id, `db_c_${id}`);

							const clipId = `c_${id}`;
							Defs += `<clipPath id="${clipId}"><rect width="${IconSize}" height="${IconSize}" /></clipPath>`;

							SVGContent += `
            <g transform="translate(0, ${Y})">
                <text x="${ColId}" y="42" fill="#ffffff" font-family="monospace" font-size="16" font-weight="bold">${id}.svg</text>
                <text x="${ColAliases}" y="42" fill="#888" font-family="monospace" font-size="16">${aliases}</text>
                
                <svg x="${ColIconDef}" y="0" width="${IconSize}" height="${IconSize}">
                    <rect width="100%" height="100%" fill="${bgColor}" />
                    <g clip-path="url(#${clipId})">${rawSVG_def || ""}</g>
                </svg>
                
                <svg x="${ColIconClean}" y="0" width="${IconSize}" height="${IconSize}">
                    ${rawSVG_cln || ""}
                </svg>
                
                <line x1="${ColId}" y1="85" x2="${CanvasWidth - 20}" y2="85" stroke="#ffffff" stroke-opacity="0.05" />
            </g>`;
							Y += RowH;
						});
						Y += 40;
					});

					const TotalCanvasHeight = Y + 60;

					return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${CanvasWidth}" height="${TotalCanvasHeight}">
        <defs>${Defs}</defs>
        <rect width="100%" height="100%" fill="#0f0f0f" />
        
        <text x="${ColId}" y="35" fill="#666" font-family="monospace" font-size="11" font-weight="bold">НАЗВАНИЕ ФАЙЛА SVG</text>
        <text x="${ColAliases}" y="35" fill="#666" font-family="monospace" font-size="11" font-weight="bold">АЛИАСЫ / ИМЕНА ДЛЯ ВВОДА</text>
        <text x="${ColIconDef}" y="35" fill="#666" font-family="monospace" font-size="11" font-weight="bold">bg=default</text>
        <text x="${ColIconClean}" y="35" fill="#666" font-family="monospace" font-size="11" font-weight="bold">bg=transparent</text>
        
        ${SVGContent}
        
        <text x="${ColId}" y="${TotalCanvasHeight - 25}" fill="#4fc3f7" font-family="monospace" font-size="12">Всего уникальных иконок: ${Object.keys(IdToAliases).length}</text>
    </svg>`;
				}

				return "Неизвестный тип \"debug\"!";
			}

			return undefined;
		}

		let Result__ = Run();
		if(Result__ === undefined){ throw new Error("Неизвестный \"type\"!"); }

		Result.end(WrapInSVG(Result__, Options));
	}catch(e){
		let Options = { ...DefaultOptions };

		Options.Background = "#411";
		Options.Color      = "#FF7878";

		Result.end(WrapInSVG("Ошибка скрипта: " + e.stack, Options));
	}
};