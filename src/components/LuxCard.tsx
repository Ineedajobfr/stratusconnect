import { ChevronRight } from "lucide-react";

export default function LuxCard({
  image, title, subtitle, href, demoHref,
}: { image: string; title: string; subtitle: string; href: string; demoHref?: string }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-line bg-glass shadow-insetSoft transition-transform duration-200 ease-out hover:-translate-y-0.5">
      <div className="aspect-[16/9] overflow-hidden">
        <img src={image} alt={title} className="h-full w-full object-cover opacity-90 transition-opacity duration-200 group-hover:opacity-100" />
      </div>
      <div className="p-6">
        <div className="mb-3 h-px w-8 bg-orange-500/20" />
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        <p className="mt-1 text-sm text-textDim">{subtitle}</p>
        <div className="mt-5 flex items-center gap-4">
          <a href={href} className="inline-flex items-center gap-2 rounded-lg border border-blue-700 bg-blue-900/30 px-4 py-2 text-sm transition-colors duration-200 hover:bg-blue-800/40">
            Access Terminal <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
          {demoHref && (
            <a href={demoHref} className="text-sm text-textDim underline-offset-4 hover:text-white hover:underline">Demo</a>
          )}
        </div>
      </div>
    </div>
  );
}
