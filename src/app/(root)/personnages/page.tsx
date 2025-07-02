'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/shared/Navbar';
import { Button } from '@/components/ui/button';

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



const CharacterCard = ({
  character,
  onDelete,
  onEdit,
}: {
  character: Character;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}) => {
  return (
    <Card className="bg-gray-800 text-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-4">
          <Avatar>
          <AvatarImage
            src={`https://www.noam-rpg-project.codegt.garage404.com${character.imagePath}`}
            alt={character.name}
          />
          <AvatarFallback>{character.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span>{character.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {['strength', 'speed', 'durability', 'power', 'combat'].map((stat) => (
            <div key={stat}>
              <div className="flex justify-between text-sm capitalize">
                <span>{stat}</span>
                <span>{character[stat as keyof Character]}</span>
              </div>
              <Progress value={character[stat as keyof Character] as number} className="h-2 bg-white" />
            </div>
          ))}
          <div className="flex space-x-4 mt-4">
            <Button onClick={() => onEdit(character.id)} variant="outline">Edit</Button>
            <Button onClick={() => onDelete(character.id)} variant="destructive">Delete</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://www.noam-rpg-project.codegt.garage404.com/api/get');
      if (!response.ok) throw new Error('Erreur lors du chargement des personnages.');
      const data = await response.json();
      setCharacters(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`https://www.noam-rpg-project.codegt.garage404.com/api/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression.');
      setCharacters((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/modification/${id}`);
  };

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
          Les Combattants
        </motion.h1>

        {isLoading ? (
          <p className="text-center">Chargement des personnages...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((character) => (
              <motion.div
                key={character.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CharacterCard character={character} onDelete={handleDelete} onEdit={handleEdit} />
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
