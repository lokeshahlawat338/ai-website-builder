const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

const SYSTEM_PROMPT = `You are an expert web developer and UI designer. When given a description, generate a single complete HTML file.

Requirements:
1. Fully self-contained — all CSS inside <style> tags, all JS inside <script> tags
2. Modern, beautiful, professional design
3. Responsive — works on mobile and desktop
4. Use Google Fonts via CDN link tag (allowed)
5. Realistic placeholder content that fits the website purpose
6. Smooth CSS animations and hover effects
7. Semantic HTML5 tags
8. Consistent color scheme throughout

CRITICAL: Return ONLY the raw HTML code. Start directly with <!DOCTYPE html>. 
No markdown, no code fences, no explanation, no backticks. Just pure HTML.`;

const generateWebsite = async (userPrompt) => {
  const fullPrompt = `${SYSTEM_PROMPT}\n\nWebsite to build: ${userPrompt}`;
  
  try {
    const result = await model.generateContent(fullPrompt);
    const response = result.response.text();
    
    // Clean response — remove markdown code fences if Gemini added them
    let html = response.trim();
    if (html.startsWith('```html')) html = html.slice(7);
    if (html.startsWith('```')) html = html.slice(3);
    if (html.endsWith('```')) html = html.slice(0, -3);
    html = html.trim();
    
    // Validate it looks like HTML
    if (!html.toLowerCase().includes('<!doctype') && !html.toLowerCase().includes('<html')) {
      throw new Error('Gemini did not return valid HTML');
    }
    
    return html;
  } catch (error) {
    // Retry once on failure
    if (!error.message.includes('valid HTML')) {
      const result = await model.generateContent(fullPrompt);
      return result.response.text().trim();
    }
    throw error;
  }
};

const refineWebsite = async (existingHTML, instruction) => {
  const prompt = `You are an expert web developer. Here is an existing website HTML:

${existingHTML.slice(0, 8000)}

The user wants to modify it: "${instruction}"

Make ONLY the requested changes. Keep all other sections intact.
Return the complete updated HTML starting with <!DOCTYPE html>.
No explanations, no markdown, just pure HTML.`;

  const result = await model.generateContent(prompt);
  let html = result.response.text().trim();
  if (html.startsWith('```html')) html = html.slice(7);
  if (html.startsWith('```')) html = html.slice(3);
  if (html.endsWith('```')) html = html.slice(0, -3);
  return html.trim();
};

module.exports = { generateWebsite, refineWebsite };