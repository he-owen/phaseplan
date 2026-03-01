import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FadeInOnScroll from '../FadeInOnScroll';

const faqs = [
  {
    question: 'How does PhasePlan track my energy usage?',
    answer:
      'PhasePlan uses your device configurations—including type, wattage, and run duration—to estimate energy consumption. When you connect your utility provider, we can correlate usage with your actual bills for more accurate insights.',
  },
  {
    question: 'What devices can I monitor?',
    answer:
      'You can add any energy-consuming device: HVAC systems, lighting, appliances, electronics, and more. Each device is categorized for better reporting, and you can specify hourly energy use and typical run times.',
  },
  {
    question: 'How do I connect my utility provider?',
    answer:
      'During onboarding, you select your utility provider and enter your account details. PhasePlan fetches your rate schedules and billing history so you can see real costs and compare them with your projected usage.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Yes. We use industry-standard authentication and encryption. Your utility and device data is stored securely and only accessible to you.',
  },
];

export default function FAQSection() {
  return (
    <Box
      id="faq"
      component="section"
      sx={{
        py: { xs: 10, md: 14 },
        px: 2,
      }}
    >
      <FadeInOnScroll>
        <Typography
          variant="overline"
          sx={{
            display: 'block',
            textAlign: 'center',
            letterSpacing: 2,
            color: 'primary.main',
            fontWeight: 600,
            mb: 1,
          }}
        >
          Support
        </Typography>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1.875rem', md: '2.5rem' },
            fontWeight: 700,
            textAlign: 'center',
            letterSpacing: '-0.02em',
            mb: 6,
            color: 'text.primary',
          }}
        >
          Frequently asked questions
        </Typography>
      </FadeInOnScroll>

      <Box
        sx={{
          maxWidth: 720,
          mx: 'auto',
          '& .MuiAccordion-root': {
            borderRadius: '12px !important',
            '&:before': { display: 'none' },
            mb: 1.5,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'rgba(255,255,255,0.06)',
            backgroundColor: 'rgba(255,255,255,0.02)',
            boxShadow: 'none',
            transition: 'all 0.25s cubic-bezier(.4,0,.2,1)',
            '&:hover': {
              borderColor: 'hsla(210,98%,48%,0.25)',
            },
            '&.Mui-expanded': {
              borderColor: 'hsla(210,98%,48%,0.35)',
              boxShadow: '0 0 20px hsla(210,98%,48%,0.06)',
              /* Blue left accent on expanded */
              borderLeft: '2px solid',
              borderLeftColor: 'primary.main',
            },
          },
          '& .MuiAccordionSummary-root': {
            px: 3,
            py: 2,
          },
          '& .MuiAccordionDetails-root': {
            px: 3,
            pb: 3,
            pt: 0,
          },
        }}
      >
        {faqs.map((faq, index) => (
          <FadeInOnScroll key={index} delay={index * 100}>
            <Accordion defaultExpanded={index === 0}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight={600} sx={{ pr: 2, color: 'text.primary' }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </FadeInOnScroll>
        ))}
      </Box>
    </Box>
  );
}
