// 1. Define the shared set of questions used by all chapters
const COMMON_QUESTIONS = {
  "q1": { "type": "mcq", "question": "Have you watched the lectures?", "options": ["Yes", "No"] },
  "q2": { "type": "mcq", "question": "Have you completed the reading through Schweser Textbook?", "options": ["Yes", "No"] },
  "q3": { "type": "mcq", "question": "Have you completed practice with Question Banks provided?", "options": ["Yes", "No"] },
  "q4": { "type": "mcq", "question": "Have u completed the revision ?", "options": ["Yes", "No"] },
  "q5": { "type": "mcq", "question": "Have you taken the Chapterwise test ?", "options": ["Yes", "No"] }
};

// 2. Helper function to apply these questions to an array of chapter titles
const createSubject = (chapters) => {
  return chapters.reduce((acc, title) => {
    acc[title] = { ...COMMON_QUESTIONS };
    return acc;
  }, {});
};

// 3. Define the main data structure by listing only the chapter names
const QUESTION_DATA = {
  "Quants": createSubject([
    "1. Rates and Returns",
    "2. Time Value of Money in Finance",
    "3. Statistical Measures of Asset Returns",
    "4. Probability Trees and Conditional Expectations",
    "5. Portfolio Mathematics",
    "6. Simulation Methods",
    "7. Estimation and Inference",
    "8. Hypothesis Testing",
    "9. Parametric and Non-Parametric Tests of Independence",
    "10. Simple Linear Regression",
    "11. Introduction to Big Data Techniques"
  ]),

  "ECO": createSubject([
    "12. The Firm and Market Structures",
    "13. Understanding Business Cycles",
    "14. Fiscal Policy",
    "15. Monetary Policy",
    "16. Introduction to Geopolitics",
    "17. International Trade",
    "18. Capital Flows and the FX Market",
    "19. Exchange Rate Calculations"
  ]),

  "CI": createSubject([
    "20. Organizational Forms, Corporate Issuer Features, and Ownership",
    "21. Investors and Other Stakeholders",
    "22. Corporate Governance: Conflicts, Mechanisms, Risks, and Benefits",
    "23. Working Capital and Liquidity",
    "24. Capital Investments and Capital Allocation",
    "25. Capital Structure",
    "26. Business Models"
  ]),

  "FSA": createSubject([
    "27. Introduction to Financial Statement Analysis",
    "28. Analyzing Income Statements",
    "29. Analyzing Balance Sheets",
    "30. Analyzing Statements of Cash Flows I",
    "31. Analyzing Statements of Cash Flows II",
    "32. Analysis of Inventories",
    "33. Analysis of Long-Term Assets",
    "34. Topics in Long-Term Liabilities and Equity",
    "35. Analysis of Income Taxes",
    "36. Financial Reporting Quality",
    "37. Financial Analysis Techniques",
    "38. Introduction to Financial Statement Modeling"
  ]),

  "Equity": createSubject([
    "39. Market Organization and Structure",
    "40. Security Market Indexes",
    "41. Market Efficiency",
    "42. Overview of Equity Securities",
    "43. Company Analysis: Past and Present",
    "44. Industry and Competitive Analysis",
    "45. Company Analysis: Forecasting",
    "46. Equity Valuation: Concepts and Basic Tools"
  ]),

  "FI": createSubject([
    "47. Fixed-Income Instrument Features",
    "48. Fixed-Income Cash Flows and Types",
    "49. Fixed-Income Issuance and Trading",
    "50. Fixed-Income Markets for Corporate Issuers",
    "51. Fixed-Income Markets for Government Issuers",
    "52. Fixed-Income Bond Valuation: Prices and Yields",
    "53. Yield and Yield Spread Measures for Fixed-Rate Bonds",
    "54. Yield and Yield Spread Measures for Floating-Rate Instruments",
    "55. The Term Structure of Interest Rates: Spot, Par, and Forward Curves",
    "56. Interest Rate Risk and Return",
    "57. Yield-Based Bond Duration Measures and Properties",
    "58. Yield-Based Bond Convexity and Portfolio Properties",
    "59. Curve-Based and Empirical Fixed-Income Risk Measures",
    "60. Credit Risk",
    "61. Credit Analysis for Government Issuers",
    "62. Credit Analysis for Corporate Issuers",
    "63. Fixed-Income Securitization",
    "64. Asset-Backed Security (ABS) Instrument and Market Features",
    "65. Mortgage-Backed Security (MBS) Instrument and Market Features"
  ]),

  "DI": createSubject([
    "66. Derivative Instrument and Derivative Market Features",
    "67. Forward Commitment and Contingent Claim Features and Instruments",
    "68. Derivative Benefits, Risks, and Issuer and Investor Uses",
    "69. Arbitrage, Replication, and the Cost of Carry in Pricing Derivatives",
    "70. Pricing and Valuation of Forward Contracts and for an Underlying with Varying Maturities",
    "71. Pricing and Valuation of Futures Contracts",
    "72. Pricing and Valuation of Interest Rates and Other Swaps",
    "73. Pricing and Valuation of Options",
    "74. Option Replication Using Put-Call Parity",
    "75. Valuing a Derivative Using a One-Period Binomial Model"
  ]),

  "AI": createSubject([
    "76. Alternative Investment Features, Methods, and Structures",
    "77. Alternative Investment Performance and Returns",
    "78. Investments in Private Capital: Equity and Debt",
    "79. Real Estate and Infrastructure",
    "80. Natural Resources",
    "81. Hedge Funds",
    "82. Introduction to Digital Assets"
  ]),

  "PM": createSubject([
    "83. Portfolio Risk and Return: Part I",
    "84. Portfolio Risk and Return: Part II",
    "85. Portfolio Management: An Overview",
    "86. Basics of Portfolio Planning and Construction",
    "87. The Behavioral Biases of Individuals",
    "88. Introduction to Risk Management"
  ]),

  "Ethics": createSubject([
    "89. Ethics and Trust in the Investment Profession",
    "90. Code of Ethics and Standards of Professional Conduct",
    "91. Guidance for Standards I-VII",
    "91.1 . Guidance for Standards I-VII: 1AB",
    "91.2 . Guidance for Standards I-VII: 1CD",
    "91.3 . Guidance for Standards I-VII: 2AB",
    "91.4 . Guidance for Standards I-VII: 3AB",
    "91.5 . Guidance for Standards I-VII: 3CDE",
    "91.6 . Guidance for Standards I-VII: 4ABC",
    "91.7 . Guidance for Standards I-VII: 5",
    "91.8 . Guidance for Standards I-VII: 6",
    "91.9 . Guidance for Standards I-VII: 7",
    "92. Introduction to the Global Investment Performance Standards (GIPS)",
    "93. Ethics Application"
  ])
};

export default QUESTION_DATA;