let pw;try{pw=require('playwright')}catch{pw=require(process.env.PLAYWRIGHT_MODULE||require('path').join(process.env.TEMP,'psykie-ui-check/node_modules/playwright'))}
const fs=require('fs');
(async()=>{
 const browser=await pw.chromium.launch({channel:'msedge'}),results=[];
 for(const viewport of [{width:1440,height:600},{width:1024,height:550},{width:390,height:700}]){
  const context=await browser.newContext({viewport}),page=await context.newPage();
  await page.addInitScript(()=>localStorage.setItem('auth-storage',JSON.stringify({state:{isAuthenticated:true,user:{id:'scroll-test',name:'Alex Morgan',email:'student@psykie.com',role:'student'}},version:0})));
  await page.goto('http://127.0.0.1:5173/help',{waitUntil:'domcontentloaded'});await page.locator('.ref-page-header h1').waitFor();await page.waitForTimeout(600);
  const before=await page.evaluate(()=>({frame:document.querySelector('.psykie-frame').getBoundingClientRect().top,workspace:document.querySelector('.ref-workspace').getBoundingClientRect().top}));
  const down=async()=>{await page.evaluate(()=>window.scrollTo({top:document.documentElement.scrollHeight,left:0,behavior:'instant'}));await page.waitForTimeout(150);if(await page.evaluate(()=>scrollY)<10)throw Error('Test page did not scroll')};
  await down();
  const after=await page.evaluate(()=>({scroll:scrollY,frame:document.querySelector('.psykie-frame').getBoundingClientRect().top,workspace:document.querySelector('.ref-workspace').getBoundingClientRect().top,sidebarBorder:getComputedStyle(document.querySelector('.ref-sidebar')).borderRightWidth,divider:getComputedStyle(document.querySelector('.ref-workspace')).borderLeftWidth,restoration:history.scrollRestoration}));
  if(Math.abs((before.workspace-before.frame)-(after.workspace-after.frame))>1)throw Error('Divider detached from frame');
  if(viewport.width>800&&(after.sidebarBorder!=='0px'||after.divider!=='1px'))throw Error('Divider still belongs to sticky sidebar');
  if(after.restoration!=='manual')throw Error('Native history restoration enabled');
  fs.mkdirSync('artifacts/scroll',{recursive:true});await page.screenshot({path:`artifacts/scroll/divider-${viewport.width}.png`});
  if(viewport.width>800)await page.locator('.ref-sidebar').getByRole('button',{name:'Notes',exact:true}).click();else await page.locator('.ref-mobile-dock').getByRole('button',{name:'Notes',exact:true}).click();
  await page.waitForURL('**/notes');await page.locator('.ref-notes-page').waitFor();await page.waitForTimeout(650);
  if(await page.evaluate(()=>scrollY)!==0)throw Error('Notes did not start at top');
  await down();
  if(viewport.width>800)await page.locator('.ref-sidebar').getByRole('button',{name:'Help',exact:true}).click();else{await page.getByRole('button',{name:'Open navigation menu',exact:true}).click();await page.locator('.ref-mobile-sidebar').getByRole('button',{name:'Help',exact:true}).click()}
  await page.waitForURL('**/help');await page.locator('.ref-help-page').waitFor();await page.waitForTimeout(650);
  if(await page.evaluate(()=>scrollY)!==0)throw Error('Help did not start at top');
  await down();await page.goBack();await page.waitForURL('**/notes');await page.locator('.ref-notes-page').waitFor();await page.waitForTimeout(650);if(await page.evaluate(()=>scrollY)!==0)throw Error('Back navigation restored bottom');
  if(viewport.width>800){await down();await page.locator('.ref-sidebar').getByRole('button',{name:'Notes',exact:true}).click();await page.waitForTimeout(500);if(await page.evaluate(()=>scrollY)!==0)throw Error('Current page reselection did not reset')}
  results.push({viewport,divider:true,forward:true,back:true,reselect:viewport.width>800});console.log('Passed '+viewport.width+'px divider, navigation and history');await context.close();
 }
 fs.writeFileSync('artifacts/scroll/results.json',JSON.stringify(results,null,2));await browser.close();
})().catch(error=>{console.error(error);process.exit(1)})
