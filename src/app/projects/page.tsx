import Link from 'next/link';
import { projects } from '@/lib/projects';
export const metadata = { title: 'Project archive — Dusyanth' };
export default function Catalog() {
  return <main className="case-page"><Link className="text-[#99CFDE]" href="/#projects">← Back to portfolio</Link><header className="py-16"><p className="eyebrow">TEN PROJECTS / ONE CONTINUING PRACTICE</p><h1 className="font-editorial text-6xl sm:text-8xl">The archive.</h1><p className="mt-6 text-white/60 max-w-xl">Experiments in software, intelligence and interaction. Source-backed details where available; clear boundaries where they are not.</p></header><div className="catalog-grid">{projects.map((project,i) => <Link key={project.slug} href={`/projects/${project.slug}`} className="catalog-item"><span className="eyebrow">{String(i+1).padStart(2,'0')} / {project.category}</span><h2 className="text-3xl my-4">{project.name} ↗</h2><p className="text-white/65 text-sm leading-relaxed">{project.summary}</p><p className="mt-6 text-xs text-[#99CFDE]">{project.repo ? 'Read project notes' : 'Source awaiting confirmation'}</p></Link>)}</div></main>;
}
