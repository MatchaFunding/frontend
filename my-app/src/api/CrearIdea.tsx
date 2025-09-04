import Idea from '../models/Idea.tsx'
import { useEffect, useState } from 'react';

export async function CrearIdeaAsync(data: Idea): Promise<Idea> {
  
  try {
    const response = await fetch(`http://localhost:8080/api/v1/ideas/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        'ID': 1,
        'Usuario':data.Usuario,
        'Campo':data.Campo,
        'Problema':data.Problema,
        'Publico':data.Publico,
        'Innovacion':data.Innovacion,
      }),
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const result: Idea = await response.json();
    return result;
  }
  catch (error) {
    throw new Error('Error al obtener los datos');
  }
}
export async function CrearIdea(data: Idea): Promise<Idea> {
  return await CrearIdeaAsync(data); // fetch/axios hacia tu API
}

export default CrearIdea;
