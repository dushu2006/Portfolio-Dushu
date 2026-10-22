import { chromium as playwright } from '@playwright/test';
import chromium from '@sparticuz/chromium';
import { writeFileSync } from 'node:fs';
const browser = await playwright.launch({ executablePath: await chromium.executablePath(), args: chromium.args.filter(a=>a!=='--single-process') });
const page = await browser.newPage({viewport:{width:390,height:844}});
await page.addInitScript(()=>{
 window.__metrics={cls:0,longTasks:0,longTaskMs:0,lcp:0};
 new PerformanceObserver(list=>list.getEntries().forEach(e=>{if(!e.hadRecentInput)window.__metrics.cls+=e.value;})).observe({type:'layout-shift',buffered:true});
 new PerformanceObserver(list=>list.getEntries().forEach(e=>{window.__metrics.longTasks++;window.__metrics.longTaskMs+=e.duration;})).observe({type:'longtask',buffered:true});
 new PerformanceObserver(list=>list.getEntries().forEach(e=>{window.__metrics.lcp=e.startTime;})).observe({type:'largest-contentful-paint',buffered:true});
});
await page.goto('http://localhost:3000');await page.waitForTimeout(2000);
const result=await page.evaluate(()=>({metrics:window.__metrics,images:[...document.querySelectorAll('#hero img')].map(img=>({src:img.currentSrc,rendered:img.getBoundingClientRect().width,sizes:img.sizes})),transfer:performance.getEntriesByType('resource').reduce((n,e)=>n+e.transferSize,0),requests:performance.getEntriesByType('resource').length}));
console.log(JSON.stringify(result,null,2));if(process.argv[2])writeFileSync(process.argv[2],JSON.stringify(result,null,2));await browser.close();
