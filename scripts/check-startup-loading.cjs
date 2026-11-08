const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const user={id:'00000000-0000-4000-8000-000000000011',email:'startup@example.com',aud:'authenticated',role:'authenticated',created_at:new Date().toISOString()};
const session={access_token:'test-token',refresh_token:'test-refresh',expires_at:Math.floor(Date.now()/1000)+3600,expires_in:3600,token_type:'bearer',user};
const base='http://127.0.0.1:5174';
function latch(){let resolve;const promise=new Promise(done=>{resolve=done});return{promise,resolve}}
async function observe(page,authenticated){await page.addInitScript(({session,authenticated})=>{
  if(authenticated)localStorage.setItem('sb-127-auth-token',JSON.stringify(session));
  const seen=new WeakSet();window.loaderStats={mounts:0,removals:0,max:0};
  const find=node=>node instanceof Element?[...(node.matches('[data-startup-loader]')?[node]:[]),...node.querySelectorAll('[data-startup-loader]')]:[];
  new MutationObserver(records=>{for(const record of records){for(const node of record.addedNodes)for(const loader of find(node)){if(!seen.has(loader)){seen.add(loader);window.loaderStats.mounts++}}for(const node of record.removedNodes)window.loaderStats.removals+=find(node).length}window.loaderStats.max=Math.max(window.loaderStats.max,document.querySelectorAll('[data-startup-loader]').length)}).observe(document,{childList:true,subtree:true});
},{session,authenticated})}
(async()=>{
  const browser=await chromium.launch({channel:'msedge'}),context=await browser.newContext(),page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));await observe(page,true);
  const authStarted=latch(),authRelease=latch(),pageStarted=latch(),pageRelease=latch();let userRequests=0,profileRequests=0;
  await context.route('http://127.0.0.1:54321/**',async route=>{
    const path=new URL(route.request().url()).pathname,headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'*'};
    if(route.request().method()==='OPTIONS')return route.fulfill({status:204,headers});
    if(path==='/auth/v1/user'){userRequests++;authStarted.resolve();await authRelease.promise}
    if(path==='/rest/v1/profiles')profileRequests++;
    return route.fulfill({status:200,headers,contentType:'application/json',body:JSON.stringify(path==='/auth/v1/user'?user:path==='/rest/v1/profiles'?{id:user.id,role:'student',display_name:'Startup Test'}:{})});
  });
  await context.route('**/src/pages/DashboardPage.tsx*',async route=>{pageStarted.resolve();await pageRelease.promise;await route.continue()});
  await page.goto(base+'/dashboard',{waitUntil:'domcontentloaded'});await authStarted.promise;
  await page.locator('[data-startup-loader]').waitFor();assert.equal(await page.locator('[data-startup-loader]').count(),1);
  authRelease.resolve();await pageStarted.promise;await page.waitForTimeout(200);
  assert.equal((await page.evaluate(()=>window.loaderStats)).mounts,1,'Loader remounted between auth and route loading');
  assert.equal(await page.locator('[data-startup-loader]').count(),1,'Loader disappeared before lazy page resolved');
  pageRelease.resolve();await page.locator('.overview-page').waitFor();await page.locator('[data-startup-loader]').waitFor({state:'detached'});
  assert.deepEqual(await page.evaluate(()=>window.loaderStats),{mounts:1,removals:1,max:1});assert.equal(userRequests,1,'StrictMode duplicated auth checks');assert.equal(profileRequests,1,'Profile fetched twice during startup');
  console.log('Passed: one uninterrupted startup loader across delayed auth and route chunk; one session/profile check.');
  // A signed-out protected deep link redirects through the same startup boundary.
  const publicContext=await browser.newContext(),publicPage=await publicContext.newPage();await observe(publicPage,false);
  await publicPage.goto(base+'/notes');await publicPage.waitForURL('**/login');await publicPage.getByLabel('Email',{exact:true}).waitFor();
  assert.deepEqual(await publicPage.evaluate(()=>window.loaderStats),{mounts:1,removals:1,max:1});
  console.log('Passed: signed-out deep-link redirect does not replay startup.');
  // Expired sessions leave the loader and expose an actionable sign-in form.
  const expiredContext=await browser.newContext(),expired=await expiredContext.newPage();await observe(expired,true);
  await expiredContext.route('http://127.0.0.1:54321/**',route=>route.fulfill({status:401,headers:{'Access-Control-Allow-Origin':'*'},contentType:'application/json',body:JSON.stringify({message:'Session expired',error_code:'bad_jwt'})}));
  await expired.goto(base+'/dashboard');await expired.waitForURL('**/login');await expired.getByLabel('Email',{exact:true}).waitFor();
  assert.equal(await expired.locator('[data-startup-loader]').count(),0);assert.equal((await expired.evaluate(()=>window.loaderStats)).mounts,1);
  assert.deepEqual(errors,[]);console.log('Passed: session errors resolve to sign-in without a stuck or repeated loader.');await browser.close();
})().catch(error=>{console.error(error);process.exit(1)})
