// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabaseClient";
// import { useRouter } from "next/navigation";
// import BookmarkForm from "@/components/BookmarkForm";
// import BookmarkList from "@/components/BookmarkList";

// export default function DashboardPage() {
//   const router = useRouter();

//   const [user, setUser] = useState<any>(null);
//   const [bookmarks, setBookmarks] = useState<any[]>([]);

//   // 🔐 Check Auth
//   useEffect(() => {
//     const checkUser = async () => {
//       const { data } = await supabase.auth.getUser();

//       if (!data.user) {
//         router.push("/login");
//       } else {
//         setUser(data.user);
//         fetchBookmarks();
//       }
//     };

//     checkUser();
//   }, [router]);

//   // 📥 Fetch bookmarks
//   const fetchBookmarks = async () => {
//     const { data, error } = await supabase
//       .from("bookmarks")
//       .select("*")
//       .order("created_at", { ascending: false });

//     if (!error) {
//       setBookmarks(data || []);
//     }
//   };

//   // ❌ Delete
//   const handleDelete = async (id: string) => {
//     await supabase.from("bookmarks").delete().eq("id", id);
//     fetchBookmarks();
//   };

//   // 🔄 Realtime
//   useEffect(() => {
//     if (!user) return;

//     const channel = supabase
//       .channel("realtime-bookmarks")
//       .on(
//         "postgres_changes",
//         {
//           event: "*",
//           schema: "public",
//           table: "bookmarks",
//         },
//         () => {
//           fetchBookmarks(); // SIMPLE & STABLE
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [user]);

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     router.push("/login");
//   };

//   return (
//     <main className="min-h-screen p-10 bg-gray-50">
//       <div className="max-w-2xl mx-auto space-y-8">

//         <div className="flex justify-between items-center">
//           <h1 className="text-xl font-bold">
//             Welcome {user?.email}
//           </h1>

//           <button
//             onClick={handleLogout}
//             className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//           >
//             Logout
//           </button>
//         </div>

//         {user && (
//           <BookmarkForm
//             userId={user.id}
//             onBookmarkAdded={fetchBookmarks}
//           />
//         )}

//         <BookmarkList
//           bookmarks={bookmarks}
//           onDelete={handleDelete}
//         />
//       </div>
//     </main>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import BookmarkForm from "@/components/BookmarkForm";
import BookmarkList from "@/components/BookmarkList";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  // 🔐 Check Auth
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
      }
    };

    checkUser();
  }, [router]);

  // 🔐 Cross-tab login/logout sync
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          router.push("/login");
        } else {
          setUser(session.user);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  // 📥 Fetch bookmarks (user scoped)
  const fetchBookmarks = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) {
      setBookmarks(data || []);
    }
  };

  // Fetch when user changes
  useEffect(() => {
    if (user) {
      fetchBookmarks();
    }
  }, [user]);

  // ❌ Delete
  const handleDelete = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    fetchBookmarks();
  };

  // 🔄 Realtime
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("realtime-bookmarks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchBookmarks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <main className="min-h-screen p-10 bg-gray-50">
      <div className="max-w-2xl mx-auto space-y-8">

        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">
            Welcome {user?.email}
          </h1>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {user && (
          <BookmarkForm
            userId={user.id}
            onBookmarkAdded={fetchBookmarks}
          />
        )}

        <BookmarkList
          bookmarks={bookmarks}
          onDelete={handleDelete}
        />
      </div>
    </main>
  );
}