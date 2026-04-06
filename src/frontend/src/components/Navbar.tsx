import { Button } from "@/components/ui/button";
import { Compass, LogIn, LogOut, User } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface NavbarProps {
  onPlayNow: () => void;
}

export function Navbar({ onPlayNow }: NavbarProps) {
  const { identity, login, clear, isLoggingIn, isInitializing, loginStatus } =
    useInternetIdentity();
  const isLoggedIn =
    loginStatus === "success" ||
    (!!identity && !identity.getPrincipal().isAnonymous());

  return (
    <nav
      className="sticky top-0 z-50 w-full"
      style={{
        background: "oklch(0.16 0.042 238)",
        borderBottom: "1px solid oklch(0.28 0.04 230)",
      }}
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3" data-ocid="nav.link">
            <img
              src="/assets/generated/questopolis-logo-transparent.dim_120x120.png"
              alt="Questopolis"
              className="h-9 w-9 object-contain"
            />
            <span className="font-brand text-xl text-white tracking-widest">
              QUESTOPOLIS
            </span>
          </div>

          {/* Center nav links */}
          <div className="hidden md:flex items-center gap-6">
            {["Home", "Play", "Leaderboards", "How to Play"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={item === "Play" ? onPlayNow : undefined}
                className="text-sm font-medium transition-colors"
                style={{ color: "oklch(0.62 0.04 225)" }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color =
                    "oklch(0.72 0.18 193)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color =
                    "oklch(0.62 0.04 225)";
                }}
                data-ocid="nav.link"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {isInitializing ? (
              <div
                className="h-8 w-8 rounded-full animate-pulse"
                style={{ background: "oklch(0.28 0.04 230)" }}
              />
            ) : isLoggedIn ? (
              <>
                <div
                  className="flex items-center gap-2"
                  style={{ color: "oklch(0.62 0.04 225)" }}
                >
                  <User size={18} />
                  <span className="hidden sm:inline text-sm">Profile</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clear}
                  className="gap-1"
                  style={{ color: "oklch(0.62 0.04 225)" }}
                  data-ocid="nav.link"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={login}
                disabled={isLoggingIn}
                className="gap-1"
                style={{ color: "oklch(0.62 0.04 225)" }}
                data-ocid="nav.link"
              >
                <LogIn size={16} />
                <span className="hidden sm:inline">
                  {isLoggingIn ? "Signing in..." : "Sign In"}
                </span>
              </Button>
            )}
            <Button
              onClick={onPlayNow}
              size="sm"
              className="font-semibold tracking-wide border transition-all"
              style={{
                background: "transparent",
                borderColor: "oklch(0.72 0.18 193)",
                color: "oklch(0.72 0.18 193)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "oklch(0.72 0.18 193)";
                (e.currentTarget as HTMLElement).style.color =
                  "oklch(0.1 0.03 240)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "transparent";
                (e.currentTarget as HTMLElement).style.color =
                  "oklch(0.72 0.18 193)";
              }}
              data-ocid="nav.primary_button"
            >
              PLAY NOW
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Suppress unused import warning - Compass is available for future use
void Compass;
