import BaseAgent from "./baseAgent";
import { CONCIERGE_AGENT_PROMPT } from "../prompts/systemPrompts";
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: import.meta.env.VITE_OPEN_AI_APIKEY,
    dangerouslyAllowBrowser: true
});

const conciergeAgent = new BaseAgent(client, CONCIERGE_AGENT_PROMPT);

export default conciergeAgent;