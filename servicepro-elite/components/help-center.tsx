import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqItems = [
  {
    question: "How do I create a new ticket?",
    answer: "To create a new ticket, click on the 'New Request' button in the top right corner of the dashboard. Fill out the form with the necessary details and submit it."
  },
  {
    question: "How can I change my password?",
    answer: "To change your password, go to the Settings page and look for the 'Change Password' section. Enter your current password and your new password, then click 'Save Changes'."
  },
  {
    question: "What do the different ticket priorities mean?",
    answer: "Ticket priorities indicate the urgency of the issue. Low priority is for minor issues, Medium for standard requests, High for urgent matters, and Critical for severe problems affecting multiple users or critical systems."
  },
  {
    question: "How do I assign a ticket to another team member?",
    answer: "Open the ticket you want to assign, look for the 'Assigned To' field, and select the team member you want to assign the ticket to from the dropdown menu. Don't forget to save your changes."
  },
  {
    question: "Can I export ticket data for reporting?",
    answer: "Yes, you can export ticket data. Go to the Analytics page and look for the 'Export Data' button. You can choose the date range and specific data you want to export."
  }
]

export function HelpCenter() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Help Center</CardTitle>
        <CardDescription>Find answers to common questions and learn how to use the system</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}

