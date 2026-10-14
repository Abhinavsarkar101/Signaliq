export interface SampleDataset {
  id: string;
  title: string;
  scenario: string;
  description: string;
  expectedOutcome: 'A_SUFFICIENT' | 'B_PARTIALLY_SUFFICIENT' | 'C_INSUFFICIENT';
  projectName: string;
  objective: string;
  productName: string;
  customerSegment: string;
  category: string;
  fileName: string;
  fileType: 'csv' | 'transcript' | 'heatmap';
  csvContent?: string;
  transcriptContent?: string;
  heatmapNotes?: string;
  columnMappings?: {
    feedbackTextCol?: string;
    ratingCol?: string;
    dateCol?: string;
    segmentCol?: string;
    idCol?: string;
  };
}

export const SAMPLE_DATASETS: SampleDataset[] = [
  {
    id: 'sample_scenario_1_sufficient',
    title: 'Scenario 1: Checkout Drop-off (Sufficient Data)',
    scenario: 'Sufficient Evidence (Outcome A)',
    description: 'Comprehensive feedback from 25 real checkout drop-offs clearly showing credit card gateway timeouts and surprise shipping fees. Sufficient to take action without needing a survey.',
    expectedOutcome: 'A_SUFFICIENT',
    projectName: 'E-commerce Checkout Funnel Drop-off',
    objective: 'Determine why customers abandon their shopping cart at step 3 (Payment Details) of the checkout flow.',
    productName: 'ApexStore Retail',
    customerSegment: 'Cart abandoners at payment stage in the past 14 days',
    category: 'conversion',
    fileName: 'checkout_abandonment_feedback.csv',
    fileType: 'csv',
    columnMappings: {
      idCol: 'ticket_id',
      dateCol: 'date',
      segmentCol: 'device_type',
      feedbackTextCol: 'customer_comment',
      ratingCol: 'satisfaction_rating',
    },
    csvContent: `ticket_id,date,device_type,satisfaction_rating,customer_comment
CK-101,2026-10-01,Mobile iOS,1,"The Apple Pay button spun indefinitely for 45 seconds and then threw an error code 502. Lost my entire order."
CK-102,2026-10-01,Desktop Chrome,1,"Surprise $18 shipping charge appeared only after entering credit card information! The header promised free shipping over $50."
CK-103,2026-10-02,Mobile Android,2,"Tried 3 times with my Visa debit card. Each time it said 'Card verification failed' without telling me why."
CK-104,2026-10-02,Desktop Safari,1,"Stripe payment gateway timed out on checkout. When I refreshed, my cart was emptied."
CK-105,2026-10-03,Mobile iOS,1,"Hidden handling fees and regional tax was added on step 3. Price jumped from $74 to $99. Cancelled immediately."
CK-106,2026-10-03,Desktop Chrome,1,"Payment gateway gave a blank white screen after 3D Secure SMS code was entered."
CK-107,2026-10-04,Mobile iOS,2,"Apple Pay failed twice. Had to manually re-type a 16-digit card number, which is impossible on a moving train so I gave up."
CK-108,2026-10-04,Desktop Firefox,1,"Estimated shipping cost was listed as free on product page, but on the final payment page it charged $14.99 standard delivery."
CK-109,2026-10-05,Mobile Android,1,"Google Pay button is completely unresponsive on Android Brave browser."
CK-110,2026-10-05,Desktop Chrome,2,"No option to split payment or use PayPal. Forced credit card only."
CK-111,2026-10-06,Desktop Chrome,1,"Zip code validation rejects Canadian postal codes because of the space character. Very frustrating."
CK-112,2026-10-06,Mobile iOS,1,"Hidden $6.50 processing fee showed up right before placing order."
CK-113,2026-10-07,Desktop Chrome,1,"Payment processing spinner never finishes. I waited 3 minutes afraid I would be double billed."
CK-114,2026-10-07,Mobile Android,1,"Card declined error even though funds were sufficient. My bank told me ApexStore's gateway didn't pass postal code."
CK-115,2026-10-08,Desktop Edge,2,"Unexpected shipping fee added for Hawaii address with no advance warning."
CK-116,2026-10-08,Mobile iOS,1,"Payment modal covers the 'Submit Order' button on iPhone 13 screen."
CK-117,2026-10-09,Desktop Chrome,1,"Spinner froze during payment authentication. No email confirmation received."
CK-118,2026-10-09,Mobile Android,2,"Tax calculation was recalculated on step 3 adding an extra 12% without explanation."
CK-119,2026-10-10,Desktop Chrome,1,"3D Secure redirect went to 404 page on Bank of America authentication."
CK-120,2026-10-10,Mobile iOS,1,"Apple Pay sheet dismisses itself before authorizing."
CK-121,2026-10-11,Desktop Firefox,2,"Shipping fee is too high compared to competitors."
CK-122,2026-10-11,Mobile Android,1,"Cart emptied after failed credit card attempt."
CK-123,2026-10-12,Desktop Chrome,1,"Error 504 Gateway Timeout when submitting card."
CK-124,2026-10-12,Mobile iOS,1,"Hidden fee on payment step is deceptive."
CK-125,2026-10-13,Desktop Chrome,2,"Failed payment did not save shipping details, had to re-type address."`,
  },
  {
    id: 'sample_scenario_2_gap',
    title: 'Scenario 2: Onboarding Drop-off (Knowledge Gap)',
    scenario: 'Partially Sufficient (Outcome B -> Survey)',
    description: 'Support tickets show users complaining about email verification codes, but tickets represent only vocal complainers and cannot establish why the silent 75% abandoned.',
    expectedOutcome: 'B_PARTIALLY_SUFFICIENT',
    projectName: 'SaaS Onboarding Drop-off Analysis',
    objective: 'Understand why new signups abandon the onboarding process before completing workspace setup.',
    productName: 'CloudDesk SaaS',
    customerSegment: 'New signups in the last 30 days',
    category: 'onboarding',
    fileName: 'onboarding_support_tickets.csv',
    fileType: 'csv',
    columnMappings: {
      idCol: 'ticket_id',
      dateCol: 'created_date',
      segmentCol: 'user_segment',
      feedbackTextCol: 'feedback_text',
      ratingCol: 'rating',
    },
    csvContent: `ticket_id,created_date,user_segment,feedback_text,rating
TK-201,2026-09-15,Solo Freelancer,"Waited 20 minutes for the verification code email. Moved on to another tool.",1
TK-202,2026-09-16,Small Team (2-10),"Verification code email was routed to Spam folder in Gmail.",2
TK-203,2026-09-17,Enterprise (50+),"Corporate firewall quarantined the confirmation link as unverified sender.",1
TK-204,2026-09-18,Solo Freelancer,"Forced me to invite 2 teammates before I could even see the workspace dashboard.",2
TK-205,2026-09-19,Small Team (2-10),"Verification token expired after 10 minutes. Had to restart signup from scratch.",1
TK-206,2026-09-20,Solo Freelancer,"The skip button on the team invite step is gray text on white background. Did not see it.",2
TK-207,2026-09-21,Enterprise (50+),"SSO was not offered on initial signup page, only password + email code.",2
TK-208,2026-09-22,Solo Freelancer,"Verification code arrived after 18 minutes. Expired by the time I entered it.",1
TK-209,2026-09-23,Small Team (2-10),"Invite colleagues step is intrusive during initial evaluation.",2
TK-210,2026-09-24,Solo Freelancer,"Confirmation email didn't arrive on Outlook domain.",1
TK-211,2026-09-25,Small Team (2-10),"Wanted to see sample project templates first before setting up workspace permissions.",3
TK-212,2026-09-26,Enterprise (50+),"Strict security settings prevent employees from receiving verification links.",1`,
  },
  {
    id: 'sample_scenario_3_multisource',
    title: 'Scenario 3: App Redesign (Tickets + Interview Transcript)',
    scenario: 'Multi-Source Evidence',
    description: 'Combines support tickets with an in-depth 1-on-1 qualitative interview transcript, showing sharply contrasting perspectives between power users and casual users.',
    expectedOutcome: 'B_PARTIALLY_SUFFICIENT',
    projectName: 'Mobile Navigation Redesign Impact',
    objective: 'Evaluate customer response to the new tab-bar navigation versus the old sidebar menu.',
    productName: 'FlowManager Mobile',
    customerSegment: 'Active daily mobile app users',
    category: 'feature adoption',
    fileName: 'user_interview_transcript_redesign.txt',
    fileType: 'transcript',
    transcriptContent: `RESEARCH INTERVIEW TRANSCRIPT
Project: Mobile Navigation Redesign Impact
Participant: Sarah Jenkins (Senior Product Marketing Lead, Enterprise Tier, 3 years daily user)
Interviewer: Alex Chen (Senior UX Researcher)
Date: October 10, 2026

[00:01:15] Alex: Sarah, thanks for taking the time today. Could you walk me through your immediate impression when you updated to version 4.0 last Tuesday?
[00:01:28] Sarah: Honestly? I was completely disoriented. For three years, I’ve had my pinned project shortcuts right there in the left-hand slide-out drawer. Now that drawer is gone, and there are only four icons at the bottom.
[00:02:10] Alex: Which specific tasks took longer for you?
[00:02:15] Sarah: Finding custom workspace tags! In the old version, it took one tap to open the drawer and one tap on my tag. Now I have to tap "More", scroll past account settings, tap "Taxonomies", and then filter. That’s four taps instead of two, and I do this fifty times a day.
[00:03:40] Alex: Did anything improve for you in the new layout?
[00:03:45] Sarah: The quick capture button in the center is nice for taking quick voice notes. But for power workflows, it feels like the app was dumbed down for people who only check notifications once a week.
[00:04:30] Alex: How would you describe the contrast between your workflow and newer teammates?
[00:04:35] Sarah: My junior marketing associates actually liked it because they found the old sidebar overwhelming with 40 menu items. But for senior leads managing cross-functional boards, we lost our speed dials. We need a way to customize that bottom bar.
[00:06:12] Alex: What would be the single most important adjustment we could make?
[00:06:18] Sarah: Let power users pin their two most used views directly to the bottom navigation bar, or give us a customizable quick-launcher. Don't hide our core tools under a generic "More" menu.`,
  },
  {
    id: 'sample_scenario_4_insufficient',
    title: 'Scenario 4: Sparse / Off-topic Data (Insufficient Data)',
    scenario: 'Insufficient Evidence (Outcome C)',
    description: 'A sparse file with only 3 vague ratings and off-topic notes. Demonstrates how SignalIQ honestly flags insufficient evidence instead of fabricating confidence.',
    expectedOutcome: 'C_INSUFFICIENT',
    projectName: 'Enterprise Pricing Strategy Review',
    objective: 'Evaluate whether enterprise tier pricing ($120/seat/mo) is driving customer churn to open-source competitors.',
    productName: 'CloudDesk Enterprise',
    customerSegment: 'Enterprise churned accounts',
    category: 'pricing',
    fileName: 'random_app_store_reviews.csv',
    fileType: 'csv',
    columnMappings: {
      idCol: 'id',
      feedbackTextCol: 'review',
      ratingCol: 'stars',
    },
    csvContent: `id,stars,review
1,5,"Great app, loved the color scheme."
2,4,"Works fine on my iPad."
3,3,"Okay I guess."`,
  },
];
