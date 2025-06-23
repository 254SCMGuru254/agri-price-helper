import { Link } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Carrot, User, Store, MessageCircle, Menu, Award, TrendingUp, Users, Phone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NetworkStatus } from "./NetworkStatus";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/components/LanguageProvider";
import { UserPoints } from "@/components/UserPoints";

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const { translate } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavigationLinks = () => (
    <>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Market</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
                <div className="grid gap-2">
                  <Link 
                    to="/#market-prices" 
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="text-sm font-medium leading-none">Market Prices</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      View and submit current market prices
                    </p>
                  </Link>
                  <Link 
                    to="/#analytics" 
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="text-sm font-medium leading-none">Price Analytics</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      View market trends and analytics
                    </p>
                  </Link>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link 
              to="/business-marketplace" 
              className={cn(navigationMenuTriggerStyle(), "flex items-center space-x-1")}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Store className="h-4 w-4" />
              <span>Business</span>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link 
              to="/#community" 
              className={cn(navigationMenuTriggerStyle(), "flex items-center space-x-1")}
              onClick={() => setMobileMenuOpen(false)}
            >
              <MessageCircle className="h-4 w-4" />
              <span>Community</span>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>More</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-3 p-6 md:w-[300px]">
                <div className="grid gap-2">
                  <Link 
                    to="/#points" 
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="text-sm font-medium leading-none flex items-center">
                      <Award className="h-4 w-4 mr-1" />
                      Points System
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Earn points for contributing to the community
                    </p>
                  </Link>
                  <Link 
                    to="/#features" 
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="text-sm font-medium leading-none">Features</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Discover all platform features
                    </p>
                  </Link>
                  <Link 
                    to="/#how-it-works" 
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="text-sm font-medium leading-none">How It Works</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Learn how to use the platform
                    </p>
                  </Link>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );

  const MobileNavigationLinks = () => (
    <div className="flex flex-col space-y-4 mt-8">
      <Link 
        to="/#market-prices" 
        className="flex items-center space-x-2 transition-colors hover:text-foreground/80 text-foreground/60"
        onClick={() => setMobileMenuOpen(false)}
      >
        <TrendingUp className="h-4 w-4" />
        <span>Market Prices</span>
      </Link>
      <Link 
        to="/business-marketplace" 
        className="flex items-center space-x-2 transition-colors hover:text-foreground/80 text-foreground/60"
        onClick={() => setMobileMenuOpen(false)}
      >
        <Store className="h-4 w-4" />
        <span>Business Marketplace</span>
      </Link>
      <Link 
        to="/#community" 
        className="flex items-center space-x-2 transition-colors hover:text-foreground/80 text-foreground/60"
        onClick={() => setMobileMenuOpen(false)}
      >
        <MessageCircle className="h-4 w-4" />
        <span>Community Forum</span>
      </Link>
      <Link 
        to="/#points" 
        className="flex items-center space-x-2 transition-colors hover:text-foreground/80 text-foreground/60"
        onClick={() => setMobileMenuOpen(false)}
      >
        <Award className="h-4 w-4" />
        <span>Points System</span>
      </Link>
      <Link 
        to="/#features" 
        className="flex items-center space-x-2 transition-colors hover:text-foreground/80 text-foreground/60"
        onClick={() => setMobileMenuOpen(false)}
      >
        <Users className="h-4 w-4" />
        <span>Features</span>
      </Link>
      <Link 
        to="/#how-it-works" 
        className="flex items-center space-x-2 transition-colors hover:text-foreground/80 text-foreground/60"
        onClick={() => setMobileMenuOpen(false)}
      >
        <Phone className="h-4 w-4" />
        <span>How It Works</span>
      </Link>
    </div>
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
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium flex-1">
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
              <MobileNavigationLinks />
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="ml-auto flex items-center space-x-4">
          <NetworkStatus />
          <LanguageSelector />
          {user ? (
            <>
              <UserPoints />
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
                  <DropdownMenuItem asChild>
                    <Link to="/#points">
                      <Award className="mr-2 h-4 w-4" />
                      <span>My Points</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link to="/auth">
              <Button>{translate('common.signIn')}</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
