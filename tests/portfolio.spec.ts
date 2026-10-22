import { test, expect, type Page } from '@playwright/test';
async function settle(page: Page) { await page.waitForTimeout(350); }
async function scroll(page: Page, y: number) {
  await page.evaluate(y => { const w = window as unknown as { __lenis?: { scrollTo(n:number,o:object):void } }; if (w.__lenis) w.__lenis.scrollTo(y,{immediate:true,force:true}); else window.scrollTo(0,y); },y); await settle(page);
}
async function range(page: Page, selector: string) {
 return page.locator(selector).evaluate(el => { const p=el.parentElement!; const r=p.getBoundingClientRect(); return {start:r.top+scrollY,end:r.top+scrollY+p.offsetHeight-(el as HTMLElement).offsetHeight}; });
}
test('desktop: reversible scenes, magnetic anchor, modal, routes and form', async ({page,request}) => {
 await page.setViewportSize({width:1440,height:900});
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await page.waitForTimeout(1500);
 await expect(page.getByRole('heading',{name:'DUSYANTH',exact:true})).toBeVisible();
 const char=page.locator('.tp-char-transition').first();const before=await char.evaluate(e=>getComputedStyle(e).fontVariationSettings);await char.hover();await settle(page);expect(await char.evaluate(e=>getComputedStyle(e).fontVariationSettings)).not.toBe(before);
 await page.locator('#hero-portrait-stage').hover();expect(await page.locator('#hero-natural-container').evaluate(e=>(e as HTMLElement).style.clipPath)).toContain('135px');
 await scroll(page,450);expect(await page.locator('#hero').evaluate(e=>Math.abs(e.getBoundingClientRect().top))).toBeLessThan(2);
 expect(await page.locator('#about').evaluate(e=>e.getBoundingClientRect().top)).toBeCloseTo(450,0);
 await scroll(page,900);expect(await page.locator('#about').evaluate(e=>Math.abs(e.getBoundingClientRect().top))).toBeLessThan(2);
 await scroll(page,0);expect(await page.locator('#hero').evaluate(e=>getComputedStyle(e).visibility)).toBe('visible');
 const rail=await range(page,'.projects-stage');await scroll(page,rail.start+10);
 const button=page.locator('.project-tile').first();await button.click();await expect(page.getByRole('dialog')).toBeVisible();await expect(page.getByRole('link',{name:'Explore Full Project'})).toHaveAttribute('href','/projects/crimelink');
 const saved=await page.evaluate(()=>scrollY);await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);expect(await page.evaluate(()=>scrollY)).toBe(saved);await expect(button).toBeFocused();
 await scroll(page,rail.end);const final=await page.locator('.project-more').boundingBox();expect(final!.x+final!.width).toBeLessThanOrEqual(1441);expect(final!.y+final!.height).toBeLessThanOrEqual(901);
 await scroll(page,rail.start);expect(await button.evaluate(e=>e.getBoundingClientRect().left)).toBeCloseTo(48,0);
 const skills=await range(page,'.skills-stage');await scroll(page,skills.start);
 const origin=await page.locator('[data-origin]').boundingBox();expect(origin!.y+origin!.height/2).toBeCloseTo(450,0);
 const nodes=page.locator('.skill-node');for(let i=0;i<8;i++)await expect(nodes.nth(i)).toBeHidden();
 const pathState=await page.locator('.skill-path').evaluateAll(els=>els.map(e=>({offset:parseFloat(getComputedStyle(e).strokeDashoffset),length:(e as SVGPathElement).getTotalLength()})));pathState.forEach(p=>expect(Math.abs(p.offset-p.length)).toBeLessThan(.1));
 // Each line takes 1 unit, node .16, final dwell .5: total 9.78.
 for(const i of [0,2,5,7]) { await scroll(page,skills.start+(skills.end-skills.start)*((i+1)*1.16/9.78));await expect(nodes.nth(i)).toBeVisible();if(i<7)await expect(nodes.nth(i+1)).toBeHidden(); }
 const nodeRect=await nodes.first().boundingBox();await page.mouse.move(nodeRect!.x+30,nodeRect!.y+10);await settle(page);const afterRect=await nodes.first().boundingBox();expect(afterRect!.x).toBeCloseTo(nodeRect!.x,1);
 await scroll(page,skills.end-5);await expect(page.getByText('Many more...', {exact:true})).toBeVisible();await page.screenshot({path:'test-results/review/skills-complete.png'});
 await scroll(page,skills.start);for(let i=0;i<8;i++)await expect(nodes.nth(i)).toBeHidden();await page.screenshot({path:'test-results/review/skills-initial.png'});
 const wheel=await range(page,'.achievement-stage');await scroll(page,wheel.start);const first=page.locator('.achievement-position').first();const center=await first.boundingBox();await scroll(page,wheel.start+(wheel.end-wheel.start)*.15);const shifted=await first.boundingBox();expect(shifted!.x).toBeLessThan(center!.x);expect(shifted!.y).toBeGreaterThan(center!.y);
 await scroll(page,wheel.end-4);await expect(page.getByRole('heading',{name:'EVENT ORGANIZING LEAD',exact:true})).toBeVisible();await scroll(page,wheel.start);expect((await first.boundingBox())!.x).toBeCloseTo(center!.x,0);
 await page.locator('header nav a[href="#contact"]').click();await page.waitForTimeout(1800);await expect(page.locator('[aria-current]')).toHaveText('Contact');
 await page.getByLabel('FULL NAME // CALLSIGN').fill('Browser Test');await page.getByLabel('EMAIL ADDRESS').fill('test@example.com');await page.getByLabel('PROJECT BRIEF / MESSAGE').fill('A test message from the portfolio browser suite.');
 await page.getByRole('button',{name:'Send Transmission',exact:true}).click();await expect(page.getByRole('status')).toContainText('Nothing has been sent yet');
 await page.route('**/api/contact',route=>route.fulfill({status:502,json:{error:'Test provider failure'}}));await page.getByRole('button',{name:'Send Transmission',exact:true}).click();await expect(page.getByRole('status')).toContainText('Test provider failure');
 await page.route('**/api/contact',async route=>{await new Promise(r=>setTimeout(r,300));await route.fulfill({json:{accepted:true}});});await page.getByRole('button',{name:'Send Transmission',exact:true}).click();await expect(page.getByRole('button',{name:'Sending Transmission...'})).toBeDisabled();await expect(page.getByRole('heading',{name:'Message accepted'})).toBeVisible();
 expect((await request.post('/api/contact',{data:{}})).status()).toBe(400);
 await page.goto('/projects');await expect(page.locator('.catalog-item')).toHaveCount(10);
 const hrefs=await page.locator('.catalog-item').evaluateAll(a=>a.map(e=>e.getAttribute('href')!));for(const href of hrefs){const response=await request.get(href);expect(response.status()).toBe(200);}
 expect((await request.get('/projects/not-real')).status()).toBe(404);
 expect(errors).toEqual([]);
});
for(const [width,height] of [[1920,1080],[1366,650],[768,1024],[390,844],[320,640],[844,390]]) {
 test(`responsive ${width}x${height}: all sections and end states`,async({page})=>{
  await page.setViewportSize({width,height});await page.goto('/');await page.waitForTimeout(1400);await page.screenshot({path:`test-results/review/hero-${width}.png`});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  await expect(page.locator('#hero img')).toHaveCount(2);
  for(const id of ['about','projects','skills','achievements','contact']) {await page.locator(`header nav a[href="#${id}"]`).click();await page.waitForTimeout(1400);await expect(page.locator('[aria-current]')).toHaveText(id==='skills'?'Skills':id.charAt(0).toUpperCase()+id.slice(1));await page.screenshot({path:`test-results/review/${id}-${width}.png`});}
  const skills=await range(page,'.skills-stage');await scroll(page,skills.end-2);await expect(page.getByText('Many more...', {exact:true})).toBeVisible();await page.screenshot({path:`test-results/review/skills-end-${width}.png`});
  const labels=await page.locator('.skill-label').evaluateAll(els=>els.map(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom};}));
  for(const a of labels){expect(a.x).toBeGreaterThanOrEqual(0);expect(a.right).toBeLessThanOrEqual(width);for(const b of labels){if(a===b)continue;expect(a.right<=b.x||b.right<=a.x||a.bottom<=b.y||b.bottom<=a.y).toBeTruthy();}}
 });
}
test('reduced motion, hash refresh and keyboard access',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:390,height:844});await page.goto('/#skills');await page.waitForTimeout(900);await expect(page.getByText('Many more...', {exact:true})).toBeVisible();expect(await page.locator('.pin-spacer').count()).toBe(0);await page.screenshot({path:'test-results/review/reduced-motion.png'});await page.goto('/');await page.keyboard.press('Tab');expect(await page.evaluate(()=>document.activeElement?.tagName)).toBe('A');
});
test('resize, reload, touch preview, keyboard containment and footer',async({page,browser,request})=>{
 test.setTimeout(120000);
 await page.goto('/#skills');await page.waitForTimeout(1400);
 for(const [width,height] of [[1366,650],[390,844],[844,390],[1440,900]]) {
  await page.setViewportSize({width,height});await page.waitForTimeout(500);
  await page.locator('header nav a[href="#skills"]').click();await page.waitForTimeout(1500);
  const dot=await page.locator('[data-origin]').boundingBox();expect(Math.abs(dot!.y+dot!.height/2-height/2)).toBeLessThan(2);
 }
 await page.reload();await page.waitForTimeout(1500);await expect(page.locator('[aria-current]')).toHaveText('Skills');
 await page.locator('header nav a[href="#projects"]').click();await page.waitForTimeout(1500);await page.locator('.project-tile').first().click();
 await page.screenshot({path:'test-results/review/preview.png',animations:'disabled'});
 for(let i=0;i<9;i++){await page.keyboard.press('Tab');expect(await page.evaluate(()=>!!document.activeElement?.closest('[role="dialog"]'))).toBe(true);}
 await page.keyboard.press('Escape');await page.locator('header nav a[href="#contact"]').click();await page.waitForTimeout(1500);
 await page.getByRole('button',{name:'Return to top'}).click();await expect.poll(()=>page.evaluate(()=>scrollY),{timeout:5000}).toBeLessThan(2);
 await page.goto('/projects/crimelink');await page.screenshot({path:'test-results/review/case-study.png',fullPage:true});
 expect((await request.post('/api/contact',{headers:{origin:'null'},data:{}})).status()).toBe(403);
 expect((await request.post('/api/contact',{headers:{origin:'https://untrusted.example'},data:{}})).status()).toBe(403);
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const touch=await context.newPage();await touch.goto('/');await touch.waitForTimeout(1500);await touch.locator('header nav a[href="#projects"]').tap();await touch.waitForTimeout(1500);await touch.locator('.project-tile').first().tap();await expect(touch.getByRole('dialog')).toBeVisible();await touch.getByRole('button',{name:'Close',exact:true}).tap();await expect(touch.getByRole('dialog')).toHaveCount(0);await context.close();
});

test('toolkit surfaces: real Motion tilt, spotlight, keyboard and reduced-motion ownership', async ({page}) => {
  await page.setViewportSize({width:1440,height:900});
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');await page.waitForTimeout(1600);
  const rail=await range(page,'.projects-stage');await scroll(page,rail.start+2);
  const tile=page.locator('.project-tile').first();
  const art=tile.locator('[data-tilt-surface]');const light=tile.locator('.card-spotlight');
  const box=await art.boundingBox();
  await page.mouse.move(box!.x+box!.width*.85, box!.y+box!.height*.3);await settle(page);
  expect(await art.evaluate(el=>getComputedStyle(el).transform)).not.toBe('none');
  expect(await light.evaluate(el=>(el as HTMLElement).style.getPropertyValue('--spotlight-active'))).toBe('1');
  const before=await page.evaluate(()=>scrollY);
  await tile.click();await expect(page.getByRole('dialog')).toBeVisible();
  await page.mouse.wheel(0,700);await settle(page);expect(await page.evaluate(()=>scrollY)).toBe(before);
  await page.keyboard.press('Escape');await expect(tile).toBeFocused();
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(700);
  const staticBox=await art.boundingBox();await page.mouse.move(staticBox!.x+20,staticBox!.y+20);await settle(page);
  expect(await art.evaluate(el=>getComputedStyle(el).transform)).toBe('none');
  await expect(tile.locator('.spotlight-light')).toBeHidden();
  expect(await page.locator('.pin-spacer').count()).toBeLessThanOrEqual(1); // Hero uses initial preference; scroll rails respond live.
  expect(errors).toEqual([]);
});
