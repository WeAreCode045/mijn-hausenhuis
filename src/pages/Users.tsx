
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  whatsapp_number: string | null;
  role: "admin" | "agent" | null;
}

const Users = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    whatsappNumber: "",
    role: "agent" as "admin" | "agent"
  });

  const { data: users, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as User[];
    },
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: {
            full_name: newUser.fullName,
          },
        },
      });

      if (authError) throw authError;

      // Update profile with role, phone and whatsapp number
      if (authData.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            role: newUser.role,
            phone: newUser.phone,
            whatsapp_number: newUser.whatsappNumber
          })
          .eq("id", authData.user.id);

        if (profileError) throw profileError;
      }

      toast({
        title: "Success",
        description: "User created successfully",
      });

      setIsDialogOpen(false);
      refetch();
      setNewUser({
        email: "",
        password: "",
        fullName: "",
        phone: "",
        whatsappNumber: "",
        role: "agent"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: newUser.fullName,
          phone: newUser.phone,
          whatsapp_number: newUser.whatsappNumber,
          role: newUser.role
        })
        .eq("id", selectedUser.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User updated successfully",
      });

      setIsDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;

      toast({
        title: "Success",
        description: "User deleted successfully",
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setNewUser({
      email: user.email,
      password: "", // We don't show/edit password for existing users
      fullName: user.full_name || "",
      phone: user.phone || "",
      whatsappNumber: user.whatsapp_number || "",
      role: user.role as "admin" | "agent" || "agent"
    });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleAddNewClick = () => {
    setSelectedUser(null);
    setNewUser({
      email: "",
      password: "",
      fullName: "",
      phone: "",
      whatsappNumber: "",
      role: "agent"
    });
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button onClick={handleAddNewClick}>Add New User</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit User" : "Add New User"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={isEditMode ? handleUpdateUser : handleCreateUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, email: e.target.value }))
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
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, password: e.target.value }))
                  }
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={newUser.fullName}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, fullName: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={newUser.phone}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
              <Input
                id="whatsappNumber"
                type="tel"
                value={newUser.whatsappNumber}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, whatsappNumber: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={newUser.role}
                onValueChange={(value: "admin" | "agent") =>
                  setNewUser((prev) => ({ ...prev, role: value }))
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
        </DialogContent>
      </Dialog>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.whatsapp_number}</TableCell>
                <TableCell className="capitalize">{user.role}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Users;
