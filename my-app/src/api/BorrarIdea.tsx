import Idea from '../models/Idea.tsx'
import { useEffect, useState } from 'react';

export async function BorrarIdeaAsync(id: number) {
  try {
    const response = await fetch(`https://backend.matchafunding.com/borraridea/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data: Idea = await response.json();
      return data;
    }
    
    return null;
  } catch (error) {
    throw error;
  }
}
export function BorrarIdea(id: number) {
  const [Idea, setIdea] = useState<Idea | null>();

  useEffect(() => {
      BorrarIdeaAsync(id).then((data) => {
      setIdea(data);
      });
  }, );
  return Idea;
}
export default BorrarIdea;