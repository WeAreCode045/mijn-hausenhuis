
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface ContactFormProps {
  agencyName?: string;
  agencyAddress?: string;
  agencyPhone?: string;
  agencyEmail?: string;
  secondaryColor?: string;
}

export function ContactForm({ 
  agencyName, 
  agencyAddress, 
  agencyPhone, 
  agencyEmail,
  secondaryColor 
}: ContactFormProps) {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Bericht verzonden",
      description: "We nemen zo spoedig mogelijk contact met u op.",
    });
  };

  return (
    <div 
      className="grid grid-cols-2 gap-8 p-6"
      style={{ backgroundColor: secondaryColor }}
    >
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-white">Contact Information</h3>
        <div className="space-y-4">
          <div className="bg-white/90 p-4 rounded-lg shadow-sm">
            <p className="font-semibold text-estate-800">{agencyName}</p>
            <p className="text-estate-600">{agencyAddress}</p>
          </div>
          <div className="bg-white/90 p-4 rounded-lg shadow-sm">
            <p className="font-semibold text-estate-800">Contact Details</p>
            <p className="text-estate-600">{agencyPhone}</p>
            <p className="text-estate-600">{agencyEmail}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white/90 p-6 rounded-lg">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" />
        </div>
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" name="message" required />
        </div>
        <Button type="submit">Send Message</Button>
      </form>
    </div>
  );
}
