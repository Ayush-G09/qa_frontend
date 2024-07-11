import { jwtDecode } from "jwt-decode";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "@langchain/core/documents";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import pdfToText from "react-pdftotext";
import { PromptTemplate } from "@langchain/core/prompts";

export function getGreeting() {
  const now = new Date();
  const hours = now.getHours();

  if (hours < 12) {
    return "Good Morning";
  } else if (hours < 18) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
}

export function validateEmail(email: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function isTokenValid(token: string) {
  if (!token) {
    return false;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp) {
      return decoded.exp > currentTime;
    }
    return false;
  } catch (e) {
    return false;
  }
}

export function checkAuthToken() {
  const token = localStorage.getItem("authToken");
  if (token) {
    return isTokenValid(token);
  }
  return false;
}

export function truncateString(str: string) {
  // Check if string length is greater than 10
  if (str.length > 20) {
    // Truncate the string and add '...'
    return str.substring(0, 20) + "...";
  } else {
    // If length is 10 or less, return the original string
    return str;
  }
}

export const split = async (text: string) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });

  const output = await splitter.createDocuments([text]);

  const content = output.map((item) => item.pageContent);

  return content;
};

export const saveEmbeddings = async (
  content: string[],
  conversationId: string,
  apiKey: string
) => {
  const docs = content.map(
    (value) =>
      new Document({
        metadata: { conversationId },
        pageContent: value,
      })
  );

  const pinecone = new Pinecone({
    apiKey: process.env.EACT_APP_PINECONE_API_KEY!,
  });

  const pineconeIndex = pinecone.Index(process.env.EACT_APP_PINECONE_INDEX!);

  const openAIEmbeddings = new OpenAIEmbeddings({
    openAIApiKey: apiKey,
  });

  try {
    await PineconeStore.fromDocuments(docs, openAIEmbeddings, {
      pineconeIndex,
      maxConcurrency: 5,
    });
    return true;
  } catch {
    return false;
  }
};

export const getText = async (file: File) => {
  try {
    const text = await pdfToText(file);
    return text;
  } catch {
    return null;
  }
};

export const ask = async (
  conversationId: string,
  question: string,
  apiKey: string
) => {
  const openAIEmbeddings = new OpenAIEmbeddings({
    openAIApiKey: apiKey,
  });

  const pinecone = new Pinecone({
    apiKey: process.env.EACT_APP_PINECONE_API_KEY!,
  });

  const pineconeIndex = pinecone.Index(process.env.EACT_APP_PINECONE_INDEX!);

  const vectorStore = await PineconeStore.fromExistingIndex(openAIEmbeddings, {
    pineconeIndex,
  });

  const llm = new ChatOpenAI({
    openAIApiKey: apiKey,
  });

  const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given question based on the context provided. Try to find the answer in the context. If you really don't know the answer, say "I am sorry, I don't know the answer to that" and direct the questioner to email at ayushgokhle@gmail.com. Don't try to make up an answer. Always speak as if you were chatting to a friend.
  context: {context}
  question: {question}
  answer: 
  `;

  const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

  const answerChain = answerPrompt.pipe(llm);

  const standaloneQuestionTemplate =
    "Given a question, convert it into a standalone question. question: {question} standalone question";

  const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
    standaloneQuestionTemplate
  );

  const questionChain = standaloneQuestionPrompt.pipe(llm);

  try {
    const res = await questionChain.invoke({
      question: question,
    });

    const results = await vectorStore.similaritySearch(
      res.content as string,
      10,
      {
        conversationId,
      }
    );

    const context = results.map((con) => con.pageContent).join("\n\n");

    const answer = await answerChain.invoke({
      context,
      question: res.content as string,
    });

    return answer;
  } catch {
    return false;
  }
};
