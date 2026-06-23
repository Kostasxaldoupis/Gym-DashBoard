// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { pauseSubscription, resumeSubscription, updateMembershipPlan } from "@/actions/action";

// type Plan = {
//   id: string;
//   name: string;
//   price: number;
//   durationDays: number;
// };

// type Membership = {
//   id: string;
//   planId: string;
//   plan: Plan;
//   startDate: Date;
//   endDate: Date;
//   active: boolean;
// };

// type Member = {
//   id: string;
//   firstName: string;
//   lastName: string;
//   memberships: Membership[];
// };

// type MemberShipProps = {
//   member: Member;
//   plans: Plan[];
// };

// export default function MemberShip({ member, plans }: MemberShipProps) {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedPlanId, setSelectedPlanId] = useState("");
  
//   const currentMembership = member.memberships?.[0];
//   const isActive = currentMembership?.active ?? false;
//   const isExpired = currentMembership 
//     ? new Date(currentMembership.endDate) < new Date()
//     : true;
  
//   const daysLeft = currentMembership
//     ? Math.ceil(
//         (new Date(currentMembership.endDate).getTime() - new Date().getTime()) /
//           (1000 * 60 * 60 * 24)
//       )
//     : 0;

//   const handlePause = async () => {
//     if (!currentMembership) return;
//     setIsLoading(true);
//     try {
//       await pauseSubscription(currentMembership.id);
//       router.refresh();
//     } catch (error) {
//       console.error("Failed to pause subscription:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResume = async () => {
//     if (!currentMembership) return;
//     setIsLoading(true);
//     try {
//       await resumeSubscription(currentMembership.id);
//       router.refresh();
//     } catch (error) {
//       console.error("Failed to resume subscription:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleRenew = async () => {
//     if (!selectedPlanId) {
//       alert("Please select a plan first");
//       return;
//     }
//     setIsLoading(true);
//     try {
//       await updateMembershipPlan(member.id, selectedPlanId);
//       router.refresh();
//     } catch (error) {
//       console.error("Failed to renew membership:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getStatusColor = () => {
//     if (!currentMembership) return "text-gray-400";
//     if (isExpired) return "text-red-400";
//     if (!isActive) return "text-yellow-400";
//     return "text-emerald-400";
//   };

//   const getStatusText = () => {
//     if (!currentMembership) return "No Membership";
//     if (isExpired) return "Expired";
//     if (!isActive) return "Paused";
//     return "Active";
//   };

//   const getStatusEmoji = () => {
//     if (!currentMembership) return "⚪";
//     if (isExpired) return "🔴";
//     if (!isActive) return "🟡";
//     return "🟢";
//   };

//   return (
//     <div className="mx-auto max-w-3xl rounded-2xl bg-slate-900 p-8 shadow-2xl border border-slate-800">
//       <h1 className="mb-2 text-3xl font-bold text-white">
//         Membership Management
//       </h1>
//       <p className="mb-6 text-slate-400">
//         Manage {member.firstName} {member.lastName}'s subscription
//       </p>

//       {/* Current Membership Card */}
//       <div className="mb-6 rounded-lg border border-slate-700 bg-slate-800/50 p-6">
//         <div className="grid gap-4 md:grid-cols-2">
//           <div>
//             <p className="text-sm text-slate-400">Current Plan</p>
//             <p className="text-lg font-semibold text-white">
//               {currentMembership?.plan.name ?? "No Plan"}
//             </p>
//           </div>
//           <div>
//             <p className="text-sm text-slate-400">Price</p>
//             <p className="text-lg font-semibold text-white">
//               {currentMembership?.plan.price 
//                 ? `$${currentMembership.plan.price.toFixed(2)}/month`
//                 : "—"}
//             </p>
//           </div>
//           <div>
//             <p className="text-sm text-slate-400">Status</p>
//             <p className={`text-lg font-semibold ${getStatusColor()}`}>
//               {getStatusEmoji()} {getStatusText()}
//             </p>
//           </div>
//           <div>
//             <p className="text-sm text-slate-400">Days Left</p>
//             <p className="text-lg font-semibold text-white">
//               {currentMembership && !isExpired 
//                 ? `${daysLeft} days`
//                 : "—"}
//             </p>
//           </div>
//           <div>
//             <p className="text-sm text-slate-400">Started</p>
//             <p className="text-lg font-semibold text-white">
//               {currentMembership 
//                 ? currentMembership.startDate.toLocaleDateString()
//                 : "—"}
//             </p>
//           </div>
//           <div>
//             <p className="text-sm text-slate-400">Expires</p>
//             <p className="text-lg font-semibold text-white">
//               {currentMembership 
//                 ? currentMembership.endDate.toLocaleDateString()
//                 : "—"}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Actions */}
//       <div className="space-y-4">
//         <h2 className="text-lg font-semibold text-white">Actions</h2>
        
//         <div className="flex flex-wrap gap-3">
//           {/* Pause/Resume Button */}
//           {currentMembership && !isExpired && (
//             isActive ? (
//               <button
//                 onClick={handlePause}
//                 disabled={isLoading}
//                 className="rounded-lg bg-yellow-600 px-6 py-2 font-medium text-white transition hover:bg-yellow-700 disabled:opacity-50"
//               >
//                 {isLoading ? "Processing..." : "⏸️ Pause Subscription"}
//               </button>
//             ) : (
//               <button
//                 onClick={handleResume}
//                 disabled={isLoading}
//                 className="rounded-lg bg-emerald-600 px-6 py-2 font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
//               >
//                 {isLoading ? "Processing..." : "▶️ Resume Subscription"}
//               </button>
//             )
//           )}

//           {/* Renew Button */}
//           {currentMembership && (
//             <button
//               onClick={handleRenew}
//               disabled={isLoading || !selectedPlanId}
//               className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
//             >
//               {isLoading ? "Processing..." : "🔄 Renew Membership"}
//             </button>
//           )}
//         </div>

//         {/* Plan Selector for Renewal */}
//         {currentMembership && (
//           <div className="mt-4">
//             <label className="mb-2 block text-sm text-slate-300">
//               Select New Plan for Renewal
//             </label>
//             <select
//               value={selectedPlanId}
//               onChange={(e) => setSelectedPlanId(e.target.value)}
//               className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
//             >
//               <option value="">Choose a plan...</option>
//               {plans.map((plan) => (
//                 <option key={plan.id} value={plan.id}>
//                   {plan.name} - ${plan.price.toFixed(2)}/month ({plan.durationDays} days)
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}
//       </div>

//       {/* Quick Stats */}
//       <div className="mt-6 rounded-lg border border-slate-700 bg-slate-800/30 p-4">
//         <h3 className="mb-2 text-sm font-medium text-slate-300">Quick Stats</h3>
//         <div className="grid grid-cols-2 gap-4 text-sm">
//           <div>
//             <span className="text-slate-400">Total Memberships:</span>
//             <span className="ml-2 text-white">{member.memberships?.length || 0}</span>
//           </div>
//           <div>
//             <span className="text-slate-400">Member Since:</span>
//             <span className="ml-2 text-white">
//               {member.memberships?.[0]?.startDate.toLocaleDateString() || "—"}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Back Button */}
//       <div className="mt-6">
//         <button
//           onClick={() => router.back()}
//           className="text-sm text-slate-400 hover:text-white transition"
//         >
//           ← Back
//         </button>
//       </div>
//     </div>
//   );
// }