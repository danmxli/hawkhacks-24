require("dotenv").config();
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the classes array
const categories = [
  "advertising",
  "meals",
  "amortization",
  "insurance",
  "bank charge",
  "interest",
  "business taxes, licences & memberships",
  "franchise fees",
  "office expense",
  "professional fees",
  "accounting fees",
  "brokerage fee",
  "management and administration",
  "training expense",
  "rent",
  "home office",
  "vehicle rentals",
  "repairs and maintenance",
  "salary",
  "sub-contracts",
  "supplies",
  "small tools",
  "computer-related expenses",
  "internet",
  "property taxes",
  "travel",
  "utilities",
  "telephone and communications",
  "selling expense",
  "delivery expense",
  "waste expense",
  "vehicle expense",
  "general and administrative expense",
];
exports.formatDateAndGenerateCategory = async (dataItem) => {
  const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
  if (!dataItem.INVOICE_RECEIPT_DATE) {
    return dataItem;
  }
  try {
    // Generate date and category for the data item in one step
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-2024-05-13",
      messages: [
        {
          role: "system",
          content: `You will be given a date in a random format and a JS object. Your goal is to 1. Format the date into YYYY-MM-DD format that is before or on ${currentDate}, and 2. Identify the most suitable category for the JavaScript object from the provided list: ${categories.join(
            ", "
          )}. Your response should strictly adhere to the 'YYYY-MM-DD;category' format. Please avoid including any additional information.`,
        },
        {
          role: "user",
          content: `${dataItem.INVOICE_RECEIPT_DATE}, ${JSON.stringify(
            dataItem
          )}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 100,
      top_p: 0.6,
    });

    // Parse the completion response to get formatted date and determined category
    const [formattedDate, category] =
      completion.choices[0].message.content.split(";");
    return { formattedDate, category };
  } catch (error) {
    console.error("Error processing expense data:", error);
    throw new Error("Failed to process expense data.");
  }
};