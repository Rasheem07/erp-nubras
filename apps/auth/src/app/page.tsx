"use client"
import React from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

const fetchProfile = async () => {
  const response = await fetch("http://localhost:5005/api/v1/me", {
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  });

  const json = await response.json()
  if(!response.ok) {
    toast.error(json.message)
  }
  return json;
};

const ProfilePage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm text-center">
        <div className="w-32 h-32 rounded-full mx-auto mb-4 border-2 border-gray-300" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {(data as any)?.email}
        </h1>
        <p className="text-gray-600">Role: {(data as any)?.role}</p>
        <p className="text-gray-500 mt-1">
          Permissions: {(data as any)?.permissions?.join(", ")}
        </p>
        <p className="text-gray-500 mt-1">
          Created at: {new Date((data as any)?.createdAt).toLocaleDateString()}
        </p>
        <Button variant={"default"} className="mt-5 w-full">
          Logout 
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
