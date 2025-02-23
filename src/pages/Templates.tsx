
import { TemplateBuilder } from "@/components/brochure/TemplateBuilder";

export default function Templates() {
  return (
    <div className="min-h-screen bg-estate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-estate-800 mb-12">Brochure Templates</h1>
        <TemplateBuilder />
      </div>
    </div>
  );
}
