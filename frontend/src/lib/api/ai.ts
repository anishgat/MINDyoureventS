import { GoogleGenAI } from "@google/genai";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from "./firebase";

export async function main(prompt: string) {
  if (!prompt.trim()) {
    throw new Error("Prompt is required to generate an image.");
  }

  const ai = new GoogleGenAI({apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY});

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: prompt,
    config: {
      systemInstruction: `Your job is to generate a cartoon-style sticker of the activity in the prompt. If a location is specified in the prompt, add an animated background of the location where appropriate. Use a vibrant color palette. 
      `
    }
  });

  const candidate = response.candidates?.[0];
  const parts = candidate?.content?.parts;
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
