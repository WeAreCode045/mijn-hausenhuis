
import { useBlockNote } from "@blocknote/react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useLocationEditor(id: string | undefined, location_description?: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void) {
  const { toast } = useToast();

  const handleEditorChange = async (content: string) => {
    if (!id) return;

    try {
      const { error } = await supabase
        .from('properties')
        .update({ location_description: content })
        .eq('id', id);

      if (error) throw error;

      const event = {
        target: {
          name: 'location_description',
          value: content
        }
      } as React.ChangeEvent<HTMLTextAreaElement>;
      
      onChange(event);
    } catch (error) {
      console.error('Error saving location description:', error);
      toast({
        variant: "destructive",
        description: "Kon locatiebeschrijving niet opslaan",
      });
    }
  };

  const editor = useBlockNote({
    initialContent: location_description ? [
      {
        type: "paragraph",
        content: location_description
      }
    ] : undefined,
    onChange: (editor) => {
      const content = editor.topLevelBlocks.map(block => block.content).join('\n');
      handleEditorChange(content);
    },
    domAttributes: {
      editor: {
        class: "min-h-[200px] px-3 py-2 focus:outline-none"
      }
    },
    defaultStyles: false
  });

  return editor;
}
