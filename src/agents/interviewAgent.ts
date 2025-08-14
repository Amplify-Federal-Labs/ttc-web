import { INTERVIEW_AGENT_PROMPT } from "../prompts/systemPrompts";
import BaseAgent from "./baseAgent";
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: import.meta.env.VITE_OPEN_AI_APIKEY, // This is the default and can be omitted
    dangerouslyAllowBrowser: true
});

const INITIAL_PROMPT = "Hello there! I'm here to help you find the perfect gift for someone special. Could you start by telling me a little about who this gift is for? For instance, what’s your relationship to them?";

const interviewAgent = new BaseAgent(client, INTERVIEW_AGENT_PROMPT, INITIAL_PROMPT);

export default interviewAgent;