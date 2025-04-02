import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import fetch from "node-fetch";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const UNSPLASH_ACCESS_KEY = process.env.CLIENT_ID;
const DEFAULT_IMAGE = "https://via.placeholder.com/800"; // Fallback image

async function generateBlogContent(keywords, subheadings, words) {
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: `Generate a well-structured blog post on '${keywords}' with ${subheadings} subheadings and approximately ${words} words.
    Ensure clarity, coherence, and readability.
    
    Format:
    Title: [Generated Title]
    Metadata: [Short summary with date]
    
    Subheadings and Content:
    - [Subheading 1]
      [Detailed content]
    - [Subheading 2]
      [Detailed content]
    - ...`
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

async function fetchUnsplashImage(query) {
  const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}`;

  try {
    const response = await fetch(url);
    const text = await response.text();

    try {
      const data = JSON.parse(text);
      return data.urls?.regular || DEFAULT_IMAGE;
    } catch (jsonError) {
      console.error("Unsplash API Rate Limit Exceeded:", text);
      return DEFAULT_IMAGE;
    }
  } catch (error) {
    console.error("Error fetching image from Unsplash:", error);
    return DEFAULT_IMAGE;
  }
}

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const keywords = searchParams.get("keywords");
  const subheadings = parseInt(searchParams.get("subheadings")) || 5;
  const words = parseInt(searchParams.get("words")) || 800;

  if (!keywords) {
    return NextResponse.json(
      { message: "Missing keywords parameter." },
      { status: 400 }
    );
  }

  try {
    const blogContent = await generateBlogContent(keywords, subheadings, words);
    
    // Fetch only **one** image for the blog based on the main keyword
    const mainImage = await fetchUnsplashImage(keywords);

    return NextResponse.json(
      {
        blog: {
          title: `Exploring ${keywords}`,
          metadata: `Generated on ${new Date().toLocaleDateString()}`,
          content: blogContent,
          image: mainImage, // Only one image
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error generating blog content or fetching images:", error);
    return NextResponse.json(
      { message: "An error occurred while generating the blog content." },
      { status: 500 }
    );
  }
}
