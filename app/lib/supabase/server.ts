// lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = () => {
  const cookieStore = cookies() 

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // cookies().set expects an object; cast options to any to match shape
          cookieStore.set({ name, value, ...(options as any) })
        },
        remove(name: string, options?: CookieOptions) {
          // cookies().delete supports either a name string or an object with name + options
          if (options) {
            cookieStore.delete({ name, ...(options as any) } as any)
          } else {
            cookieStore.delete(name)
          }
        },
      },
    }
  )
}