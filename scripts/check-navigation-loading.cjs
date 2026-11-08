let pw;try{pw=require('playwright')}catch{pw=require(require('path').join(process.env.TEMP,'psykie-ui-check/node_modules/playwright'))}
(async()=>{const b=await pw.chromium.launch({channel:'msedge'}),c=await b.newContext({viewport:{width:1440,height:600}}),p=await c.newPage();const id='00000000-0000-4000-8000-000000000004',user={id,email:'sidebar@example.com',aud:'authenticated',role:'authenticated',created_at:new Date().toISOString()},session={access_token:'test-token',refresh_token:'test-refresh',expires_at:Math.floor(Date.now()/1000)+3600,expires_in:3600,token_type:'bearer',user};await p.addInitScript(session=>{if(!localStorage.getItem('sb-127-auth-token'))localStorage.setItem('sb-127-auth-token',JSON.stringify(session))},session);await c.route('http://127.0.0.1:54321/**',r=>{const path=new URL(r.request().url()).pathname,headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'*'};if(path==='/auth/v1/logout')return r.fulfill({status:204,headers,body:''});return r.fulfill({status:200,headers,contentType:'application/json',body:JSON.stringify(path==='/auth/v1/user'?user:path==='/rest/v1/profiles'?{id,role:'student',display_name:'Sidebar Test'}:{})})});await p.addInitScript(()=>{window.requestIdleCallback=()=>1;window.cancelIdleCallback=()=>{}});await p.goto('http://127.0.0.1:5174/dashboard',{waitUntil:'domcontentloaded'});await p.locator('.overview-page').waitFor();
let release;
const pending = new Promise(resolve => { release = resolve });
let requested;
const requestedPage = new Promise(resolve => { requested = resolve });
await c.route('**/src/pages/NotesPage.tsx*', async route => { requested(); await pending; await route.continue() });
await p.evaluate(() => {
  window.navigationSplashSeen = false;
  new MutationObserver(() => {
    if (document.body.innerText.includes('Loading Psykie...')) window.navigationSplashSeen = true;
  }).observe(document.body, {childList:true, subtree:true});
});
await p.locator('.ref-sidebar').getByRole('button',{name:'Notes',exact:true}).click();
await requestedPage;
await p.waitForTimeout(600);
if (!await p.locator('.overview-page').isVisible() || !await p.locator('.ref-sidebar').isVisible()) throw Error('Navigation hid the current page or sidebar while loading');
release();
await p.locator('.ref-notes-page').waitFor();
for (const [name, selector] of [['Help','.ref-help-page'],['Overview','.overview-page'],['Notes','.ref-notes-page']]) {
  await p.locator('.ref-sidebar').getByRole('button',{name,exact:true}).click();
  await p.locator(selector).waitFor();
}
await p.goBack();
await p.locator('.overview-page').waitFor();
if (await p.evaluate(() => window.navigationSplashSeen)) throw Error('Full-screen splash appeared during navigation');
await p.setViewportSize({width:390,height:800});
await p.locator('.ref-mobile-dock').getByRole('button',{name:'Notes',exact:true}).click();
await p.locator('.ref-notes-page').waitFor();
if (await p.evaluate(() => window.navigationSplashSeen)) throw Error('Full-screen splash appeared on mobile');
console.log('Passed slow first-load navigation, persistent page/sidebar, repeated tab changes, browser Back, and mobile navigation without splash');
await b.close()})().catch(error=>{console.error(error);process.exit(1)})
