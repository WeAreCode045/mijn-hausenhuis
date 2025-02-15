
import { Home, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem 
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { PropertyData } from '@/types/property';

const items = [{
  title: "Home",
  url: "/",
  icon: Home
}, {
  title: "Settings",
  url: "/settings",
  icon: Settings
}];

interface StoredPropertyData {
  title: string;
  address: string;
  images: string[];
  hasGarden: boolean;
  features: any[];
  gridImages: string[];
  [key: string]: any;
}

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [savedBrochures, setSavedBrochures] = useState<StoredPropertyData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("savedBrochures");
    if (saved) {
      setSavedBrochures(JSON.parse(saved));
    }
  }, []);

  const handleEditBrochure = (brochure: StoredPropertyData) => {
    navigate('/', {
      state: {
        editBrochure: {
          ...brochure,
          features: brochure.features || [],
          hasGarden: brochure.hasGarden || false,
          gridImages: brochure.gridImages || []
        }
      }
    });
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            {items.map(item => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton onClick={() => navigate(item.url)}>
                  <item.icon className="w-4 h-4 mr-2" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
