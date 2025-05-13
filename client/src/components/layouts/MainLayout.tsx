import { useState, useEffect } from "react";
import Sidebar from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import NotificationCenter from "@/components/ui/notification-center";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { user, isLoading, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // If not authenticated and not on login page, render just the children
  if (!isAuthenticated && !isLoading && window.location.pathname !== "/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden lg:flex" />

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top navigation */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <div className="w-full flex md:ml-0">
                <label htmlFor="search-field" className="sr-only">Buscar</label>
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-3">
                    <Search className="h-5 w-5" />
                  </div>
                  <Input
                    id="search-field"
                    name="search-field"
                    className="block w-full h-full pl-10 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent focus:placeholder-gray-400 sm:text-sm"
                    placeholder="Buscar cenários, especialidades..."
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button 
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setSearchQuery('')}
                    >
                      <X className="h-4 w-4 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <NotificationCenter />

              {/* Profile dropdown */}
              <div className="ml-3 relative">
                {isLoading ? (
                  <Skeleton className="h-8 w-8 rounded-full" />
                ) : (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImageUrl || undefined} alt="Foto de perfil" />
                    <AvatarFallback>
                      {user ? (user.firstName?.[0] || 'U') : 'U'}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
