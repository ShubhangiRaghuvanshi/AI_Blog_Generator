import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Use environment variables for sensitive information (like your API key)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function GET(request) {
  const prompt = request.nextUrl.searchParams.get("prompt"); // Fetch 'prompt' from URL

  if (!prompt) {
    return NextResponse.json(
      { message: "Missing prompt in the query parameters." },
      { status: 400 }
    );
  }

  try {
    // Use the prompt to generate content, title, and tags
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Generate a blog post including title, tags, and content based on the prompt: "${prompt}"`,
    });

    // Log the response for debugging
    console.log(response);

    // Extract the blog content from the response
    const blogContent = response.candidates[0]?.content?.parts[0]?.text;
    const blogImage = response.candidates[0]?.content?.parts[1]?.inlineData?.data; // Assuming the second part contains an image

    if (!blogContent) {
      return NextResponse.json(
        { message: "Failed to generate blog content." },
        { status: 500 }
      );
    }

    // Return the generated content in a structured format
    return NextResponse.json(
      {
        blog: {
          title: `Exploring ${prompt}`,
          metadata: `Generated on ${new Date().toLocaleDateString()}`,
          image: blogImage ? `data:image/png;base64,${blogImage}` : null,
          content: blogContent,
          tags: ["AI", "Technology", prompt],
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating blog content:", error);
    return NextResponse.json(
      { message: "An error occurred while generating the blog content." },
      { status: 500 }
    );
  }
}

