import type { Project } from '@/lib/projects';

// Conceptual architecture, never screenshots, measured telemetry or product UI.
function Diagram({ slug }: { slug: string }) {
  if (slug === 'arise') return <>
    <circle cx="250" cy="120" r="75" stroke="currentColor" strokeOpacity=".25" strokeDasharray="3 8"/>
    <path d="M70 120 H205 M295 120 H430 M250 45 V84 M250 156 V195" stroke="currentColor"/>
    <rect x="205" y="84" width="90" height="72" rx="12" fill="#151b26" stroke="currentColor"/>
    <path d="M231 120 L245 134 L269 106" stroke="currentColor" strokeWidth="2"/>
    {[70,430].map(x=><circle key={x} cx={x} cy="120" r="12" fill="#151b26" stroke="currentColor"/>)}
  </>;
  if (slug === 'smartplant') return <>
    {[65,195,325].map((x,i)=><g key={x}><rect x={x} y={65+i*15} width="100" height="90" rx="4" fill="#151b26" stroke="currentColor"/><path d={`M${x+18} ${92+i*15} h38 M${x+18} ${109+i*15} h64 M${x+18} ${126+i*15} h48`} stroke="currentColor" strokeOpacity=".35"/>{i<2&&<path d={`M${x+100} ${110+i*15} H${x+130}`} stroke="currentColor"/>}</g>)}
  </>;
  if (slug === 'dropzone') return <>
    <ellipse cx="250" cy="120" rx="180" ry="85" stroke="currentColor" strokeOpacity=".2"/>
    <ellipse cx="250" cy="120" rx="115" ry="60" stroke="currentColor" strokeOpacity=".5"/>
    <path d="M250 150 C225 120 220 110 220 95 A30 30 0 0 1 280 95 C280 110 275 120 250 150Z" fill="#151b26" stroke="currentColor"/>
    <circle cx="250" cy="95" r="9" stroke="currentColor"/>
    {[[110,145],[365,95],[315,175]].map(([x,y])=><circle key={x} cx={x} cy={y} r="7" fill="#151b26" stroke="currentColor"/>)}
  </>;
  if (slug === 'api-doctor') return <>
    <path d="M100 70 L65 120 L100 170 M400 70 L435 120 L400 170" stroke="currentColor" strokeWidth="2"/>
    <path d="M140 90 H230 M140 120 H205 M140 150 H245 M295 118 L310 133 L345 98" stroke="currentColor" strokeWidth="2"/>
    <rect x="275" y="77" width="90" height="90" rx="16" stroke="currentColor" strokeOpacity=".35"/>
  </>;
  return <>
    <path d="M55 180 C120 180 110 55 200 65 S340 210 440 65" stroke="currentColor"/>
    <path d="M55 180 L200 65 L440 65 L350 185 Z" stroke="currentColor" strokeOpacity=".2"/>
    {[[55,180],[200,65],[350,185],[440,65]].map(([x,y],i)=><g key={x}><circle cx={x} cy={y} r={i===1?23:12} fill="#151b26" stroke="currentColor"/><circle cx={x} cy={y} r="3" fill="currentColor"/></g>)}
  </>;
}
export default function ProjectVisual({ project }: { project: Project }) {
  return <div className={`project-visual visual-${project.slug}`} aria-hidden="true">
    <svg viewBox="0 0 500 240" fill="none"><Diagram slug={project.slug}/></svg>
    <div className="visual-flow">{project.flow.map((step,i) => <span key={step}><small>0{i+1}</small>{step}</span>)}</div>
  </div>;
}
