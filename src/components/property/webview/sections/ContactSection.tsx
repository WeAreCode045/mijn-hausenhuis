
import { ContactForm } from "../ContactForm";
import { WebViewSectionProps } from "../types";
import { MessageCircle, Mail, Phone, Building2, WhatsApp } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Agent {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  whatsapp_number: string | null;
  agent_photo: string | null;
}

export function ContactSection({ property, settings }: WebViewSectionProps) {
  const [agent, setAgent] = useState<Agent | null>(null);

  useEffect(() => {
    const fetchAgent = async () => {
      if (property.agent_id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, email, phone, whatsapp_number, agent_photo')
          .eq('id', property.agent_id)
          .single();
        
        if (!error && data) {
          setAgent({
            id: data.id,
            full_name: data.full_name || '',
            email: data.email || '',
            phone: data.phone || '',
            whatsapp_number: data.whatsapp_number,
            agent_photo: data.agent_photo
          });
        }
      }
    };

    fetchAgent();
  }, [property.agent_id]);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        {agent && (
          <div className="w-full rounded-xl shadow-lg p-8" style={{ backgroundColor: settings?.primaryColor }}>
            <h4 className="text-xl font-semibold mb-6 text-white">Contact Agent</h4>
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="w-16 h-16 border-2 border-white">
                {agent.agent_photo ? (
                  <AvatarImage src={agent.agent_photo} alt={agent.full_name} />
                ) : (
                  <AvatarFallback className="bg-white/10 text-white">
                    {agent.full_name?.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
              <p className="font-medium text-base text-white">{agent.full_name}</p>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col items-start gap-3">
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
                {agent.whatsapp_number && (
                  <a 
                    href={`https://wa.me/${agent.whatsapp_number.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-white/90 hover:text-white transition-colors"
                  >
                    <WhatsApp className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
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
