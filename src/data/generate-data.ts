import { getCollection } from 'astro:content';
import { createHash } from 'crypto';

export async function generateContentVersion() {
  const checklists = await getCollection('checklists');
  
  // Create deterministic data snapshot
  const snapshot = checklists.map(entry => ({
    id: entry.id,
    title: entry.data.title,
    itemIds: entry.data.items.map(item => item.id),
    updatedAt: new Date().toISOString(),
  }));
  
  const dataStr = JSON.stringify(snapshot);
  const hash = createHash('sha256').update(dataStr).digest('hex').slice(0, 12);
  
  return hash;
}

export async function exportChecklistsData() {
  const checklists = await getCollection('checklists');
  
  const data = {
    version: await generateContentVersion(),
    generatedAt: new Date().toISOString(),
    checklists: checklists.map(entry => ({
      id: entry.id,
      title: entry.data.title,
      description: entry.data.description || '',
      items: entry.data.items,
    })),
  };
  
  return data;
}
