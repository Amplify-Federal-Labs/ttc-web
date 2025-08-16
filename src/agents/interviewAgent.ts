import { INTERVIEW_AGENT_PROMPT } from "../prompts/systemPrompts";
import BaseAgent from "./baseAgent";
import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL || 'https://api.openai.com';

const axiosClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    }
});

const INITIAL_PROMPT = "Hello there! I'm here to help you find the perfect gift for someone special. Could you start by telling me a little about who this gift is for? For instance, what's your relationship to them?";

const interviewAgent = new BaseAgent(axiosClient, INTERVIEW_AGENT_PROMPT, INITIAL_PROMPT);

export default interviewAgent;