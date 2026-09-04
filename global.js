const FS = require("fs");
const PATH = require("path");

const Redis_URL = process.env.Redis_URL;
const Redis_Token = process.env.Redis_Token;

const EscapeXML = function(S){
    if(typeof S !== "string"){ S = String(S); }
    return S.replace(/[<>&"']/g, (C) => ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "\"": "&quot;",
        "'": "&apos;"
    }[C])).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "");
};

const EscapeText = function(S){
    return S.replace(/\\n/g, "\n").replace(/nbsp;?/g, " ");
}

const SplitParams = function(S){
    S = String(S || "").trim();

    if(S.startsWith('{') && S.endsWith('}')){
        let Balance = 0;
        let InternalReset = false;
        for(let i = 0; i < S.length - 1; i++){
            if(S[i] === '{'){ Balance++; }
            if(S[i] === '}'){ Balance--; }
            if(Balance === 0 && i > 0){
                InternalReset = true;
                break;
            }
        }
        if(!InternalReset){
            S = S.slice(1, -1);
        }
    }

    const Parts = [];
    let Current = "";
    let Depth = 0;
    for(let Char of S){
        if(Char === '{'){ Depth++; }
        if(Char === '}'){ Depth--; }
        if(Char === ',' && Depth === 0){
            Parts.push(Current.trim());
            Current = "";
        }else{
            Current += Char;
        }
    }
    if(Current){ Parts.push(Current.trim()); }
    return Parts.filter(P => P.length > 0)
}

const AutoCast = function(V){
    V = String(V).trim();
    if(V.toLowerCase() === "true" ){ return true; }
    if(V.toLowerCase() === "false"){ return false; }
    if(V !== "" && !isNaN(V)){ return Number(V); }
    return V;
}

const ParseLocalParams = function(S, Defaults = {}, PrimaryKey = "value"){
    S = String(S || "").trim();
    const Result = { ...Defaults };

    if(!S.startsWith('{')){
        Result[PrimaryKey] = S;
        return Result;
    }

    S = S.replace(/^{(.*)}$/, "$1");

    const Pairs = S.split(/,(?![^{]*})(?![^\(]*\))/);

    Pairs.forEach((Pair, Index) => {
       let [Key, Value] = Pair.split("=").map(S => S.trim());

       if(Key && Value !== undefined){
           Value = Value.replace(/^["'](.*)["']$/, "$1")
           Result[Key] = AutoCast(Value);
       }else if(Key && Value === undefined){
           if(Index === 0){
               Result[PrimaryKey] = AutoCast(Key);
           }else{
               Result[Key] = true;
           }
       }
    });
    return Result;
}
const FixColor = function(C){
    if(!C || typeof C !== "string"){ return C; }

    const LowerC = C.toLowerCase().trim();

    if(LowerC.startsWith("#")){
        return C;
    }

    if (/^[0-9a-fA-F]{3,8}$/.test(C)) {
        return `#${C}`;
    }

    return C;
}


const WrapInSVG = function(Text, Options = {}){
    Text = Text.trim();
    if(Text.startsWith("<svg")){
        if(!Text.startsWith("<?xml")){
            return `<?xml version="1.0" encoding="UTF-8"?>\n${Text}`;
        }
        return Text;
    }

    const Background = FixColor(Options.Background);
    const Color = FixColor(Options.Color);
    const FontSize = parseInt(Options.FontSize);
    const LineHeight = parseInt(Options.LineHeight) || Math.floor(FontSize * 1.5);
    const Padding = parseInt(Options.Padding);

    const Lines = Text.split("\n");
    const DisplayLines = Lines.slice(0, parseInt(Options.MaxLines));

    const MaxChars = Math.max(...DisplayLines.map(L => L.length), 1);
    const ContentWidth = Math.floor(MaxChars * FontSize * 0.6) + (Padding * 2);
    const Width= parseInt(Options.Width) || ContentWidth;

    const ContentHeight = (DisplayLines.length - 1) * LineHeight + FontSize;
    const Height = parseInt(Options.Height) || (ContentHeight + Padding * 2);

    const FirstLineY = Padding + FontSize - Math.floor(FontSize * 0.15);

    let TextElements = DisplayLines.map((Line, Index) =>
        `<text x="${Padding}" y="${FirstLineY + Index * LineHeight}" fill="${Color}" font-family="monospace" font-size="${FontSize}" xml:space="preserve">${EscapeXML(Line)}</text>`
    ).join("");

    return `<?xml version="1.0" encoding="UTF-8"?>
    <svg xmlns="http://www.w3.org/2000/svg" width="${Width}" height="${Height}" viewBox="0 0 ${Width} ${Height}">
      <rect width="100%" height="100%" rx="6" fill="${Background}" />
      ${TextElements}
    </svg>`.trim();
};

const __CacheSVG = {};
const GetIconSVG = function(IconID, UniquePrefix){
    let SVG;
    if(__CacheSVG[IconID]){
        SVG = __CacheSVG[IconID];
    }else{
        const IconPath = PATH.join(IconsPath, IconID + ".svg");
        SVG = FS.readFileSync(IconPath, "utf8");
        __CacheSVG[IconID] = SVG;
    }

    SVG = SVG.replace(/<\?xml.*?\?>|<!DOCTYPE.*?>|<!--.*?-->/gs, "");

    SVG = SVG.replace(/<svg\s+([^>]*)>/i, (match, attrs) => {
        const CleanAttributes = attrs.replace(/\b(width|height)\s*=\s*["'][^"']*["']/gi, "").trim();
        return `<svg ${CleanAttributes} width="100%" height="100%">`;
    });

    SVG = SVG.replace(/(id=")([^"]*)(")/g, `$1${UniquePrefix}_$2$3`);
    SVG = SVG.replace(/(url\(#)([^)]*)(\))/g, `$1${UniquePrefix}_$2$3`);
    SVG = SVG.replace(/xlink:href="#([^"]*)"/g, `xlink:href="#${UniquePrefix}_$1"`);

    return SVG.trim();
}

// ----------------------------------------------------------------------

const RequestLogs = [];

const AddLog = async function(Type, Query, Request){
    const FullURL = Request.url || "/";
    const Referer = Request.headers["referer"] || Request.headers["referrer"] || Request.headers["x-orig-referer"] || Request.headers["origin"] || "Direct / No Referer";
    const TimeNow = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    
    try{
        const Response = await fetch(`${Redis_URL}/get/history`, {
            headers: { Authorization: `Bearer ${Redis_Token}` }
        });
        const Data = await Response.json();
        let Logs = Data.result ? JSON.parse(Data.result) : [];

        const ExistingEntry = Logs.find(Log => Log.URL == FullURL && Log.Referer == Referer);

        if(ExistingEntry){
            ExistingEntry.Time = TimeNow;
            ExistingEntry.Count++;
        }else{
            const NewEntry = {
                Time: TimeNow,
                Type: Type,
                URL: FullURL,
                Referer: Referer,
                Count: 1
            };

            if(Type === "js" && Query.code){
                try{
                    const Code = Buffer.from(Query.code.replace(/ /g, "+"), "base64").toString("utf8");
                    NewEntry.JSPreview = Code.substring(0, 150);
                }catch(e){}
            }

            Logs.unshift(NewEntry);
        }
        
        await fetch(`${Redis_URL}/set/history`, {
            method: "POST",
            headers: { Authorization: `Bearer ${Redis_Token}` },
            body: JSON.stringify(Logs)
        })
    }catch(e){
        console.error("Redis Error:", e)
    }
}

// ----------------------------------------------------------------------

const IconsPath = PATH.join(process.cwd(), "resources", "icons");
const IconsInfoPath = PATH.join(IconsPath, "icons.json");

if(!FS.existsSync(IconsInfoPath)){ throw new Error("icons.json не найден!"); }

const IconsInfo = JSON.parse(FS.readFileSync(IconsInfoPath, "utf8"));

module.exports = {
    EscapeXML,
    WrapInSVG,
    GetIconSVG,
    IconsInfo,
    SplitParams,
    ParseLocalParams,
    AutoCast,
    FixColor,
    EscapeText,
    RequestLogs,
    AddLog,
    Redis_URL,
    Redis_Token
};