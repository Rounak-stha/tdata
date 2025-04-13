import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does Tdata differ from other project management tools?",
    answer:
      "Unlike most tools that force you into rigid workflows, Tdata adapts to your team's unique processes with customizable boards, statuses, and views. It combines the flexibility you need with powerful collaboration features that keep everyone in sync.",
  },
  {
    question: "Can I import data from other project management tools?",
    answer: "We're working on importing features for popular tools like Trello, Asana, and Jira. For now, you can manually create projects and tasks in Tdata.",
  },
  {
    question: "Is there a limit to how many team members I can add?",
    answer: "Our Free plan supports up to 5 team members.",
  },
  {
    question: "Does Tdata offer integrations with other tools?",
    answer: "Absolutely. We're working on integrations with tools like Slack, GitHub, and more. Stay tuned for updates!",
  },
  {
    question: "How secure is my data with Tdata?",
    answer:
      "We take security seriously. Tdata uses industry-standard encryption, regular security audits, and offers SSO integration for enterprise customers. Your data is backed up daily and we're GDPR compliant.",
  },
  {
    question: "Can I try Tdata before purchasing?",
    answer: "TData is free as of now with limited features. You can sign up for a free account to explore the platform and its features.",
  },
];

const FaqSection = () => {
  return (
    <section id="faq" className="landing-section bg-tdata-dark-card/50">
      <div className="landing-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently asked questions</h2>
          <p className="text-tdata-muted-text max-w-2xl mx-auto">Everything you need to know about Tdata.</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-tdata-dark-border">
                <AccordionTrigger className="text-left text-lg font-medium">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-tdata-muted-text">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
