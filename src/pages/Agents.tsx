
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

interface Agent {
  id: string;
  full_name: string;
  email: string;
  role: 'agent';
}

export default function Agents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [newAgent, setNewAgent] = useState({ full_name: '', email: '' });
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchAgents();
  }, [isAdmin, navigate]);

  const fetchAgents = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'agent');

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch agents",
        variant: "destructive",
      });
      return;
    }

    setAgents(data || []);
  };

  const handleAddAgent = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from('profiles')
      .insert([
        {
          full_name: newAgent.full_name,
          email: newAgent.email,
          role: 'agent'
        }
      ])
      .select();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create agent",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Agent created successfully",
    });

    setNewAgent({ full_name: '', email: '' });
    fetchAgents();
  };

  const handleDeleteAgent = async (id: string) => {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete agent",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Agent deleted successfully",
    });

    fetchAgents();
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Agent</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddAgent} className="space-y-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={newAgent.full_name}
                onChange={(e) => setNewAgent({ ...newAgent, full_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newAgent.email}
                onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                required
              />
            </div>
            <Button type="submit">Add Agent</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Agents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agents.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{agent.full_name}</p>
                  <p className="text-sm text-gray-500">{agent.email}</p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteAgent(agent.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
            {agents.length === 0 && (
              <p className="text-center text-gray-500">No agents found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
