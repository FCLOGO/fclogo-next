'use server';
import { revalidatePath } from 'next/cache';

const COUNTER_WORKER_URL = process.env.NEXT_COUNTER_WORKER_URL;

async function incrementDownloadCountInDO(logoId: string): Promise<number | null> {
  if (!COUNTER_WORKER_URL) {
    console.error("COUNTER_WORKER_URL environment variable is not set.");
    return null;
  }

  const incrementUrl = `${COUNTER_WORKER_URL}/increment`;
  try {
    const response = await fetch(incrementUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // 请求体中包含 Sanity 的 _id 作为 logoID
      body: JSON.stringify({ logoID: logoId }),
      // 使用 next: { revalidate: 0 } 来确保这是一个动态请求，不被缓存
      next: { revalidate: 0 } 
    });

    if (!response.ok) {
      // 如果 Worker 返回错误，我们也抛出错误
      throw new Error(`Worker responded with status: ${response.status}`);
    }

    // Worker 会返回最新的计数值
    const newCountText = await response.text();
    return parseInt(newCountText, 10);

  } catch (error) {
    console.error(`[Server Action] Failed to increment count for ${logoId}:`, error);
    // 在出错时，我们不让整个 Action 失败，而是返回一个 null
    // 这样前端 UI 可以优雅地处理，不会因为计数失败而崩溃
    return null;
  }
}

export async function updateDownloadCountAction(logoId: string, slug: string): Promise<{ success: boolean; newCount: number | null }> {
  const newCount = await incrementDownloadCountInDO(logoId);
  
  if (newCount !== null) {
    // 只有在成功更新计数后，才清除页面缓存
    // 这确保了如果有人在更新后立即刷新页面，他们可能会看到更新后的数字（取决于缓存策略）
    revalidatePath(`/${slug}`, 'page'); // 'page' 表示只重新验证页面，不重新验证布局
    
    return { success: true, newCount };
  } else {
    return { success: false, newCount: null };
  }
}