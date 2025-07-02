"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/shared/Navbar";
import { useState } from "react";



export default function Inscription() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const registerData = {
            email: email,
            password: password,
        };

        try {
            const response = await fetch("http://127.0.0.1:8001/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(registerData),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            console.log("Registration successful:", data);
            // Redirection possible après l'inscription
            window.location.href = "/connexion";
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <motion.h1
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl font-bold mb-8 text-center"
                >
                    Inscription
                </motion.h1>

                {/* Formulaire d'inscription */}
                <form onSubmit={handleRegisterSubmit} className="max-w-md mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-semibold focus:outline-none focus:ring focus:ring-indigo-500"
                    >
                        S'inscrire
                    </button>
                </form>
            </main>
        </div>
    );
}