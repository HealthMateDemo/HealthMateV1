export const TEMPLATE_AI_RESPONSES = {
  health: "Thanks for choosing Physical Health! How can I help you with your wellness journey today?",
  mindfull: "Thanks for choosing Mental Wellness! How can I help you with your mental health and mindfulness today?",
} as const;

export type TemplateType = keyof typeof TEMPLATE_AI_RESPONSES;
