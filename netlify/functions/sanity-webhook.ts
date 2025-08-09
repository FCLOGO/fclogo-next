import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient as createSanityClient } from '@sanity/client';

// 辅助函数，用于从 Sanity 获取一个 logo 的完整搜索数据 (与之前版本相同)
async function getLogoSearchData(sanityClient: any, logoId: string) {
  const query = `*[_id == $logoId][0]{
    "logo_id": _id, "slug": slug.current, version, "preview_image_url": previewImage.asset->url,
    "style_name": style->title[_key == "en"][0].value,
    "style_name_zh": style->title[_key == "zh-cn"][0].value,
    "subject_name": subject->name[_key == "en"][0].value,
    "subject_name_zh": subject->name[_key == "zh-cn"][0].value,
    "subject_short_name": subject->info.shortName[_key == "en"][0].value,
    "subject_short_name_zh": subject->info.shortName[_key == "zh-cn"][0].value,
    "subject_local_name": subject->info.localName,
    "alternate_names": alternateNames
  }`;
  return await sanityClient.fetch(query, { logoId });
}

// Netlify Function 的主处理函数
const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // 只接受 POST 请求
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
    );
    const sanityClient = createSanityClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
      useCdn: true,
      apiVersion: new Date().toISOString().split('T')[0],
    });

    if (!event.body) {
      throw new Error("Request body is missing");
    }
    const body = JSON.parse(event.body);
    
    // 处理删除
    if (body.deleted) {
      await supabase.from('logo_search_index').delete().eq('logo_id', body.deleted.id);
      return { statusCode: 200, body: JSON.stringify({ success: true, operation: 'delete' }) };
    }

    // 处理创建或更新
    const documentId = body.created?.id || body.updated?.id;
    if (!documentId) {
      throw new Error("Invalid payload: missing document ID");
    }

    const dataToIndex = await getLogoSearchData(sanityClient, documentId);
    if (!dataToIndex) {
      throw new Error(`Could not fetch data for logo ${documentId}`);
    }
    
    if (dataToIndex.alternate_names && Array.isArray(dataToIndex.alternate_names)) {
      dataToIndex.alternate_names = dataToIndex.alternate_names.join(' ');
    }

    const { error } = await supabase.from('logo_search_index').upsert(dataToIndex);
    if (error) throw error;
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, operation: 'upsert' })
    };

  } catch (error: any) {
    console.error('Webhook Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error processing webhook', error: error.message })
    };
  }
};

export { handler };