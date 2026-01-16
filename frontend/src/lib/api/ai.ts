import { GoogleGenerativeAI } from "@google/generative-ai";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from "./firebase";

export async function main(prompt: string) {
  if (!prompt.trim()) {
    throw new Error("Prompt is required to generate an image.");
  }

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local file.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  // Note: The Gemini API structure may need adjustment based on actual API response
  // This is a placeholder implementation - you may need to update based on the actual API
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash-exp" // or "gemini-1.5-flash" - check current available models
  });

  const result = await model.generateContent({
    contents: [{
      role: "user",
      parts: [{ text: `Generate a cartoon-style sticker of: ${prompt}. Use vibrant colors and make it child-friendly.` }]
    }],
  });

  const response = await result.response;

  // Handle response - adjust based on actual Gemini API response structure
  const parts = response.candidates?.[0]?.content?.parts;
  if (!parts) {
    throw new Error("No content parts returned from the model.");
  }

  let downloadUrl: string | null = null;

  for (const part of parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      if (!imageData) {
        throw new Error("Missing inline image data from the model.");
      }
      const buffer = Buffer.from(imageData, "base64");

      // Convert Node Buffer to a BlobPart-compatible type.
      const fileBits = [new Uint8Array(buffer)];
      const fileName = "gemini-native-image.png";
      const file = new File(fileBits, fileName, { type: "image/png" });


      const storageRef = ref(storage, `images/gemini-native-image.png`);
    
      try {
        // Upload the file
        const snapshot = await uploadBytes(storageRef, file);
        console.log('Uploaded a blob or file!', snapshot);

        // Get the download URL
        const url = await getDownloadURL(snapshot.ref);
        console.log(`Download url: ${url}`);
        downloadUrl = url;
      } catch (err) {
        if (err instanceof Error) {
          console.log(`An error occured: ${err}`);
        } else {
          console.log('An unknown error occured');
        }
      } finally {
        // fs.writeFileSync("gemini-native-image.png", buffer);
        console.log("Image saved as gemini-native-image.png");
      }

      if (downloadUrl) {
        break;
      }
    }
  }

  if (!downloadUrl) {
    throw new Error("No image URL was generated.");
  }

  return downloadUrl;
}
