'use server';

const COUNTER_WORKER_URL = process.env.NEXT_COUNTER_WORKER_URL;

// 这个函数将用于批量获取多个 logo 的计数值
export async function getCountsAction(logoIDs: string[]): Promise<Record<string, number>> {
  if (!COUNTER_WORKER_URL || logoIDs.length === 0) {
    return {};
  }
  
  const getUrl = `${COUNTER_WORKER_URL}/batch-get`;
  
  try {
    const response = await fetch(getUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logoIDs }),
      next: { revalidate: 5 } // 缓存 60 秒，避免频繁请求
    });

    if (!response.ok) throw new Error('Worker responded with an error');

    const counts = await response.json();
    return counts;
  } catch (error) {
    console.error("[getCountsAction] Failed to fetch batch counts:", error);
    return {};
  }
}

// 我们也可以创建一个获取单个计数值的函数，用于详情页
export async function getCountAction(logoId: string): Promise<number> {
    if (!COUNTER_WORKER_URL) return 0;
    
    const getUrl = `${COUNTER_WORKER_URL}/`; // 根路径获取计数值
    try {
        const response = await fetch(getUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ logoID: logoId }),
            next: { revalidate: 5 }
        });

        if (!response.ok) throw new Error('Worker responded with an error');

        const countText = await response.text();
        return parseInt(countText, 10) || 0;
    } catch (error) {
        console.error(`[getCountAction] Failed to fetch count for ${logoId}:`, error);
        return 0;
    }
}