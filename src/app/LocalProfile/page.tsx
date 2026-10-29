"use client";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Trash2, Edit3, X, Phone, MapPin, User, Loader2 } from "lucide-react";

const BASE_URL = "https://t-mark-4.onrender.com";

// --- Interfaces ---
interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

interface Payment {
    _id: string;
    userEmail: string;
    transactionId: string;
    totalAmount: number;
    paymentStatus: string;
    items: OrderItem[];
}

interface UserData {
    address?: string;
    phoneNumber?: string;
}

const LocalProfile = () => {
    const { data: session, status } = useSession();
    const [paymentData, setPaymentData] = useState<Payment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<string | null>(null);
    const [userData, setUserData] = useState<UserData>({ address: "", phoneNumber: "" });
    const [updateLoading, setUpdateLoading] = useState(false);

    const userEmail = session?.user?.email;
    const userImage = session?.user?.image;

    // --- Data Fetching Logic ---
    const fetchData = useCallback(async () => {
        if (status === "loading" || !userEmail) return;

        try {
            // 1. Fetch Transactions
            const payRes = await fetch(`${BASE_URL}/api/payment/paymentData`);
            const payResult = await payRes.json();
            const allPayments = payResult.data || payResult;
            if (Array.isArray(allPayments)) {
                setPaymentData(allPayments.filter((item: Payment) => item.userEmail === userEmail));
            }

            // 2. Fetch User Profile via Cookies
            const userRes = await fetch(`${BASE_URL}/api/getMe`, {
                method: "GET",
                credentials: "include",
            });

            if (userRes.ok) {
                const uData = await userRes.json();
                if (uData.user) {
                    setUserData({
                        address: uData.user.address || "",
                        phoneNumber: uData.user.phoneNumber?.toString() || "",
                    });
                }
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    }, [userEmail, status]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Handlers ---
    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdateLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/api/optional`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(userData),
            });

            if (res.ok) {
                setIsEditModalOpen(false);
                await fetchData();
            }
        } catch (err) {
            console.error("Update error:", err);
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleDeleteOrder = async (id: string) => {
        try {
            const res = await fetch(`${BASE_URL}/api/payment/delete/${id}`, {
                method: "DELETE",
                credentials: "include"
            });
            if (res.ok) {
                setPaymentData(prev => prev.filter(item => item._id !== id));
                setIsDeleteModalOpen(null);
            }
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    if (status === "loading" || loading)
        return (
            <div className="min-h-screen bg-black flex flex-col gap-4 items-center justify-center text-[#d9ff00] font-mono tracking-[0.4em] text-[10px]">
                <Loader2 className="animate-spin" size={20} />
                LOADING DATA...
            </div>
        );

    return (
        <section className="bg-[#050505] text-white min-h-screen flex items-center justify-center py-32 relative overflow-hidden font-inter">

            {/* Visual Flare */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#d9ff00]/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-4xl w-full px-6 relative z-10 flex flex-col items-center">

                {/* --- PROFILE HEADER: CENTERED --- */}
                <div className="w-full flex flex-col items-center gap-8 bg-white/5 p-12 border border-white/10 rounded-[50px] backdrop-blur-xl text-center shadow-2xl">

                    <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-[#d9ff00] shadow-[0_0_50px_rgba(217,255,0,0.1)]">
                        {userImage ? (
                            <Image src={userImage} alt="User" fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-5xl font-bebas text-[#d9ff00]">
                                {session?.user?.name?.[0] || "U"}
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-5xl md:text-6xl font-bebas tracking-widest italic uppercase">{session?.user?.name || "REDACTED_USER"}</h1>

                        <div className="flex flex-wrap justify-center gap-3 text-[10px] font-mono tracking-[0.2em] uppercase text-white/40">
                            <span className="flex items-center gap-2 px-5 py-2 bg-white/5 rounded-full border border-white/5">
                                <User size={12} className="text-[#d9ff00]" /> {userEmail}
                            </span>
                            <span className="flex items-center gap-2 px-5 py-2 bg-white/5 rounded-full border border-white/5">
                                <Phone size={12} className="text-[#d9ff00]" /> {userData.phoneNumber || "NO_LINK"}
                            </span>
                            <span className="flex items-center gap-2 px-5 py-2 bg-white/5 rounded-full border border-white/5">
                                <MapPin size={12} className="text-[#d9ff00]" /> {userData.address || "NO_ADDR"}
                            </span>
                        </div>

                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="mt-4 inline-flex items-center gap-3 text-[#d9ff00] text-[11px] font-black border border-[#d9ff00]/30 px-10 py-4 rounded-full hover:bg-[#d9ff00] hover:text-black transition-all duration-500 uppercase tracking-[0.3em] shadow-lg shadow-[#d9ff00]/5"
                        >
                            <Edit3 size={14} /> EDIT DATA
                        </button>
                    </div>
                </div>

                {/* --- SECTION TITLE --- */}
                <div className="my-24 text-center">
                    <h2 className="text-7xl md:text-9xl font-bebas italic tracking-tighter uppercase leading-none opacity-90">
                        Mission_<span className="text-[#d9ff00]">Logs</span>
                    </h2>
                    <div className="h-[1px] w-24 bg-[#d9ff00]/30 mx-auto mt-6"></div>
                </div>

                {/* --- TRANSACTIONS: CENTERED --- */}
                <div className="w-full space-y-8 flex flex-col items-center">
                    {paymentData.length > 0 ? (
                        paymentData.map((item) => (
                            <div
                                key={item._id}
                                className="w-full group relative bg-white/5 border border-white/10 p-12 rounded-[45px] flex flex-col items-center text-center gap-10 hover:border-[#d9ff00]/40 transition-all duration-700 hover:bg-white/[0.07]"
                            >
                                <div className="space-y-3">
                                    <span className="text-[10px] text-white/20 font-mono tracking-[0.5em] uppercase">REFERENCE: {item.transactionId}</span>
                                    <p className="text-7xl font-bebas text-[#d9ff00] tracking-tight leading-none">${item.totalAmount.toFixed(2)}</p>
                                </div>

                                <div className="flex flex-wrap justify-center gap-3 max-w-md">
                                    {item.items.map((orderItem, i) => (
                                        <div key={i} className="text-[10px] font-bold border border-white/10 px-6 py-2 rounded-xl uppercase tracking-widest bg-black/40">
                                            {orderItem.name} <span className="text-[#d9ff00] ml-2">x{orderItem.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center gap-8 pt-4">
                                    <span className={`text-[11px] font-black uppercase tracking-[0.4em] px-10 py-3.5 rounded-full border-2 ${item.paymentStatus === 'pending'
                                        ? 'border-yellow-500/20 text-yellow-500 bg-yellow-500/5'
                                        : 'border-[#d9ff00]/20 text-[#d9ff00] bg-[#d9ff00]/5'
                                        }`}>
                                        {item.paymentStatus}
                                    </span>

                                    <button
                                        onClick={() => setIsDeleteModalOpen(item._id)}
                                        className="p-5 bg-red-500/5 text-red-500/40 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300 border border-red-500/10 hover:border-red-500 shadow-xl shadow-red-500/5"
                                    >
                                        <Trash2 size={22} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="w-full border-2 border-dashed border-white/5 rounded-[60px] py-40 text-center flex flex-col items-center">
                            <p className="text-white/10 font-bebas text-6xl uppercase italic tracking-widest">Archive_Empty</p>
                            <p className="text-[10px] font-mono text-white/5 mt-6 tracking-[0.6em] uppercase">Standing by for transactions...</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Background Brand */}
            <div className="fixed bottom-[-2vw] right-[-2vw] opacity-[0.03] font-bebas text-[25vw] italic pointer-events-none select-none text-white leading-none -rotate-12">
                SINNERS
            </div>

            {/* --- MODALS --- */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl">
                    <div className="bg-zinc-950 border border-white/10 w-full max-w-lg p-12 rounded-[50px] relative shadow-[0_0_100px_rgba(0,0,0,1)]">
                        <button onClick={() => setIsEditModalOpen(false)} className="absolute top-10 right-10 text-white/20 hover:text-[#d9ff00] transition-colors"><X size={28} /></button>
                        <h3 className="text-5xl font-bebas text-[#d9ff00] italic mb-12 tracking-widest uppercase">Update_Metadata</h3>
                        <form onSubmit={handleUpdateProfile} className="space-y-10">
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-black">Connection_Number</label>
                                <input
                                    type="text"
                                    value={userData.phoneNumber}
                                    onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-[#d9ff00] transition-all text-sm font-mono"
                                    placeholder="+880..."
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-black">Geographic_Location</label>
                                <textarea
                                    value={userData.address}
                                    onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-[#d9ff00] transition-all h-36 resize-none text-sm font-mono"
                                    placeholder="Sector, City, ZIP Code..."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={updateLoading}
                                className="w-full py-6 bg-[#d9ff00] text-black font-black text-[12px] tracking-[0.4em] uppercase rounded-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 shadow-[0_20px_40px_rgba(217,255,0,0.15)]"
                            >
                                {updateLoading ? "SYNCHRONIZING..." : "COMMIT_CHANGES"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl">
                    <div className="bg-zinc-950 border border-red-500/20 w-full max-w-md p-14 rounded-[50px] text-center">
                        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Trash2 className="text-red-500" size={40} />
                        </div>
                        <h3 className="text-4xl font-bebas text-red-500 italic mb-6 uppercase tracking-wider">Confirm_Erase</h3>
                        <p className="text-[11px] text-white/30 uppercase tracking-[0.3em] mb-12 leading-relaxed font-mono">
                            Warning: This action will permanently remove the record from your mission log.
                        </p>
                        <div className="flex gap-6">
                            <button onClick={() => setIsDeleteModalOpen(null)} className="flex-1 py-5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/5 transition-all">Abort</button>
                            <button onClick={() => handleDeleteOrder(isDeleteModalOpen)} className="flex-1 py-5 bg-red-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-red-600 shadow-xl shadow-red-500/20 transition-all">Proceed</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default LocalProfile;