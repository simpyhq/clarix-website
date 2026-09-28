/**
 * Marketing copy for the public site.
 *
 * Rules: no invented customers, logos, testimonials, metrics, uptime figures,
 * or certifications. Gaps Christian must fill are marked TODO(owner),
 * TODO(owner-verify), or TODO(owner/legal) next to the placeholder.
 */

export const supportEmail = "support@clarixhq.ai";

export const homeTitle =
  "Clarix Cash Desk — AI bookkeeping & cash visibility for QuickBooks Online";

export const homeDescription =
  "Clarix Cash Desk keeps QuickBooks Online books categorized, chases invoices, and sends a plain-English cash brief. A person approves every change.";

export const navLinks = [
  { href: "/cash-desk", label: "Product" },
  { href: "/#how", label: "How it works" },
  { href: "/security", label: "Security" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
] as const;

export const problems = [
  {
    pain: "Month-end piles up",
    detail:
      "Transactions sit uncategorized until someone has a free weekend to clean the file.",
    outcome:
      "Bank activity is categorized as it lands. Only the exceptions wait for a person.",
  },
  {
    pain: "Invoices go quiet",
    detail:
      "Receivables slip because the follow-up lives in someone’s memory.",
    outcome:
      "Overdue invoices are listed and a follow-up is drafted for you to approve before it is sent.",
  },
  {
    pain: "Cash is a guess",
    detail:
      "The number in the bank is not the same as money you can actually spend.",
    outcome:
      "Each morning you get a plain-English brief: cash on hand, what is overdue, and what is due soon.",
  },
] as const;

export const capabilities = [
  {
    id: "categorize",
    title: "Categorization and reconciliation",
    summary:
      "Bank and credit-card lines are matched to your chart of accounts. Anything uncertain stays in a review queue.",
    detail:
      "Cash Desk proposes a category and a payee for new activity in QuickBooks Online. A match you have approved before can be repeated. A new or odd line waits. Reconciliation ties the cleared balance back to the statement so month-end is not a surprise.",
  },
  {
    id: "ar",
    title: "Invoice follow-ups",
    summary:
      "Open receivables are watched, and a reminder is drafted when an invoice ages.",
    detail:
      "Cash Desk reads open invoices, ranks what is late, and drafts a short note in your voice. It does not email your customer until you approve the send. You can edit the note, skip it, or mark the invoice handled.",
  },
  {
    id: "ap",
    title: "Bills and due dates",
    summary:
      "Bills are tracked against their due dates so nothing important is paid by accident or missed.",
    detail:
      "Upcoming bills show up in the brief with the amount and the date. Cash Desk does not pay a bill on its own. You still decide what gets paid, and when.",
  },
  {
    id: "brief",
    title: "Cash brief and 13-week view",
    summary:
      "A morning note in plain English, plus a simple view of the next 13 weeks.",
    detail:
      "The brief covers cash on hand, overdue invoices, and bills due soon. The 13-week view is a forward look built from what is already in QuickBooks, not a promise about the future. The method should be confirmed before it is described more precisely.",
  },
  {
    id: "close",
    title: "Month-end checklist",
    summary:
      "A short list of what is done and what is still open before you call the month closed.",
    detail:
      "Uncategorized lines, unreconciled accounts, overdue invoices, and bills past due sit on one list. Closing the month is still your call, or your bookkeeper’s.",
  },
  {
    id: "ask",
    title: "Ask your books",
    summary:
      "Questions in plain language, answered from your QuickBooks file.",
    detail:
      "Ask what you spent on software, which customers are late, or how this month compares with last month. Answers cite the accounts they came from. They are explanations of your books, not tax advice.",
  },
] as const;

export const steps = [
  {
    n: "01",
    title: "Connect QuickBooks",
    body: "You sign in on Intuit’s screen and approve access. It takes a few minutes. Clarix never sees your QuickBooks password or your bank password.",
  },
  {
    n: "02",
    title: "Set the rules",
    body: "We map your chart of accounts and the categories you actually use. Setup starts with a discovery conversation. A published turnaround time is not on this site until it is a promise we can keep.",
  },
  {
    n: "03",
    title: "Work, then approve",
    body: "Cash Desk prepares categories, follow-ups, and the morning brief. A person approves changes before they are written to your books.",
  },
  {
    n: "04",
    title: "Tune each month",
    body: "We look at what you corrected and adjust the rules. The cadence on the site is monthly until you confirm a different rhythm.",
  },
] as const;

export const setupIncludes = [
  "A discovery conversation about how you close the books today",
  "Connecting QuickBooks Online through Intuit’s sign-in",
  "Rule and chart-of-accounts configuration",
  "Onboarding onto the morning brief and the review queue",
  "Tuning during the first month",
] as const;

export const faqs = [
  {
    q: "Does it change my books without approval?",
    a: "No. Cash Desk proposes changes. A person reviews them, and they are written to QuickBooks Online only after approval. You can edit or reject a suggestion.",
  },
  {
    q: "What access does it need?",
    a: "A QuickBooks Online connection that you approve on Intuit’s own sign-in screen. Clarix does not ask for, see, or store your QuickBooks password or your bank password. You can revoke the connection from QuickBooks.",
  },
  {
    q: "What if a categorization is wrong?",
    a: "Correct it. Corrections are how the rules get tuned. A suggestion is not final until you approve it, and you can change a category after the fact in QuickBooks the way you always could.",
  },
  {
    q: "Do I still need a bookkeeper or a CPA?",
    a: "For tax, filings, and judgment, yes. Cash Desk does not prepare tax returns, sign returns, or replace an accountant. Many firms will use it alongside the bookkeeper or fractional CFO they already trust.",
  },
  {
    q: "What does it cost after setup?",
    a: "Setup starts at $2,500. Monthly plans are not published yet. On the demo we will tell you the monthly number we are proposing before you commit to anything.",
  },
  {
    q: "How do I disconnect?",
    a: "Disconnect Clarix inside QuickBooks Online. That revokes the connection. You can also email support@clarixhq.ai and tell us to stop. Disconnect does not delete the history already in your QuickBooks file.",
  },
] as const;

export const volumeOptions = [
  "Under 200",
  "200–1,000",
  "1,000–5,000",
  "More than 5,000",
  "Not sure yet",
] as const;

export const founders = [
  {
    name: "Christian Simpson",
    role: "Co-founder",
  },
  {
    name: "Michael Simpson",
    role: "Co-founder",
  },
] as const;
