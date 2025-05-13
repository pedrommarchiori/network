import { Card } from "@/components/ui/card";
import { AvatarWithStatus } from "@/components/ui/avatar-with-status";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";

interface RankingUser {
  id: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  rank: number;
  score: number;
  medal?: "medal-gold" | "medal-silver" | "medal-bronze";
}

interface RankingSectionProps {
  users: RankingUser[];
  currentUser?: RankingUser;
  isLoading?: boolean;
}

export function RankingSection({ users, currentUser, isLoading = false }: RankingSectionProps) {
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="mt-8">
        <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Ranking - Top 5</h2>
        <Card>
          <ul className="divide-y divide-gray-200">
            {[1, 2, 3, 4, 5].map((i) => (
              <li key={i} className="px-4 py-4 sm:px-6 flex items-center justify-between">
                <div className="flex items-center">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="ml-4">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-16 mt-1" />
                  </div>
                </div>
                <div className="flex items-center">
                  <Skeleton className="h-4 w-10" />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Ranking - Top 5</h2>
      <Card>
        <ul className="divide-y divide-gray-200">
          {users.map((rankingUser, index) => {
            const isCurrentUser = rankingUser.id === user?.id;
            let bgClass = "";

            if (index === 0) bgClass = "bg-yellow-50";
            else if (index === 1) bgClass = "bg-gray-50";

            return (
              <li
                key={rankingUser.id}
                className={`px-4 py-4 sm:px-6 flex items-center justify-between ${bgClass} ${
                  isCurrentUser ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-center">
                  <AvatarWithStatus
                    src={rankingUser.profileImageUrl}
                    alt={`${rankingUser.firstName} ${rankingUser.lastName}`}
                    fallback={rankingUser.firstName?.[0] || "U"}
                    status={rankingUser.medal}
                  />
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {rankingUser.firstName} {rankingUser.lastName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {rankingUser.rank}º Lugar
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  {(index === 0 || index === 1 || index === 2) && (
                    <div className="flex-shrink-0 mr-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          index === 0
                            ? "bg-yellow-200 text-yellow-800"
                            : index === 1
                            ? "bg-gray-200 text-gray-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {index === 0 ? "OURO" : index === 1 ? "PRATA" : "BRONZE"}
                      </span>
                    </div>
                  )}
                  <div className="text-sm font-medium text-gray-900">{rankingUser.score.toFixed(2)}</div>
                </div>
              </li>
            );
          })}

          {currentUser && !users.some(u => u.id === currentUser.id) && (
            <li className="px-4 py-4 sm:px-6 flex items-center justify-between bg-gray-50">
              <div className="flex items-center">
                <AvatarWithStatus
                  src={currentUser.profileImageUrl}
                  alt={`${currentUser.firstName} ${currentUser.lastName}`}
                  fallback={currentUser.firstName?.[0] || "U"}
                />
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {currentUser.firstName} {currentUser.lastName}
                  </div>
                  <div className="text-xs text-gray-500">{currentUser.rank}º Lugar</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-sm font-medium text-gray-900">{currentUser.score.toFixed(2)}</div>
              </div>
            </li>
          )}
        </ul>
      </Card>
    </div>
  );
}
