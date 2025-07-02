"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Radar } from "@/components/ui/radar";
import Navbar from "@/components/shared/Navbar";

interface Character {
  id: number;
  name: string;
  imagePath: string;
  strength: number;
  speed: number;
  durability: number;
  power: number;
  combat: number;
}

const stats = [
  { name: "Strength", key: "strength" },
  { name: "Speed", key: "speed" },
  { name: "Durability", key: "durability" },
  { name: "Power", key: "power" },
  { name: "Combat", key: "combat" },
];

export default function EditCharacterPage() {
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  useEffect(() => {
    if (id) fetchCharacter();
  }, [id]);

  const fetchCharacter = async () => {
    try {
      const res = await fetch("http://localhost:8001/api/get");
      const data: Character[] = await res.json();
      const found = data.find((c) => c.id === id);
      if (!found) throw new Error("Character not found.");
      setCharacter(found);
    } catch (err) {
      setError("Impossible de charger le personnage.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatChange = (stat: string, value: number[]) => {
    if (character) {
      setCharacter((prev) => ({ ...prev!, [stat]: value[0] }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedCharacter = { ...character };
      const formData = new FormData();

      // if (newImageFile) {
      //   formData.append("imagePath", newImageFile);
      // }

      formData.append("name", String(updatedCharacter.name));
      formData.append("strength", String(updatedCharacter.strength));
      formData.append("speed", String(updatedCharacter.speed));
      formData.append("durability", String(updatedCharacter.durability));
      formData.append("power", String(updatedCharacter.power));
      formData.append("combat", String(updatedCharacter.combat));

      console.log(formData)


      const response = await fetch(`http://localhost:8001/api/edit/${id}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erreur lors de la mise à jour.");
      router.push("/personnages");
    } catch (err) {
      setError("Erreur lors de la mise à jour.");
    }
  };



  const chartData = character
    ? {
        labels: stats.map((s) => s.name),
        datasets: [
          {
            label: "Stats",
            data: stats.map((s) => character[s.key as keyof Character] as number),
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 2,
          },
        ],
      }
    : null;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-8 text-center"
        >
          Le Combattant
        </motion.h1>

        {isLoading ? (
          <p className="text-center">Chargement...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : character ? (
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <Card className="bg-gray-800 mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage
                      src={
                        newImageFile
                          ? URL.createObjectURL(newImageFile)
                          : `http://localhost:8001${character.imagePath}`
                      }
                      alt={character.name}
                    />
                    <AvatarFallback>
                      {character.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Label htmlFor="name" className="block mb-2 text-white">
                      Nom du combattant
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={character.name}
                      onChange={(e) =>
                        setCharacter({ ...character, name: e.target.value })
                      }
                      required
                      className="bg-gray-700 text-white placeholder-white" readOnly
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 mb-6">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">Statistiques</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    {stats.map((stat) => (
                      <div key={stat.key} className="mb-4">
                        <Label htmlFor={stat.key} className="block mb-2">
                          {stat.name}: {character[stat.key as keyof Character]}
                        </Label>
                        <Slider
                          id={stat.key}
                          min={0}
                          max={100}
                          step={1}
                          value={[character[stat.key as keyof Character] as number]}
                          onValueChange={(val) => handleStatChange(stat.key, val)}
                          className="w-full" disabled
                        />
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    {chartData && (
                      <Radar
                        data={chartData}
                        options={{
                          scales: {
                            r: {
                              angleLines: { color: "rgba(255,255,255,0.2)" },
                              grid: { color: "rgba(255,255,255,0.2)" },
                              pointLabels: { color: "rgba(255,255,255,0.7)" },
                              ticks: {
                                color: "rgba(255,255,255,0.7)",
                                backdropColor: "transparent",
                              },
                            },
                          },
                          plugins: { legend: { display: false } },
                          maintainAspectRatio: false,
                        }}
                        className="w-full h-64"
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex justify-center"
            >
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Confirmer les modifications
              </Button>
            </motion.div>
          </form>
        ) : (
          <p className="text-center">Aucun personnage trouvé.</p>
        )}
      </main>
    </div>
  );
}
