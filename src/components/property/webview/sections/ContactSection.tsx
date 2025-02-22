
import { ContactForm } from "../ContactForm";
import { WebViewSectionProps } from "../types";
import { MessageCircle, Mail, Phone, Building2 } from "lucide-react";

export function ContactSection({ property, settings }: WebViewSectionProps) {
  const handleWhatsAppClick = (whatsapp: string) => {
    const phone = whatsapp.replace(/\D/g, '');
    window.open(`https://wa.me/${phone}`, '_blank');
  };

  return (
    <div className="p-4 sm:p-6 min-w-[calc(800px+3rem)] space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Agency Contact Details */}
        <div className="w-full rounded-xl shadow-lg p-8" style={{ backgroundColor: settings?.primaryColor }}>
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="w-5 h-5 text-white" />
            <h3 className="text-xl font-semibold text-white">Contact Agency</h3>
          </div>
          <div className="space-y-4">
            {settings?.name && (
              <p className="font-medium text-base text-white">{settings.name}</p>
            )}
            {settings?.address && (
              <p className="text-sm text-white/90 leading-relaxed">{settings.address}</p>
            )}
            <div className="flex flex-col gap-3 mt-4">
              {settings?.phone && (
                <a 
                  href={`tel:${settings.phone}`}
                  className="flex items-center gap-3 text-sm text-white/90 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>{settings.phone}</span>
                </a>
              )}
              {settings?.email && (
                <a 
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-3 text-sm text-white/90 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>{settings.email}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Agent Details */}
        {settings?.agents && settings.agents.length > 0 && (
          <div className="w-full rounded-xl shadow-lg p-8" style={{ backgroundColor: settings?.primaryColor }}>
            <h4 className="text-xl font-semibold mb-6 text-white">Contact Agent</h4>
            <div className="space-y-4">
              {settings.agents.map((agent, index) => (
                <div key={index} className="space-y-4">
                  <p className="font-medium text-base text-white">{agent.name}</p>
                  {agent.phone && (
                    <a 
                      href={`tel:${agent.phone}`}
                      className="flex items-center gap-3 text-sm text-white/90 hover:text-white transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{agent.phone}</span>
                    </a>
                  )}
                  {agent.email && (
                    <a 
                      href={`mailto:${agent.email}`}
                      className="flex items-center gap-3 text-sm text-white/90 hover:text-white transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span>{agent.email}</span>
                    </a>
                  )}
                  {agent.whatsapp && (
                    <button 
                      onClick={() => handleWhatsAppClick(agent.whatsapp)}
                      className="flex items-center gap-2 text-sm text-white/90 hover:text-white transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Contact via WhatsApp
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contact Form */}
      <div className="w-full rounded-xl shadow-lg p-8 text-white" style={{ backgroundColor: settings?.secondaryColor }}>
        <h3 className="text-xl font-semibold mb-6">Interesse in deze woning?</h3>
        <ContactForm 
          propertyId={property.id}
          propertyTitle={property.title}
          agentId={property.agent_id}
        />
      </div>
    </div>
  );
}
