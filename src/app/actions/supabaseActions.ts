'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// 在服务器端创建客户端，可以安全地使用 service_role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export async function getSupabaseCountAction(logoId: string): Promise<number> {
  try {
    const { data, error } = await supabase.rpc('get_download_count', {
      logo_id_to_get: logoId,
    });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`[Supabase] Failed to get count for ${logoId}:`, error);
    return 0;
  }
}

export async function updateSupabaseCountAction(logoId: string, slug: string): Promise<{ success: boolean; newCount: number | null }> {
  try {
    const { data, error } = await supabase.rpc('increment_download_count', {
      logo_id_to_increment: logoId,
    });
    if (error) throw error;
    
    revalidatePath(`/${slug}`, 'page');
    
    return { success: true, newCount: data };
  } catch (error) {
    console.error(`[Supabase] Failed to update count for ${logoId}:`, error);
    return { success: false, newCount: null };
  }
}