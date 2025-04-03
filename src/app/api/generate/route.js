import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import fetch from "node-fetch";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const UNSPLASH_ACCESS_KEY = process.env.CLIENT_ID;
const DEFAULT_IMAGE = "https://via.placeholder.com/800";

// ✅ Function to Generate Blog Content
async function generateBlogContent(keywords, subheadings, words) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          parts: [
            {
              text: `Generate a structured blog post on '${keywords}' with ${subheadings} subheadings and around ${words} words.
               Format:
               Title: [Generated Title]
               Metadata: [Short summary with date]
               Sections:
               - [Subheading 1]
                 [Detailed content]
               - [Subheading 2]
                 [Detailed content]
               Ensure proper readability, coherence, and informative tone.`
            }
          ]
        }
      ]
    });

    console.log("🔍 Full AI API Response:", JSON.stringify(response, null, 2));

    const blogText = response?.candidates?.[0]?.content?.parts?.map(part => part.text).join("\n").trim() || "";
    console.log("🔍 Blog Text:", blogText);

    if (!blogText) return null;

    const lines = blogText.split("\n").map((line) => line.trim()).filter(Boolean);
    console.log("🔍 Split Lines:", lines);

    let title = "Generated Blog";
    let metadata = `Generated on ${new Date().toLocaleDateString()}`;
    let sections = [];
    let currentSection = null;

    for (let line of lines) {
      console.log("🔍 Processing Line:", line); // Log each line to debug

      if (line.startsWith("Title:")) {
        title = line.replace("Title:", "").trim();
      } else if (line.startsWith("Metadata:")) {
        metadata = line.replace("Metadata:", "").trim();
      } else if (/^(##|\*\*|[-•])/.test(line)) {  // Handle markdown-style subheadings (##, **, -)
        if (currentSection) sections.push(currentSection);
        currentSection = { subheading: line.replace(/^(\*\*|##|[-•])/, "").trim(), content: "" };
      } else if (currentSection) {
        currentSection.content += line + " ";
      }
    }

    if (currentSection) sections.push(currentSection);

    if (!sections.length) {
      console.error("❌ No valid sections generated.");
      return null;
    }

    return { title, metadata, sections };
  } catch (error) {
    console.error("❌ Error generating blog content:", error);
    return null;
  }
}

// ✅ Function to Fetch Unsplash Images
async function fetchUnsplashImages(sections) {
  const imageRequests = sections.map(async (section) => {
    const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(
      section.subheading
    )}&client_id=${UNSPLASH_ACCESS_KEY}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Unsplash API Error: ${response.status}`);
      const data = await response.json();
      return data.urls?.regular || DEFAULT_IMAGE;
    } catch (error) {
      console.error("❌ Error fetching Unsplash image:", error);
      return DEFAULT_IMAGE;
    }
  });

  return Promise.all(imageRequests);
}

// ✅ API Route Handler
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const keywords = url.searchParams.get("keywords");
    const subheadings = parseInt(url.searchParams.get("subheadings")) || 5;
    const words = parseInt(url.searchParams.get("words")) || 800;

    if (!keywords || !keywords.trim()) {
      return NextResponse.json({ message: "Missing or empty keywords parameter." }, { status: 400 });
    }

    console.log("🔹 Generating blog content...");
    const blog = await generateBlogContent(keywords, subheadings, words);
    if (!blog) {
      console.error("❌ Blog generation failed.");
      return NextResponse.json({ message: "Failed to generate blog content." }, { status: 500 });
    }

    console.log("🔹 Fetching Unsplash images...");
    const images = await fetchUnsplashImages(blog.sections);
    blog.sections = blog.sections.map((section, index) => ({
      ...section,
      image: images[index] || DEFAULT_IMAGE,
    }));

    console.log("✅ Blog and images ready!");
    return NextResponse.json({ blog }, { status: 200 });
  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
