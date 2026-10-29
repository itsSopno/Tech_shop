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
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 pt-32 pb-24">
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.45,
          ease: shouldReduceMotion ? "linear" : [0.16, 1, 0.3, 1],
        }}
        className="group w-full max-w-3xl rounded-[40px] overflow-hidden border border-white/10 bg-white/[0.02] p-8 backdrop-blur-2xl sm:p-12 relative shadow-2xl"
        aria-labelledby="glass-profile-settings-title"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-10"
        />
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 font-jetbrains-mono text-[10px] uppercase tracking-[0.28em] text-indigo-500">
              Settings_Node
            </div>
            <h1
              id="glass-profile-settings-title"
              className="mt-4 text-4xl font-bebas tracking-widest text-white sm:text-5xl uppercase italic"
            >
              System Profile
            </h1>
            <p className="mt-2 text-xs font-mono tracking-[0.2em] uppercase text-white/40">
              Update Identity Hash, Comm Links & Subscriptions.
            </p>
          </div>
          <Badge className="group gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 transition-colors duration-300 hover:border-indigo-500/60 hover:bg-indigo-500/15 hover:text-indigo-400">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" aria-hidden />
            Auto-Sync_Online
          </Badge>
        </div>

        <form className="grid gap-8 sm:grid-cols-5" onSubmit={handleSubmit}>
          <div className="sm:col-span-2">
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/5 bg-black/40 p-6 backdrop-blur">
              <Avatar className="h-28 w-28 border-2 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                {userImage ? (
                  <img src={userImage} alt="Profile" className="object-cover w-full h-full" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center rounded-full bg-indigo-500/20 text-4xl font-bebas text-indigo-500">
                    {firstName?.[0] || session?.user?.email?.[0]?.toUpperCase() || "X"}
                  </span>
                )}
              </Avatar>
              <div className="text-center mt-2">
                <p className="text-xl font-bebas tracking-wider text-white uppercase">{firstName} {lastName}</p>
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-indigo-500">
                  {(currentUserData as any)?.role || "Standard_Operator"}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-white/10 bg-white/5 px-4 py-2 text-xs font-mono uppercase tracking-widest text-white/80 hover:bg-white/10 hover:text-white transition-all mt-2"
              >
                <UploadCloud className="mr-2 h-4 w-4 text-indigo-500" />
                Override Image
              </Button>
            </div>
          </div>

          <div className="space-y-6 sm:col-span-3">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="profile-first-name" className="font-mono text-[10px] tracking-widest uppercase text-white/50">First name</Label>
                <Input
                  id="profile-first-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-12 rounded-xl border-white/10 bg-black/40 px-4 text-white focus-visible:ring-indigo-500"
                  autoComplete="given-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-last-name" className="font-mono text-[10px] tracking-widest uppercase text-white/50">Last name</Label>
                <Input
                  id="profile-last-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="h-12 rounded-xl border-white/10 bg-black/40 px-4 text-white focus-visible:ring-indigo-500"
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="profile-email" className="font-mono text-[10px] tracking-widest uppercase text-white/50">Email address</Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={session?.user?.email || ""}
                  disabled
                  className="h-12 rounded-xl border-white/10 bg-white/[0.02] px-4 text-white/30 cursor-not-allowed"
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-phone" className="font-mono text-[10px] tracking-widest uppercase text-white/50">Comms Link</Label>
                <Input
                  id="profile-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+00 XXXXXX"
                  className="h-12 rounded-xl border-white/10 bg-black/40 px-4 text-white focus-visible:ring-indigo-500"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-bio" className="font-mono text-[10px] tracking-widest uppercase text-white/50">Bio_Trace</Label>
              <Textarea
                id="profile-bio"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                rows={4}
                className="rounded-xl border-white/10 bg-black/40 px-4 py-4 text-sm text-white focus-visible:ring-indigo-500 resize-none"
                placeholder="Declare your objectives..."
              />
              <p className="text-right text-[10px] font-mono text-white/30">
                {bio.length}/160 
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-black/40 p-6 backdrop-blur">
              <h2 className="text-sm font-bebas tracking-widest uppercase text-indigo-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                System Relays
              </h2>
              <p className="mb-6 mt-1 text-[10px] font-mono tracking-widest uppercase text-white/40">
                Configure data ping preferences.
              </p>
              <div className="space-y-4">
                <label className="flex items-center justify-between gap-3 text-xs font-mono uppercase tracking-wider text-white/70 cursor-pointer group">
                  <span className="group-hover:text-indigo-400 transition-colors">Alert Transmissions</span>
                  <Switch
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </label>
                <label className="flex items-center justify-between gap-3 text-xs font-mono uppercase tracking-wider text-white/70 cursor-pointer group">
                  <span className="group-hover:text-indigo-400 transition-colors">Tech_Log Newsletter</span>
                  <Switch checked={newsletter} onCheckedChange={setNewsletter} />
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end mt-4">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-white/10 bg-transparent px-8 py-6 text-xs font-mono uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/5"
                onClick={() => window.location.reload()}
              >
                Abort
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-indigo-500 px-8 py-6 text-xs font-mono uppercase tracking-widest text-black shadow-[0_10px_30px_rgba(99,102,241,0.3)] transition-all duration-300 hover:bg-indigo-400 hover:shadow-[0_10px_40px_rgba(99,102,241,0.5)] border border-indigo-400"
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
