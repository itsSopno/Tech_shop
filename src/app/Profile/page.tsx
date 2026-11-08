"use client";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { motion, useReducedMotion } from "framer-motion";
import { UploadCloud } from "lucide-react";
import { FormEvent, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useGlobalContext, IUserData } from "@/context/globalContext";

export default function GlassProfileSettingsCard() {
  const shouldReduceMotion = useReducedMotion();
  const { data: session } = useSession();
  const { allUsers } = useGlobalContext();

  const currentUserData = allUsers?.find(
    (user: IUserData) => user.email === session?.user?.email
  );

  const [notifications, setNotifications] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  
  const [bio, setBio] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (currentUserData) {
      setBio(currentUserData.Bio || "");
      setFirstName(currentUserData.name || session?.user?.name?.split(" ")[0] || "");
      setLastName(currentUserData.lastName || session?.user?.name?.split(" ").slice(1).join(" ") || "");
      setPhone(currentUserData.phoneNumber ? String(currentUserData.phoneNumber) : "");
    } else if (session?.user) {
      setFirstName(session.user.name?.split(" ")[0] || "");
      setLastName(session.user.name?.split(" ").slice(1).join(" ") || "");
    }
  }, [currentUserData, session]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const userImage = currentUserData?.image || session?.user?.image || "";

  return (
    <div className="min-h-screen bg-[#DEDEDE] flex items-center justify-center p-6 pt-32 pb-24">
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.45,
          ease: shouldReduceMotion ? "linear" : [0.16, 1, 0.3, 1],
        }}
        className="group w-full max-w-3xl rounded-[40px] overflow-hidden border border-[#4D4D4D]/20 bg-[#EAEAEA] p-8 backdrop-blur-2xl sm:p-12 relative shadow-2xl"
        aria-labelledby="glass-profile-settings-title"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-[#f25623]/[0.05] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-10"
        />
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#f25623]/30 bg-[#f25623]/10 px-3 py-1 font-jetbrains-mono text-[10px] uppercase tracking-[0.28em] text-[#f25623]">
              Settings_Node
            </div>
            <h1
              id="glass-profile-settings-title"
              className="mt-4 text-4xl font-bebas tracking-widest text-[#4D4D4D] sm:text-5xl uppercase italic"
            >
              System Profile
            </h1>
            <p className="mt-2 text-xs font-mono tracking-[0.2em] uppercase text-[#4D4D4D]/50">
              Update Identity Hash, Comm Links &amp; Subscriptions.
            </p>
          </div>
          <Badge className="group gap-2 rounded-full border border-[#4D4D4D]/20 bg-[#4D4D4D]/5 px-4 py-2 font-mono text-[10px] tracking-[0.2em] uppercase text-[#4D4D4D]/60 transition-colors duration-300 hover:border-[#f25623]/60 hover:bg-[#f25623]/15 hover:text-[#f25623]">
            <span className="h-2 w-2 rounded-full bg-[#f25623] animate-pulse" aria-hidden />
            Auto-Sync_Online
          </Badge>
        </div>

        <form className="grid gap-8 sm:grid-cols-5" onSubmit={handleSubmit}>
          <div className="sm:col-span-2">
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-[#4D4D4D]/10 bg-[#DEDEDE]/60 p-6 backdrop-blur">
              <Avatar className="h-28 w-28 border-2 border-[#f25623]/50 shadow-[0_0_30px_rgba(242,86,35,0.2)]">
                {userImage ? (
                  <img src={userImage} alt="Profile" className="object-cover w-full h-full" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center rounded-full bg-[#f25623]/20 text-4xl font-bebas text-[#f25623]">
                    {firstName?.[0] || session?.user?.email?.[0]?.toUpperCase() || "X"}
                  </span>
                )}
              </Avatar>
              <div className="text-center mt-2">
                <p className="text-xl font-bebas tracking-wider text-[#4D4D4D] uppercase">{firstName} {lastName}</p>
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#f25623]">
                  {(currentUserData as any)?.role || "Standard_Operator"}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-[#4D4D4D]/20 bg-[#4D4D4D]/5 px-4 py-2 text-xs font-mono uppercase tracking-widest text-[#4D4D4D]/80 hover:bg-[#4D4D4D]/10 hover:text-[#4D4D4D] transition-all mt-2"
              >
                <UploadCloud className="mr-2 h-4 w-4 text-[#f25623]" />
                Override Image
              </Button>
            </div>
          </div>

          <div className="space-y-6 sm:col-span-3">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="profile-first-name" className="font-mono text-[10px] tracking-widest uppercase text-[#4D4D4D]/60">First name</Label>
                <Input
                  id="profile-first-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-12 rounded-xl border-[#4D4D4D]/20 bg-[#DEDEDE]/60 px-4 text-[#4D4D4D] focus-visible:ring-[#f25623]"
                  autoComplete="given-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-last-name" className="font-mono text-[10px] tracking-widest uppercase text-[#4D4D4D]/60">Last name</Label>
                <Input
                  id="profile-last-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="h-12 rounded-xl border-[#4D4D4D]/20 bg-[#DEDEDE]/60 px-4 text-[#4D4D4D] focus-visible:ring-[#f25623]"
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="profile-email" className="font-mono text-[10px] tracking-widest uppercase text-[#4D4D4D]/60">Email address</Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={session?.user?.email || ""}
                  disabled
                  className="h-12 rounded-xl border-[#4D4D4D]/20 bg-[#DEDEDE]/30 px-4 text-[#4D4D4D]/40 cursor-not-allowed"
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-phone" className="font-mono text-[10px] tracking-widest uppercase text-[#4D4D4D]/60">Comms Link</Label>
                <Input
                  id="profile-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+00 XXXXXX"
                  className="h-12 rounded-xl border-[#4D4D4D]/20 bg-[#DEDEDE]/60 px-4 text-[#4D4D4D] focus-visible:ring-[#f25623]"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-bio" className="font-mono text-[10px] tracking-widest uppercase text-[#4D4D4D]/60">Bio_Trace</Label>
              <Textarea
                id="profile-bio"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                rows={4}
                className="rounded-xl border-[#4D4D4D]/20 bg-[#DEDEDE]/60 px-4 py-4 text-sm text-[#4D4D4D] focus-visible:ring-[#f25623] resize-none"
                placeholder="Declare your objectives..."
              />
              <p className="text-right text-[10px] font-mono text-[#4D4D4D]/40">
                {bio.length}/160 
              </p>
            </div>

            <div className="rounded-2xl border border-[#4D4D4D]/10 bg-[#DEDEDE]/60 p-6 backdrop-blur">
              <h2 className="text-sm font-bebas tracking-widest uppercase text-[#f25623] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f25623] animate-pulse"></span>
                System Relays
              </h2>
              <p className="mb-6 mt-1 text-[10px] font-mono tracking-widest uppercase text-[#4D4D4D]/50">
                Configure data ping preferences.
              </p>
              <div className="space-y-4">
                <label className="flex items-center justify-between gap-3 text-xs font-mono uppercase tracking-wider text-[#4D4D4D]/70 cursor-pointer group">
                  <span className="group-hover:text-[#f25623] transition-colors">Alert Transmissions</span>
                  <Switch
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </label>
                <label className="flex items-center justify-between gap-3 text-xs font-mono uppercase tracking-wider text-[#4D4D4D]/70 cursor-pointer group">
                  <span className="group-hover:text-[#f25623] transition-colors">Tech_Log Newsletter</span>
                  <Switch checked={newsletter} onCheckedChange={setNewsletter} />
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end mt-4">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-[#4D4D4D]/20 bg-transparent px-8 py-6 text-xs font-mono uppercase tracking-widest text-[#4D4D4D]/60 hover:text-[#4D4D4D] hover:bg-[#4D4D4D]/5"
                onClick={() => window.location.reload()}
              >
                Abort
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-[#f25623] px-8 py-6 text-xs font-mono uppercase tracking-widest text-white shadow-[0_10px_30px_rgba(242,86,35,0.3)] transition-all duration-300 hover:bg-[#d94514] hover:shadow-[0_10px_40px_rgba(242,86,35,0.5)] border border-[#f25623]"
              >
                Commit Changes
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
