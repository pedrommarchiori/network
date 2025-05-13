import { useQuery } from "@tanstack/react-query";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { PracticeRecommendations } from "@/components/dashboard/PracticeRecommendations";
import { AvailableScenarios } from "@/components/dashboard/AvailableScenarios";
import { PerformanceAnalytics } from "@/components/dashboard/PerformanceAnalytics";
import { RankingSection } from "@/components/dashboard/RankingSection";
import { 
  BarChart2, 
  ClipboardCheckIcon, 
  Clock, 
  Users 
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/dashboard"],
  });

  // Default images for specialty cards
  const specialtyImages = {
    clinical: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
    surgery: "https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
    obstetrics: "https://images.unsplash.com/photo-1558960214-f4283a743867?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
    gynecology: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
    pediatrics: "https://images.unsplash.com/photo-1579684453423-f84349ef60b0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
    preventive: "https://images.unsplash.com/photo-1581056771107-24247a210aca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
  };

  // Fake data for development
  const mockScenarios = [
    {
      id: 1,
      name: "Clínica",
      code: "clinical",
      imageUrl: specialtyImages.clinical,
      difficulty: "medium" as const,
      practiceCount: 21,
      scenarioCount: 12,
    },
    {
      id: 2,
      name: "Cirurgia",
      code: "surgery",
      imageUrl: specialtyImages.surgery,
      difficulty: "hard" as const,
      practiceCount: 18,
      scenarioCount: 15,
    },
    {
      id: 3,
      name: "GO - Obstetrícia",
      code: "obstetrics",
      imageUrl: specialtyImages.obstetrics,
      difficulty: "medium" as const,
      practiceCount: 8,
      scenarioCount: 8,
    },
  ];

  const mockRecommendations = [
    {
      id: 1,
      title: "Infecção de Sítio Cirúrgico | INEP 2023.1",
      lastAttemptDate: "06/05/2025",
      bestScore: 6.7,
      specialtyCode: "clinical",
    },
    {
      id: 2,
      title: "Escroto Agudo - Torção Testicular II",
      lastAttemptDate: "25/03/2025",
      bestScore: 6.5,
      specialtyCode: "surgery",
    },
    {
      id: 3,
      title: "Abdome Agudo Obstrutivo - Obstrução Intestinal Alta",
      lastAttemptDate: "21/04/2025",
      bestScore: 6.7,
      specialtyCode: "surgery",
    },
  ];

  const mockSpecialtyPerformance = [
    {
      specialtyName: "Clínica",
      attempts: 2,
      userScore: 3.3,
      averageScore: 2.1,
    },
    {
      specialtyName: "Cirurgia",
      attempts: 1,
      userScore: 0.0,
      averageScore: 1.2,
    },
    {
      specialtyName: "GO - Obstetrícia",
      attempts: 0,
      userScore: 0.0,
      averageScore: 3.2,
    },
    {
      specialtyName: "GO - Ginecologia",
      attempts: 1,
      userScore: 0.0,
      averageScore: 2.0,
    },
  ];

  const mockCategoryPerformance = [
    { categoryName: "Anamnese", percentage: 85 },
    { categoryName: "Apresentação", percentage: 100 },
    { categoryName: "Conduta", percentage: 75 },
    { categoryName: "Diagnóstico", percentage: 86 },
    { categoryName: "Exame Físico", percentage: 90 },
    { categoryName: "História Patológica", percentage: 0 },
  ];

  const mockRankingUsers = [
    {
      id: "1",
      firstName: "Alan",
      lastName: "dos Santos Costa",
      profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      rank: 1,
      score: 6.04,
      medal: "medal-gold" as const,
    },
    {
      id: "2",
      firstName: "Sávio",
      lastName: "Rocha de Santana",
      profileImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      rank: 2,
      score: 5.98,
      medal: "medal-silver" as const,
    },
    {
      id: "3",
      firstName: "Cesar",
      lastName: "Silva",
      profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      rank: 3,
      score: 5.88,
      medal: "medal-bronze" as const,
    },
    {
      id: "4",
      firstName: "Marcelo",
      lastName: "Correia Silva",
      profileImageUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      rank: 4,
      score: 5.87,
    },
    {
      id: "5",
      firstName: "Juscelino",
      lastName: "Junior",
      profileImageUrl: "",
      rank: 5,
      score: 5.85,
    },
  ];

  const mockCurrentUser = {
    id: user?.id || "current_user",
    firstName: user?.firstName || "Pedro",
    lastName: user?.lastName || "Machado Marchiori",
    profileImageUrl: user?.profileImageUrl,
    rank: 723,
    score: 0,
  };

  return (
    <div className="py-6">
      <WelcomeHeader 
        userName={dashboardData?.user?.firstName ? `Dr. ${dashboardData.user.firstName} ${dashboardData.user.lastName}` : `Dr. ${user?.firstName} ${user?.lastName}`}
        lastActivity={new Date()}
        isLoading={isLoading}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Performance Overview Section */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-4">
          <StatCard
            title="Nota Geral"
            value={dashboardData?.user?.score || "7.7"}
            icon={<BarChart2 className="h-6 w-6 text-primary-600" />}
            trend={{ value: "0.5", positive: true }}
            iconBgColor="bg-primary-100"
          />

          <StatCard
            title="Práticas Realizadas"
            value={dashboardData?.user?.practiceCount || "73"}
            icon={<ClipboardCheckIcon className="h-6 w-6 text-green-600" />}
            trend={{ value: "12", positive: true }}
            iconBgColor="bg-green-100"
          />

          <StatCard
            title="Tempo de Estudo"
            value={dashboardData?.user?.studyTimeMinutes ? `${Math.floor(dashboardData.user.studyTimeMinutes / 60)}h` : "48h"}
            icon={<Clock className="h-6 w-6 text-indigo-600" />}
            trend={{ value: "5h", positive: true }}
            iconBgColor="bg-indigo-100"
          />

          <StatCard
            title="Ranking"
            value={dashboardData?.user?.rank ? `${dashboardData.user.rank}º` : "723º"}
            icon={<Users className="h-6 w-6 text-yellow-600" />}
            trend={{ value: "12", positive: false }}
            iconBgColor="bg-yellow-100"
          />
        </div>

        <PracticeRecommendations 
          recommendations={dashboardData?.recommendations || mockRecommendations} 
          isLoading={isLoading}
        />

        <AvailableScenarios 
          scenarios={dashboardData?.availableScenarios || mockScenarios} 
          isLoading={isLoading}
        />

        <PerformanceAnalytics
          specialtyPerformance={dashboardData?.specialtyPerformance || mockSpecialtyPerformance}
          categoryPerformance={dashboardData?.categoryPerformance || mockCategoryPerformance}
          isLoading={isLoading}
        />

        <RankingSection
          users={dashboardData?.ranking || mockRankingUsers}
          currentUser={dashboardData?.user ? {
            id: dashboardData.user.id,
            firstName: dashboardData.user.firstName || "",
            lastName: dashboardData.user.lastName || "",
            profileImageUrl: dashboardData.user.profileImageUrl,
            rank: dashboardData.user.rank || 0,
            score: dashboardData.user.score || 0,
          } : mockCurrentUser}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
