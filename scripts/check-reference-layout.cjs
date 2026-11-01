let playwright;
try { playwright = require('playwright') } catch { playwright = require(process.env.PLAYWRIGHT_MODULE || require('path').join(process.env.TEMP, 'psykie-ui-check/node_modules/playwright')) }
const { chromium } = playwright;
const fs = require('fs');
(async()=>{
const browser=await chromium.launch({channel:'msedge',headless:true});
const context=await browser.newContext({reducedMotion:'reduce'});
const page=await context.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1:5173/')&&r.status()>=400)errors.push(r.status()+' '+r.url())});
await page.addInitScript(()=>localStorage.setItem('auth-storage',JSON.stringify({state:{isAuthenticated:true,user:{id:'ui-check',name:'Alex Morgan',email:'student@psykie.com',role:'student',createdAt:new Date().toISOString()}},version:0})));
const results=[];fs.mkdirSync('artifacts/reference',{recursive:true});
for(const width of [320,390,768,1024,1440]) {
 console.log(`Checking ${width}px`);
 await page.setViewportSize({width,height:900});
 for(const route of ['dashboard','flashcards','notes','quizzes','research','calendar','sessions','clients','documents','mindy','settings','help']) {
  await page.goto(`http://127.0.0.1:5173/${route}`, { waitUntil: 'domcontentloaded' });await page.locator('.reference-page h1').waitFor({state:'visible'});await page.waitForTimeout(1500);
  const result=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth,overflow:[...document.querySelectorAll('main *')].filter(el=>{const r=el.getBoundingClientRect();return r.width>0&&r.right>innerWidth+2&&getComputedStyle(el).position!=='fixed'}).slice(0,8).map(el=>({tag:el.tagName,cls:el.className?.baseVal??el.className,text:el.textContent?.slice(0,55),right:Math.round(el.getBoundingClientRect().right)}))}));
  results.push({width,route,...result});
  if([390,1440].includes(width)&&['flashcards','notes','calendar','research','settings','mindy','clients','documents','help','quizzes'].includes(route))await page.screenshot({timeout:10000,path:`artifacts/reference/${route}-${width}.png`,fullPage:true});
 }
}
await context.close();const auth=await browser.newContext({reducedMotion:'reduce'});const authPage=await auth.newPage();
for(const width of [320,390,768,1440]) {await authPage.setViewportSize({width,height:900});for(const route of ['login','register']){await authPage.goto(`http://127.0.0.1:5173/${route}`, { waitUntil: 'domcontentloaded' });await authPage.locator('.ref-auth-form h2').waitFor({state:'visible'});await authPage.waitForTimeout(700);results.push({width,route,...await authPage.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth}))});if(width===390||width===1440)await authPage.screenshot({path:`artifacts/reference/${route}-${width}.png`,fullPage:true});}}
fs.writeFileSync('artifacts/reference/layout-results.json',JSON.stringify({errors,results},null,2));console.log(JSON.stringify({errors,checks:results.length,failures:results.filter(r=>r.scroll>r.width+1)},null,2));if(results.some(r=>r.scroll>r.width+1)||errors.length)process.exitCode=1;await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
