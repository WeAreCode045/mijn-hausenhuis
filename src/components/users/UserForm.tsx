
import { useState } from "react";
import { User, UserFormData } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface UserFormProps {
  isEditMode: boolean;
  initialData?: User;
  onSuccess: () => void;
}

export function UserForm({ isEditMode, initialData, onSuccess }: UserFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<UserFormData>({
    email: initialData?.email || "",
    password: "",
    fullName: initialData?.full_name || "",
    phone: initialData?.phone || "",
    whatsappNumber: initialData?.whatsapp_number || "",
    role: (initialData?.role as "admin" | "agent") || "agent"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditMode && initialData?.id) {
        const { error } = await supabase
          .from("profiles")
          .update({
            full_name: formData.fullName,
            phone: formData.phone,
            whatsapp_number: formData.whatsappNumber,
            role: formData.role,
            updated_at: new Date().toISOString()
          })
          .eq("id", initialData.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "User updated successfully",
        });
      } else {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
            },
          },
        });

        if (authError) throw authError;

        if (authData.user) {
          const { error: profileError } = await supabase
            .from("profiles")
            .update({
              full_name: formData.fullName,
              role: formData.role,
              phone: formData.phone,
              whatsapp_number: formData.whatsappNumber,
              updated_at: new Date().toISOString()
            })
            .eq("id", authData.user.id);

          if (profileError) throw profileError;
        }

        toast({
          title: "Success",
          description: "User created successfully",
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          disabled={isEditMode}
          required
        />
      </div>
      {!isEditMode && (
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            required
          />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={formData.fullName}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, fullName: e.target.value }))
          }
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, phone: e.target.value }))
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
        <Input
          id="whatsappNumber"
          type="tel"
          value={formData.whatsappNumber}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, whatsappNumber: e.target.value }))
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select
          value={formData.role}
          onValueChange={(value: "admin" | "agent") =>
            setFormData((prev) => ({ ...prev, role: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="agent">Agent</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">
        {isEditMode ? "Update User" : "Create User"}
      </Button>
    </form>
  );
}
