"use server"
import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});



export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    // Validate message before doing any work or calling the model
    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { error: 'message is required' },
        { status: 400 }
      )
    }

    const sanitized = message.trim()

    const contextualPrompt = `
      You are an advanced fraud detection AI system with expertise in cybersecurity and financial crime prevention. 
      Analyze the provided text with deep contextual understanding.

      ADVANCED FRAUD PATTERNS TO DETECT:
      🚨 HIGH-RISK INDICATORS:
      - Urgency tactics ("act now", "limited time", "expires today")
      - Unsolicited financial opportunities (investments, lottery, inheritance)
      - Request for personal/financial information via unofficial channels
      - Impersonation of authorities (banks, government, tech companies)
      - Romance/relationship manipulation for financial gain
      - Advance fee scams (pay upfront for larger reward)
      - Cryptocurrency/NFT investment schemes
      - Fake charity appeals (especially during disasters)
      - Tech support scams claiming malware/virus
      - Phishing attempts with suspicious links/attachments

      ✅ LEGITIMATE COMMUNICATION PATTERNS:
      - Official business correspondence with proper verification methods
      - Genuine customer service with established protocols
      - Normal social interactions without financial requests
      - Verified notifications with official contact information
      - Educational content without pressure tactics

      ANALYSIS FRAMEWORK:
      1. Intent Analysis: What is the sender trying to achieve?
      2. Pressure Tactics: Are there urgency or fear-based manipulations?
      3. Financial Requests: Any direct/indirect requests for money or information?
      4. Verification: Can claims be independently verified?
      5. Communication Style: Professional vs. manipulative language patterns

      Text to analyze: "${sanitized}"

      RESPONSE REQUIREMENTS:
      - Be extremely thorough in analysis
      - Consider psychological manipulation techniques
      - Flag anything suspicious even if borderline
      - Provide actionable advice for users

      Respond in this JSON format:
      {
        "risk_level": "LOW|MEDIUM|HIGH|CRITICAL",
        "confidence": "percentage (0-100)",
        "classification": "LEGITIMATE|SUSPICIOUS|FRAUD",
        "primary_concerns": ["list of main red flags"],
        "analysis": "detailed explanation of findings",
        "recommendations": ["specific actions user should take"]
      }
      `;


    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: [{text: contextualPrompt}]
    })

    // Try to parse the JSON response, fallback to raw text if parsing fails
    let formattedResponse;
    const responseText = response.text || '';
    
    try {
      // Clean the response text to extract only the JSON part
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : responseText;
      const jsonResponse = JSON.parse(jsonString);
      
      // Format the structured response for better readability with proper headings
      formattedResponse = `# 🔍 Fraud Analysis Report

## 📊 Risk Assessment
**Risk Level:** ${jsonResponse.risk_level}  
**Confidence:** ${jsonResponse.confidence}%  
**Classification:** ${jsonResponse.classification}

## ⚠️ Primary Concerns
${jsonResponse.primary_concerns.map((concern: string) => `• ${concern}`).join('\n')}

## 📝 Detailed Analysis
${jsonResponse.analysis}

## 💡 Recommendations
${jsonResponse.recommendations.map((rec: string) => `• ${rec}`).join('\n')}`;
        
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      // Fallback to raw response if JSON parsing fails
      formattedResponse = responseText;
    }

    return NextResponse.json({ response: formattedResponse }, {status: 200});
    
  } 
  catch(error){
    return NextResponse.json(
      {error: String(error)},
      {status: 500}
    )
  }

}

export async function GET(request: Request){
  try{
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: [{text: 'hello, how are you?'}]
    })

    return NextResponse.json({message: response.text}, {status: 200})
  } catch(error){
    return NextResponse.json(
      {error: error},
      {status: 500}
    )  }
}