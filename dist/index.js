#!/usr/bin/env node
var q=Object.create;var v=Object.defineProperty;var I=Object.getOwnPropertyDescriptor;var Y=Object.getOwnPropertyNames;var A=Object.getPrototypeOf,F=Object.prototype.hasOwnProperty;var V=(e,n,r,s)=>{if(n&&typeof n=="object"||typeof n=="function")for(let i of Y(n))!F.call(e,i)&&i!==r&&v(e,i,{get:()=>n[i],enumerable:!(s=I(n,i))||s.enumerable});return e};var f=(e,n,r)=>(r=e!=null?q(A(e)):{},V(n||!e||!e.__esModule?v(r,"default",{value:e,enumerable:!0}):r,e));var l=f(require("pathe")),g=f(require("fs")),u=require("dotenv"),w=require("@manypkg/get-packages"),x=require("child_process");var a={wait_stacks:[],...console,wait(...e){this.wait_stacks.push(...e)},don(...e){e.length&&console.log(...e),this.wait_stacks.forEach(n=>console.log(n)),this.wait_stacks=[]}};var p=process.cwd();async function E(e,n={}){if(!e){y(`${p}/.env`,n);return}let{packages:r,root:s}=await(0,w.getPackages)(process.cwd());s.dir!==p&&a.warn("Subproject exposes environment. If is correct, ignore this message.");for(let i of r.filter(t=>t.dir!==p))a.wait(` - ${l.default.relative(p,i.dir)}/.env`),y(`${i.dir}/.env`,n)}async function b(e,n){if(Array.isArray(e)&&(e=e.join(" ")),!e)throw new Error("Unable to run empty running script");let{execaSync:r}=await import("execa"),s={stdio:"inherit",env:{...process.env,...n}},i=e.split("&&").map(t=>t.trim());for(let t of i)try{r(t,s)}catch{(0,x.execSync)(t,s)}}function k(e){e="."+e;let n=T(e);if(!n)return;if(e!==".env.vault")return(0,u.config)({path:n,processEnv:{}});let r=h(".env.key")||process.env.DOTENV_KEY||h(".env");if(!r)throw new Error("no DOTENV_KEY found in .env | .env.key or process.env");return(0,u.config)({DOTENV_KEY:r,path:n})}function T(e){let n=p;for(;n!==l.default.parse(n).root;){let r=l.default.join(n,e);if(g.default.existsSync(r))return r;n=l.default.dirname(n)}}function j(e){return[...new Set([...e])]}function O(e){return e!=="env"?e==="dotenv"?"env.vault":`env.${e}`:e}function h(e){return(0,u.config)({processEnv:{},path:T(e)}).parsed?.DOTENV_KEY}function y(e,n={}){let s=["# This file is generated by lnv command","# DO NOT ATTEMPT TO EDIT THIS FILE",Object.entries(n).map(([i,t])=>`${i}=${t}`).join(`
`)].join(`
`);g.default.writeFileSync(e,s,"utf-8")}function $(e){let n=[],r="",s=!1,i="";for(let t of e)t.startsWith("'")||t.startsWith("`")?s?r+=" "+t.slice(1):(s=!0,i=t[0],r+=t.slice(1)):t.endsWith("'")||t.endsWith("`")?s&&i===t[t.length-1]?(r+=" "+t.slice(0,-1),n.push(r.trim()),r="",s=!1):n.push(t):s?r+=" "+t:n.push(t);return r&&n.push(r.trim()),n}var _=f(require("yargs")),D=require("yargs/helpers");var S="5.1.0";function N(){let e=$((0,D.hideBin)(process.argv));return(0,_.default)(e).scriptName("lnv").showHelpOnFail(!1).version(S).usage("lnv <mode> [args]").alias("h","help").alias("v","version").option("run",{describe:"load runtime environment and run any scripts",type:"array",alias:"r"}).option("monorepo",{describe:"apply to packages in the monorepo.",type:"boolean",alias:"m"}).option("expose",{describe:"expose environment variables",alias:"e",type:"boolean"}).option("default",{describe:"the default environment (env|...|env.local) be loaded",alias:"d",type:"boolean"}).help()}var o=N().parse();async function M(){await P().catch(e=>{console.warn(`LNV Error: ${e.message}`),process.exit()})}async function P(){if(!o.e&&!o.r)throw new Error("Missing required --expose|-e or --run|-r options");if(o.m&&o.r)throw new Error("In monorepo, the run script cannot be run");if(o.e&&o.r)throw new Error("Expose and run cannot run simultaneously");let e=[o.d&&"env",...o._||[],o.d&&"local"],n=j(e).filter(Boolean).map(O);if(!n.length)throw new Error("Please enter lnv <modes> the loading mode");o.e&&!o.m&&n.splice(0,1);let r={},s=[];for(let c of n){let m=k(c);if(!m||m?.error){o.d&&(c==="env"||c==="env.local")||a.log(`Failed to loading ${c} file not found in all scopes`);continue}Object.assign(r,m.parsed),s.unshift(c)}let i=o.e?"exposed":"loaded",t=o.m?"packages by":"runtime environment",d=`Successfully ${i} ${s.join("|")} to ${t}`;o.r&&a.log(d),o.r&&await b(o.r,r),o.e&&await E(o.m,r),o.e&&a.don(d)}M();
