const YES_NO_OPTIONS = ['Yes', 'No'];

const COMMON_QUESTIONS = {
  q1: {
    type: 'mcq',
    question: 'Have you watched the lectures?',
    options: YES_NO_OPTIONS,
  },
  q2: {
    type: 'mcq',
    question: 'Have you completed the reading through Schweser Textbook?',
    options: YES_NO_OPTIONS,
  },
  q3: {
    type: 'mcq',
    question: 'Have you completed practice with Question Banks provided?',
    options: YES_NO_OPTIONS,
  },
  q4: {
    type: 'mcq',
    question: 'Have you completed the revision?',
    options: YES_NO_OPTIONS,
  },
  q5: {
    type: 'mcq',
    question: 'Have you taken the Chapterwise test?',
    options: YES_NO_OPTIONS,
  },
};

const SUBJECT_CHAPTERS = {
  Quants: [
    '1. Rates and Returns',
    '2. Time Value of Money in Finance',
    '3. Statistical Measures of Asset Returns',
    '4. Probability Trees and Conditional Expectations',
    '5. Portfolio Mathematics',
    '6. Simulation Methods',
    '7. Estimation and Inference',
    '8. Hypothesis Testing',
    '9. Parametric and Non-Parametric Tests of Independence',
    '10. Simple Linear Regression',
    '11. Introduction to Big Data Techniques',
  ],

  ECO: [
    '12. The Firm and Market Structures',
    '13. Understanding Business Cycles',
    '14. Fiscal Policy',
    '15. Monetary Policy',
    '16. Introduction to Geopolitics',
    '17. International Trade',
    '18. Capital Flows and the FX Market',
    '19. Exchange Rate Calculations',
  ],

  CI: [
    '20. Organizational Forms, Corporate Issuer Features, and Ownership',
    '21. Investors and Other Stakeholders',
    '22. Corporate Governance: Conflicts, Mechanisms, Risks, and Benefits',
    '23. Working Capital and Liquidity',
    '24. Capital Investments and Capital Allocation',
    '25. Capital Structure',
    '26. Business Models',
  ],

  FSA: [
    '27. Introduction to Financial Statement Analysis',
    '28. Analyzing Income Statements',
    '29. Analyzing Balance Sheets',
    '30. Analyzing Statements of Cash Flows I',
    '31. Analyzing Statements of Cash Flows II',
    '32. Analysis of Inventories',
    '33. Analysis of Long-Term Assets',
    '34. Topics in Long-Term Liabilities and Equity',
    '35. Analysis of Income Taxes',
    '36. Financial Reporting Quality',
    '37. Financial Analysis Techniques',
    '38. Introduction to Financial Statement Modeling',
  ],

  Equity: [
    '39. Market Organization and Structure',
    '40. Security Market Indexes',
    '41. Market Efficiency',
    '42. Overview of Equity Securities',
    '43. Company Analysis: Past and Present',
    '44. Industry and Competitive Analysis',
    '45. Company Analysis: Forecasting',
    '46. Equity Valuation: Concepts and Basic Tools',
  ],

  FI: [
    '47. Fixed-Income Instrument Features',
    '48. Fixed-Income Cash Flows and Types',
    '49. Fixed-Income Issuance and Trading',
    '50. Fixed-Income Markets for Corporate Issuers',
    '51. Fixed-Income Markets for Government Issuers',
    '52. Fixed-Income Bond Valuation: Prices and Yields',
    '53. Yield and Yield Spread Measures for Fixed-Rate Bonds',
    '54. Yield and Yield Spread Measures for Floating-Rate Instruments',
    '55. The Term Structure of Interest Rates: Spot, Par, and Forward Curves',
    '56. Interest Rate Risk and Return',
    '57. Yield-Based Bond Duration Measures and Properties',
    '58. Yield-Based Bond Convexity and Portfolio Properties',
    '59. Curve-Based and Empirical Fixed-Income Risk Measures',
    '60. Credit Risk',
    '61. Credit Analysis for Government Issuers',
    '62. Credit Analysis for Corporate Issuers',
    '63. Fixed-Income Securitization',
    '64. Asset-Backed Security (ABS) Instrument and Market Features',
    '65. Mortgage-Backed Security (MBS) Instrument and Market Features',
  ],
};

const createQuestionSet = () =>
  structuredClone(COMMON_QUESTIONS);

const QUESTION_DATA = Object.fromEntries(
  Object.entries(SUBJECT_CHAPTERS).map(([subject, chapters]) => [
    subject,
    Object.fromEntries(
      chapters.map((chapter) => [chapter, createQuestionSet()])
    ),
  ])
);

export default QUESTION_DATA;