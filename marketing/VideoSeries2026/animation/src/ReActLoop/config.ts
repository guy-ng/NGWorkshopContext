// ReAct Loop Animation — Configuration
// 30 seconds @ 30 fps = 900 frames

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// ─── Timing (seconds) ────────────────────────────────────────────────
export const TIMING = {
  // Scene 1: Core LLM appears
  llmStart: 0,
  llmEnd: 3,
  // Scene 2: User query arrives
  queryStart: 3,
  queryEnd: 6,
  // Scene 3: THINK — reasoning
  thinkStart: 6,
  thinkEnd: 10,
  // Scene 4: ACT — tool selection
  actStart: 10,
  actEnd: 14,
  // Scene 5: Tool execution
  execStart: 14,
  execEnd: 18,
  // Scene 6: OBSERVE — receive result
  observeStart: 18,
  observeEnd: 22,
  // Scene 7: Final response
  responseStart: 22,
  responseEnd: 26,
  // Scene 8: Loop diagram summary
  summaryStart: 26,
  summaryEnd: 30,
} as const;

export const TOTAL_DURATION = TIMING.summaryEnd;
export const TOTAL_FRAMES = TOTAL_DURATION * FPS;

// ─── Layout ──────────────────────────────────────────────────────────
export const CENTER_X = WIDTH / 2;
export const CENTER_Y = HEIGHT / 2;

// LLM brain position
export const LLM_X = CENTER_X;
export const LLM_Y = CENTER_Y;
export const LLM_RADIUS = 80;

// Tool icons orbit radius
export const TOOL_ORBIT_RADIUS = 220;

// Tools definition
export const TOOLS = [
  { icon: "🌐", label: "דפדפן", labelEn: "Web Browser", angle: 0 },
  { icon: "📁", label: "קבצים", labelEn: "File System", angle: Math.PI / 2 },
  { icon: "🧮", label: "מחשבון", labelEn: "Calculator", angle: Math.PI },
  { icon: "📧", label: "דוא״ל", labelEn: "Email", angle: (3 * Math.PI) / 2 },
] as const;

// The selected tool index (Web Browser)
export const SELECTED_TOOL_INDEX = 0;

// Query text
export const QUERY_TEXT = "מה מזג האוויר בתל אביב היום?";
export const RESPONSE_TEXT = "מזג האוויר בתל אביב היום: 24 מעלות, שמיים בהירים";

// Think bubble text
export const THINK_TEXT =
  "אני צריך לבדוק מזג אוויר עדכני.\nאשתמש בכלי חיפוש באינטרנט";
export const OBSERVE_TEXT = "קיבלתי את המידע. אפשר לענות למשתמש";

// Tool result
export const TOOL_RESULT = "תל אביב: 24°C, בהיר";

// Summary diagram box positions
export const SUMMARY_BOXES = [
  { label: "THINK", labelHe: "חשיבה", subLabel: "Reason", y: 200 },
  { label: "ACT", labelHe: "פעולה", subLabel: "Tool Use", y: 440 },
  { label: "OBSERVE", labelHe: "תצפית", subLabel: "Result", y: 680 },
] as const;
