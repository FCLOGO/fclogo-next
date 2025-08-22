import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

export const runtime = 'edge';
// 从环境变量中获取 Sanity Webhook Secret
const SANITY_WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<{
      _type: string
      slug?: { current: string }
    }>(req, SANITY_WEBHOOK_SECRET)

    if (!isValidSignature) {
      return new Response('Invalid Signature', { status: 401 })
    }

    if (!body?._type) {
      return NextResponse.json({ message: 'No body' }, { status: 400 })
    }

    // 根据更新的文档类型来决定要重新验证哪些标签
    const tagsToRevalidate: string[] = [];
    
    switch (body._type) {
      case 'logo':
        tagsToRevalidate.push('logos-list', 'logo-count', 'footer-stats');
        if (body.slug?.current) {
          tagsToRevalidate.push(`logo:${body.slug.current}`);
        }
        break;
      case 'logoPack':
        tagsToRevalidate.push('packs-list');
        if (body.slug?.current) {
          tagsToRevalidate.push(`pack:${body.slug.current}`);
        }
        break;
    }

    console.log(`Revalidating tags: ${tagsToRevalidate.join(', ')}`);
    
    // 依次重新验证所有相关的标签
    for (const tag of tagsToRevalidate) {
      revalidateTag(tag);
    }

    return NextResponse.json({ revalidated: true, tags: tagsToRevalidate, now: Date.now() })
  } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (err: any) {
    console.error(err)
    return new Response(err.message, { status: 500 })
  }
}