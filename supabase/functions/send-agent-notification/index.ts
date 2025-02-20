
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  inquiry_type: string;
  property_title: string;
  agent_email: string;
  agent_name: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const submission: ContactSubmission = await req.json();

    const emailResponse = await resend.emails.send({
      from: "Property Inquiry <onboarding@resend.dev>",
      to: [submission.agent_email],
      subject: `New inquiry for ${submission.property_title}`,
      html: `
        <h2>New Property Inquiry</h2>
        <p>Dear ${submission.agent_name},</p>
        <p>You have received a new inquiry for property: ${submission.property_title}</p>
        <h3>Contact Details:</h3>
        <ul>
          <li>Name: ${submission.name}</li>
          <li>Email: ${submission.email}</li>
          <li>Phone: ${submission.phone}</li>
          <li>Inquiry Type: ${submission.inquiry_type}</li>
        </ul>
        <h3>Message:</h3>
        <p>${submission.message}</p>
      `,
    });

    return new Response(JSON.stringify(emailResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
