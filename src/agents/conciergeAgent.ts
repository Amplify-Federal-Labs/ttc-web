import BaseAgent from "./baseAgent";
import { CONCIERGE_AGENT_PROMPT } from "../prompts/systemPrompts";
import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL || 'https://api.openai.com';

const axiosClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    }
});

const conciergeAgent = new BaseAgent(axiosClient, CONCIERGE_AGENT_PROMPT);

export default conciergeAgent;