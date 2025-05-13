import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartPulseIcon } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

export default function Login() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-6">
            <HeartPulseIcon className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">SanusXPRO</CardTitle>
          <p className="text-sm text-gray-500 mt-2">
            Plataforma completa de preparação para residência médica
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-700">
              Bem-vindo à sua plataforma de treinamento para o Revalida. Faça login para acessar checklists práticos, simulados e monitore seu desempenho.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => window.location.href = "/api/login"}
              disabled={isLoading}
            >
              {isLoading ? "Carregando..." : "Entrar com Replit"}
            </Button>

            <p className="text-center text-xs text-gray-500 mt-4">
              Ao fazer login você concorda com os <a href="#" className="underline">Termos de Uso</a> e <a href="#" className="underline">Política de Privacidade</a>.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
