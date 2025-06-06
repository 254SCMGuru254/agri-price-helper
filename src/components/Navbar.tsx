
import { Link } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Carrot, User, Store, MessageCircle, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NetworkStatus } from "./NetworkStatus";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavigationLinks = () => (
    <>
      <Link 
        to="/business-marketplace" 
        className="flex items-center space-x-1 transition-colors hover:text-foreground/80 text-foreground/60"
        onClick={() => setMobileMenuOpen(false)}
      >
        <Store className="h-4 w-4" />
        <span>Business Marketplace</span>
      </Link>
      <Link 
        to="/#community" 
        className="flex items-center space-x-1 transition-colors hover:text-foreground/80 text-foreground/60"
        onClick={() => setMobileMenuOpen(false)}
      >
        <MessageCircle className="h-4 w-4" />
        <span>Community</span>
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <Carrot className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">
            AgriPrice Helper
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <NavigationLinks />
        </nav>
        
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <div className="flex flex-col space-y-4 mt-8">
                <NavigationLinks />
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="ml-auto flex items-center space-x-4">
          <NetworkStatus />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
                    <AvatarFallback>{user.user_metadata?.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/business-marketplace">
                    <Store className="mr-2 h-4 w-4" />
                    <span>My Business</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
