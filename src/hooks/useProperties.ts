
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useProperties = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchProperties = async () => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het ophalen van de brochures",
        variant: "destructive",
      });
      return;
    }

    setProperties(data || []);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het verwijderen van de brochure",
        variant: "destructive",
      });
      return;
    }

    await fetchProperties();
    toast({
      title: "Brochure verwijderd",
      description: "De brochure is succesvol verwijderd",
    });
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return {
    properties,
    handleDelete,
  };
};
