import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Layout } from "../../components/layout/Layout";
import { ChatContainer } from "../../components/chat/ChatContainer";
import { conversationsService } from "../../services/conversations";
import { projectsService } from "../../services/projects";
import { Button } from "../../components/ui/Button";
import { ArrowRight, Save } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function Explore() {
  const { t } = useTranslation();
  const { projectId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (user && projectId) {
      loadData();
    }
  }, [user, projectId]);

  const loadData = async () => {
    try {
      const [projectData, conversationData] = await Promise.all([
        projectsService.getOne(projectId, user.id),
        conversationsService.get(projectId, user.id),
      ]);

      setProject(projectData);
      setMessages(conversationData.messages || []);

      // If no messages, send initial greeting
      if (
        !conversationData.messages ||
        conversationData.messages.length === 0
      ) {
        await sendInitialMessage(projectData);
      }
    } catch (error) {
      console.error(error);
      toast.error(t("project.load_error"));
    } finally {
      setLoading(false);
    }
  };

  const sendInitialMessage = async (projectData) => {
    setSending(true);
    try {
      const prompt = `Bonjour ! Je vois que tu veux écrire une histoire intitulée "${projectData.title}". C'est un projet de type ${projectData.style} pour ${projectData.target_audience}. Raconte-moi un peu ton idée !`;

      // We simulate AI response for the first message to start conversation
      // In a real app, we might want to trigger this from backend
      const initialMsg = {
        role: "assistant",
        content: prompt,
        timestamp: new Date().toISOString(),
      };

      setMessages([initialMsg]);
      // We don't save this initial message to DB yet, it will be saved when user replies or we can save it now.
      // For simplicity, let's just show it.
    } finally {
      setSending(false);
    }
  };

  const handleSendMessage = async (content) => {
    setSending(true);
    try {
      // Optimistic update
      const userMsg = {
        role: "user",
        content,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);

      const response = await conversationsService.sendMessage(
        projectId,
        content,
        user.id
      );

      setMessages((prev) => [...prev, response.message]);
    } catch (error) {
      console.error(error);
      toast.error(t("project.load_error"));
    } finally {
      setSending(false);
    }
  };

  const handleNextPhase = () => {
    navigate(`/create/${projectId}/plan`);
  };

  if (loading) return <Layout>{t("project.loading")}</Layout>;

  return (
    <Layout>
      <div className="h-[calc(100vh-140px)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-orient-dark">
              {t("project.explore_title")} : {project?.title}
            </h1>
            <p className="text-sm text-gray-500">
              {t("project.explore_subtitle")}
            </p>
          </div>
          <Button onClick={handleNextPhase} variant="secondary">
            {t("project.next_plan")} <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/50 shadow-xl overflow-hidden">
          <ChatContainer
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={sending}
            placeholder={t("project.chat_placeholder")}
          />
        </div>
      </div>
    </Layout>
  );
}
